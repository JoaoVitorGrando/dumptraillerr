import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { SERVICES } from "../data/services";
import { TRAILERS } from "../data/trailers";

/* -------------------------------------------------------------------------- */
/* Services / Sizes overview                                                  */
/* -------------------------------------------------------------------------- */
/* MVP focus: dump trailer. We render a centered headline + a minimalist     */
/* grid of available sizes (12, 14, 16, 18, 20 ft). Each card is a clean     */
/* photo + size label that links to the dump-trailer page.                   */
/* -------------------------------------------------------------------------- */

export default function ServicesCarousel() {
  return (
    <section id="services" className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="container-page">
        <div className="max-w-2xl mx-auto text-center">
          <span className="section-eyebrow inline-block">Our Services</span>
          <h2 className="section-title text-brand-dark">
            Dump trailer rental{" "}
            <span className="text-brand-orange">for any job.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
            12 to 20 ft hydraulic dump trailers, roofing tear-offs,
            construction debris, full cleanouts and everything in between.
            Online booking, day-before delivery and pickup included.
          </p>
        </div>

        <ul
          className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5"
          aria-label="Available dump trailer sizes"
        >
          {TRAILERS.map((t) => (
            <li key={t.id}>
              <SizeCard trailer={t} />
            </li>
          ))}
        </ul>

        <p className="mt-6 sm:mt-8 text-center text-sm text-gray-500">
          Need a different size or capacity?{" "}
          <Link
            to="/services/dump-trailer#trailers"
            className="font-semibold text-brand-orange hover:text-brand-yellow"
          >
            Request a custom trailer →
          </Link>
        </p>

        <ComingSoonPreview />
      </div>
    </section>
  );
}

function SizeCard({ trailer }) {
  const dimension = `${trailer.length.replace(" ft", "")}x${trailer.width.replace(
    " ft",
    ""
  )}`;

  return (
    <Link
      to={`/services/dump-trailer?model=${trailer.id}#trailers`}
      className="group block overflow-hidden rounded-2xl border border-gray-200 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-brand-yellow hover:shadow-xl"
    >
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={trailer.image}
          alt={trailer.imageAlt || trailer.name}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent"
        />
      </div>
      <div className="p-4 text-center">
        <p className="text-xl sm:text-2xl font-semibold tabular-nums tracking-normal text-brand-dark leading-none">
          {dimension}
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-wider text-gray-500 font-semibold">
          {trailer.name.replace(" Dump Trailer", "")}
        </p>
      </div>
    </Link>
  );
}

function ComingSoonPreview() {
  const hiddenServices = SERVICES.filter((s) => s.slug !== "dump-trailer");
  const trackRef = useRef(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el || hiddenServices.length <= 1) return undefined;

    const autoAdvance = () => {
      const card = el.querySelector("[data-coming-card]");
      const step = card ? card.clientWidth + 12 : el.clientWidth * 0.9;
      const maxLeft = el.scrollWidth - el.clientWidth;
      const nextLeft = el.scrollLeft + step;

      if (nextLeft >= maxLeft - 8) {
        el.scrollTo({ left: 0, behavior: "smooth" });
        return;
      }
      el.scrollTo({ left: nextLeft, behavior: "smooth" });
    };

    const timer = window.setInterval(autoAdvance, 2300);
    return () => window.clearInterval(timer);
  }, [hiddenServices.length]);

  if (!hiddenServices.length) return null;

  return (
    <div className="mt-10 sm:mt-12 rounded-2xl border border-brand-yellow/30 bg-brand-yellow/10 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] uppercase tracking-wider text-brand-orange font-semibold">
          Coming soon categories
        </p>
        <span className="text-[10px] uppercase tracking-wider text-brand-dark/60 font-semibold">
          Visual preview only
        </span>
      </div>

      <ul
        ref={trackRef}
        className="mt-3 flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [scrollbar-width:thin]"
        style={{ scrollbarColor: "#EB7231 transparent" }}
        aria-label="Coming soon trailer categories"
      >
        {hiddenServices.map((service) => (
          <li
            key={service.slug}
            data-coming-card
            className="snap-start shrink-0 w-[86%] sm:w-[48%] lg:w-[32%] xl:w-[24%] overflow-hidden rounded-xl border border-brand-dark/10 bg-white"
          >
            <div className="relative h-36 bg-gray-100">
              <img
                src={service.image}
                alt={service.name}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-contain p-2"
              />
            </div>
            <div className="px-3 pb-3">
              <p className="text-brand-dark font-semibold text-sm">{service.name}</p>
              <p className="mt-0.5 text-[11px] text-gray-500 line-clamp-2">
                {service.tagline}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
