// Quick-glance value proposition cards
const ITEMS = [
  {
    title: "Flexible Delivery",
    text: "Drop-offs are typically scheduled for the afternoon or evening before your service date to make logistics easier.",
    icon: "truck",
  },
  {
    title: "Online Booking",
    text: "Reserve in minutes — pick a trailer, choose a date, and confirm with prepayment.",
    icon: "calendar",
  },
  {
    title: "Two Trailer Sizes",
    text: "Choose between our 14 ft and 16 ft dump trailers depending on the size of your project.",
    icon: "ruler",
  },
  {
    title: "Built for Heavy Jobs",
    text: "Perfect for construction debris, yard waste, renovations, lot clearing, and full property cleanouts.",
    icon: "hammer",
  },
  {
    title: "Locked-In Reservations",
    text: "Prepayment guarantees your date, so the trailer is ready exactly when you need it.",
    icon: "lock",
  },
  {
    title: "Transparent Pricing",
    text: "Flat $350 starting rate — and 50% off your second trailer on the same job site.",
    icon: "tag",
  },
];

export default function Benefits() {
  return (
    <section className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="section-eyebrow">Why Choose Us</span>
          <h2 className="section-title text-brand-dark">
            Heavy-duty rentals,{" "}
            <span className="text-brand-orange">light on the hassle.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
            Everything you need to keep your job site clean, on time, and on
            budget — from quick online booking to flexible delivery windows.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {ITEMS.map((item) => (
            <BenefitCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BenefitCard({ title, text, icon }) {
  return (
    <div className="group relative rounded-2xl border border-gray-200 bg-white p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-brand-yellow">
      <div className="absolute top-0 left-5 sm:left-6 h-1 w-10 sm:w-12 bg-brand-yellow rounded-b-md group-hover:w-20 transition-all" />
      <div className="grid h-11 w-11 sm:h-12 sm:w-12 place-items-center rounded-lg bg-brand-dark text-brand-yellow">
        <Icon name={icon} />
      </div>
      <h3 className="mt-4 text-lg sm:text-xl font-bold text-brand-dark">
        {title}
      </h3>
      <p className="mt-2 text-gray-600 leading-relaxed text-sm sm:text-base">
        {text}
      </p>
    </div>
  );
}

function Icon({ name }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "truck":
      return (
        <svg {...props}>
          <rect x="1" y="6" width="14" height="11" rx="1" />
          <polygon points="15 9 21 9 23 13 23 17 15 17 15 9" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
        </svg>
      );
    case "calendar":
      return (
        <svg {...props}>
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
      );
    case "ruler":
      return (
        <svg {...props}>
          <path d="M2 22 22 2" />
          <path d="M5 16l3-3" />
          <path d="M9 12l3-3" />
          <path d="M13 8l3-3" />
        </svg>
      );
    case "hammer":
      return (
        <svg {...props}>
          <path d="M14 2 22 10 18 14 10 6 z" />
          <path d="M10 6 2 14 6 18 14 10" />
          <path d="M9 13l-4 4" />
        </svg>
      );
    case "lock":
      return (
        <svg {...props}>
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      );
    case "tag":
      return (
        <svg {...props}>
          <path d="M20.59 13.41 13 21l-9-9V4h8l8.59 8.59a2 2 0 010 2.82z" />
          <circle cx="7.5" cy="7.5" r="1.5" />
        </svg>
      );
    default:
      return null;
  }
}
