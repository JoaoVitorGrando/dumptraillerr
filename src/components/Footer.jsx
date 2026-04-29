import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import FaguBadge from "./FaguBadge";
import { SERVICES } from "../data/services";
import { API_CONFIG } from "../config/api";

export default function Footer() {
  const year = new Date().getFullYear();
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  return (
    <footer className="bg-brand-dark text-white/80">
      {isHome && (
        <div className="container-page py-8 sm:py-10 grid md:grid-cols-[1.2fr,1fr] gap-6 md:gap-8">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <FaguBadge size="sm" variant="dark" />
              <span className="font-display text-base sm:text-lg font-extrabold tracking-wide text-white">
                FAGU<span className="text-brand-yellow"> · </span>Home Services
              </span>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-white font-display font-bold tracking-wider hover:text-brand-yellow transition-colors">
              Services
              <span className="text-white/50 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
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
          </details>

          <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-white font-display font-bold tracking-wider hover:text-brand-yellow transition-colors">
              Partner
              <span className="text-white/50 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
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
          </details>

          <details className="group">
            <summary className="inline-flex cursor-pointer list-none items-center gap-2 text-white font-display font-bold tracking-wider hover:text-brand-yellow transition-colors">
              Contact
              <span className="text-white/50 transition-transform group-open:rotate-180">
                ▾
              </span>
            </summary>
            <ul className="mt-3 space-y-2 text-sm">
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
            </ul>
          </details>
          </div>
        </div>
      )}

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
