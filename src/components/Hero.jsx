import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FaguBadge from "./FaguBadge";
import { SERVICES } from "../data/services";

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
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[400px] w-[400px] sm:h-[600px] sm:w-[600px] rounded-full bg-brand-yellow/10 blur-3xl"
      />
      <div className="absolute top-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />

      <div className="container-page relative grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
        <div className="lg:col-span-7">
          <span className="section-eyebrow">
            FAGU · Home Services & Logistics
          </span>
          <h1 className="text-[2.4rem] xs:text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.6rem] font-extrabold leading-[0.96] uppercase max-w-4xl">
            One platform.
            <br className="hidden sm:inline" />{" "}
            <span className="text-brand-yellow">Every trailer you need.</span>
          </h1>
          <p className="mt-5 sm:mt-6 max-w-2xl text-lg md:text-xl text-white/85 leading-relaxed">
            We connect you to the right trailer for any job fast, simple, and
            reliable.
          </p>
          <p className="mt-3 max-w-2xl text-base sm:text-lg text-brand-yellow font-semibold">
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

          <div className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg">
            <Trust label="For Owners" value="Monetize your trailers with ease" />
            <Trust label="For Customers" value="Book fast and get it delivered" />
            <Trust label="For Drivers" value="Earn by making local deliveries" />
          </div>
        </div>

        <div className="lg:col-span-5">
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
  const carouselItems = useMemo(
    () =>
      SERVICES.map((service) => ({
        slug: service.slug,
        name: service.name,
        image: service.image,
      })),
    []
  );
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
    <div className="relative max-w-lg mx-auto lg:max-w-none lg:-ml-8 lg:mt-6">
      <div className="absolute -inset-4 rounded-3xl bg-brand-yellow/20 blur-2xl" />

      <div className="relative rounded-2xl sm:rounded-3xl border border-white/10 bg-gradient-to-br from-brand-gray to-brand-dark p-5 sm:p-7 shadow-2xl">
        <div className="flex items-center justify-between mb-3 sm:mb-4 gap-2 flex-wrap">
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-yellow text-brand-dark text-[10px] sm:text-xs font-bold uppercase px-2.5 sm:px-3 py-1 tracking-wider">
            <span className="h-2 w-2 rounded-full bg-brand-dark animate-pulse" />
            FAGU · Trailer Fleet
          </span>
          <Link
            to={activeItem ? `/services/${activeItem.slug}` : "/#services"}
            className="text-white/70 hover:text-brand-yellow text-[10px] sm:text-xs font-semibold"
          >
            See details →
          </Link>
        </div>
        <p className="font-display text-3xl sm:text-4xl font-extrabold text-white leading-tight">
          Explore our trailer{" "}
          <span className="text-brand-yellow">options.</span>
        </p>

        <div className="relative mt-4 sm:mt-6 overflow-hidden rounded-xl border border-white/10">
          {/* Brand seal stays over the photo, never over text */}
          <FaguBadge
            size="md"
            variant="dark"
            className="absolute top-3 left-3 z-20"
          />
          {activeItem && (
            <>
              <img
                src={activeItem.image}
                alt={activeItem.name}
                loading="eager"
                decoding="async"
                className="h-60 sm:h-72 md:h-80 w-full object-cover transition-all duration-700"
              />
              <div className="absolute left-3 right-3 bottom-3 flex items-center justify-between gap-3 z-20">
                <span className="rounded-full bg-black/55 border border-white/20 px-3 py-1 text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-white">
                  {activeItem.name}
                </span>
                <div className="flex items-center gap-1.5">
                  {carouselItems.map((item, i) => (
                    <span
                      key={item.slug}
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
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/70 via-brand-dark/20 to-transparent"
            aria-hidden
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3 text-sm">
          <Spec label="Sizes" value="12 – 18 ft" />
          <Spec label="Coverage" value="Day-before delivery" />
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
