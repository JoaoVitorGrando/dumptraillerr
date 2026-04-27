// Site footer
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="container-page py-12 sm:py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="sm:col-span-2">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-brand-yellow text-brand-dark font-black text-xl">
              DT
            </span>
            <span className="font-display text-lg sm:text-xl font-extrabold uppercase tracking-wide text-white">
              Dump Trailer<span className="text-brand-yellow">.</span>Rental
            </span>
          </div>
          <p className="mt-3 sm:mt-4 max-w-md text-white/70 text-sm sm:text-base">
            Professional dump trailer rentals for construction, renovation,
            yard waste, and full property cleanouts. Online booking, flexible
            delivery, and transparent pricing.
          </p>
        </div>

        <div>
          <h4 className="text-white font-display font-bold uppercase tracking-wider">
            Explore
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a href="#trailers" className="hover:text-brand-yellow">
                Our Trailers
              </a>
            </li>
            <li>
              <a href="#how-it-works" className="hover:text-brand-yellow">
                How It Works
              </a>
            </li>
            <li>
              <a href="#rules" className="hover:text-brand-yellow">
                Rental Rules
              </a>
            </li>
            <li>
              <a href="#faq" className="hover:text-brand-yellow">
                FAQ
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-bold uppercase tracking-wider">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="tel:+15555550199"
                className="hover:text-brand-yellow"
              >
                (555) 555-0199
              </a>
            </li>
            <li>
              <a
                href="mailto:hello@dumptrailerrental.com"
                className="hover:text-brand-yellow"
              >
                hello@dumptrailerrental.com
              </a>
            </li>
            <li>Mon–Sat · 7:00 AM – 7:00 PM</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3 text-[11px] sm:text-xs text-white/50">
          <p>
            © {year} Dump Trailer Rental. All rights reserved. Prices in USD.
          </p>
          <p>
            Built for contractors, homeowners, and crews who get things done.
          </p>
        </div>
      </div>
    </footer>
  );
}
