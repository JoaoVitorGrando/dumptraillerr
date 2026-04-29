import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FaguBadge from "./FaguBadge";
import { SERVICES } from "../data/services";
import { TRAILERS } from "../data/trailers";

/* -------------------------------------------------------------------------- */
/* Hero — FAGU brand introduction                                             */
/* -------------------------------------------------------------------------- */
/* The home page is now a presentation of FAGU as a multi-service trailer     */
/* platform. The hero introduces the brand and points users to the two main  */
/* flows: explore services or partner with FAGU. All deeper content lives in */
/* dedicated routes.                                                          */
/* -------------------------------------------------------------------------- */

export default function Hero() {
  return (
    <section
      id="home"
      className="relative isolate overflow-hidden bg-grid-dark text-white pt-40 sm:pt-44 md:pt-52 pb-16 sm:pb-20 md:pb-28"
    >
      <div className="absolute top-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />

      <div className="container-page relative grid lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] gap-8 lg:gap-2 items-center">
        <div className="min-w-0 lg:pr-3">
          <h1 className="text-[2.4rem] xs:text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.4rem] font-extrabold leading-[0.96] uppercase max-w-none">
            One platform.
            <br className="hidden sm:inline" />{" "}
            <span className="text-brand-yellow">Every trailer you need.</span>
          </h1>
          <p className="mt-5 sm:mt-6 max-w-3xl text-lg md:text-xl text-white/85 leading-relaxed">
            We connect you to the right trailer for any job fast, simple, and
            reliable.
          </p>
          <p className="mt-3 max-w-3xl text-base sm:text-lg text-brand-yellow font-semibold">
            Book now and get your job done without hassle.
          </p>

          <div className="mt-7 sm:mt-8 flex flex-col sm:flex-row gap-3">
            <a
              href="#services"
              className="btn-primary w-full sm:w-auto !text-sm md:!text-base !px-7"
            >
              Explore Our Services
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
            <Link
              to="/partner"
              className="btn-outline-light w-full sm:w-auto !text-sm md:!text-base !px-7"
            >
              Partner with FAGU
            </Link>
          </div>

          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4 max-w-2xl">
            <Trust label="For Owners" value="Monetize your trailers with ease" />
            <Trust label="For Customers" value="Book fast and get it delivered" />
            <Trust label="For Drivers" value="Earn by making local deliveries" />
          </div>
        </div>

        <div className="min-w-0">
          <HeroVisual />
        </div>
      </div>

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

function HeroVisual() {
  const carouselItems = useMemo(() => {
    if (TRAILERS.length) {
      return TRAILERS.map((trailer) => ({
        slug: "dump-trailer",
        name: trailer.size,
        image: trailer.image,
      }));
    }
    return SERVICES.map((service) => ({
      slug: service.slug,
      name: service.name,
      image: service.image,
    }));
  }, []);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!carouselItems.length) return undefined;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % carouselItems.length);
    }, 2800);
    return () => window.clearInterval(timer);
  }, [carouselItems]);

  const activeItem = carouselItems[activeIndex];

  return (
    <div className="relative w-full max-w-xl mx-auto lg:max-w-none lg:mt-2 lg:-ml-2">
      <div className="absolute -inset-3 rounded-3xl bg-brand-yellow/10 blur-xl pointer-events-none" />
      <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-sm p-4 sm:p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.18em] text-brand-yellow font-bold">
              FAGU · Trailer Fleet
            </p>
            <p className="mt-1 text-white font-display text-xl sm:text-2xl font-extrabold leading-tight">
              Explore our trailer{" "}
              <span className="text-brand-yellow">options.</span>
            </p>
          </div>
          <FaguBadge
            size="sm"
            bare
            className="shrink-0 opacity-90"
          />
        </div>

        <div className="relative overflow-hidden rounded-xl border border-white/10">
          {activeItem && (
            <>
              <img
                src={activeItem.image}
                alt={activeItem.name}
                loading="eager"
                decoding="async"
                className="h-72 sm:h-80 md:h-96 lg:h-[26rem] w-full object-cover transition-all duration-700"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/15 to-transparent"
              />
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between gap-3 z-20">
                <span className="rounded-full bg-white/95 text-brand-dark text-[10px] sm:text-xs font-bold tabular-nums px-3 py-1">
                  {activeItem.name}
                </span>
                <div className="flex items-center gap-1.5">
                  {carouselItems.map((item, i) => (
                    <span
                      key={`${item.slug}-${i}`}
                      className={`h-1.5 rounded-full transition-all ${
                        i === activeIndex
                          ? "w-5 bg-brand-yellow"
                          : "w-2.5 bg-white/45"
                      }`}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-3 sm:mt-4 flex items-center justify-between gap-3 px-1">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Sizes
            </p>
            <p className="font-semibold text-white text-sm sm:text-base tabular-nums">
              12 – 20 ft
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-white/50">
              Delivery
            </p>
            <p className="font-semibold text-white text-sm sm:text-base">
              Day-before
            </p>
          </div>
        </div>

        <Link
          to={activeItem ? `/services/${activeItem.slug}` : "/#services"}
          className="btn-primary mt-4 w-full !text-sm"
        >
          Explore all trailer options
        </Link>
      </div>
    </div>
  );
}

