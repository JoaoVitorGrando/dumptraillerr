import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  DEMO_FLEET,
  DEMO_OWNER_EARNINGS,
  formatCents,
  statusColor,
  statusLabel,
} from "@/data/demo";

export const metadata = { title: "Owner Dashboard — FAGU Home Services" };

/* ---------- Inline icons ---------- */
function I({ children }: { children: React.ReactNode }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      {children}
    </svg>
  );
}
const IconWallet = (
  <I>
    <path d="M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
    <path d="M3 7V6a2 2 0 0 1 2-2h11" />
    <circle cx="17" cy="13" r="1.2" />
  </I>
);
const IconTrend = (
  <I>
    <path d="M3 17 9 11l4 4 8-8" />
    <path d="M14 7h7v7" />
  </I>
);
const IconTruck = (
  <I>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </I>
);
const IconCheck = (
  <I>
    <path d="M4 12.5 10 18 20 6" />
  </I>
);
const IconCalendar = (
  <I>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </I>
);
const IconUser = (
  <I>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </I>
);

export default async function OwnerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/owner");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  const fleet = DEMO_FLEET;
  const earnings = DEMO_OWNER_EARNINGS;
  const thisMonth = earnings[earnings.length - 1];
  const lastMonth = earnings[earnings.length - 2];
  const totalEarnings = earnings.reduce((s, e) => s + e.net, 0);
  const availableCount = fleet.filter((t) => t.status === "available").length;
  const rentedCount = fleet.filter((t) => t.status === "rented").length;

  return (
    <div>
      {/* Greeting + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <p className="text-sm text-brand-gray">
          Hi <span className="font-semibold text-brand-dark">{firstName}</span>, here is your fleet overview.
        </p>
        <Link href="/dashboard/owner/fleet/new" className="btn-primary shrink-0">
          + Add Trailer
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total Earnings" value={formatCents(totalEarnings)} icon={IconWallet} accent />
        <StatCard label="This Month" value={formatCents(thisMonth.net)} icon={IconTrend} />
        <StatCard label="Trailers Active" value={String(rentedCount)} icon={IconTruck} />
        <StatCard label="Available Now" value={String(availableCount)} icon={IconCheck} />
      </div>

      {/* Month comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[11px] font-semibold text-brand-gray uppercase tracking-[0.14em]">
              {thisMonth.period}
            </p>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded">
              Live
            </span>
          </div>
          <p className="font-display text-3xl font-bold text-brand-dark leading-none">
            {formatCents(thisMonth.net)}
          </p>
          <p className="text-xs text-brand-gray mt-1.5">
            {thisMonth.trips} trips · gross {formatCents(thisMonth.gross)}
          </p>
          <div className="mt-3 h-1.5 rounded-full bg-brand-light overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-orange to-brand-dark-orange transition-all duration-500"
              style={{
                width: `${Math.min(100, (thisMonth.trips / Math.max(1, lastMonth.trips)) * 100)}%`,
              }}
            />
          </div>
          <p className="text-xs text-brand-gray mt-1.5">
            vs {lastMonth.period}: {lastMonth.trips} trips
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-brand-light/40 to-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-7 h-7 rounded-md bg-brand-orange/10 text-brand-orange items-center justify-center">
                {IconTruck}
              </span>
              <h2 className="font-display font-bold text-brand-dark text-base">Fleet Status</h2>
            </div>
            <Link
              href="/dashboard/owner/fleet"
              className="text-xs text-brand-orange font-bold hover:underline"
            >
              Manage →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {fleet.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-brand-light/30 transition-colors"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-10 h-8 object-cover rounded bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{t.name}</p>
                  <p className="text-xs text-brand-gray">
                    {t.size} · {t.licensePlate}
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
            ))}
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/dashboard/owner/fleet", label: "Fleet", icon: IconTruck },
          { href: "/dashboard/owner/availability", label: "Availability", icon: IconCalendar },
          { href: "/dashboard/owner/earnings", label: "Earnings", icon: IconWallet },
          { href: "/dashboard/owner/profile", label: "Profile", icon: IconUser },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-brand-orange/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-brand-light/80 text-brand-dark group-hover:bg-brand-orange group-hover:text-white transition-colors">
              {l.icon}
            </span>
            <span className="text-sm font-semibold text-brand-dark">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  warn,
  accent,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  warn?: boolean;
  accent?: boolean;
}) {
  const tone = warn
    ? {
        border: "border-amber-200",
        iconBg: "bg-amber-100 text-amber-700",
        valueClass: "text-amber-700",
      }
    : accent
    ? {
        border: "border-brand-orange/30",
        iconBg: "bg-brand-orange text-white",
        valueClass: "text-brand-dark",
      }
    : {
        border: "border-gray-200",
        iconBg: "bg-brand-light/80 text-brand-dark",
        valueClass: "text-brand-dark",
      };

  return (
    <div
      className={`relative bg-white rounded-xl border ${tone.border} p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${tone.iconBg}`}>
          {icon}
        </span>
        {accent && (
          <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded">
            Live
          </span>
        )}
      </div>
      <p className={`font-display text-2xl sm:text-[26px] font-bold leading-none ${tone.valueClass}`}>
        {value}
      </p>
      <p className="text-[11px] sm:text-xs text-brand-gray mt-1.5 uppercase tracking-wider font-semibold">
        {label}
      </p>
    </div>
  );
}
