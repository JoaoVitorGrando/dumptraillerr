import { prisma } from "./prisma";

export interface AvailabilityResult {
  available: boolean;
  conflictingBookingIds: string[];
  conflictingBlockIds: string[];
}

/**
 * Verifica se um trailer está disponível no intervalo [from, to].
 * Checa bookings ativos E bloqueios manuais de disponibilidade.
 * Deve ser chamado dentro de uma transação para evitar race conditions.
 */
export async function checkTrailerAvailability(
  trailerId: string,
  from: Date,
  to: Date,
  excludeBookingId?: string
): Promise<AvailabilityResult> {
  const [bookingConflicts, blockConflicts] = await Promise.all([
    prisma.booking.findMany({
      where: {
        trailerId,
        id: excludeBookingId ? { not: excludeBookingId } : undefined,
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
        AND: [
          { serviceDate: { lte: to } },
          {
            OR: [
              { pickupDate: { gte: from } },
              { pickupDate: null, serviceDate: { gte: from } },
            ],
          },
        ],
      },
      select: { id: true },
    }),
    prisma.trailerAvailability.findMany({
      where: {
        trailerId,
        blockedFrom: { lte: to },
        blockedUntil: { gte: from },
      },
      select: { id: true },
    }),
  ]);

  return {
    available: bookingConflicts.length === 0 && blockConflicts.length === 0,
    conflictingBookingIds: bookingConflicts.map((b) => b.id),
    conflictingBlockIds: blockConflicts.map((b) => b.id),
  };
}

/**
 * Cancela bookings PENDING que passaram do expiresAt.
 * Retorna a quantidade de bookings expirados.
 */
export async function expireStaleBookings(): Promise<number> {
  const result = await prisma.booking.updateMany({
    where: {
      status: "PENDING",
      expiresAt: { lt: new Date() },
    },
    data: { status: "CANCELLED" },
  });
  return result.count;
}
