import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import FaguBadge from "./FaguBadge";
import { SERVICES } from "../data/services";

/* -------------------------------------------------------------------------- */
/* Header — FAGU Home Services                                                */
/* -------------------------------------------------------------------------- */
/* Top-level navigation reflects the new, lean architecture:                  */
/*   - Home (/)                                                              */
/*   - Services dropdown -> /services/:slug                                  */
/*   - Partner (/partner) with role sub-routes                              */
/*   - FAQ (/faq) and Contact (/contact)                                    */
/*                                                                            */
/* The "Reserve Your Trailer" CTA always points at the dump-trailer booking */
/* anchor — the MVP's main conversion path.                                 */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { to: "/", label: "Home", end: true },
  { to: "/partner", label: "Partner" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

const RESERVE_HREF = "/services/dump-trailer#booking";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus whenever the route changes.
  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Promo bar */}
      <div
        className={`promo-bar-attention overflow-hidden bg-brand-yellow text-white transition-[max-height,opacity] duration-300 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-12 opacity-100"
        }`}
        role="region"
        aria-label="Promotional offer"
      >
        <div className="container-page flex items-center justify-center gap-2 sm:gap-3 py-1.5 sm:py-2 text-center">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-dark text-brand-yellow text-[10px] font-bold uppercase px-2 py-0.5 tracking-widest">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Limited Offer
          </span>
          <p className="promo-copy-attention text-[11px] sm:text-sm font-semibold leading-tight">
            <span className="font-extrabold uppercase">Save 50%</span> on your
            second dump trailer for the same job site.{" "}
            <Link
              to="/services/dump-trailer#rules"
              className="underline underline-offset-2 hover:no-underline font-bold whitespace-nowrap"
            >
              See terms
            </Link>
          </p>
        </div>
      </div>

      {/* Main nav bar */}
      <div
        className={`bg-brand-dark/80 backdrop-blur-md transition-shadow duration-300 ${
          scrolled ? "shadow-lg bg-brand-dark/88" : ""
        }`}
      >
        <div className="container-page flex h-24 md:h-28 items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center text-white min-w-0 flex-1"
            aria-label="FAGU Home Services — Home"
          >
            <FaguBadge
              size="xl"
              bare
              className="!h-20 !w-20 sm:!h-28 sm:!w-28 md:!h-32 md:!w-32"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            <Link
              to="/"
              className="text-white/90 hover:text-brand-yellow font-medium transition-colors"
            >
              Home
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setServicesOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={servicesOpen}
                className="text-white/90 hover:text-brand-yellow font-medium transition-colors inline-flex items-center gap-1"
              >
                Services
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {servicesOpen && (
                <div
                  role="menu"
                  className="absolute top-full left-0 pt-3 min-w-[260px]"
                >
                  <div className="rounded-xl border border-white/10 bg-brand-dark/95 backdrop-blur shadow-2xl overflow-hidden">
                    {SERVICES.map((s) => (
                      <Link
                        key={s.slug}
                        to={`/services/${s.slug}`}
                        role="menuitem"
                        className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/5 hover:text-brand-yellow border-b border-white/5 last:border-b-0"
                      >
                        <span className="font-semibold">{s.name}</span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider ${
                            s.available
                              ? "text-brand-yellow"
                              : "text-white/40"
                          }`}
                        >
                          {s.available ? "Live" : "Soon"}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-white/90 hover:text-brand-yellow font-medium transition-colors"
              >
                {l.label}
              </Link>
            ))}

            <a
              href={RESERVE_HREF}
              className="btn-primary !py-2.5 !px-5 !text-xs xl:!text-sm"
            >
              Reserve a Trailer
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10 active:bg-white/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {open ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden overflow-hidden bg-brand-dark border-t border-white/10 transition-[max-height] duration-300 ${
          open ? "max-h-[44rem]" : "max-h-0"
        }`}
      >
        <nav className="container-page flex flex-col py-3">
          <Link
            to="/"
            className="py-3 text-white/90 border-b border-white/5 hover:text-brand-yellow text-base font-semibold"
          >
            Home
          </Link>

          <div className="py-3 border-b border-white/5">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-semibold mb-2">
              Services
            </p>
            <ul className="grid grid-cols-1 gap-1">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    to={`/services/${s.slug}`}
                    className="flex items-center justify-between rounded-md px-2 py-2 text-white/85 hover:bg-white/5 hover:text-brand-yellow"
                  >
                    <span>{s.name}</span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        s.available ? "text-brand-yellow" : "text-white/40"
                      }`}
                    >
                      {s.available ? "Live" : "Soon"}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="py-3 text-white/90 border-b border-white/5 hover:text-brand-yellow text-base"
            >
              {l.label}
            </Link>
          ))}

          <a
            href={RESERVE_HREF}
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            Reserve a Trailer
          </a>
        </nav>
      </div>
    </header>
  );
}
