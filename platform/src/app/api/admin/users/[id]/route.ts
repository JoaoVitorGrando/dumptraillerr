import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

type Action = "approve" | "suspend" | "reactivate";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAdmin();
    const { id } = await params;
    const body = (await request.json()) as { action: Action };

    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, status: true, role: true, ownerProfile: { select: { id: true } }, driverProfile: { select: { id: true } } },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const actionMap: Record<Action, { status: "ACTIVE" | "SUSPENDED"; approveProfile: boolean }> = {
      approve: { status: "ACTIVE", approveProfile: true },
      suspend: { status: "SUSPENDED", approveProfile: false },
      reactivate: { status: "ACTIVE", approveProfile: false },
    };

    const conf = actionMap[body.action];
    if (!conf) {
      return NextResponse.json({ error: "Invalid action" }, { status: 422 });
    }

    const updated = await prisma.$transaction(async (tx) => {
      const u = await tx.user.update({
        where: { id },
        data: { status: conf.status },
        select: { id: true, status: true, role: true },
      });

      if (conf.approveProfile) {
        if (user.ownerProfile) {
          await tx.ownerProfile.update({
            where: { userId: id },
            data: { approvedAt: new Date() },
          });
        }
        if (user.driverProfile) {
          await tx.driverProfile.update({
            where: { userId: id },
            data: { approvedAt: new Date() },
          });
        }
      }

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: `user.${body.action}`,
          entity: "User",
          entityId: id,
          payload: { previousStatus: user.status, newStatus: conf.status },
        },
      });

      return u;
    });

    return NextResponse.json(updated);
  } catch (err) {
    return adminError(err);
  }
}
