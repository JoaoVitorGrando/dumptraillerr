import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_JOBS, DEMO_EARNINGS, formatCents, statusColor, statusLabel } from "@/data/demo";

export const metadata = { title: "Driver Dashboard — FAGU" };

export default async function DriverDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/driver");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  const jobs = DEMO_JOBS;
  const earnings = DEMO_EARNINGS;
  const thisMonth = earnings[earnings.length - 1];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-brand-dark">
          Good morning, {firstName} ☀️
        </h1>
        <p className="text-brand-gray mt-1 text-sm">
          {jobs.length > 0
            ? `You have ${jobs.length} job${jobs.length > 1 ? "s" : ""} scheduled today.`
            : "No jobs scheduled today. Check back later."}
        </p>
      </div>

      {/* Today's stats strip */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold text-brand-dark">{jobs.length}</p>
          <p className="text-xs text-brand-gray">Today</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold text-brand-dark">
            {formatCents(jobs.reduce((s, j) => s + j.earnings, 0))}
          </p>
          <p className="text-xs text-brand-gray">Est. Pay</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
          <p className="text-xl font-bold text-brand-dark">
            {formatCents(thisMonth.net)}
          </p>
          <p className="text-xs text-brand-gray">This Month</p>
        </div>
      </div>

      {/* Job cards */}
      <h2 className="text-sm font-bold text-brand-dark uppercase tracking-wider mb-3">
        Today&apos;s Schedule
      </h2>
      <div className="space-y-3 mb-8">
        {jobs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <div className="text-4xl mb-3">🌴</div>
            <p className="text-sm font-semibold text-brand-dark">Free day!</p>
            <p className="text-xs text-brand-gray mt-1">No deliveries scheduled.</p>
          </div>
        )}
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/dashboard/driver/job/${job.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-orange/40 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-brand-dark">{job.customerName}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(job.status)}`}>
                    {statusLabel(job.status)}
                  </span>
                </div>
                <p className="text-xs text-brand-gray mt-0.5">
                  {job.trailerSize} · {job.scheduledTime}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-brand-dark">{formatCents(job.earnings)}</p>
                <p className="text-xs text-brand-gray">{job.distanceMiles} mi</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-gray">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
              </svg>
              {job.address}, {job.city}
            </div>
            {job.notes && (
              <p className="text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-1.5 mt-2">
                📌 {job.notes}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-brand-orange font-semibold">
                Tap to start delivery →
              </span>
              <div className="flex gap-1">
                {["Pickup", "Drive", "Deliver", "Done"].map((step, i) => (
                  <div
                    key={step}
                    className={`w-6 h-1.5 rounded-full ${i === 0 ? "bg-brand-orange" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { href: "/dashboard/driver/history", label: "History", emoji: "📋" },
          { href: "/dashboard/driver/earnings", label: "Earnings", emoji: "💵" },
          { href: "/dashboard/driver/profile", label: "Profile", emoji: "👤" },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-brand-orange/40 transition-all"
          >
            <span className="text-2xl">{l.emoji}</span>
            <span className="text-xs font-semibold text-brand-dark">{l.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
