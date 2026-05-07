import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const payments = await prisma.payment.findMany({
      where: {
        ...(status && status !== "all" ? { status: status.toUpperCase() as never } : {}),
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        amount: true,
        stripeCheckoutSessionId: true,
        stripePaymentIntentId: true,
        paidAt: true,
        createdAt: true,
        booking: {
          select: {
            id: true,
            status: true,
            serviceDate: true,
            trailer: { select: { name: true } },
            customer: { select: { user: { select: { email: true } } } },
          },
        },
      },
    });

    return NextResponse.json(payments);
  } catch (err) {
    return adminError(err);
  }
}
