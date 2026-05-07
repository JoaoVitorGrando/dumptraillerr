import { prisma } from "@/lib/prisma";
import { expireStaleBookings } from "@/lib/availability";
import BookingsClient from "./BookingsClient";

export const metadata = { title: "Bookings — Admin FAGU" };

export default async function AdminBookingsPage() {
  await expireStaleBookings();

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      deliveryAddress: true,
      serviceDate: true,
      pickupDate: true,
      totalAmount: true,
      trailer: { select: { name: true, images: true } },
      customer: { select: { user: { select: { email: true } } } },
      payment: { select: { status: true, stripeCheckoutSessionId: true } },
    },
  });

  const serialized = bookings.map((b) => ({
    ...b,
    serviceDate: b.serviceDate.toISOString(),
    pickupDate: b.pickupDate?.toISOString() ?? null,
  }));

  return <BookingsClient initialBookings={serialized} />;
}
