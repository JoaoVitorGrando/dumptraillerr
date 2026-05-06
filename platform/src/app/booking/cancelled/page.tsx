import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Cancelled — FAGU Home Services",
};

export default function BookingCancelledPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6 text-3xl">
          🛑
        </div>
        <h1 className="font-display text-3xl font-bold text-brand-dark mb-3">
          Payment Cancelled
        </h1>
        <p className="text-brand-gray mb-8">
          Your booking was not completed. No payment was charged.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/services/dump-trailer" className="btn-primary inline-flex">
            Try Again
          </Link>
          <Link href="/contact" className="btn-secondary inline-flex">
            Contact Support
          </Link>
        </div>
      </div>
    </main>
  );
}
