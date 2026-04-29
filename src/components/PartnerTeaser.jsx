import { Link } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/* Partner teaser (home page)                                                 */
/* -------------------------------------------------------------------------- */
/* Lightweight 3-card section that introduces the multi-persona platform     */
/* and routes each user to their dedicated /partner/:role registration page. */
/* Keeps the home page lean; the actual forms live on those routes.          */
/* -------------------------------------------------------------------------- */

const ROLES = [
  {
    slug: "owner",
    eyebrow: "For Trailer Owners",
    title: "I have trailers",
    pitch:
      "Put your fleet to work with steady demand from roofing crews and contractors.",
    cta: "Become an Owner",
    icon: "trailer",
  },
  {
    slug: "customer",
    eyebrow: "For Roofing & Crews",
    title: "I need a trailer",
    pitch:
      "Open a recurring rental account so your team can book in seconds.",
    cta: "Open a Customer Account",
    icon: "hammer",
  },
  {
    slug: "driver",
    eyebrow: "For Drivers",
    title: "I want to drive",
    pitch:
      "Use your truck to deliver and pick up trailers — up to 4 movements per day.",
    cta: "Apply to Drive",
    icon: "truck",
  },
];

export default function PartnerTeaser() {
  return (
    <section
      id="partner"
      className="py-16 sm:py-20 md:py-28 bg-grid-dark text-white"
    >
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-eyebrow inline-block">Join the FAGU Network</span>
          <h2 className="section-title">
            One platform.{" "}
            <span className="text-brand-yellow">Three ways to grow.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-white/75 text-base sm:text-lg">
            FAGU connects three sides of the trailer business in one platform.
            Pick your role to get started — each path has its own quick
            onboarding form.
          </p>
        </div>

        <ul className="mt-8 sm:mt-10 grid gap-4 sm:gap-5 md:grid-cols-3">
          {ROLES.map((r) => (
            <li key={r.slug}>
              <Link
                to={`/partner/${r.slug}`}
                className="group block h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 transition-all hover:border-brand-yellow hover:bg-white/[0.07] hover:-translate-y-1"
              >
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-brand-yellow text-brand-dark mb-4">
                  <RoleIcon name={r.icon} />
                </span>
                <p className="text-[10px] uppercase tracking-[0.18em] text-white/55 font-semibold">
                  {r.eyebrow}
                </p>
                <h3 className="mt-1 font-display text-xl sm:text-2xl font-extrabold leading-tight">
                  {r.title}
                </h3>
                <p className="mt-3 text-white/75 text-sm sm:text-base leading-relaxed">
                  {r.pitch}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-yellow group-hover:text-white">
                  {r.cta}
                  <svg
                    width="16"
                    height="16"
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
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-8 sm:mt-10 text-center text-sm text-white/60">
          Not sure where you fit?{" "}
          <Link
            to="/partner"
            className="text-brand-yellow font-semibold hover:underline"
          >
            See all partner paths →
          </Link>
        </div>
      </div>
    </section>
  );
}

function RoleIcon({ name }) {
  const p = {
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
    case "trailer":
      return (
        <svg {...p}>
          <rect x="2" y="7" width="18" height="9" rx="1" />
          <line x1="20" y1="11.5" x2="23" y2="11.5" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="15" cy="18" r="2" />
        </svg>
      );
    case "hammer":
      return (
        <svg {...p}>
          <path d="M14 2 22 10 18 14 10 6 z" />
          <path d="M10 6 2 14 6 18 14 10" />
          <path d="M9 13l-4 4" />
        </svg>
      );
    case "truck":
      return (
        <svg {...p}>
          <rect x="1" y="6" width="14" height="11" rx="1" />
          <polygon points="15 9 21 9 23 13 23 17 15 17 15 9" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
        </svg>
      );
    default:
      return null;
  }
}
