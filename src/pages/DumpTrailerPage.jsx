import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Benefits from "../components/Benefits";
import Trailers from "../components/Trailers";
import HowItWorks from "../components/HowItWorks";
import Rules from "../components/Rules";
import BookingForm from "../components/BookingForm";
import Payment from "../components/Payment";
import FAQ from "../components/FAQ";
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

      <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
        {/* Page hero */}
        <section className="bg-grid-dark text-white">
          <div className="container-page py-12 sm:py-16 md:py-20 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <Breadcrumb name={service.name} />
              <span className="mt-4 inline-block rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider bg-brand-yellow text-white">
                {service.badge}
              </span>
              <h1 className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
                Dump Trailer Rental{" "}
                <span className="text-brand-yellow">— Fast, Simple, Secure.</span>
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
                <a href="#booking" className="btn-primary">
                  Reserve a Trailer
                </a>
                <a href="#trailers" className="btn-outline-light">
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
                  className="h-72 sm:h-80 md:h-96 w-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Full marketing flow — concentrated here, removed from the home */}
        <Benefits />
        <Trailers />
        <HowItWorks />
        <Rules />
        <BookingForm />
        <Payment />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

function Breadcrumb({ name }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-white/60">
      <Link to="/" className="hover:text-brand-yellow">
        Home
      </Link>
      <span className="mx-2">/</span>
      <Link to="/#services" className="hover:text-brand-yellow">
        Services
      </Link>
      <span className="mx-2">/</span>
      <span className="text-white/90">{name}</span>
    </nav>
  );
}
