"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------
   AdminShell — Top-level chrome for /admin/* pages.

   Provides:
   - Sticky header with dynamic page title + breadcrumb
   - Quick access: Dashboard button + alerts badge
   - Gear-icon dropdown menu organized by category, with all
     admin functionalities reachable in two clicks.

   Color palette (Brand Book 2026 — Belisa Design):
   - brand-orange  #EB7231   primary CTA, accents
   - brand-dark    #3E3E3E   primary text / dark surfaces
   - brand-gray    #979797   secondary text
   - brand-light   #E2E2E2   soft backgrounds
   - brand-white   #FFFFFF   surfaces
   ------------------------------------------------------------------ */

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: React.ReactNode;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": { title: "Overview", subtitle: "Platform health at a glance." },
  "/admin/bookings": { title: "Bookings", subtitle: "Manage every reservation across the fleet." },
  "/admin/availability": { title: "Availability", subtitle: "Block dates and resolve scheduling conflicts." },
  "/admin/fleet": { title: "Fleet", subtitle: "Trailer status and operational readiness." },
  "/admin/users": { title: "Users", subtitle: "Approve owners and drivers, manage access." },
  "/admin/payments": { title: "Payments", subtitle: "Stripe transactions and payout health." },
  "/admin/audit": { title: "Audit Log", subtitle: "Trace every administrative action." },
};

/* ---------- Inline icons (no external deps) ---------- */
function Icon({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {children}
    </svg>
  );
}

const IconHome = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5 10v10h14V10" />
  </Icon>
);
const IconBookings = (p: { className?: string }) => (
  <Icon className={p.className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </Icon>
);
const IconCalendar = (p: { className?: string }) => (
  <Icon className={p.className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M7 14h2M11 14h2M15 14h2M7 18h2M11 18h2" />
  </Icon>
);
const IconTruck = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M3 7h11v9H3z" />
    <path d="M14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17" cy="18" r="2" />
  </Icon>
);
const IconUsers = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17" cy="9" r="2.8" />
    <path d="M15 20a5 5 0 0 1 6.5-4.7" />
  </Icon>
);
const IconCard = (p: { className?: string }) => (
  <Icon className={p.className}>
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <path d="M2.5 10h19M6 15h3" />
  </Icon>
);
const IconShield = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M12 3 4 6v6c0 4.5 3.2 8.4 8 9 4.8-.6 8-4.5 8-9V6l-8-3Z" />
    <path d="m9.5 12 2 2 3.5-4" />
  </Icon>
);
const IconGear = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />
  </Icon>
);
const IconChevron = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="m6 9 6 6 6-6" />
  </Icon>
);
const IconLogout = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M14 4h5v16h-5" />
    <path d="M10 8 6 12l4 4" />
    <path d="M6 12h10" />
  </Icon>
);

/* ---------- Menu groups ---------- */
const NAV_GROUPS: NavGroup[] = [
  {
    label: "Operations",
    items: [
      {
        href: "/admin/bookings",
        label: "Bookings",
        description: "Reservations & status",
        icon: <IconBookings className="w-4 h-4" />,
      },
      {
        href: "/admin/availability",
        label: "Availability",
        description: "Calendar & blocks",
        icon: <IconCalendar className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Fleet",
    items: [
      {
        href: "/admin/fleet",
        label: "Fleet Management",
        description: "Trailers & status",
        icon: <IconTruck className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "People",
    items: [
      {
        href: "/admin/users",
        label: "Users",
        description: "Owners, drivers, approvals",
        icon: <IconUsers className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "Finance",
    items: [
      {
        href: "/admin/payments",
        label: "Payments",
        description: "Stripe transactions",
        icon: <IconCard className="w-4 h-4" />,
      },
    ],
  },
  {
    label: "System",
    items: [
      {
        href: "/admin/audit",
        label: "Audit Log",
        description: "Administrative actions",
        icon: <IconShield className="w-4 h-4" />,
      },
    ],
  },
];

export interface AdminShellProps {
  children: React.ReactNode;
  alertCount?: number;
  userEmail?: string;
}

export default function AdminShell({ children, userEmail }: AdminShellProps) {
  const pathname = usePathname() ?? "/admin";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* derive page header info */
  const pageInfo = useMemo(() => {
    const direct = PAGE_TITLES[pathname];
    if (direct) return direct;
    // fallback: nearest match
    const keys = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length);
    const match = keys.find((k) => pathname.startsWith(k));
    return match ? PAGE_TITLES[match] : { title: "Admin", subtitle: "" };
  }, [pathname]);

  const isOnDashboard = pathname === "/admin";

  /* close menu on outside click + ESC */
  useEffect(() => {
    if (!menuOpen) return;
    function onDown(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  /* close menu on route change */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <main className="flex-1 bg-grid-gray pt-40 sm:pt-44 md:pt-48">
      <div className="container-page pb-6 sm:pb-8 md:pb-10">
        {/* ===== Header card ===== */}
        <div className="relative rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-visible">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-5 sm:px-7 py-5">
            {/* Title block */}
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange" />
                Admin Console
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-dark mt-1 truncate">
                {pageInfo.title}
              </h1>
              {pageInfo.subtitle && (
                <p className="text-sm text-brand-gray mt-0.5">{pageInfo.subtitle}</p>
              )}
            </div>

            {/* Quick actions + gear */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Dashboard quick button */}
              <Link
                href="/admin"
                aria-current={isOnDashboard ? "page" : undefined}
                className={[
                  "inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-semibold transition-all duration-200",
                  isOnDashboard
                    ? "bg-brand-dark text-white shadow-sm"
                    : "bg-brand-light/70 text-brand-dark hover:bg-brand-dark hover:text-white",
                ].join(" ")}
              >
                <IconHome className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>

              {/* Gear menu trigger */}
              <div className="relative">
                <button
                  ref={buttonRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Open admin menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  className={[
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all duration-200",
                    menuOpen
                      ? "bg-brand-orange text-white shadow-md"
                      : "bg-brand-dark text-white hover:bg-brand-orange",
                  ].join(" ")}
                >
                  <IconGear
                    className={`w-4 h-4 transition-transform duration-500 ${
                      menuOpen ? "rotate-90" : "rotate-0"
                    }`}
                  />
                  <span className="hidden md:inline">Menu</span>
                  <IconChevron
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown panel */}
                {menuOpen && (
                  <div
                    ref={menuRef}
                    role="menu"
                    aria-label="Admin functionalities"
                    className="absolute right-0 mt-2 w-[min(340px,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/[0.03] z-50 origin-top-right animate-[fadeSlide_140ms_ease-out]"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-brand-light/50 to-white rounded-t-xl">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-gray">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-brand-dark truncate">
                        {userEmail ?? "admin"}
                      </p>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto py-1.5">
                      {NAV_GROUPS.map((group) => (
                        <div key={group.label} className="px-2 pt-2 pb-1">
                          <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">
                            {group.label}
                          </p>
                          <ul className="space-y-0.5">
                            {group.items.map((item) => {
                              const active =
                                pathname === item.href || pathname.startsWith(item.href + "/");
                              return (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    role="menuitem"
                                    className={[
                                      "group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                                      active
                                        ? "bg-brand-orange/10 text-brand-dark"
                                        : "text-brand-dark hover:bg-brand-light/60",
                                    ].join(" ")}
                                  >
                                    <span
                                      className={[
                                        "inline-flex items-center justify-center w-8 h-8 rounded-md shrink-0 transition-colors",
                                        active
                                          ? "bg-brand-orange text-white"
                                          : "bg-brand-light/80 text-brand-dark group-hover:bg-brand-dark group-hover:text-white",
                                      ].join(" ")}
                                    >
                                      {item.icon}
                                    </span>
                                    <span className="flex-1 min-w-0">
                                      <span className="block text-sm font-semibold leading-tight">
                                        {item.label}
                                      </span>
                                      <span className="block text-xs text-brand-gray truncate">
                                        {item.description}
                                      </span>
                                    </span>
                                    {active && (
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange shrink-0">
                                        ●
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 p-2">
                      <Link
                        href="/auth/signout"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm font-semibold text-brand-dark hover:bg-brand-dark hover:text-white transition-colors"
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-brand-light/80 group-hover:bg-brand-dark">
                          <IconLogout className="w-4 h-4" />
                        </span>
                        Sign out
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ===== Page content ===== */}
        <div className="mt-5 rounded-2xl border border-gray-200/80 bg-white shadow-sm p-4 sm:p-6 md:p-8">
          {children}
        </div>
      </div>

      {/* keyframes for dropdown */}
      <style jsx global>{`
        @keyframes fadeSlide {
          from {
            opacity: 0;
            transform: translateY(-4px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </main>
  );
}
