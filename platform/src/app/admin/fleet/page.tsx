import { prisma } from "@/lib/prisma";
import FleetClient from "./FleetClient";

export const metadata = { title: "Fleet — Admin FAGU" };

export default async function AdminFleetPage() {
  const trailers = await prisma.trailer.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      size: true,
      pricePerPeriod: true,
      status: true,
      images: true,
      owner: { select: { companyName: true, user: { select: { email: true } } } },
      bookings: {
        where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } },
        orderBy: { serviceDate: "asc" },
        take: 1,
        select: { serviceDate: true, pickupDate: true, status: true },
      },
      _count: { select: { bookings: { where: { status: "COMPLETED" } } } },
    },
  });

  const serialized = trailers.map((t) => ({
    ...t,
    bookings: t.bookings.map((b) => ({
      ...b,
      serviceDate: b.serviceDate.toISOString(),
      pickupDate: b.pickupDate?.toISOString() ?? null,
    })),
  }));

  return <FleetClient initialTrailers={serialized} />;
}
