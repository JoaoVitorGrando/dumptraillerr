import { useState, useEffect } from "react";

/* -------------------------------------------------------------------------- */
/* Header with conversion-focused promo bar                                   */
/* -------------------------------------------------------------------------- */

const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#trailers", label: "Trailers" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#booking", label: "Booking" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Promo bar with discount offer — disappears on scroll to keep header compact */}
      <div
        className={`overflow-hidden bg-brand-yellow text-brand-dark transition-[max-height,opacity] duration-300 ${
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
          <p className="text-[11px] sm:text-sm font-semibold leading-tight">
            <span className="font-extrabold uppercase">Save 50%</span> on your
            second trailer for the same job site.{" "}
            <a
              href="#rules"
              className="underline underline-offset-2 hover:no-underline font-bold whitespace-nowrap"
            >
              See terms
            </a>
          </p>
        </div>
      </div>

      {/* Main nav bar */}
      <div
        className={`transition-colors duration-300 ${
          scrolled
            ? "bg-brand-dark/95 backdrop-blur shadow-lg"
            : "bg-gradient-to-b from-black/70 to-transparent"
        }`}
      >
        <div className="container-page flex h-16 md:h-20 items-center justify-between gap-3">
          <a
            href="#home"
            className="flex items-center gap-2 text-white min-w-0"
            aria-label="Dump Trailer Rental — Home"
          >
            <span className="grid h-9 w-9 sm:h-10 sm:w-10 shrink-0 place-items-center rounded-md bg-brand-yellow text-brand-dark font-black text-base sm:text-xl">
              DT
            </span>
            <span className="font-display text-base sm:text-lg md:text-xl font-extrabold uppercase tracking-wide whitespace-nowrap">
              <span className="hidden xs:inline">Dump Trailer</span>
              <span className="xs:hidden">DT</span>
              <span className="text-brand-yellow">.</span>Rental
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-white/90 hover:text-brand-yellow font-medium transition-colors"
              >
                {l.label}
              </a>
            ))}

            {/* Inline discount mention next to CTA */}
            <div className="hidden xl:flex flex-col items-end leading-tight">
              <span className="text-[10px] uppercase tracking-wider text-brand-yellow font-bold">
                Save 50% on trailer #2
              </span>
              <span className="text-[10px] text-white/60">
                Same job site, same project
              </span>
            </div>

            <a
              href="#booking"
              className="btn-primary !py-2.5 !px-5 !text-xs xl:!text-sm"
            >
              Reserve Your Trailer
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
          open ? "max-h-[32rem]" : "max-h-0"
        }`}
      >
        <nav className="container-page flex flex-col py-3">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="py-3 text-white/90 border-b border-white/5 hover:text-brand-yellow text-base"
            >
              {l.label}
            </a>
          ))}

          {/* Discount call-out inside the mobile drawer */}
          <div className="mt-4 rounded-lg border border-brand-yellow/40 bg-brand-yellow/10 px-4 py-3">
            <p className="text-brand-yellow font-bold text-sm">
              Save 50% on your second trailer
            </p>
            <p className="text-white/70 text-xs mt-0.5">
              Same job site, same project. Booking is confirmed only after
              prepayment.
            </p>
          </div>

          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            Reserve Your Trailer
          </a>
          <a
            href="#booking"
            onClick={() => setOpen(false)}
            className="btn-outline-light mt-2 mb-1 w-full"
          >
            Check Availability
          </a>
        </nav>
      </div>
    </header>
  );
}
