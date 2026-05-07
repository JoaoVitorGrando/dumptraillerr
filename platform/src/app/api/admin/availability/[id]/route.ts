import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAdmin();
    const { id } = await params;

    const block = await prisma.trailerAvailability.findUnique({
      where: { id },
      select: { id: true, trailerId: true },
    });

    if (!block) {
      return NextResponse.json({ error: "Block not found" }, { status: 404 });
    }

    await prisma.$transaction(async (tx) => {
      await tx.trailerAvailability.delete({ where: { id } });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "availability.block.deleted",
          entity: "TrailerAvailability",
          entityId: id,
          payload: { trailerId: block.trailerId },
        },
      });
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    return adminError(err);
  }
}
