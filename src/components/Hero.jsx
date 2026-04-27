import heroTrailerPhoto from "../assets/dumptrailler header.jpg";

// Hero / above-the-fold section. Strong promise + dual CTAs.
export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-grid-dark text-white pt-32 sm:pt-36 md:pt-44 pb-16 sm:pb-20 md:pb-28"
    >
      {/* Decorative spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-brand-yellow/10 blur-3xl"
      />
      {/* Hazard stripe accent */}
      <div className="absolute top-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />

      <div className="container-page relative grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7 order-2 lg:order-1">
          <span className="section-eyebrow">
            Construction · Cleanouts · Renovation
          </span>
          <h1 className="text-[2.4rem] xs:text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5.2rem] xl:text-[6rem] font-extrabold leading-[0.94] uppercase max-w-4xl">
            Rent a Dump Trailer
            <br className="hidden sm:inline" />{" "}
            <span className="text-brand-yellow">Fast, Simple & Secure</span>
          </h1>
          <p className="mt-5 sm:mt-6 max-w-2xl text-lg md:text-xl text-white/85 leading-relaxed">
            Choose the right trailer, pick your service date, and lock in your
            reservation with prepayment. We deliver on time so your job stays
            on schedule.
          </p>

          {/* Discount highlight near the primary CTA */}
          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1.5 text-xs sm:text-sm text-brand-yellow">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-brand-yellow text-brand-dark font-extrabold text-[10px]">
              %
            </span>
            <span>
              <strong className="font-bold">Save 50%</strong> on your second
              trailer for the same job site.
            </span>
          </div>

          <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row gap-3">
            <a
              href="#booking"
              className="btn-primary w-full sm:w-auto !text-sm md:!text-base !px-7"
            >
              Check Availability — Book Today
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
            </a>
            <a
              href="#trailers"
              className="btn-outline-light w-full sm:w-auto !text-sm md:!text-base !px-7"
            >
              View Trailers
            </a>
          </div>

          {/* Trust strip */}
          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
            <Trust label="Online" value="Booking" />
            <Trust label="Flexible" value="Delivery" />
            <Trust label="Transparent" value="Pricing" />
          </div>
        </div>

        {/* Visual card */}
        <div className="lg:col-span-5 order-1 lg:order-2">
          <HeroVisual />
        </div>
      </div>

      {/* Bottom hazard stripe */}
      <div className="absolute bottom-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />
    </section>
  );
}

function Trust({ label, value }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-2.5 sm:p-3">
      <p className="text-[10px] sm:text-xs text-white/60 uppercase tracking-wider">
        {label}
      </p>
      <p className="font-display text-sm sm:text-lg font-bold leading-tight">
        {value}
      </p>
    </div>
  );
}

// Hero visual card with real trailer image
function HeroVisual() {
  return (
    <div className="relative max-w-md mx-auto lg:max-w-none">
      <div className="absolute -inset-4 rounded-3xl bg-brand-yellow/20 blur-2xl" />
      <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-brand-gray to-brand-dark p-4 sm:p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-brand-dark text-[10px] sm:text-xs font-bold uppercase px-2.5 sm:px-3 py-1 tracking-wider">
            <span className="h-2 w-2 rounded-full bg-brand-dark animate-pulse" />
            Available Now
          </span>
          <span className="text-white/60 text-[10px] sm:text-xs">
            Starting at
          </span>
        </div>
        <p className="font-display text-4xl sm:text-5xl font-extrabold text-white">
          $350<span className="text-brand-yellow">.</span>
          <span className="text-sm sm:text-base font-medium text-white/60 ml-2 block sm:inline">
            / first trailer
          </span>
        </p>

        <div className="relative mt-4 sm:mt-6 overflow-hidden rounded-xl border border-white/10">
          <img
            src={heroTrailerPhoto}
            alt="Large dump trailer ready at a job site"
            loading="eager"
            decoding="async"
            className="h-56 sm:h-64 md:h-72 w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent"
            aria-hidden
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-sm">
          <Spec label="Sizes" value="14 ft / 16 ft" />
          <Spec label="Hitch" value="2-5/16 in" />
          <Spec label="Electrical" value="7-pin plug" />
          <Spec label="Width" value="7 ft" />
        </div>
      </div>
    </div>
  );
}

function Spec({ label, value }) {
  return (
    <div className="rounded-lg bg-white/5 border border-white/10 px-2.5 sm:px-3 py-2">
      <p className="text-[10px] uppercase tracking-wider text-white/50">
        {label}
      </p>
      <p className="font-semibold text-white text-sm sm:text-base">{value}</p>
    </div>
  );
}
