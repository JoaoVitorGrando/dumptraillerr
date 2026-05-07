import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Payments — Admin FAGU" };

type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

const STATUS_COLORS: Record<PaymentStatus, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-600 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(cents / 100);
}

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default async function AdminPaymentsPage() {
  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      amount: true,
      stripeCheckoutSessionId: true,
      stripePaymentIntentId: true,
      paidAt: true,
      createdAt: true,
      booking: {
        select: {
          id: true,
          status: true,
          serviceDate: true,
          trailer: { select: { name: true } },
          customer: { select: { user: { select: { email: true } } } },
        },
      },
    },
  });

  const totals = {
    PAID: payments.filter((p) => p.status === "PAID").reduce((s, p) => s + p.amount, 0),
    PENDING: payments.filter((p) => p.status === "PENDING").length,
    FAILED: payments.filter((p) => p.status === "FAILED").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Payments</h1>
        <p className="text-brand-gray mt-1 text-sm">{payments.length} total payments</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-2xl font-bold text-green-700">{formatCents(totals.PAID)}</p>
          <p className="text-xs text-brand-gray mt-0.5">Total collected</p>
        </div>
        <div className={`bg-white rounded-xl border p-4 ${totals.PENDING > 0 ? "border-amber-200" : "border-gray-200"}`}>
          <p className={`text-2xl font-bold ${totals.PENDING > 0 ? "text-amber-700" : "text-brand-dark"}`}>{totals.PENDING}</p>
          <p className="text-xs text-brand-gray mt-0.5">Awaiting payment</p>
        </div>
        <div className={`bg-white rounded-xl border p-4 ${totals.FAILED > 0 ? "border-red-200" : "border-gray-200"}`}>
          <p className={`text-2xl font-bold ${totals.FAILED > 0 ? "text-red-600" : "text-brand-dark"}`}>{totals.FAILED}</p>
          <p className="text-xs text-brand-gray mt-0.5">Failed</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {payments.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-brand-gray">No payments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">Booking</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden md:table-cell">Customer</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">Amount</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden lg:table-cell">Stripe Session</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-brand-gray uppercase tracking-wider hidden md:table-cell">Paid At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div>
                        <p className="font-semibold text-brand-dark">{p.booking.trailer.name}</p>
                        <Link
                          href="/admin/bookings"
                          className="text-xs text-brand-orange hover:underline font-mono"
                        >
                          #{p.booking.id.slice(-8)}
                        </Link>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-gray hidden md:table-cell">
                      {p.booking.customer.user.email}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-brand-dark">
                      {formatCents(p.amount)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[p.status as PaymentStatus] ?? ""}`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-gray font-mono hidden lg:table-cell">
                      {p.stripeCheckoutSessionId
                        ? `...${p.stripeCheckoutSessionId.slice(-16)}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-brand-gray hidden md:table-cell">
                      {formatDate(p.paidAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
