import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";
import { expireStaleBookings } from "@/lib/availability";

export async function GET() {
  try {
    await requireAdmin();
    await expireStaleBookings();

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      bookingsToday,
      confirmedBookings,
      allTrailers,
      rentedTrailers,
      totalRevenue,
      monthRevenue,
      pendingPayments,
      failedPayments,
      pendingOwners,
      pendingDrivers,
      recentBookings,
    ] = await Promise.all([
      prisma.booking.count({ where: { serviceDate: { gte: startOfToday } } }),
      prisma.booking.count({ where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } } }),
      prisma.trailer.count(),
      prisma.trailer.count({ where: { status: "RENTED" } }),
      prisma.payment.aggregate({
        where: { status: "PAID" },
        _sum: { amount: true },
      }),
      prisma.payment.aggregate({
        where: { status: "PAID", paidAt: { gte: startOfMonth } },
        _sum: { amount: true },
      }),
      prisma.payment.count({ where: { status: "PENDING" } }),
      prisma.payment.count({ where: { status: "FAILED" } }),
      prisma.ownerProfile.count({ where: { approvedAt: null } }),
      prisma.driverProfile.count({ where: { approvedAt: null } }),
      prisma.booking.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          status: true,
          totalAmount: true,
          serviceDate: true,
          trailer: { select: { name: true } },
          customer: { select: { user: { select: { email: true } } } },
          payment: { select: { status: true } },
        },
      }),
    ]);

    const occupancyPct =
      allTrailers > 0 ? Math.round((rentedTrailers / allTrailers) * 100) : 0;

    return NextResponse.json({
      bookingsToday,
      confirmedBookings,
      occupancyPct,
      totalRevenueCents: totalRevenue._sum.amount ?? 0,
      monthRevenueCents: monthRevenue._sum.amount ?? 0,
      pendingPayments,
      failedPayments,
      pendingOwners,
      pendingDrivers,
      recentBookings,
    });
  } catch (err) {
    return adminError(err);
  }
}
