import { useEffect, useRef } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import DumpTrailerPage from "./DumpTrailerPage";
import { findPublicService, PUBLIC_SERVICES } from "../data/services";

/* -------------------------------------------------------------------------- */
/* Service detail page (/services/:slug)                                      */
/* -------------------------------------------------------------------------- */
/* Generic template that renders any FAGU service category. Keeps the home    */
/* page focused on the dump-trailer MVP while giving each other category its  */
/* own URL with full marketing copy + waitlist CTA.                           */
/* -------------------------------------------------------------------------- */

export default function ServicePage() {
  const { slug } = useParams();
  const service = findPublicService(slug);
  const otherServicesTrackRef = useRef(null);

  // Reset scroll position whenever the route changes so the user lands at the
  // top of the new service page instead of mid-scroll.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [slug]);

  useEffect(() => {
    const el = otherServicesTrackRef.current;
    if (!el) return undefined;

    const autoAdvance = () => {
      const card = el.querySelector("[data-other-card]");
      const step = card ? card.clientWidth + 16 : el.clientWidth * 0.85;
      const maxLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + step;

      if (nextLeft >= maxLeft - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    };

    const timer = window.setInterval(autoAdvance, 2800);
    return () => window.clearInterval(timer);
  }, [slug]);

  if (!service) {
    return <Navigate to="/" replace />;
  }

  // The MVP service has its own dedicated, content-rich page. Delegate to it
  // so the URL stays the same (/services/dump-trailer) but the layout is
  // tailored for the booking flow.
  if (service.slug === "dump-trailer") {
    return <DumpTrailerPage />;
  }

  const others = PUBLIC_SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-grid-dark text-white pt-24 sm:pt-28 md:pt-32">
          <div className="container-page py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
                {service.name}
              </h1>
              <p className="mt-3 text-brand-yellow font-semibold text-lg">
                {service.tagline}
              </p>
              <p className="mt-4 text-white/80 text-base sm:text-lg leading-relaxed max-w-xl">
                {service.short}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {service.sizes.map((sz) => (
                  <span
                    key={sz}
                    className="rounded-full bg-white/10 border border-white/15 text-white/90 text-xs font-semibold px-3 py-1"
                  >
                    {sz}
                  </span>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <CTALink href={service.primaryCta.href} primary>
                  {service.primaryCta.label}
                </CTALink>
                <CTALink href={service.secondaryCta.href}>
                  {service.secondaryCta.label}
                </CTALink>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-brand-yellow/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-white/[0.04]">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-72 sm:h-80 md:h-96 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Specs + best for */}
        <section className="py-12 sm:py-16 md:py-20 bg-white">
          <div className="container-page grid lg:grid-cols-[1.1fr,1fr] gap-8 lg:gap-12">
            <div>
              <span className="section-eyebrow">Best Suited For</span>
              <h2 className="section-title text-brand-dark">
                Built for the jobs{" "}
                <span className="text-brand-orange">that demand it.</span>
              </h2>
              <ul className="mt-6 space-y-3">
                {service.bestFor.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-yellow text-white">
                      <svg
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                    <span className="text-gray-700 text-sm sm:text-base">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 sm:mt-10 grid sm:grid-cols-2 gap-3 sm:gap-4">
                {service.highlights.map((h) => (
                  <div
                    key={h}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <p className="text-sm text-gray-700">{h}</p>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-2xl bg-brand-dark text-white p-5 sm:p-6 md:p-8 self-start">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60 font-semibold">
                Specs Snapshot
              </p>
              <h3 className="mt-2 font-display text-2xl sm:text-3xl font-extrabold">
                {service.name}
              </h3>

              <dl className="mt-5 sm:mt-6 grid grid-cols-2 gap-3">
                {service.specs.map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg bg-white/5 border border-white/10 p-3"
                  >
                    <dt className="text-[10px] uppercase tracking-wider text-white/50">
                      {s.label}
                    </dt>
                    <dd className="font-semibold text-white text-sm mt-0.5">
                      {s.value}
                    </dd>
                  </div>
                ))}
              </dl>

              {service.available ? (
                <Link
                  to="/services/dump-trailer#booking"
                  className="btn-primary mt-6 w-full"
                >
                  Reserve Now
                </Link>
              ) : (
                <div className="mt-6 rounded-xl border border-brand-yellow/40 bg-brand-yellow/10 p-4">
                  <p className="text-brand-yellow font-bold text-sm">
                    Not yet bookable online
                  </p>
                  <p className="text-white/75 text-xs mt-1">
                    Join the waitlist and we'll notify you the moment{" "}
                    {service.name.toLowerCase()}s come online in your city.
                  </p>
                  <Link
                    to="/partner/customer"
                    className="btn-primary mt-4 w-full"
                  >
                    Join Waitlist
                  </Link>
                </div>
              )}
            </aside>
          </div>
        </section>

        {/* Other services — only shown when multiple public services exist */}
        {others.length > 0 && (
          <section className="py-12 sm:py-16 md:py-20 bg-brand-light">
            <div className="container-page">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <span className="section-eyebrow">Explore More</span>
                  <h2 className="section-title text-brand-dark">
                    Other FAGU services
                  </h2>
                </div>
                <Link
                  to="/#services"
                  className="text-sm font-bold text-brand-yellow hover:text-brand-orange"
                >
                  ← Back to all services
                </Link>
              </div>

              <ul
                ref={otherServicesTrackRef}
                className="mt-8 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:thin]"
                style={{ scrollbarColor: "#EB7231 transparent" }}
              >
                {others.map((s) => (
                  <li
                    key={s.slug}
                    data-other-card
                    className="snap-start shrink-0 w-[82%] xs:w-[74%] sm:w-[48%] md:w-[38%] lg:w-[30%] xl:w-[24%]"
                  >
                    <Link
                      to={`/services/${s.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:border-brand-yellow"
                    >
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={s.image}
                          alt={s.name}
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="p-4">
                        <p className="font-display text-lg font-extrabold text-brand-dark">
                          {s.name}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                          {s.tagline}
                        </p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

function CTALink({ href, children, primary }) {
  // Both react-router internal links and plain anchors (for /#hash on home)
  // are routed correctly by the browser since hash links work natively.
  const className = primary ? "btn-primary" : "btn-outline-light";
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
