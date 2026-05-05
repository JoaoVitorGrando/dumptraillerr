import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  DEMO_BOOKINGS,
  formatCents,
  statusColor,
  statusLabel,
} from "@/data/demo";

export const metadata = { title: "My Account — FAGU Home Services" };

export default async function CustomerDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/customer");

  const firstName =
    (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "there";

  // TODO: substituir por query real quando Supabase estiver configurado
  const bookings = DEMO_BOOKINGS;
  const activeBooking = bookings.find((b) => b.status === "active");
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;
  const completedCount = bookings.filter((b) => b.status === "completed").length;
  const totalSpent = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((s, b) => s + b.totalAmount, 0);

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">
            Hey, {firstName} 👋
          </h1>
          <p className="text-brand-gray mt-1 text-sm">
            Welcome back to your FAGU account.
          </p>
        </div>
        <Link href="/dashboard/customer/book" className="btn-primary shrink-0">
          + New Booking
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Spent" value={formatCents(totalSpent)} icon="💰" />
        <StatCard label="Completed" value={String(completedCount)} icon="✅" />
        <StatCard label="Upcoming" value={String(confirmedCount)} icon="📅" />
        <StatCard label="Total Bookings" value={String(bookings.length)} icon="📦" />
      </div>

      {/* Active booking banner */}
      {activeBooking && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3">
          <span className="text-xl mt-0.5">🚛</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-green-800">
              Active Rental — {activeBooking.trailer.name}
            </p>
            <p className="text-xs text-green-700 mt-0.5">
              Delivery: {activeBooking.deliveryDate} · Pickup: {activeBooking.pickupDate} ·{" "}
              {activeBooking.address}, {activeBooking.city}
            </p>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-bold text-brand-dark text-sm">Recent Bookings</h2>
          <Link href="/dashboard/customer/bookings" className="text-xs text-brand-orange font-semibold hover:underline">
            View all →
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {bookings.slice(0, 4).map((b) => (
            <div key={b.id} className="flex items-center gap-4 px-5 py-3.5">
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
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(b.status)}`}>
                  {statusLabel(b.status)}
                </span>
              </div>
            </div>
          ))}
        </div>
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
