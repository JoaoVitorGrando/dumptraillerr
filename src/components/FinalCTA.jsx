// Final, high-impact call to action right before the footer
export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-brand-yellow text-brand-dark">
      {/* Hazard stripe top border */}
      <div className="absolute inset-x-0 top-0 h-2 sm:h-3 bg-hazard-stripes opacity-90" />
      <div className="container-page py-16 sm:py-20 md:py-24 grid lg:grid-cols-[1.5fr,1fr] items-center gap-6 lg:gap-8">
        <div>
          <span className="inline-block bg-brand-dark text-brand-yellow font-semibold uppercase tracking-[0.18em] text-[10px] sm:text-xs px-2.5 sm:px-3 py-1 rounded-full mb-3 sm:mb-4">
            Ready to Roll
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold uppercase font-display leading-[1.05]">
            Need a dump trailer for your next project?
          </h2>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg md:text-xl text-brand-dark/80 max-w-2xl">
            Book online today and lock in your service date with confidence:
            transparent pricing, flexible delivery, and no surprises.
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <a
            href="#booking"
            className="btn-secondary !border-brand-dark !text-brand-dark hover:!bg-brand-dark hover:!text-brand-yellow w-full lg:w-auto"
          >
            Book Your Dump Trailer
          </a>
          <a
            href="tel:+15555550199"
            className="inline-flex items-center gap-2 font-bold text-brand-dark hover:underline text-sm sm:text-base"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M22 16.92V21a1 1 0 01-1.09 1A19.86 19.86 0 012 4.09 1 1 0 013 3h4.09a1 1 0 011 .75 12.06 12.06 0 00.66 2.66 1 1 0 01-.22 1L7 9a16 16 0 008 8l1.59-1.59a1 1 0 011-.22 12.06 12.06 0 002.66.66 1 1 0 01.75 1z" />
            </svg>
            Or call (555) 555-0199
          </a>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-2 sm:h-3 bg-hazard-stripes opacity-90" />
    </section>
  );
}
