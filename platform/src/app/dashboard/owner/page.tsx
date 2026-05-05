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

export default async function OwnerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/owner");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  // TODO: queries reais quando Supabase estiver configurado
  const fleet = DEMO_FLEET;
  const earnings = DEMO_OWNER_EARNINGS;
  const thisMonth = earnings[earnings.length - 1];
  const lastMonth = earnings[earnings.length - 2];
  const totalEarnings = earnings.reduce((s, e) => s + e.net, 0);
  const availableCount = fleet.filter((t) => t.status === "available").length;
  const rentedCount = fleet.filter((t) => t.status === "rented").length;

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">
            Owner Dashboard
          </h1>
          <p className="text-brand-gray mt-1 text-sm">
            Hi {firstName}, here&apos;s your fleet overview.
          </p>
        </div>
        <Link href="/dashboard/owner/fleet/new" className="btn-primary shrink-0">
          + Add Trailer
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Earnings" value={formatCents(totalEarnings)} icon="💰" />
        <StatCard label="This Month" value={formatCents(thisMonth.net)} icon="📈" />
        <StatCard label="Trailers Active" value={String(rentedCount)} icon="🚛" />
        <StatCard label="Available Now" value={String(availableCount)} icon="✅" />
      </div>

      {/* Month comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-3">
            {thisMonth.period}
          </p>
          <p className="text-3xl font-bold text-brand-dark">{formatCents(thisMonth.net)}</p>
          <p className="text-xs text-brand-gray mt-1">{thisMonth.trips} trips · gross {formatCents(thisMonth.gross)}</p>
          <div className="mt-3 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand-orange"
              style={{ width: `${Math.min(100, (thisMonth.trips / lastMonth.trips) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-brand-gray mt-1">
            vs {lastMonth.period}: {lastMonth.trips} trips
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-3">
            Fleet Status
          </p>
          <div className="space-y-3">
            {fleet.map((t) => (
              <div key={t.id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} className="w-10 h-8 object-cover rounded bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{t.name}</p>
                  <p className="text-xs text-brand-gray">{t.size} · {t.licensePlate}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusColor(t.status)}`}>
                  {statusLabel(t.status)}
                </span>
              </div>
            ))}
          </div>
          <Link href="/dashboard/owner/fleet" className="mt-4 inline-block text-xs text-brand-orange font-semibold hover:underline">
            Manage fleet →
          </Link>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { href: "/dashboard/owner/fleet", label: "Fleet", emoji: "🚛" },
          { href: "/dashboard/owner/availability", label: "Availability", emoji: "📅" },
          { href: "/dashboard/owner/earnings", label: "Earnings", emoji: "💵" },
          { href: "/dashboard/owner/profile", label: "Profile", emoji: "👤" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-3 hover:border-brand-orange/40 hover:shadow-sm transition-all"
          >
            <span className="text-xl">{l.emoji}</span>
            <span className="text-sm font-semibold text-brand-dark">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="text-xl mb-2">{icon}</div>
      <p className="text-2xl font-bold text-brand-dark">{value}</p>
      <p className="text-xs text-brand-gray mt-0.5">{label}</p>
    </div>
  );
}
