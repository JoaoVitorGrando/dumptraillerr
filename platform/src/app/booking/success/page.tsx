import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Confirmed — FAGU Home Services",
};

interface Props {
  searchParams: Promise<{ session_id?: string; demo?: string }>;
}

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { session_id, demo } = await searchParams;
  const isDemo = demo === "true" || (session_id?.startsWith("demo_") ?? false);

  return (
    <main className="flex-1 flex items-center justify-center px-4 py-20">
      <div className="max-w-lg w-full text-center">
        {/* Checkmark animation */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              width={48}
              height={48}
              viewBox="0 0 24 24"
              fill="none"
              stroke="#16a34a"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </div>
          {/* Hazard stripe accent */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1.5 w-16 rounded-full"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg,#eb7231 0,#eb7231 4px,#d75227 4px,#d75227 8px)",
            }}
          />
        </div>

        <h1 className="font-display text-4xl font-bold text-brand-dark mb-3">
          Booking Confirmed! 🎉
        </h1>

        <p className="text-brand-gray text-lg mb-2">
          Your dump trailer is reserved and on its way.
        </p>

        {isDemo ? (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-8 inline-block">
            <strong>Demo mode</strong> — No real payment was processed.
            Connect Stripe to activate real payments.
          </p>
        ) : (
          <p className="text-sm text-brand-gray mb-8">
            A confirmation email is on its way.
            {session_id && (
              <span className="block text-xs text-gray-400 mt-1">
                Reference: {session_id}
              </span>
            )}
          </p>
        )}

        {/* What happens next */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 text-left mb-8">
          <h2 className="font-bold text-brand-dark text-sm mb-4">What happens next</h2>
          <ol className="space-y-3">
            {[
              {
                icon: "📧",
                title: "Confirmation email",
                desc: "Check your inbox for booking details and a receipt.",
              },
              {
                icon: "📞",
                title: "We'll call to confirm delivery",
                desc: "Our team will confirm the delivery window within 2 hours.",
              },
              {
                icon: "🚛",
                title: "Trailer delivered",
                desc: "A driver will deliver your trailer to the address on the booking day.",
              },
              {
                icon: "✅",
                title: "Pickup when you're done",
                desc: "We'll pick it up on the scheduled pickup date — no hassle.",
              },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0 mt-0.5">{step.icon}</span>
                <div>
                  <p className="font-semibold text-brand-dark text-sm">{step.title}</p>
                  <p className="text-xs text-brand-gray">{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/dashboard/customer/bookings" className="btn-primary inline-flex">
            View My Bookings
          </Link>
          <Link href="/" className="btn-secondary inline-flex">
            Back to Home
          </Link>
        </div>

        {/* Contact */}
        <p className="mt-8 text-xs text-brand-gray">
          Questions?{" "}
          <Link href="/contact" className="text-brand-orange hover:underline font-medium">
            Contact us
          </Link>{" "}
          or call{" "}
          <a href="tel:+12065550199" className="text-brand-orange hover:underline font-medium">
            (206) 555-0199
          </a>
        </p>
      </div>
    </main>
  );
}
