import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DEMO_FLEET, formatCents, statusColor, statusLabel } from "@/data/demo";
import OnlineBookingToggle from "@/components/owner/OnlineBookingToggle";
import OwnerTrailerQuickEdit from "@/components/owner/OwnerTrailerQuickEdit";

export const metadata = { title: "My Fleet — FAGU Home Services" };

/**
 * Owner Fleet — listagem da frota do owner com toggle de online booking.
 *
 * Por enquanto a página usa DEMO_FLEET como fallback (modo dev sem DB).
 * Quando o Prisma estiver populado, basta substituir a busca pelo query real
 * `prisma.trailer.findMany({ where: { owner: { user: { email: user.email } } } })`.
 */

type TrailerVm = {
  id: string;
  name: string;
  size: string;
  year?: number | null;
  licensePlate?: string | null;
  image: string;
  status: string;
  dailyRate: number;
  totalTrips: number;
  totalEarnings: number;
  nextAvailable?: string | null;
  onlineBookingEnabled: boolean;
  currentLocationType: "DEPOT" | "CUSTOMER_SITE" | "DISPOSAL_SITE" | "IN_TRANSIT" | "UNKNOWN";
  currentLocationLabel?: string | null;
  isDemo: boolean;
};

export default async function OwnerFleetPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/owner/fleet");

  let fleet: TrailerVm[] = [];
  try {
    const owner = await prisma.ownerProfile.findFirst({
      where: { user: { email: user.email ?? "" } },
      select: { id: true },
    });

    if (owner) {
      const trailers = await prisma.trailer.findMany({
        where: { ownerId: owner.id },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          size: true,
          capacity: true,
          gvwr: true,
          payload: true,
          pricePerPeriod: true,
          status: true,
          onlineBookingEnabled: true,
          currentLocationType: true,
          currentLocationLabel: true,
          images: true,
          bookings: {
            orderBy: { serviceDate: "desc" },
            select: {
              serviceDate: true,
              pickupDate: true,
              status: true,
              totalAmount: true,
              notes: true,
            },
          },
        },
      });

      fleet = trailers.map((t) => {
        const completed = t.bookings.filter((b) => b.status === "COMPLETED");
        const active = t.bookings.find((b) => b.status === "CONFIRMED" || b.status === "IN_PROGRESS");
        const totalEarnings = completed.reduce((sum, b) => sum + b.totalAmount, 0);
        return {
          id: t.id,
          name: t.name,
          size: t.size,
          image: t.images[0] ?? "/assets/7x14.png",
          status: t.status.toLowerCase(),
          dailyRate: t.pricePerPeriod,
          totalTrips: completed.length,
          totalEarnings,
          nextAvailable: active?.pickupDate?.toISOString() ?? null,
          onlineBookingEnabled: t.onlineBookingEnabled,
          currentLocationType: t.currentLocationType,
          currentLocationLabel: t.currentLocationLabel,
          isDemo: false,
        };
      });
    }
  } catch {
    fleet = [];
  }

  if (fleet.length === 0) {
    // Demo fallback — assume todos online por padrão.
    fleet = DEMO_FLEET.map((t) => ({
      id: t.id,
      name: t.name,
      size: t.size,
      year: t.year ?? null,
      licensePlate: t.licensePlate ?? null,
      image: t.image,
      status: t.status,
      dailyRate: t.dailyRate,
      totalTrips: t.totalTrips,
      totalEarnings: t.totalEarnings,
      nextAvailable: t.nextAvailable ?? null,
      onlineBookingEnabled: true,
      currentLocationType: "UNKNOWN",
      currentLocationLabel: null,
      isDemo: true,
    }));
  }

  const offlineCount = fleet.filter((t) => !t.onlineBookingEnabled).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <p className="text-sm text-brand-gray">
          <span className="font-semibold text-brand-dark">{fleet.length}</span> trailers registered
          {offlineCount > 0 && (
            <span className="ml-2 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
              {offlineCount} offline
            </span>
          )}
        </p>
        <Link href="/dashboard/owner/fleet/new" className="btn-primary shrink-0">
          + Add Trailer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {fleet.map((t) => (
          <div
            key={t.id}
            className={[
              "bg-white rounded-xl border overflow-hidden transition-all duration-200",
              t.onlineBookingEnabled
                ? "border-gray-200 hover:border-brand-orange/30 hover:shadow-md"
                : "border-amber-200 hover:border-amber-300",
            ].join(" ")}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt={t.name}
                className={`w-full h-40 object-cover bg-gray-100 ${
                  t.onlineBookingEnabled ? "" : "grayscale opacity-90"
                }`}
              />
              {!t.onlineBookingEnabled && (
                <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 border border-amber-300 px-2 py-1 rounded-full shadow-sm">
                  Offline
                </span>
              )}
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  <h3 className="font-display font-bold text-brand-dark truncate">{t.name}</h3>
                  <p className="text-[10px] font-semibold text-brand-gray">ID: {t.id}</p>
                  <p className="text-xs text-brand-gray">
                    {t.size}
                    {t.year ? ` · ${t.year}` : ""}
                    {t.licensePlate ? ` · ${t.licensePlate}` : ""}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${statusColor(
                    t.status,
                  )}`}
                >
                  {statusLabel(t.status)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center mb-3">
                <div className="bg-brand-light/60 rounded-lg py-2">
                  <p className="text-sm font-bold text-brand-dark">{formatCents(t.dailyRate)}</p>
                  <p className="text-[10px] text-brand-gray uppercase tracking-wider">/day</p>
                </div>
                <div className="bg-brand-light/60 rounded-lg py-2">
                  <p className="text-sm font-bold text-brand-dark">{t.totalTrips}</p>
                  <p className="text-[10px] text-brand-gray uppercase tracking-wider">trips</p>
                </div>
                <div className="bg-brand-light/60 rounded-lg py-2">
                  <p className="text-sm font-bold text-brand-dark">{formatCents(t.totalEarnings)}</p>
                  <p className="text-[10px] text-brand-gray uppercase tracking-wider">earned</p>
                </div>
              </div>

              {/* Toggle: Online booking ON/OFF */}
              <div className="mb-3">
                <OnlineBookingToggle
                  trailerId={t.id}
                  initialEnabled={t.onlineBookingEnabled}
                  readOnly={t.isDemo}
                />
              </div>

              <div className="mb-3 rounded-lg border border-gray-200 bg-brand-light/30 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-gray">
                  Current location
                </p>
                <p className="text-xs text-brand-dark mt-0.5">
                  {t.currentLocationType}
                  {t.currentLocationLabel ? ` · ${t.currentLocationLabel}` : ""}
                </p>
              </div>

              {t.nextAvailable && t.status !== "available" && (
                <p className="text-xs text-brand-gray mb-3">
                  Available from: <strong className="text-brand-dark">{t.nextAvailable}</strong>
                </p>
              )}

              <div className="flex gap-2">
                <OwnerTrailerQuickEdit
                  trailerId={t.id}
                  initialName={t.name}
                  initialSize={t.size}
                  initialPricePerPeriod={t.dailyRate}
                  initialLocationType={t.currentLocationType}
                  initialLocationLabel={t.currentLocationLabel ?? null}
                />
                <Link
                  href="/dashboard/owner/availability"
                  className="flex-1 text-center text-xs font-semibold text-brand-gray border border-gray-200 rounded-lg py-2 hover:bg-brand-light/40 transition-colors"
                >
                  Schedule
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Add trailer card */}
        <Link
          href="/dashboard/owner/fleet/new"
          className="bg-white rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-3 p-8 h-full min-h-[280px] hover:border-brand-orange/40 hover:bg-brand-orange/5 transition-all group"
        >
          <div className="w-12 h-12 rounded-full bg-brand-orange/10 group-hover:bg-brand-orange/20 flex items-center justify-center transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-5 h-5 text-brand-orange"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-brand-gray group-hover:text-brand-dark transition-colors">
            Add a Trailer
          </p>
        </Link>
      </div>
    </div>
  );
}
