import { notFound, redirect } from "next/navigation";
import DeliveryFlow from "@/components/driver/DeliveryFlow";
import { DEMO_JOBS } from "@/data/demo";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ autoNav?: string }>;
}

export default async function JobPage({ params, searchParams }: Props) {
  const { id } = await params;
  const resolvedSearch = searchParams ? await searchParams : undefined;
  const autoNavPickup = resolvedSearch?.autoNav === "pickup";
  const demoJob = DEMO_JOBS.find((j) => j.id === id);
  if (demoJob) {
    return <DeliveryFlow job={demoJob} autoNavigatePickup={autoNavPickup} />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/driver");

  const driver = await prisma.driverProfile.findFirst({
    where: { user: { email: user.email ?? "" } },
    select: { id: true },
  });
  if (!driver) notFound();

  const booking = await prisma.booking.findFirst({
    where: { id, driverId: driver.id },
    select: {
      id: true,
      trailerId: true,
      deliveryAddress: true,
      serviceDate: true,
      notes: true,
      trailer: { select: { size: true } },
      customer: { select: { user: { select: { email: true } } } },
    },
  });
  if (!booking) notFound();

  const activeOrder = await prisma.logisticsOrder.findFirst({
    where: {
      bookingId: booking.id,
      driverId: driver.id,
      status: { in: ["ASSIGNED", "IN_PROGRESS", "PENDING"] },
    },
    orderBy: [{ status: "desc" }, { sequence: "asc" }],
    select: {
      id: true,
      type: true,
      fromLocationLabel: true,
      toLocationLabel: true,
      wasteDropLocation: true,
      nextStopLocation: true,
      trailerId: true,
      sequence: true,
    },
  });

  const nextOrder = activeOrder
    ? await prisma.logisticsOrder.findFirst({
        where: {
          trailerId: activeOrder.trailerId,
          status: "PENDING",
          sequence: { gt: activeOrder.sequence },
        },
        orderBy: { sequence: "asc" },
        select: { id: true, type: true, toLocationLabel: true },
      })
    : null;

  const driverFeeMatch = booking.notes?.match(/driverCostCents=(\d+)/);
  const totalDriverFee = driverFeeMatch ? Number(driverFeeMatch[1]) : 8000;
  const city =
    booking.deliveryAddress.split(",").slice(-1)[0]?.trim() || "Seattle, WA";
  const mappedJob = {
    id: booking.id,
    status: "assigned" as const,
    customerName: booking.customer.user.email.split("@")[0] || "Customer",
    address: booking.deliveryAddress,
    city,
    trailerSize: booking.trailer.size,
    scheduledTime: booking.serviceDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    earnings: totalDriverFee,
    tip: 0,
    distanceMiles: 0,
    notes: booking.notes ?? undefined,
    photos: [],
    signatureObtained: false,
    logistics: activeOrder
      ? {
          trailerId: booking.trailerId,
          orderId: activeOrder.id,
          orderType: activeOrder.type,
          fromLocation: activeOrder.fromLocationLabel ?? "Current trailer location",
          toLocation: activeOrder.toLocationLabel,
          wasteDropLocation: activeOrder.wasteDropLocation,
          nextStopLocation: activeOrder.nextStopLocation,
          nextOrderId: nextOrder?.id ?? null,
          nextOrderType: nextOrder?.type ?? null,
          nextOrderToLocation: nextOrder?.toLocationLabel ?? null,
        }
      : undefined,
  };

  return <DeliveryFlow job={mappedJob} autoNavigatePickup={autoNavPickup} />;
}
