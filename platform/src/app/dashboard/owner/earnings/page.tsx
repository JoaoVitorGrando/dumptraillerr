import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_OWNER_EARNINGS, DEMO_FLEET, formatCents } from "@/data/demo";

export const metadata = { title: "Earnings — FAGU Owner" };

export default async function OwnerEarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/owner/earnings");

  const earnings = DEMO_OWNER_EARNINGS;
  const fleet = DEMO_FLEET;

  const totalGross = earnings.reduce((s, e) => s + e.gross, 0);
  const totalNet = earnings.reduce((s, e) => s + e.net, 0);
  const platformFee = totalGross - totalNet;
  const maxNet = Math.max(...earnings.map((e) => e.net));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Earnings</h1>
        <p className="text-brand-gray mt-1 text-sm">
          Revenue after FAGU 15% platform fee.
        </p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Net Earned" value={formatCents(totalNet)} highlight />
        <StatCard label="Total Gross" value={formatCents(totalGross)} />
        <StatCard label="Platform Fees" value={formatCents(platformFee)} />
        <StatCard label="Total Trips" value={String(earnings.reduce((s, e) => s + e.trips, 0))} />
      </div>

      {/* Monthly breakdown */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-brand-dark text-sm mb-5">Monthly Breakdown</h2>
        <div className="space-y-4">
          {[...earnings].reverse().map((e) => (
            <div key={e.period}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-brand-dark">{e.period}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-dark">{formatCents(e.net)}</span>
                  <span className="text-xs text-brand-gray ml-2">({e.trips} trips)</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-orange transition-all"
                  style={{ width: `${Math.round((e.net / maxNet) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Per-trailer earnings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-brand-dark text-sm">Per-Trailer Performance</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {fleet.map((t) => (
            <div key={t.id} className="flex items-center gap-4 px-5 py-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.image} alt={t.name} className="w-12 h-10 object-cover rounded-lg bg-gray-100 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-dark">{t.name}</p>
                <p className="text-xs text-brand-gray">{t.size} · {t.totalTrips} trips</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-brand-dark">{formatCents(t.totalEarnings)}</p>
                <p className="text-xs text-brand-gray">lifetime</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stripe connect CTA */}
      <div className="mt-6 bg-brand-dark rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white text-sm">Set up payouts</p>
          <p className="text-xs text-white/60 mt-0.5">
            Connect your bank account via Stripe to receive weekly payouts.
          </p>
        </div>
        <button
          type="button"
          className="btn-outline-light shrink-0 text-sm"
          onClick={() => alert("Stripe Connect — available after Stripe credentials are configured.")}
        >
          Connect Bank
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? "bg-brand-orange border-brand-orange/20" : "bg-white border-gray-200"}`}>
      <p className={`text-2xl font-bold ${highlight ? "text-white" : "text-brand-dark"}`}>{value}</p>
      <p className={`text-xs mt-0.5 ${highlight ? "text-white/80" : "text-brand-gray"}`}>{label}</p>
    </div>
  );
}
