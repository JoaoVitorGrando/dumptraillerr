"use client";

import { useState } from "react";
import { DEMO_BOOKINGS, formatCents, statusColor, statusLabel, type DemoBooking, type BookingStatus } from "@/data/demo";

type Filter = "all" | BookingStatus;

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [bookings, setBookings] = useState<DemoBooking[]>(DEMO_BOOKINGS);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  function updateStatus(id: string, status: BookingStatus) {
    // TODO: PATCH Supabase — update booking status
    setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status } : b));
  }

  const counts: Record<string, number> = {
    all: bookings.length,
    pending: bookings.filter((b) => b.status === "pending").length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    active: bookings.filter((b) => b.status === "active").length,
    completed: bookings.filter((b) => b.status === "completed").length,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-brand-dark">Bookings</h1>
        <p className="text-brand-gray mt-1 text-sm">{bookings.length} total bookings</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(["all", "pending", "confirmed", "active", "completed"] as Filter[]).map((f) => (
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
            {f === "all" ? `All (${counts.all})` : `${f} (${counts[f] ?? 0})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((b) => (
          <div key={b.id} className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-start gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={b.trailer.image}
                alt={b.trailer.name}
                className="w-16 h-12 object-cover rounded-lg bg-gray-100 shrink-0 hidden sm:block"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-bold text-brand-dark">{b.trailer.name}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(b.status)}`}>
                    {statusLabel(b.status)}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${statusColor(b.paymentStatus)}`}>
                    {statusLabel(b.paymentStatus)}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-xs text-brand-gray mt-1">
                  <span><strong className="text-brand-dark">Delivery:</strong> {b.deliveryDate}</span>
                  <span><strong className="text-brand-dark">Pickup:</strong> {b.pickupDate}</span>
                  <span className="col-span-2"><strong className="text-brand-dark">Address:</strong> {b.address}, {b.city}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-brand-dark text-lg">{formatCents(b.totalAmount)}</p>
                <p className="text-xs text-brand-gray">ID: {b.id}</p>
              </div>
            </div>

            {/* Admin actions */}
            <div className="mt-4 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
              {b.status === "pending" && (
                <>
                  <ActionBtn color="green" onClick={() => updateStatus(b.id, "confirmed")}>
                    ✓ Confirm
                  </ActionBtn>
                  <ActionBtn color="red" onClick={() => updateStatus(b.id, "cancelled")}>
                    ✗ Cancel
                  </ActionBtn>
                </>
              )}
              {b.status === "confirmed" && (
                <ActionBtn color="blue" onClick={() => updateStatus(b.id, "active")}>
                  → Mark Active
                </ActionBtn>
              )}
              {b.status === "active" && (
                <ActionBtn color="gray" onClick={() => updateStatus(b.id, "completed")}>
                  ✓ Mark Completed
                </ActionBtn>
              )}
              {b.stripeSessionId && (
                <span className="text-xs text-brand-gray px-3 py-1">
                  Stripe: {b.stripeSessionId}
                </span>
              )}
            </div>
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
  children,
  color,
  onClick,
}: {
  children: React.ReactNode;
  color: "green" | "blue" | "red" | "gray";
  onClick: () => void;
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
      className={`text-xs font-semibold border rounded-lg px-3 py-1.5 transition-colors ${cls[color]}`}
    >
      {children}
    </button>
  );
}
