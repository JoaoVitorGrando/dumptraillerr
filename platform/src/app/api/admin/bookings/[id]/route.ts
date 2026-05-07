import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { id: true, status: true },
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    if (body.status) {
      const allowed = VALID_TRANSITIONS[booking.status] ?? [];
      if (!allowed.includes(body.status)) {
        return NextResponse.json(
          { error: `Cannot transition from ${booking.status} to ${body.status}` },
          { status: 422 }
        );
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const b = await tx.booking.update({
        where: { id },
        data: {
          ...(body.status ? { status: body.status as never } : {}),
        },
        select: { id: true, status: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          bookingId: id,
          action: `booking.status.${body.status?.toLowerCase()}`,
          entity: "Booking",
          entityId: id,
          payload: { previousStatus: booking.status, newStatus: body.status },
        },
      });

      return b;
    });

    return NextResponse.json(updated);
  } catch (err) {
    return adminError(err);
  }
}
