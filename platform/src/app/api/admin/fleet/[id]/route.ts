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
    const body = (await request.json()) as {
      status?: "AVAILABLE" | "RENTED" | "MAINTENANCE";
      ownerId?: string;
      name?: string;
      size?: string;
      capacity?: string;
      gvwr?: string;
      payload?: string;
      pricePerPeriod?: number;
      images?: string[];
      currentLocationType?: "DEPOT" | "CUSTOMER_SITE" | "DISPOSAL_SITE" | "IN_TRANSIT" | "UNKNOWN";
      currentLocationLabel?: string | null;
    };

    const trailer = await prisma.trailer.findUnique({
      where: { id },
      select: { id: true, status: true, name: true, ownerId: true },
    });

    if (!trailer) {
      return NextResponse.json({ error: "Trailer not found" }, { status: 404 });
    }

    const validStatuses = ["AVAILABLE", "RENTED", "MAINTENANCE"] as const;
    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 422 });
    }

    if (body.ownerId) {
      const owner = await prisma.ownerProfile.findUnique({
        where: { id: body.ownerId },
        select: { id: true },
      });
      if (!owner) {
        return NextResponse.json({ error: "Owner not found" }, { status: 404 });
      }
    }

    const updated = await prisma.$transaction(async (tx) => {
      const t = await tx.trailer.update({
        where: { id },
        data: {
          ...(body.status ? { status: body.status } : {}),
          ...(body.ownerId ? { ownerId: body.ownerId } : {}),
          ...(body.name ? { name: body.name } : {}),
          ...(body.size ? { size: body.size } : {}),
          ...(body.capacity ? { capacity: body.capacity } : {}),
          ...(body.gvwr ? { gvwr: body.gvwr } : {}),
          ...(body.payload ? { payload: body.payload } : {}),
          ...(typeof body.pricePerPeriod === "number"
            ? { pricePerPeriod: Number(body.pricePerPeriod) }
            : {}),
          ...(Array.isArray(body.images) ? { images: body.images.filter(Boolean) } : {}),
          ...(body.currentLocationType ? { currentLocationType: body.currentLocationType } : {}),
          ...(body.currentLocationLabel !== undefined
            ? { currentLocationLabel: body.currentLocationLabel || null, currentLocationAt: new Date() }
            : {}),
        },
        select: { id: true, status: true, name: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: body.status ? `trailer.status.${body.status.toLowerCase()}` : "trailer.update",
          entity: "Trailer",
          entityId: id,
          payload: {
            previousStatus: trailer.status,
            newStatus: body.status ?? trailer.status,
            previousOwnerId: trailer.ownerId,
            newOwnerId: body.ownerId ?? trailer.ownerId,
          },
        },
      });

      return t;
    });

    return NextResponse.json(updated);
  } catch (err) {
    return adminError(err);
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await requireAdmin();
    const { id } = await params;

    const trailer = await prisma.trailer.findUnique({
      where: { id },
      select: { id: true, name: true },
    });
    if (!trailer) {
      return NextResponse.json({ error: "Trailer not found" }, { status: 404 });
    }

    const activeBookings = await prisma.booking.count({
      where: {
        trailerId: id,
        status: { in: ["PENDING", "CONFIRMED", "IN_PROGRESS"] },
      },
    });
    if (activeBookings > 0) {
      return NextResponse.json(
        { error: "Cannot delete trailer with active bookings" },
        { status: 409 }
      );
    }

    await prisma.$transaction(async (tx) => {
      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "trailer.delete",
          entity: "Trailer",
          entityId: id,
          payload: { name: trailer.name },
        },
      });
      await tx.trailer.delete({ where: { id } });
    });

    return NextResponse.json({ ok: true, id });
  } catch (err) {
    return adminError(err);
  }
}
