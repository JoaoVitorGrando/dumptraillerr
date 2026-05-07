"use client";

import { useState, useTransition } from "react";

type BookingStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

interface BookingItem {
  id: string;
  status: BookingStatus;
  deliveryAddress: string;
  serviceDate: string;
  pickupDate: string | null;
  totalAmount: number;
  trailer: { name: string; images: string[] };
  customer: { user: { email: string } };
  payment: { status: PaymentStatus; stripeCheckoutSessionId: string | null } | null;
}

type Filter = "all" | BookingStatus;

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
  IN_PROGRESS: "bg-green-50 text-green-700 border-green-200",
  COMPLETED: "bg-gray-100 text-gray-600 border-gray-200",
  CANCELLED: "bg-red-50 text-red-600 border-red-200",
  PAID: "bg-green-50 text-green-700 border-green-200",
  FAILED: "bg-red-50 text-red-600 border-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 border-purple-200",
};

function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cents / 100);
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const NEXT_STATUSES: Partial<Record<BookingStatus, { label: string; status: BookingStatus; color: "green" | "blue" | "red" | "gray" }[]>> = {
  PENDING: [
    { label: "✓ Confirm", status: "CONFIRMED", color: "green" },
    { label: "✗ Cancel", status: "CANCELLED", color: "red" },
  ],
  CONFIRMED: [
    { label: "→ Mark Active", status: "IN_PROGRESS", color: "blue" },
    { label: "✗ Cancel", status: "CANCELLED", color: "red" },
  ],
  IN_PROGRESS: [
    { label: "✓ Complete", status: "COMPLETED", color: "gray" },
  ],
};

export default function BookingsClient({ initialBookings }: { initialBookings: BookingItem[] }) {
  const [bookings, setBookings] = useState<BookingItem[]>(initialBookings);
  const [filter, setFilter] = useState<Filter>("all");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const counts: Record<string, number> = {
    all: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
    IN_PROGRESS: bookings.filter((b) => b.status === "IN_PROGRESS").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  function updateStatus(id: string, status: BookingStatus) {
    setError(null);
    startTransition(async () => {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json() as { error?: string };
        setError(data.error ?? "Failed to update");
        return;
      }
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
    });
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Bookings</h1>
        <p className="text-brand-gray mt-1 text-sm">{bookings.length} total bookings</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "PENDING", "CONFIRMED", "IN_PROGRESS", "COMPLETED"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize border transition-all ${
              filter === f
                ? "bg-brand-dark text-white border-brand-dark"
                : "bg-white text-brand-gray border-gray-200 hover:border-gray-300"
            }`}
          >
            {f === "all" ? `All (${counts.all})` : `${f.replace("_", " ")} (${counts[f] ?? 0})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((b) => (
          <div key={b.id} className={`bg-white rounded-xl border border-gray-200 p-5 ${isPending ? "opacity-70" : ""}`}>
            <div className="flex items-start gap-4">
              {b.trailer.images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={b.trailer.images[0]} alt={b.trailer.name} className="w-16 h-12 object-cover rounded-lg bg-gray-100 shrink-0 hidden sm:block" />
              ) : (
                <div className="w-16 h-12 rounded-lg bg-gray-100 shrink-0 hidden sm:block" />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-brand-dark">{b.trailer.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[b.status] ?? ""}`}>
                    {b.status.replace("_", " ")}
                  </span>
                  {b.payment && (
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[b.payment.status] ?? ""}`}>
                      {b.payment.status}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-1 text-xs text-brand-gray mt-1">
                  <span><strong className="text-brand-dark">Customer:</strong> {b.customer.user.email}</span>
                  <span><strong className="text-brand-dark">Service:</strong> {formatDate(b.serviceDate)}</span>
                  {b.pickupDate && (
                    <span><strong className="text-brand-dark">Pickup:</strong> {formatDate(b.pickupDate)}</span>
                  )}
                  <span className="col-span-2 md:col-span-1"><strong className="text-brand-dark">Address:</strong> {b.deliveryAddress}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-brand-dark text-lg">{formatCents(b.totalAmount)}</p>
                <p className="text-xs text-brand-gray font-mono">#{b.id.slice(-8)}</p>
              </div>
            </div>

            {/* Actions */}
            {NEXT_STATUSES[b.status] && (
              <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                {NEXT_STATUSES[b.status]!.map((action) => (
                  <ActionBtn
                    key={action.status}
                    color={action.color}
                    onClick={() => updateStatus(b.id, action.status)}
                    disabled={isPending}
                  >
                    {action.label}
                  </ActionBtn>
                ))}
                {b.payment?.stripeCheckoutSessionId && (
                  <span className="text-xs text-brand-gray px-3 py-1 font-mono">
                    Stripe: {b.payment.stripeCheckoutSessionId.slice(-12)}
                  </span>
                )}
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-10 text-center text-brand-gray text-sm">
            No bookings found for this filter.
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({
  children, color, onClick, disabled,
}: {
  children: React.ReactNode;
  color: "green" | "blue" | "red" | "gray";
  onClick: () => void;
  disabled?: boolean;
}) {
  const cls: Record<string, string> = {
    green: "text-green-700 border-green-200 hover:bg-green-50",
    blue: "text-blue-700 border-blue-200 hover:bg-blue-50",
    red: "text-red-600 border-red-200 hover:bg-red-50",
    gray: "text-brand-gray border-gray-200 hover:bg-gray-50",
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`text-xs font-semibold border rounded-lg px-3 py-1.5 transition-colors disabled:opacity-50 ${cls[color]}`}
    >
      {children}
    </button>
  );
}
