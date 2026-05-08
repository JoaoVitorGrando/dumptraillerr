import { prisma } from "@/lib/prisma";
import FleetClient from "./FleetClient";

export const metadata = { title: "Fleet — Admin FAGU" };

export default async function AdminFleetPage() {
  const [trailers, owners] = await Promise.all([
    prisma.trailer.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      size: true,
      pricePerPeriod: true,
      status: true,
        capacity: true,
        gvwr: true,
        payload: true,
        currentLocationType: true,
        currentLocationLabel: true,
      images: true,
      owner: { select: { companyName: true, user: { select: { email: true } } } },
        ownerId: true,
      bookings: {
        where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } },
        orderBy: { serviceDate: "asc" },
        take: 1,
        select: { serviceDate: true, pickupDate: true, status: true },
      },
      _count: { select: { bookings: { where: { status: "COMPLETED" } } } },
    },
    }),
    prisma.ownerProfile.findMany({
      where: { approvedAt: { not: null } },
      orderBy: { approvedAt: "desc" },
      select: {
        id: true,
        companyName: true,
        user: { select: { email: true } },
      },
    }),
  ]);

  const serialized = trailers.map((t) => ({
    ...t,
    bookings: t.bookings.map((b) => ({
      ...b,
      serviceDate: b.serviceDate.toISOString(),
      pickupDate: b.pickupDate?.toISOString() ?? null,
    })),
  }));

  const ownerOptions = owners.map((o) => ({
    id: o.id,
    label: o.companyName || o.user.email,
  }));

  return <FleetClient initialTrailers={serialized} ownerOptions={ownerOptions} />;
}
