import { useState } from "react";

// Informational + simulated payment section
export default function Payment() {
  const [done, setDone] = useState(false);

  const handleClick = () => {
    setDone(true);
    setTimeout(() => setDone(false), 4000);
  };

  return (
    <section
      id="payment"
      className="py-16 sm:py-20 md:py-28 bg-grid-dark text-white"
    >
      <div className="container-page">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
          <div>
            <span className="section-eyebrow">Secure Your Reservation</span>
            <h2 className="section-title">
              Pay to lock in{" "}
              <span className="text-brand-yellow">your service date.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-white/80 text-base sm:text-lg max-w-xl">
              To secure your reservation, the rental fee must be paid in
              advance. Once your payment is confirmed, your trailer and
              service date are officially booked.
            </p>

            <ul className="mt-6 sm:mt-8 space-y-3 max-w-md">
              <Bullet>Encrypted, secure online payment</Bullet>
              <Bullet>Instant confirmation by email</Bullet>
              <Bullet>Flexible cancellation policy</Bullet>
            </ul>

            <button
              onClick={handleClick}
              type="button"
              className="btn-primary mt-6 sm:mt-8 w-full sm:w-auto"
            >
              {done ? "Redirecting…" : "Continue to Payment"}
              {!done && (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              )}
            </button>
            {done && (
              <p className="mt-4 text-sm text-brand-yellow">
                Payment integration is not connected yet — this is a demo
                button.
              </p>
            )}
          </div>

          {/* Mock payment card */}
          <div className="relative">
            <div className="absolute -inset-3 rounded-3xl bg-brand-yellow/20 blur-2xl" />
            <div className="relative rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 md:p-8">
              <div className="flex items-center justify-between gap-2">
                <p className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">
                  Order Total
                </p>
                <span className="rounded-full bg-green-500/10 text-green-400 text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 font-semibold">
                  USD
                </span>
              </div>
              <p className="mt-2 font-display text-4xl sm:text-5xl md:text-6xl font-extrabold">
                $350.00
              </p>
              <p className="mt-1 text-white/60 text-sm sm:text-base">
                First dump trailer rental — delivery and pickup included.
              </p>

              <div className="mt-5 sm:mt-6 space-y-3 text-sm">
                <Row label="Trailer Rental" value="$350.00" />
                <Row label="Delivery & Pickup" value="Included" />
                <Row label="Disposal Fees" value="Billed Separately" muted />
              </div>

              <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-white/10 flex items-center justify-between gap-2">
                <span className="font-display text-base sm:text-lg font-bold">
                  Total Today
                </span>
                <span className="font-display text-xl sm:text-2xl font-extrabold text-brand-yellow">
                  $350.00
                </span>
              </div>

              <div className="mt-5 sm:mt-6 flex items-center gap-2 sm:gap-3 text-white/60 text-xs sm:text-sm">
                <Lock />
                256-bit SSL Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Bullet({ children }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-dark">
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className="text-white/85 text-sm sm:text-base">{children}</span>
    </li>
  );
}

function Row({ label, value, muted }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
      <span className="text-white/70 text-xs sm:text-sm">{label}</span>
      <span
        className={`text-right text-xs sm:text-sm ${
          muted ? "text-white/50" : "font-semibold"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Lock() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}
