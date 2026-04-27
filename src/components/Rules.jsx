// Clear, plain-language rental terms. Builds trust and reduces back-and-forth.
const RULES = [
  {
    title: "First trailer rental",
    text: "Flat $350 starting rate. Covers trailer delivery and pickup only.",
    icon: "money",
  },
  {
    title: "Disposal fees not included",
    text: "Dump and landfill fees are billed separately and depend on weight, material, and local regulations.",
    icon: "warning",
  },
  {
    title: "Second trailer — 50% off",
    text: "Need a second trailer for the same job site and same project? You'll only pay 50% of the first trailer's price.",
    icon: "discount",
  },
  {
    title: "Notify us when full",
    text: "Please let us know in advance when your trailer is full or nearly full so we can swap it out or pick it up.",
    icon: "bell",
  },
  {
    title: "Reservation = prepayment",
    text: "Your date is only locked in after payment is received. No payment, no reservation.",
    icon: "lock",
  },
  {
    title: "Day-before delivery",
    text: "Delivery is typically performed in the afternoon or evening before your service date.",
    icon: "clock",
  },
];

export default function Rules() {
  return (
    <section id="rules" className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="section-eyebrow">Rental Rules</span>
          <h2 className="section-title text-brand-dark">
            Straightforward terms.{" "}
            <span className="text-brand-orange">No surprises.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
            We keep our pricing and policies simple so you know exactly what
            you're paying for before you book.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {RULES.map((r) => (
            <RuleCard key={r.title} {...r} />
          ))}
        </div>

        {/* Pricing example */}
        <div className="mt-10 sm:mt-12 rounded-2xl bg-brand-dark text-white p-5 sm:p-6 md:p-10 grid lg:grid-cols-[1fr,auto] items-center gap-6 lg:gap-8">
          <div>
            <p className="section-eyebrow !mb-2">Pricing Example</p>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase">
              Two trailers, one job site
            </h3>
            <p className="mt-2 text-white/70 text-sm sm:text-base">
              When a single trailer isn't enough, our 50% discount on the
              second trailer keeps your project moving without breaking the
              budget.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center min-w-0">
            <div className="rounded-xl bg-white/5 border border-white/10 p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/60">
                First trailer
              </p>
              <p className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
                $350
              </p>
            </div>
            <div className="rounded-xl bg-brand-yellow text-brand-dark p-3 sm:p-4">
              <p className="text-[10px] sm:text-xs uppercase tracking-wider opacity-80">
                Second trailer
              </p>
              <p className="font-display text-2xl sm:text-3xl font-extrabold mt-1">
                $175
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RuleCard({ title, text, icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 hover:shadow-lg transition-shadow">
      <div className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-lg bg-brand-yellow text-brand-dark">
        <Icon name={icon} />
      </div>
      <h3 className="mt-3 sm:mt-4 text-base sm:text-lg font-bold text-brand-dark">
        {title}
      </h3>
      <p className="mt-1.5 text-gray-600 leading-relaxed text-sm sm:text-base">
        {text}
      </p>
    </div>
  );
}

function Icon({ name }) {
  const p = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "money":
      return (
        <svg {...p}>
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
        </svg>
      );
    case "warning":
      return (
        <svg {...p}>
          <path d="M10.29 3.86 1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      );
    case "discount":
      return (
        <svg {...p}>
          <path d="M20.59 13.41 13 21l-9-9V4h8l8.59 8.59a2 2 0 010 2.82z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      );
    case "bell":
      return (
        <svg {...p}>
          <path d="M18 8a6 6 0 10-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>
      );
    case "lock":
      return (
        <svg {...p}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...p}>
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );
    default:
      return null;
  }
}
