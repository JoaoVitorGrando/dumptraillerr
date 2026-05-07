import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

export async function GET() {
  try {
    await requireAdmin();

    const trailers = await prisma.trailer.findMany({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
        size: true,
        capacity: true,
        gvwr: true,
        payload: true,
        pricePerPeriod: true,
        status: true,
        images: true,
        createdAt: true,
        owner: {
          select: {
            companyName: true,
            user: { select: { id: true, email: true } },
          },
        },
        bookings: {
          where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } },
          orderBy: { serviceDate: "asc" },
          take: 1,
          select: { serviceDate: true, pickupDate: true, status: true },
        },
        _count: { select: { bookings: { where: { status: "COMPLETED" } } } },
      },
    });

    return NextResponse.json(trailers);
  } catch (err) {
    return adminError(err);
  }
}
