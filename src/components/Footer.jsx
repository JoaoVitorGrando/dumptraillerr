import { Link } from "react-router-dom";
import FaguBadge from "./FaguBadge";
import { SERVICES } from "../data/services";
import { API_CONFIG } from "../config/api";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="container-page py-12 sm:py-14 grid sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="sm:col-span-2 md:col-span-1">
          <Link to="/" className="flex items-center gap-3">
            <FaguBadge size="lg" variant="dark" />
            <span className="font-display text-lg sm:text-xl font-extrabold tracking-wide text-white">
              FAGU<span className="text-brand-yellow"> · </span>Home Services
            </span>
          </Link>
          <p className="mt-3 sm:mt-4 max-w-md text-white/70 text-sm sm:text-base">
            One platform connecting trailer owners, roofing crews and drivers.
            Starting with dump trailer rentals (12–18 ft) and rolling out the
            rest of the lineup.
          </p>
        </div>

        <div>
          <h4 className="text-white font-display font-bold tracking-wider">
            Services
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="hover:text-brand-yellow"
                >
                  {s.name}
                  {!s.available && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-white/40">
                      soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-bold tracking-wider">
            Partner
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/partner/owner" className="hover:text-brand-yellow">
                Trailer Owners
              </Link>
            </li>
            <li>
              <Link to="/partner/customer" className="hover:text-brand-yellow">
                Customers / Roofing
              </Link>
            </li>
            <li>
              <Link to="/partner/driver" className="hover:text-brand-yellow">
                Drivers
              </Link>
            </li>
            <li>
              <Link to="/partner" className="hover:text-brand-yellow">
                All partner paths →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-display font-bold tracking-wider">
            Contact
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={`tel:${API_CONFIG.contact.phone.replace(/\s+/g, "")}`}
                className="hover:text-brand-yellow"
              >
                {API_CONFIG.contact.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${API_CONFIG.contact.email}`}
                className="hover:text-brand-yellow break-all"
              >
                {API_CONFIG.contact.email}
              </a>
            </li>
            <li>{API_CONFIG.contact.hours}</li>
            <li>
              <Link to="/faq" className="hover:text-brand-yellow">
                FAQ
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-brand-yellow">
                Contact page →
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3 text-[11px] sm:text-xs text-white/50">
          <p>
            © {year} FAGU Home Services. All rights reserved. Prices in USD.
          </p>
          <p>
            Built for contractors, homeowners and crews who get things done.
          </p>
        </div>
      </div>
    </footer>
  );
}
