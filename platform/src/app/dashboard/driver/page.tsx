import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import DriverOffersList, { type DriverOfferItem } from "@/components/driver/DriverOffersList";

export const metadata = { title: "Driver Dashboard — FAGU" };

function pseudoSeattlePoint(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const latOffset = ((hash % 900) / 10000) - 0.045;
  const lngOffset = ((((hash / 900) | 0) % 1200) / 10000) - 0.06;
  return {
    lat: 47.6062 + latOffset,
    lng: -122.3321 + lngOffset,
  };
}

async function geocodeSeattleAddress(address: string, seed: string) {
  const fallback = pseudoSeattlePoint(seed);
  const query = encodeURIComponent(`${address}, Seattle, WA, USA`);
  const url = `https://nominatim.openstreetmap.org/search?q=${query}&format=jsonv2&limit=1`;

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "FAGU Driver Dashboard/1.0",
        Accept: "application/json",
      },
      next: { revalidate: 60 * 60 * 12 },
    });
    if (!res.ok) return fallback;

    const data = (await res.json()) as Array<{ lat: string; lon: string }>;
    const first = data[0];
    if (!first) return fallback;

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return fallback;
    return { lat, lng };
  } catch {
    return fallback;
  }
}

export default async function DriverDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/driver");

  let openOffers: DriverOfferItem[] = [];
  let assignedLogistics: Array<{
    orderId: string;
    bookingId: string | null;
    trailerName: string;
    type: string;
    status: string;
    toLocation: string;
  }> = [];

  try {
    const offers = await prisma.booking.findMany({
      where: {
        status: "CONFIRMED",
        driverId: null,
        notes: { contains: "provider=DRIVER_MARKETPLACE" },
      },
      orderBy: { createdAt: "asc" },
      take: 8,
      select: {
        id: true,
        serviceDate: true,
        pickupDate: true,
        deliveryAddress: true,
        trailer: { select: { name: true } },
        customer: { select: { user: { select: { email: true } } } },
      },
    });
    openOffers = await Promise.all(
      offers.map(async (o) => {
        const point = await geocodeSeattleAddress(
          o.deliveryAddress,
          `${o.id}:${o.deliveryAddress}`
        );
        return {
          id: o.id,
          serviceDate: o.serviceDate.toISOString(),
          pickupDate: o.pickupDate?.toISOString() ?? null,
          deliveryAddress: o.deliveryAddress,
          trailerName: o.trailer.name,
          customerEmail: o.customer.user.email,
          lat: point.lat,
          lng: point.lng,
        };
      })
    );
  } catch {
    openOffers = [];
  }

  try {
    const driverProfile = await prisma.driverProfile.findFirst({
      where: { user: { email: user.email ?? "" } },
      select: { id: true },
    });
    if (driverProfile) {
      const queue = await prisma.logisticsOrder.findMany({
        where: {
          driverId: driverProfile.id,
          status: { in: ["ASSIGNED", "IN_PROGRESS", "PENDING"] },
        },
        orderBy: [{ status: "desc" }, { sequence: "asc" }],
        take: 6,
        select: {
          id: true,
          bookingId: true,
          type: true,
          status: true,
          toLocationLabel: true,
          trailer: { select: { name: true } },
        },
      });
      assignedLogistics = queue.map((q) => ({
        orderId: q.id,
        bookingId: q.bookingId,
        trailerName: q.trailer.name,
        type: q.type,
        status: q.status,
        toLocation: q.toLocationLabel,
      }));
    }
  } catch {
    assignedLogistics = [];
  }

  return (
    <div>
      <DriverOffersList initialOffers={openOffers} />

      {assignedLogistics.length > 0 && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-brand-light/40 to-white">
            <h2 className="font-display text-base font-bold text-brand-dark">My Active Logistics Orders</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {assignedLogistics.map((order) => (
              <div key={order.orderId} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">
                    {order.trailerName} · {order.type}
                  </p>
                  <p className="text-xs text-brand-gray truncate">{order.toLocation}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange">
                    {order.status}
                  </span>
                  {order.bookingId && (
                    <Link href={`/dashboard/driver/job/${order.bookingId}`} className="btn-primary !px-3 !py-1.5 !text-xs">
                      Open
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
