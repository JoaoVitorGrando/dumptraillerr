import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Trailers from "../components/Trailers";
import BookingForm from "../components/BookingForm";
import { findService } from "../data/services";

/* -------------------------------------------------------------------------- */
/* Dump Trailer service page (/services/dump-trailer)                         */
/* -------------------------------------------------------------------------- */
/* Dedicated page that concentrates EVERYTHING about the MVP service:        */
/* sizes, benefits, how-it-works, rules, booking, payment and FAQ. This is   */
/* where the home page redirects users who pick the dump trailer card.      */
/* -------------------------------------------------------------------------- */

export default function DumpTrailerPage() {
  const service = findService("dump-trailer");
  const { hash, pathname } = useLocation();

  // Reset to top when first arriving (no hash) and smooth-scroll to a hash if
  // the user landed on /services/dump-trailer#booking, etc.
  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
      return;
    }
    const id = hash.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [pathname, hash]);

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />

      <main className="flex-1">
        {/* Page hero */}
        <section className="relative overflow-hidden bg-grid-dark text-white pt-24 sm:pt-28 md:pt-32">
          <div className="absolute top-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />
          <div className="container-page py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h1 className="text-[2.4rem] xs:text-[2.8rem] sm:text-6xl md:text-7xl lg:text-[5rem] xl:text-[5.4rem] font-extrabold leading-[0.96] uppercase">
                Dump Trailer Rental:{" "}
                <span className="text-brand-yellow">Fast, Simple, Secure.</span>
              </h1>
              <p className="mt-5 sm:mt-6 max-w-3xl text-base sm:text-lg text-brand-yellow font-semibold">
                {service.tagline}
              </p>
              <p className="mt-3 max-w-3xl text-lg md:text-xl text-white/85 leading-relaxed">
                {service.short}
              </p>

              <div className="mt-6 sm:mt-7 flex flex-wrap gap-2.5">
                {service.sizes.map((sz) => (
                  <span
                    key={sz}
                    className="rounded-full bg-white/10 border border-white/15 text-white/90 text-sm font-semibold px-3.5 py-1.5"
                  >
                    {sz}
                  </span>
                ))}
              </div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3">
                <a href="#booking" className="btn-primary !text-sm md:!text-base !px-7">
                  Reserve a Trailer
                </a>
                <a href="#trailers" className="btn-outline-light !text-sm md:!text-base !px-7">
                  See sizes & pricing
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-brand-yellow/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-2xl bg-white/[0.04]">
                <img
                  src={service.image}
                  alt={service.name}
                  className="h-[26rem] sm:h-[32rem] md:h-[38rem] w-full object-cover object-[50%_45%]"
                />
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 inset-x-0 h-2 bg-hazard-stripes opacity-90" />
        </section>

        {/* Lean flow: only core conversion sections */}
        <Trailers />
        <BookingForm />
      </main>

      <Footer />
    </div>
  );
}
