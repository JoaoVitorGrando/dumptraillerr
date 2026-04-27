// Step-by-step explanation of the rental process
const STEPS = [
  {
    n: "01",
    title: "Pick your trailer",
    text: "Choose between the 7x14x4 or the 7x16x4 dump trailer based on the size of your project.",
  },
  {
    n: "02",
    title: "Choose your service date",
    text: "Select the date you'll need the trailer on the job site.",
  },
  {
    n: "03",
    title: "Provide address & contact",
    text: "Tell us the job site address, the ZIP code, and the best way to reach you.",
  },
  {
    n: "04",
    title: "Pay to lock in the date",
    text: "Reservations are confirmed only after prepayment — no hidden fees.",
  },
  {
    n: "05",
    title: "We deliver the day before",
    text: "Whenever possible, we drop off the trailer in the afternoon or evening before your service date.",
  },
  {
    n: "06",
    title: "We pick it up after the job",
    text: "Once you're done, we come back and haul it away. Disposal fees are billed separately.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-20 md:py-28 bg-grid-dark text-white"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="section-eyebrow">How It Works</span>
          <h2 className="section-title">
            Six easy steps to{" "}
            <span className="text-brand-yellow">get rolling.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-white/70 text-base sm:text-lg">
            We've simplified the rental process so contractors, homeowners,
            and crews can book in minutes and stay focused on the job.
          </p>
        </div>

        <ol className="mt-12 sm:mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-5">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 hover:border-brand-yellow/60 transition-colors"
            >
              <span
                aria-hidden
                className="absolute -top-5 left-5 sm:left-6 grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-lg bg-brand-yellow text-brand-dark font-display font-extrabold"
              >
                {s.n}
              </span>
              <h3 className="mt-5 sm:mt-6 text-lg sm:text-xl font-bold">
                {s.title}
              </h3>
              <p className="mt-2 text-white/70 leading-relaxed text-sm sm:text-base">
                {s.text}
              </p>
            </li>
          ))}
        </ol>

        {/* Highlighted scheduling note */}
        <div className="mt-12 sm:mt-14 grid sm:grid-cols-[auto,1fr] items-start sm:items-center gap-4 sm:gap-6 rounded-2xl border-l-4 border-brand-yellow bg-white/[0.04] p-5 sm:p-6 md:p-8">
          <div className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-xl bg-brand-yellow text-brand-dark shrink-0">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold">
              Delivery the day before
            </h4>
            <p className="mt-1 text-white/80 text-sm sm:text-base">
              Delivery is typically performed the{" "}
              <strong className="text-brand-yellow">
                afternoon or evening before your service date
              </strong>{" "}
              to improve logistics and give you maximum flexibility on job day.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
