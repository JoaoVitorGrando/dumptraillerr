import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { expireStaleBookings } from "@/lib/availability";

export const metadata = { title: "Admin — FAGU Platform" };

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

function formatDate(d: Date) {
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ---------- Inline icons (stroke-based, brand-aligned) ---------- */
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
const IconBookings = (
  <I>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </I>
);
const IconCheck = (
  <I>
    <path d="M4 12.5 10 18 20 6" />
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
const IconTrend = (
  <I>
    <path d="M3 17 9 11l4 4 8-8" />
    <path d="M14 7h7v7" />
  </I>
);
const IconWallet = (
  <I>
    <path d="M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
    <path d="M3 7V6a2 2 0 0 1 2-2h11" />
    <circle cx="17" cy="13" r="1.2" />
  </I>
);
const IconClock = (
  <I>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </I>
);
const IconAlert = (
  <I>
    <path d="m12 3 10 18H2L12 3Z" />
    <path d="M12 10v5M12 18.5v.01" />
  </I>
);
const IconUsers = (
  <I>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17" cy="9" r="2.8" />
    <path d="M15 20a5 5 0 0 1 6.5-4.7" />
  </I>
);

export default async function AdminPage() {
  await expireStaleBookings();

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    bookingsToday,
    confirmedBookings,
    allTrailers,
    rentedTrailers,
    totalRevenue,
    monthRevenue,
    pendingPayments,
    failedPayments,
    pendingOwners,
    pendingDrivers,
    recentBookings,
    recentTrailers,
  ] = await Promise.all([
    prisma.booking.count({ where: { serviceDate: { gte: startOfToday } } }),
    prisma.booking.count({ where: { status: { in: ["CONFIRMED", "IN_PROGRESS"] } } }),
    prisma.trailer.count(),
    prisma.trailer.count({ where: { status: "RENTED" } }),
    prisma.payment.aggregate({ where: { status: "PAID" }, _sum: { amount: true } }),
    prisma.payment.aggregate({
      where: { status: "PAID", paidAt: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "FAILED" } }),
    prisma.ownerProfile.count({ where: { approvedAt: null } }),
    prisma.driverProfile.count({ where: { approvedAt: null } }),
    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        status: true,
        totalAmount: true,
        serviceDate: true,
        trailer: { select: { name: true } },
        customer: { select: { user: { select: { email: true } } } },
        payment: { select: { status: true } },
      },
    }),
    prisma.trailer.findMany({
      take: 6,
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, size: true, status: true, images: true },
    }),
  ]);

  const occupancyPct = allTrailers > 0 ? Math.round((rentedTrailers / allTrailers) * 100) : 0;
  const pendingApprovals = pendingOwners + pendingDrivers;

  const bookingStatusColor: Record<string, string> = {
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    IN_PROGRESS: "bg-emerald-50 text-emerald-700 border-emerald-200",
    COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
    PENDING: "bg-amber-50 text-amber-700 border-amber-200",
    CANCELLED: "bg-red-50 text-red-600 border-red-200",
  };

  const trailerStatusColor: Record<string, string> = {
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-200",
    RENTED: "bg-blue-50 text-blue-700 border-blue-200",
    MAINTENANCE: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <div>
      {/* KPI grid - primary row (brand-accented) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <StatCard label="Bookings Today" value={String(bookingsToday)} icon={IconBookings} accent />
        <StatCard label="Active Bookings" value={String(confirmedBookings)} icon={IconCheck} />
        <StatCard label="Fleet Occupancy" value={`${occupancyPct}%`} icon={IconTruck} progress={occupancyPct} />
        <StatCard
          label="Revenue This Month"
          value={formatCents(monthRevenue._sum.amount ?? 0)}
          icon={IconTrend}
        />
      </div>

      {/* KPI grid - secondary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total Revenue" value={formatCents(totalRevenue._sum.amount ?? 0)} icon={IconWallet} />
        <StatCard
          label="Pending Payments"
          value={String(pendingPayments)}
          icon={IconClock}
          warn={pendingPayments > 0}
        />
        <StatCard
          label="Failed Payments"
          value={String(failedPayments)}
          icon={IconAlert}
          danger={failedPayments > 0}
        />
        <StatCard
          label="Pending Approvals"
          value={String(pendingApprovals)}
          icon={IconUsers}
          warn={pendingApprovals > 0}
        />
      </div>

      {/* Alerts */}
      {pendingApprovals > 0 && (
        <div className="mb-4 sm:mb-5 bg-gradient-to-r from-amber-50 to-amber-50/40 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-amber-100 text-amber-700">
              <I>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </I>
            </span>
            <div>
              <p className="text-sm font-bold text-amber-800">
                {pendingApprovals} pending approval{pendingApprovals > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-700">
                {pendingOwners > 0 && `${pendingOwners} owner${pendingOwners > 1 ? "s" : ""}`}
                {pendingOwners > 0 && pendingDrivers > 0 && " · "}
                {pendingDrivers > 0 && `${pendingDrivers} driver${pendingDrivers > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <Link
            href="/admin/users"
            className="text-sm font-semibold text-amber-800 bg-white border border-amber-300 rounded-lg px-3.5 py-1.5 hover:bg-amber-100 transition-colors shrink-0"
          >
            Review →
          </Link>
        </div>
      )}

      {failedPayments > 0 && (
        <div className="mb-4 sm:mb-5 bg-gradient-to-r from-red-50 to-red-50/40 border border-red-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-100 text-red-700">
              {IconAlert}
            </span>
            <p className="text-sm font-bold text-red-800">
              {failedPayments} failed payment{failedPayments > 1 ? "s" : ""} need attention
            </p>
          </div>
          <Link
            href="/admin/payments"
            className="text-sm font-semibold text-red-800 bg-white border border-red-300 rounded-lg px-3.5 py-1.5 hover:bg-red-100 transition-colors shrink-0"
          >
            Review →
          </Link>
        </div>
      )}

      {/* Two column summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recent bookings */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-brand-light/40 to-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-7 h-7 rounded-md bg-brand-orange/10 text-brand-orange items-center justify-center">
                {IconBookings}
              </span>
              <h2 className="font-display font-bold text-brand-dark text-base">Recent Bookings</h2>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs text-brand-orange font-bold hover:underline"
            >
              View all →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-brand-gray">No bookings yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-5 py-3 hover:bg-brand-light/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-dark truncate">{b.trailer.name}</p>
                    <p className="text-xs text-brand-gray">{formatDate(b.serviceDate)}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                      bookingStatusColor[b.status] ?? ""
                    }`}
                  >
                    {b.status}
                  </span>
                  <p className="text-sm font-bold text-brand-dark shrink-0">
                    {formatCents(b.totalAmount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fleet quick view */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-brand-light/40 to-white">
            <div className="flex items-center gap-2">
              <span className="inline-flex w-7 h-7 rounded-md bg-brand-orange/10 text-brand-orange items-center justify-center">
                {IconTruck}
              </span>
              <h2 className="font-display font-bold text-brand-dark text-base">Fleet</h2>
            </div>
            <Link href="/admin/fleet" className="text-xs text-brand-orange font-bold hover:underline">
              View all →
            </Link>
          </div>
          {recentTrailers.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-brand-gray">No trailers yet.</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentTrailers.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 px-5 py-3 hover:bg-brand-light/30 transition-colors"
                >
                  {t.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={t.images[0]}
                      alt={t.name}
                      className="w-10 h-8 object-cover rounded bg-gray-100 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-8 rounded bg-gray-100 shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-brand-dark">{t.name}</p>
                    <p className="text-xs text-brand-gray">{t.size}</p>
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border shrink-0 ${
                      trailerStatusColor[t.status] ?? ""
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  warn,
  danger,
  accent,
  progress,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  warn?: boolean;
  danger?: boolean;
  accent?: boolean;
  progress?: number;
}) {
  const tone = danger
    ? {
        border: "border-red-200",
        iconBg: "bg-red-100 text-red-700",
        valueClass: "text-red-700",
      }
    : warn
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
        <span
          className={`inline-flex items-center justify-center w-9 h-9 rounded-lg ${tone.iconBg}`}
        >
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
      {typeof progress === "number" && (
        <div className="mt-3 h-1.5 w-full rounded-full bg-brand-light overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-orange to-brand-dark-orange transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
}
