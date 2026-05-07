import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { status?: string };

    const trailer = await prisma.trailer.findUnique({
      where: { id },
      select: { id: true, status: true, name: true },
    });

    if (!trailer) {
      return NextResponse.json({ error: "Trailer not found" }, { status: 404 });
    }

    const validStatuses = ["AVAILABLE", "RENTED", "MAINTENANCE"];
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 422 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const t = await tx.trailer.update({
        where: { id },
        data: { ...(body.status ? { status: body.status as never } : {}) },
        select: { id: true, status: true, name: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: `trailer.status.${body.status?.toLowerCase()}`,
          entity: "Trailer",
          entityId: id,
          payload: { previousStatus: trailer.status, newStatus: body.status },
        },
      });

      return t;
    });

    return NextResponse.json(updated);
  } catch (err) {
    return adminError(err);
  }
}
