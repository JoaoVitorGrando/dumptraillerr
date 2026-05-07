import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  formatCents,
  statusColor,
  statusLabel,
} from "@/data/demo";
import { getDemoBookingsForUser } from "@/lib/demoBookings";

export const metadata = { title: "My Account — FAGU Home Services" };

/* ---------- Inline icons (brand-aligned) ---------- */
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
const IconBox = (
  <I>
    <path d="m3 8 9-5 9 5-9 5-9-5Z" />
    <path d="M3 8v8l9 5 9-5V8" />
    <path d="M12 13v8" />
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

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/customer");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  const bookings = await getDemoBookingsForUser(user.email);
  const activeBooking = bookings.find((b) => b.status === "active");
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div>
      {/* Greeting + CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <p className="text-sm text-brand-gray">
          Hey <span className="font-semibold text-brand-dark">{firstName}</span>, welcome back to your FAGU account.
        </p>
        <Link href="/services/dump-trailer#booking" className="btn-primary shrink-0">
          + New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        <StatCard label="Total Spent" value={formatCents(totalSpent)} icon={IconWallet} accent />
        <StatCard label="Completed" value={String(completedCount)} icon={IconCheck} />
        <StatCard label="Upcoming" value={String(confirmedCount)} icon={IconCalendar} />
        <StatCard label="Total Bookings" value={String(bookings.length)} icon={IconBox} />
      </div>

      {/* Active booking banner */}
      {activeBooking && (
        <div className="mb-6 bg-gradient-to-r from-emerald-50 to-emerald-50/40 border border-emerald-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 shrink-0">
            {IconTruck}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-emerald-800">
              Active Rental — {activeBooking.trailer.name}
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Delivery: {activeBooking.deliveryDate} · Pickup: {activeBooking.pickupDate} ·{" "}
              {activeBooking.address}, {activeBooking.city}
            </p>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gradient-to-br from-brand-light/40 to-white">
          <div className="flex items-center gap-2">
            <span className="inline-flex w-7 h-7 rounded-md bg-brand-orange/10 text-brand-orange items-center justify-center">
              {IconCalendar}
            </span>
            <h2 className="font-display font-bold text-brand-dark text-base">Recent Bookings</h2>
          </div>
          <Link
            href="/dashboard/customer/bookings"
            className="text-xs text-brand-orange font-bold hover:underline"
          >
            View all →
          </Link>
        </div>
        {bookings.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-gray">No bookings yet.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-brand-light/30 transition-colors">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.trailer.image}
                  alt={b.trailer.name}
                  className="w-12 h-10 object-cover rounded-lg bg-gray-100 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">
                    {b.trailer.name}
                  </p>
                  <p className="text-xs text-brand-gray truncate">
                    {b.deliveryDate} · {b.address}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-brand-dark">
                    {formatCents(b.totalAmount)}
                  </p>
                  <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border mt-0.5 ${statusColor(b.status)}`}>
                    {statusLabel(b.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
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
