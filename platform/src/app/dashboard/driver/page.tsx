import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_JOBS, DEMO_EARNINGS, formatCents, statusColor, statusLabel } from "@/data/demo";

export const metadata = { title: "Driver Dashboard — FAGU" };

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
const IconRoute = (
  <I>
    <circle cx="6" cy="6" r="3" />
    <circle cx="18" cy="18" r="3" />
    <path d="M9 6h6a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8" />
  </I>
);
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
const IconHistory = (
  <I>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 8v5l3.5 2" />
  </I>
);
const IconUser = (
  <I>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </I>
);
const IconBeach = (
  <I>
    <circle cx="6" cy="9" r="3" />
    <path d="M6 12v9" />
    <path d="M3 21h18" />
    <path d="M9 9c4-3 8-3 12 0" />
  </I>
);

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
      {/* Greeting */}
      <div className="mb-6">
        <p className="text-sm text-brand-gray">
          Good morning <span className="font-semibold text-brand-dark">{firstName}</span> —{" "}
          {jobs.length > 0
            ? `you have ${jobs.length} job${jobs.length > 1 ? "s" : ""} scheduled today.`
            : "no jobs scheduled today. Enjoy."}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Today" value={String(jobs.length)} icon={IconRoute} accent />
        <StatCard
          label="Est. Pay"
          value={formatCents(jobs.reduce((s, j) => s + j.earnings, 0))}
          icon={IconWallet}
        />
        <StatCard label="This Month" value={formatCents(thisMonth.net)} icon={IconTrend} />
      </div>

      {/* Today schedule heading */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-base sm:text-lg font-bold text-brand-dark">
          Today&apos;s Schedule
        </h2>
        <Link
          href="/dashboard/driver/history"
          className="text-xs text-brand-orange font-bold hover:underline"
        >
          View history →
        </Link>
      </div>

      <div className="space-y-3 mb-8">
        {jobs.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-light/80 text-brand-dark mb-3 mx-auto">
              {IconBeach}
            </span>
            <p className="text-sm font-semibold text-brand-dark">Free day!</p>
            <p className="text-xs text-brand-gray mt-1">No deliveries scheduled.</p>
          </div>
        )}
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/dashboard/driver/job/${job.id}`}
            className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-brand-orange/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-brand-dark">{job.customerName}</span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusColor(
                      job.status,
                    )}`}
                  >
                    {statusLabel(job.status)}
                  </span>
                </div>
                <p className="text-xs text-brand-gray mt-0.5">
                  {job.trailerSize} · {job.scheduledTime}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-display font-bold text-brand-dark text-lg leading-none">
                  {formatCents(job.earnings)}
                </p>
                <p className="text-xs text-brand-gray mt-1">{job.distanceMiles} mi</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-brand-gray">
              <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-brand-orange">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {job.address}, {job.city}
            </div>
            {job.notes && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-1.5 mt-2 flex items-center gap-1.5">
                <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="text-amber-700">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <path d="M14 2v6h6M9 13h6M9 17h4" />
                </svg>
                {job.notes}
              </p>
            )}
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-brand-orange font-bold">
                Tap to start delivery →
              </span>
              <div className="flex gap-1">
                {["Pickup", "Drive", "Deliver", "Done"].map((step, i) => (
                  <div
                    key={step}
                    className={`w-6 h-1.5 rounded-full ${
                      i === 0 ? "bg-brand-orange" : "bg-brand-light"
                    }`}
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
          { href: "/dashboard/driver/history", label: "History", icon: IconHistory },
          { href: "/dashboard/driver/earnings", label: "Earnings", icon: IconWallet },
          { href: "/dashboard/driver/profile", label: "Profile", icon: IconUser },
        ].map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="group bg-white border border-gray-200 rounded-xl p-4 flex flex-col items-center gap-2 hover:border-brand-orange/40 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-200"
          >
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-brand-light/80 text-brand-dark group-hover:bg-brand-orange group-hover:text-white transition-colors">
              {l.icon}
            </span>
            <span className="text-xs font-semibold text-brand-dark">{l.label}</span>
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
      className={`relative bg-white rounded-xl border ${tone.border} p-3 sm:p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5`}
    >
      <div className="flex items-start justify-between gap-2 mb-2 sm:mb-3">
        <span className={`inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg ${tone.iconBg}`}>
          {icon}
        </span>
      </div>
      <p
        className={`font-display text-xl sm:text-2xl font-bold leading-none ${tone.valueClass}`}
      >
        {value}
      </p>
      <p className="text-[10px] sm:text-xs text-brand-gray mt-1.5 uppercase tracking-wider font-semibold">
        {label}
      </p>
    </div>
  );
}
