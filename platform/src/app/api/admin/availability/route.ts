import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const trailerId = searchParams.get("trailerId");

    const blocks = await prisma.trailerAvailability.findMany({
      where: { ...(trailerId ? { trailerId } : {}) },
      orderBy: { blockedFrom: "asc" },
      select: {
        id: true,
        trailerId: true,
        blockedFrom: true,
        blockedUntil: true,
        reason: true,
        trailer: { select: { name: true } },
      },
    });

    return NextResponse.json(blocks);
  } catch (err) {
    return adminError(err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAdmin();
    const body = (await request.json()) as {
      trailerId: string;
      blockedFrom: string;
      blockedUntil: string;
      reason?: string;
    };

    if (!body.trailerId || !body.blockedFrom || !body.blockedUntil) {
      return NextResponse.json(
        { error: "trailerId, blockedFrom, and blockedUntil are required" },
        { status: 400 }
      );
    }

    const from = new Date(body.blockedFrom);
    const to = new Date(body.blockedUntil);

    if (from >= to) {
      return NextResponse.json(
        { error: "blockedFrom must be before blockedUntil" },
        { status: 400 }
      );
    }

    const block = await prisma.$transaction(async (tx) => {
      const b = await tx.trailerAvailability.create({
        data: {
          trailerId: body.trailerId,
          blockedFrom: from,
          blockedUntil: to,
          reason: body.reason,
        },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "availability.block.created",
          entity: "TrailerAvailability",
          entityId: b.id,
          payload: { trailerId: body.trailerId, from: body.blockedFrom, to: body.blockedUntil, reason: body.reason },
        },
      });

      return b;
    });

    return NextResponse.json(block, { status: 201 });
  } catch (err) {
    return adminError(err);
  }
}
