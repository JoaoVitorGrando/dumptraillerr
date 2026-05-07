import Link from "next/link";
import FaguBadge from "@/components/FaguBadge";
import { SERVICES } from "@/data/services";
import { API_CONFIG } from "@/config/api";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-dark text-white/80">
      <div className="container-page py-8 sm:py-10 grid md:grid-cols-[1.2fr,1fr] gap-6 md:gap-8">
        <div>
          <Link href="/" className="flex items-center gap-3">
            <FaguBadge size="sm" variant="dark" />
            <span className="font-display text-base sm:text-lg font-extrabold tracking-wide text-white">
              FAGU<span className="text-brand-yellow"> · </span>Home Services
            </span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          <FooterSection title="Services">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="hover:text-brand-yellow">
                  {s.name}
                  {!s.available && (
                    <span className="ml-2 text-[10px] uppercase tracking-wider text-white/40">
                      soon
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </FooterSection>

          <FooterSection title="Partner">
            <li>
              <Link href="/partner/owner" className="hover:text-brand-yellow">
                Trailer Owners
              </Link>
            </li>
            <li>
              <Link href="/partner/customer" className="hover:text-brand-yellow">
                Customers / Roofing
              </Link>
            </li>
            <li>
              <Link href="/partner/driver" className="hover:text-brand-yellow">
                Drivers
              </Link>
            </li>
            <li>
              <Link href="/partner" className="hover:text-brand-yellow">
                All partner paths →
              </Link>
            </li>
          </FooterSection>

          <FooterSection title="Contact">
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
              <Link href="/faq" className="hover:text-brand-yellow">
                FAQ
              </Link>
            </li>
          </FooterSection>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page py-5 sm:py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 md:gap-3 text-[11px] sm:text-xs text-white/50">
          <p>© {year} FAGU Home Services. All rights reserved.</p>
          <p>Built for contractors, homeowners and crews who get things done.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="group/footer">
      <button
        type="button"
        className="inline-flex items-center gap-1 text-white font-display font-bold tracking-wider"
        aria-label={`Open ${title} details`}
      >
        {title}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-brand-yellow transition-transform duration-200 group-hover/footer:rotate-180 group-focus-within/footer:rotate-180"
          aria-hidden
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div className="mt-0 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover/footer:mt-2 group-hover/footer:max-h-[30rem] group-hover/footer:opacity-100 group-focus-within/footer:mt-2 group-focus-within/footer:max-h-[30rem] group-focus-within/footer:opacity-100">
        <div className="min-w-[220px] max-w-[280px] rounded-xl border border-white/10 bg-brand-dark/95 backdrop-blur p-3 shadow-2xl">
        <ul className="space-y-2 text-sm">{children}</ul>
        </div>
      </div>
    </div>
  );
}
