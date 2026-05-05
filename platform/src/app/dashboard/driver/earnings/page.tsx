import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEMO_EARNINGS, DEMO_JOB_HISTORY, formatCents } from "@/data/demo";

export const metadata = { title: "Earnings — FAGU Driver" };

export default async function DriverEarningsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/driver/earnings");

  const earnings = DEMO_EARNINGS;
  const history = DEMO_JOB_HISTORY;

  const totalNet = earnings.reduce((s, e) => s + e.net, 0);
  const totalTips = history.reduce((s, j) => s + j.tip, 0);
  const thisMonth = earnings[earnings.length - 1];
  const maxNet = Math.max(...earnings.map((e) => e.net));

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Earnings</h1>
        <p className="text-brand-gray mt-1 text-sm">Your pay after FAGU 15% fee.</p>
      </div>

      {/* Top stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-brand-orange rounded-xl p-5 text-white">
          <p className="text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
            Total Earned
          </p>
          <p className="text-3xl font-bold">{formatCents(totalNet)}</p>
          <p className="text-xs opacity-70 mt-1">+ {formatCents(totalTips)} in tips</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-brand-gray uppercase tracking-wider mb-1">
            This Month
          </p>
          <p className="text-3xl font-bold text-brand-dark">{formatCents(thisMonth.net)}</p>
          <p className="text-xs text-brand-gray mt-1">{thisMonth.trips} trips</p>
        </div>
      </div>

      {/* Monthly chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-bold text-brand-dark text-sm mb-5">Monthly Pay</h2>
        <div className="space-y-4">
          {[...earnings].reverse().map((e) => (
            <div key={e.period}>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-brand-dark">{e.period}</span>
                <div className="text-right">
                  <span className="text-sm font-bold text-brand-dark">{formatCents(e.net)}</span>
                  <span className="text-xs text-brand-gray ml-2">({e.trips} trips)</span>
                </div>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-orange"
                  style={{ width: `${Math.round((e.net / maxNet) * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payout CTA */}
      <div className="bg-brand-dark rounded-xl p-5 flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-white text-sm">Weekly payouts via Stripe</p>
          <p className="text-xs text-white/60 mt-0.5">
            Connect your bank account to receive automatic weekly transfers.
          </p>
        </div>
        <button
          type="button"
          className="btn-outline-light shrink-0 text-sm"
          onClick={() => alert("Stripe Connect — disponível após configurar as credenciais.")}
        >
          Connect Bank
        </button>
      </div>
    </div>
  );
}
