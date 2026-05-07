import Link from "next/link";
import type { Metadata } from "next";
import FaguBadge from "@/components/FaguBadge";
import { API_CONFIG } from "@/config/api";

export const metadata: Metadata = {
  title: "Booking Confirmed — FAGU Home Services",
};

interface Props {
  searchParams: Promise<{ session_id?: string; demo?: string }>;
}

const STEPS = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
    title: "Confirmation email",
    desc: "Booking details and receipt sent to your inbox.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" />
      </svg>
    ),
    title: "We confirm delivery",
    desc: "Our team will call within 2 hours to lock in your window.",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="6" width="14" height="11" rx="1" />
        <polygon points="15 9 21 9 23 13 23 17 15 17 15 9" />
        <circle cx="6" cy="19" r="2" />
        <circle cx="18" cy="19" r="2" />
      </svg>
    ),
    title: "Trailer delivered",
    desc: "Arrives the evening before your service date.",
  },
];

export default async function BookingSuccessPage({ searchParams }: Props) {
  const { session_id, demo } = await searchParams;
  const isDemo = demo === "true" || (session_id?.startsWith("demo_") ?? false);
  const phone = API_CONFIG.contact.phone;
  const email = API_CONFIG.contact.email;

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col bg-grid-dark text-white">
      <div className="h-1.5 w-full bg-hazard-stripes shrink-0" />

      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 min-h-0">
        <div className="w-full max-w-3xl flex flex-col items-center text-center gap-5 sm:gap-6">

          <FaguBadge size="lg" bare className="!h-16 !w-16 sm:!h-20 sm:!w-20" />

          <div className="flex items-center gap-2">
            <div className="relative grid h-9 w-9 place-items-center rounded-full bg-brand-orange/15 border border-brand-orange/40">
              <span className="absolute inset-0 rounded-full bg-brand-orange/15 animate-ping opacity-40" />
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eb7231" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <span className="text-brand-orange text-[11px] sm:text-xs font-bold uppercase tracking-[0.22em]">
              Payment Confirmed
            </span>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase leading-[0.95]">
              Thank you for choosing{" "}
              <span className="text-brand-orange">FAGU.</span>
            </h1>
            <p className="mt-3 text-white/60 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Your dump trailer reservation is confirmed. We&apos;re already preparing your delivery — relax, we&apos;ll take it from here.
            </p>
          </div>

          {isDemo ? (
            <div className="rounded-md border border-amber-400/30 bg-amber-400/10 px-3 py-1.5 text-[11px] text-amber-300 font-semibold uppercase tracking-wider">
              Demo mode — no real payment was processed
            </div>
          ) : (
            session_id && (
              <p className="text-[10px] text-white/25 font-mono">Ref: {session_id}</p>
            )
          )}

          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-1">
            {STEPS.map((step, i) => (
              <div
                key={step.title}
                className="rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-4 sm:p-5 text-left hover:border-brand-orange/40 transition-colors"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="grid h-7 w-7 place-items-center rounded-md bg-brand-orange text-white font-extrabold text-[11px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-brand-orange">{step.icon}</span>
                </div>
                <p className="font-bold text-white text-sm leading-snug">{step.title}</p>
                <p className="mt-1 text-white/45 text-[12px] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-1">
            <Link
              href="/dashboard/customer/bookings"
              className="btn-primary flex-1 text-center !py-3 !text-sm"
            >
              View My Bookings
            </Link>
            <Link
              href="/"
              className="btn-outline-light flex-1 text-center !py-3 !text-sm"
            >
              Back to Home
            </Link>
          </div>

          <p className="text-[11px] text-white/30">
            Questions?{" "}
            <a href={`mailto:${email}`} className="text-brand-orange hover:text-white transition-colors font-medium">
              {email}
            </a>
            {" · "}
            <a href={`tel:${phone.replace(/\s+/g, "")}`} className="text-brand-orange hover:text-white transition-colors font-medium">
              {phone}
            </a>
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-hazard-stripes shrink-0" />
    </main>
  );
}
