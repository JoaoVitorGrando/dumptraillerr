import { DEMO_BOOKINGS, DEMO_USERS, DEMO_FLEET, DEMO_EARNINGS, formatCents } from "@/data/demo";

export const metadata = { title: "Admin — FAGU Platform" };

export default function AdminPage() {
  const bookings = DEMO_BOOKINGS;
  const users = DEMO_USERS;
  const fleet = DEMO_FLEET;
  const earnings = DEMO_EARNINGS;

  const pendingUsers = users.filter((u) => u.approvalStatus === "pending");
  const activeBookings = bookings.filter((b) => b.status === "active" || b.status === "confirmed");
  const thisMonthRevenue = earnings[earnings.length - 1];
  const totalRevenue = earnings.reduce((s, e) => s + e.gross, 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Admin Overview</h1>
        <p className="text-brand-gray mt-1 text-sm">Platform health at a glance.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={formatCents(totalRevenue)} icon="💰" />
        <StatCard label="This Month" value={formatCents(thisMonthRevenue.gross)} icon="📈" />
        <StatCard label="Active Bookings" value={String(activeBookings.length)} icon="📅" />
        <StatCard label="Total Users" value={String(users.length)} icon="👥" />
      </div>

      {/* Pending approvals alert */}
      {pendingUsers.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xl">⏳</span>
            <div>
              <p className="text-sm font-bold text-amber-800">
                {pendingUsers.length} pending approval{pendingUsers.length > 1 ? "s" : ""}
              </p>
              <p className="text-xs text-amber-700">
                {pendingUsers.map((u) => u.name).join(", ")}
              </p>
            </div>
          </div>
          <a
            href="/admin/users"
            className="text-sm font-semibold text-amber-700 border border-amber-300 rounded-lg px-3 py-1.5 hover:bg-amber-100 transition-colors shrink-0"
          >
            Review →
          </a>
        </div>
      )}

      {/* Two column summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Recent bookings */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-brand-dark text-sm">Recent Bookings</h2>
            <a href="/admin/bookings" className="text-xs text-brand-orange font-semibold hover:underline">
              View all →
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {bookings.slice(0, 4).map((b) => (
              <div key={b.id} className="flex items-center gap-3 px-5 py-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark truncate">{b.trailer.name}</p>
                  <p className="text-xs text-brand-gray">{b.deliveryDate}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                  b.status === "active" ? "bg-green-50 text-green-700 border-green-200" :
                  b.status === "confirmed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  b.status === "completed" ? "bg-gray-100 text-gray-600 border-gray-200" :
                  "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {b.status}
                </span>
                <p className="text-sm font-bold text-brand-dark shrink-0">{formatCents(b.totalAmount)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Fleet quick view */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 className="font-bold text-brand-dark text-sm">Fleet</h2>
            <a href="/admin/fleet" className="text-xs text-brand-orange font-semibold hover:underline">
              View all →
            </a>
          </div>
          <div className="divide-y divide-gray-50">
            {fleet.map((t) => (
              <div key={t.id} className="flex items-center gap-3 px-5 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={t.image} alt={t.name} className="w-10 h-8 object-cover rounded bg-gray-100 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-brand-dark">{t.name}</p>
                  <p className="text-xs text-brand-gray">{t.size} · {t.licensePlate}</p>
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                  t.status === "available" ? "bg-green-50 text-green-700 border-green-200" :
                  t.status === "rented" ? "bg-blue-50 text-blue-700 border-blue-200" :
                  "bg-amber-50 text-amber-700 border-amber-200"
                }`}>
                  {t.status}
                </span>
              </div>
            ))}
          </div>
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
