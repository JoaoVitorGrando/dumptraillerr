import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";

/* -------------------------------------------------------------------------- */
/* Services carousel                                                          */
/* -------------------------------------------------------------------------- */
/* Horizontal snap-scroll carousel of FAGU service categories. Each card is   */
/* clickable and routes to /services/:slug for detailed info, keeping the     */
/* home page focused on the MVP (Dump Trailer 12-18 ft).                      */
/* -------------------------------------------------------------------------- */

export default function ServicesCarousel() {
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return undefined;

    const autoAdvance = () => {
      const card = el.querySelector("[data-card]");
      const step = card ? card.clientWidth + 16 : el.clientWidth * 0.85;
      const maxLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + step;

      if (nextLeft >= maxLeft - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    };

    const timer = window.setInterval(autoAdvance, 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section id="services" className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 sm:gap-6">
          <div className="max-w-2xl">
            <span className="section-eyebrow">Our Services</span>
            <h2 className="section-title text-brand-dark">
              Every trailer for{" "}
              <span className="text-brand-orange">every job.</span>
            </h2>
            <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
              FAGU is launching with the dump trailer fleet that roofing crews
              and contractors rely on, and we're rolling out the rest of the
              lineup right after. Pick a category to see the full breakdown.
            </p>
          </div>

        </div>

        <div className="relative mt-8 sm:mt-10">
          {/* Edge fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-white to-transparent z-10 hidden sm:block"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-white to-transparent z-10 hidden sm:block"
          />

          <ul
            ref={trackRef}
            className="flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:thin]"
            style={{ scrollbarColor: "#EB7231 transparent" }}
          >
            {SERVICES.map((s) => (
              <li
                key={s.slug}
                data-card
                className="snap-start shrink-0 w-[78%] xs:w-[70%] sm:w-[48%] md:w-[40%] lg:w-[32%] xl:w-[28%]"
              >
                <ServiceCard service={s} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ service }) {
  const to = `/services/${service.slug}`;
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-brand-yellow flex flex-col">
      <Link to={to} className="block focus:outline-none" aria-label={`Learn more about ${service.name}`}>
        <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
          />
          <span
            className={`absolute top-3 left-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              service.available
                ? "bg-brand-yellow text-white"
                : "bg-white/90 text-brand-dark"
            }`}
          >
            {service.badge}
          </span>
          <h3 className="absolute bottom-3 left-3 right-3 font-display text-xl sm:text-2xl font-extrabold text-white drop-shadow">
            {service.name}
          </h3>
        </div>
      </Link>

      <div className="flex flex-col flex-1 p-5">
        <p className="text-brand-orange font-semibold text-sm min-h-[3.25rem] line-clamp-2">
          {service.tagline}
        </p>
        <p className="mt-2 text-gray-600 text-sm leading-relaxed line-clamp-3 min-h-[4.5rem]">
          {service.short}
        </p>

        <div className="mt-4 flex flex-wrap content-start gap-1.5 min-h-[3.1rem]">
          {service.sizes.slice(0, 4).map((sz) => (
            <span
              key={sz}
              className="rounded-full bg-gray-100 text-gray-700 text-[11px] font-semibold px-2.5 py-1"
            >
              {sz}
            </span>
          ))}
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between gap-3 mt-auto">
          {service.startingPrice ? (
            <p className="text-sm">
              <span className="text-gray-500">From </span>
              <span className="font-display font-extrabold text-brand-dark text-lg">
                ${service.startingPrice}
              </span>
            </p>
          ) : (
            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
              Joining the lineup
            </p>
          )}
          <Link
            to={to}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-yellow hover:text-brand-orange"
          >
            Learn more
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
          </Link>
        </div>
      </div>
    </article>
  );
}
