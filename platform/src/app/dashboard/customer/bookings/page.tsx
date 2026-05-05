import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DEMO_BOOKINGS, formatCents, statusColor, statusLabel } from "@/data/demo";

export const metadata = { title: "My Bookings — FAGU Home Services" };

export default async function CustomerBookingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard/customer/bookings");

  // TODO: query real — await supabase.from("bookings").select("*").eq("customer_id", user.id)
  const bookings = DEMO_BOOKINGS;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-brand-dark">My Bookings</h1>
          <p className="text-brand-gray mt-1 text-sm">{bookings.length} total bookings</p>
        </div>
        <Link href="/dashboard/customer/book" className="btn-primary shrink-0">
          + New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">📭</div>
          <h2 className="font-bold text-brand-dark mb-2">No bookings yet</h2>
          <p className="text-brand-gray text-sm mb-6">
            Book your first dump trailer in minutes.
          </p>
          <Link href="/dashboard/customer/book" className="btn-primary inline-flex">
            Book Now
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-start gap-4">
                {/* Trailer image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={b.trailer.image}
                  alt={b.trailer.name}
                  className="w-20 h-16 object-cover rounded-lg bg-gray-100 shrink-0 hidden sm:block"
                />

                {/* Info */}
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

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 text-xs text-brand-gray mt-2">
                    <span>
                      <strong className="text-brand-dark">Delivery:</strong> {b.deliveryDate}
                    </span>
                    <span>
                      <strong className="text-brand-dark">Pickup:</strong> {b.pickupDate}
                    </span>
                    <span>
                      <strong className="text-brand-dark">Address:</strong> {b.address}, {b.city}
                    </span>
                  </div>

                  {b.notes && (
                    <p className="text-xs text-brand-gray mt-1 italic">
                      Note: {b.notes}
                    </p>
                  )}
                </div>

                {/* Amount */}
                <div className="text-right shrink-0">
                  <p className="font-bold text-brand-dark text-lg">
                    {formatCents(b.totalAmount)}
                  </p>
                  <p className="text-xs text-brand-gray">
                    Booked {new Date(b.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </p>
                </div>
              </div>

              {/* Actions */}
              {(b.status === "pending" || b.status === "confirmed") && (
                <div className="mt-4 pt-3 border-t border-gray-100 flex gap-3">
                  <Link
                    href="/contact"
                    className="text-xs font-semibold text-brand-orange hover:underline"
                  >
                    Contact Support
                  </Link>
                  {b.status === "pending" && b.paymentStatus === "pending" && (
                    <Link
                      href={`/booking/checkout?bookingId=${b.id}`}
                      className="text-xs font-semibold text-brand-orange hover:underline"
                    >
                      Complete Payment
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
