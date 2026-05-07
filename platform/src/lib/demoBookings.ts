import { cookies } from "next/headers";

export type DemoBookingStatus = "pending" | "confirmed" | "active" | "completed" | "cancelled";
export type DemoPaymentStatus = "pending" | "paid" | "refunded";

export interface StoredDemoBooking {
  id: string;
  createdAt: string;
  status: DemoBookingStatus;
  paymentStatus: DemoPaymentStatus;
  totalAmount: number;
  deliveryDate: string;
  pickupDate: string;
  address: string;
  city: string;
  notes?: string;
  customerEmail: string;
  trailer: {
    name: string;
    size: string;
    image: string;
  };
}

export const DEMO_BOOKINGS_COOKIE = "fagu_demo_bookings";

export async function getDemoBookingsForUser(email?: string | null): Promise<StoredDemoBooking[]> {
  if (!email) return [];
  const store = await cookies();
  const raw = store.get(DEMO_BOOKINGS_COOKIE)?.value;
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as StoredDemoBooking[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((b) => String(b.customerEmail).toLowerCase() === email.toLowerCase())
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  } catch {
    return [];
  }
}

