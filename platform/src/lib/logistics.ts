import type { Prisma, TrailerLocationType } from "@prisma/client";
import { prisma } from "./prisma";
import {
  decidePostDisposalRoute,
  parseTransportProvider,
  shouldRequirePickupTeam,
  type TransportProvider,
} from "./logisticsPolicy";

const DISPOSAL_FALLBACK_LABEL = "Seattle Transfer Station";

export function isContinuousLogisticsEnabled() {
  return process.env.CONTINUOUS_LOGISTICS_ENABLED === "true";
}

export function getDefaultDepotLabel() {
  return process.env.DEFAULT_DEPOT_LABEL || "FAGU Main Depot, Seattle, WA";
}

export function extractTransportProviderFromNotes(notes?: string | null): TransportProvider {
  return parseTransportProvider(notes);
}

function mapToLocationType(provider: TransportProvider): TrailerLocationType {
  if (provider === "OWNER") return "CUSTOMER_SITE";
  return "IN_TRANSIT";
}

async function getNextSequence(trailerId: string, tx: Prisma.TransactionClient) {
  const last = await tx.logisticsOrder.findFirst({
    where: { trailerId },
    orderBy: { sequence: "desc" },
    select: { sequence: true },
  });
  return (last?.sequence ?? 0) + 1;
}

/**
 * Creates initial pickup + disposal orders for a newly CONFIRMED booking.
 * Idempotent by bookingId (if already seeded, it returns silently).
 */
export async function seedLogisticsForConfirmedBooking(bookingId: string) {
  if (!isContinuousLogisticsEnabled()) return;

  await prisma.$transaction(async (tx) => {
    const existing = await tx.logisticsOrder.count({ where: { bookingId } });
    if (existing > 0) return;

    const booking = await tx.booking.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        deliveryAddress: true,
        serviceDate: true,
        notes: true,
        trailerId: true,
        trailer: {
          select: {
            currentLocationType: true,
            currentLocationLabel: true,
          },
        },
      },
    });
    if (!booking) return;

    const provider = extractTransportProviderFromNotes(booking.notes);
    const fromLocationType = booking.trailer.currentLocationType;
    const fromLocationLabel = booking.trailer.currentLocationLabel ?? getDefaultDepotLabel();
    let seq = await getNextSequence(booking.trailerId, tx);

    await tx.logisticsOrder.create({
      data: {
        trailerId: booking.trailerId,
        bookingId: booking.id,
        type: "PICKUP",
        status: "PENDING",
        sequence: seq,
        fromLocationType,
        fromLocationLabel,
        toLocationType: "CUSTOMER_SITE",
        toLocationLabel: booking.deliveryAddress,
        nextStopLocation: DISPOSAL_FALLBACK_LABEL,
        requiresPickupTeam: shouldRequirePickupTeam(provider),
        scheduledAt: booking.serviceDate,
        autoPlanned: true,
        notes:
          provider === "OWNER"
            ? "Owner self-service logistics route."
            : "Pickup assigned to logistics marketplace/driver.",
      },
    });
    seq += 1;

    await tx.logisticsOrder.create({
      data: {
        trailerId: booking.trailerId,
        bookingId: booking.id,
        type: "DISPOSAL",
        status: "PENDING",
        sequence: seq,
        fromLocationType: "CUSTOMER_SITE",
        fromLocationLabel: booking.deliveryAddress,
        toLocationType: mapToLocationType(provider),
        toLocationLabel: DISPOSAL_FALLBACK_LABEL,
        wasteDropLocation: DISPOSAL_FALLBACK_LABEL,
        autoPlanned: true,
        notes: "After load completion, dispose debris and resolve next destination.",
      },
    });
  });
}

export async function createNextRouteAfterDisposal(input: {
  trailerId: string;
  fromBookingId?: string | null;
  driverId?: string | null;
}) {
  if (!isContinuousLogisticsEnabled()) return;

  await prisma.$transaction(async (tx) => {
    const trailer = await tx.trailer.findUnique({
      where: { id: input.trailerId },
      select: { id: true, currentLocationLabel: true, currentLocationType: true },
    });
    if (!trailer) return;

    const nextBooking = await tx.booking.findFirst({
      where: {
        trailerId: input.trailerId,
        id: input.fromBookingId ? { not: input.fromBookingId } : undefined,
        status: { in: ["CONFIRMED", "IN_PROGRESS"] },
        serviceDate: { gte: new Date(Date.now() - 60 * 60 * 1000) },
      },
      orderBy: { serviceDate: "asc" },
      select: { id: true, deliveryAddress: true, serviceDate: true },
    });

    const sequence = await getNextSequence(input.trailerId, tx);

    const nextRoute = decidePostDisposalRoute(Boolean(nextBooking));
    if (nextRoute === "DROPOFF" && nextBooking) {
      await tx.logisticsOrder.create({
        data: {
          trailerId: input.trailerId,
          bookingId: nextBooking.id,
          driverId: input.driverId ?? undefined,
          type: "DROPOFF",
          status: "PENDING",
          sequence,
          fromLocationType: trailer.currentLocationType,
          fromLocationLabel: trailer.currentLocationLabel ?? DISPOSAL_FALLBACK_LABEL,
          toLocationType: "CUSTOMER_SITE",
          toLocationLabel: nextBooking.deliveryAddress,
          scheduledAt: nextBooking.serviceDate,
          autoPlanned: true,
          notes: "Auto-routed to next waiting customer.",
        },
      });
      return;
    }

    await tx.logisticsOrder.create({
      data: {
        trailerId: input.trailerId,
        driverId: input.driverId ?? undefined,
        type: "REPOSITION",
        status: "PENDING",
        sequence,
        fromLocationType: trailer.currentLocationType,
        fromLocationLabel: trailer.currentLocationLabel ?? DISPOSAL_FALLBACK_LABEL,
        toLocationType: "DEPOT",
        toLocationLabel: getDefaultDepotLabel(),
        autoPlanned: true,
        notes: "No next customer found, return trailer to depot.",
      },
    });
  });
}
