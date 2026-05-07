import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";
import { expireStaleBookings } from "@/lib/availability";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();
    await expireStaleBookings();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const trailerId = searchParams.get("trailerId");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && status !== "all" ? { status: status as never } : {}),
        ...(trailerId ? { trailerId } : {}),
        ...(from || to
          ? {
              serviceDate: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        deliveryAddress: true,
        serviceDate: true,
        pickupDate: true,
        deliveryWindow: true,
        materialType: true,
        loads: true,
        totalAmount: true,
        notes: true,
        expiresAt: true,
        createdAt: true,
        trailer: { select: { id: true, name: true, slug: true, images: true } },
        customer: {
          select: { user: { select: { id: true, email: true, phone: true } } },
        },
        driver: {
          select: { user: { select: { id: true, email: true } } },
        },
        payment: {
          select: {
            id: true,
            status: true,
            amount: true,
            stripeCheckoutSessionId: true,
            stripePaymentIntentId: true,
            paidAt: true,
          },
        },
      },
    });

    return NextResponse.json(bookings);
  } catch (err) {
    return adminError(err);
  }
}
