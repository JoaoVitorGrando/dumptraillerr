import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, adminError } from "@/lib/adminAuth";
import { NextRequest } from "next/server";

function toSlug(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function generateUniqueSlug(base: string) {
  const root = toSlug(base) || `trailer-${Date.now()}`;
  let candidate = root;
  let i = 1;
  while (true) {
    const exists = await prisma.trailer.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
    i += 1;
    candidate = `${root}-${i}`;
  }
}

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
        currentLocationType: true,
        currentLocationLabel: true,
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

export async function POST(request: NextRequest) {
  try {
    const { userId } = await requireAdmin();
    const body = (await request.json()) as {
      ownerId?: string;
      name?: string;
      size?: string;
      capacity?: string;
      gvwr?: string;
      payload?: string;
      pricePerPeriod?: number;
      status?: "AVAILABLE" | "RENTED" | "MAINTENANCE";
      images?: string[];
      currentLocationType?: "DEPOT" | "CUSTOMER_SITE" | "DISPOSAL_SITE" | "IN_TRANSIT" | "UNKNOWN";
      currentLocationLabel?: string;
    };

    if (!body.ownerId || !body.name || !body.size || !body.pricePerPeriod) {
      return NextResponse.json(
        { error: "ownerId, name, size and pricePerPeriod are required" },
        { status: 422 }
      );
    }

    const owner = await prisma.ownerProfile.findUnique({
      where: { id: body.ownerId },
      select: { id: true },
    });
    if (!owner) {
      return NextResponse.json({ error: "Owner not found" }, { status: 404 });
    }

    const slug = await generateUniqueSlug(`${body.name}-${body.size}`);
    const created = await prisma.$transaction(async (tx) => {
      const trailer = await tx.trailer.create({
        data: {
          ownerId: body.ownerId!,
          name: body.name!,
          slug,
          size: body.size!,
          capacity: body.capacity ?? "N/A",
          gvwr: body.gvwr ?? "N/A",
          payload: body.payload ?? "N/A",
          pricePerPeriod: Number(body.pricePerPeriod),
          status: body.status ?? "AVAILABLE",
          images: Array.isArray(body.images) ? body.images.filter(Boolean) : [],
          currentLocationType: body.currentLocationType ?? "DEPOT",
          currentLocationLabel: body.currentLocationLabel ?? null,
          currentLocationAt: new Date(),
        },
        select: { id: true, name: true, slug: true },
      });

      await tx.auditLog.create({
        data: {
          actorId: userId,
          action: "trailer.create",
          entity: "Trailer",
          entityId: trailer.id,
          payload: { name: trailer.name, slug: trailer.slug },
        },
      });

      return trailer;
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    return adminError(err);
  }
}
