"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

/* ------------------------------------------------------------------
   DashboardShell — Top-level chrome for /dashboard/* pages.

   Mirrors the AdminShell aesthetic so all four panels (admin,
   customer, owner, driver) feel like one product.

   Role determines:
   - Page title catalog
   - Gear-menu nav groups
   - Home/quick-action label
   ------------------------------------------------------------------ */

export type DashboardRole = "customer" | "owner" | "driver";

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

/* ---------- Inline icons ---------- */
function Icon({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
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
const IconPlus = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
const IconUser = (p: { className?: string }) => (
  <Icon className={p.className}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
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
const IconCalendar = (p: { className?: string }) => (
  <Icon className={p.className}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M16 3v4M8 3v4M3 11h18" />
  </Icon>
);
const IconWallet = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M3 7h15a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V7Z" />
    <path d="M3 7V6a2 2 0 0 1 2-2h11" />
    <circle cx="17" cy="13" r="1.2" />
  </Icon>
);
const IconHistory = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M3 12a9 9 0 1 0 3-6.7" />
    <path d="M3 4v5h5" />
    <path d="M12 8v5l3.5 2" />
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
const IconApp = (p: { className?: string }) => (
  <Icon className={p.className}>
    <rect x="7" y="2.5" width="10" height="19" rx="2.2" />
    <path d="M10 5h4" />
    <circle cx="12" cy="18.3" r="0.9" />
  </Icon>
);
const IconLogout = (p: { className?: string }) => (
  <Icon className={p.className}>
    <path d="M14 4h5v16h-5" />
    <path d="M10 8 6 12l4 4" />
    <path d="M6 12h10" />
  </Icon>
);

/* ---------- Per-role configuration ---------- */
const ROLE_CONFIG: Record<
  DashboardRole,
  {
    homeHref: string;
    homeLabel: string;
    eyebrow: string;
    pageTitles: Record<string, { title: string; subtitle: string }>;
    navGroups: NavGroup[];
    notificationHref: string;
  }
> = {
  customer: {
    homeHref: "/dashboard/customer",
    homeLabel: "Dashboard",
    eyebrow: "My Account",
    pageTitles: {
      "/dashboard/customer": {
        title: "My Account",
        subtitle: "Welcome back to your FAGU account.",
      },
      "/dashboard/customer/bookings": {
        title: "My Bookings",
        subtitle: "Every reservation you've made with FAGU.",
      },
      "/dashboard/customer/book": {
        title: "New Booking",
        subtitle: "Pick a trailer, choose a date, and we'll handle the rest.",
      },
      "/dashboard/customer/profile": {
        title: "Profile",
        subtitle: "Personal data and account preferences.",
      },
    },
    navGroups: [
      {
        label: "Activity",
        items: [
          {
            href: "/dashboard/customer/bookings",
            label: "My Bookings",
            description: "Active, upcoming and past",
            icon: <IconBookings className="w-4 h-4" />,
          },
          {
            href: "/dashboard/customer/book",
            label: "New Booking",
            description: "Reserve a trailer",
            icon: <IconPlus className="w-4 h-4" />,
          },
        ],
      },
      {
        label: "Account",
        items: [
          {
            href: "/dashboard/customer/profile",
            label: "Profile",
            description: "Personal information",
            icon: <IconUser className="w-4 h-4" />,
          },
        ],
      },
    ],
    notificationHref: "/dashboard/customer/bookings",
  },
  owner: {
    homeHref: "/dashboard/owner",
    homeLabel: "Dashboard",
    eyebrow: "Owner Console",
    pageTitles: {
      "/dashboard/owner": {
        title: "Owner Dashboard",
        subtitle: "Your fleet performance at a glance.",
      },
      "/dashboard/owner/fleet": {
        title: "My Fleet",
        subtitle: "Manage trailers, status and details.",
      },
      "/dashboard/owner/fleet/new": {
        title: "Add Trailer",
        subtitle: "Register a new trailer to your fleet.",
      },
      "/dashboard/owner/availability": {
        title: "Availability",
        subtitle: "Block dates and plan maintenance.",
      },
      "/dashboard/owner/earnings": {
        title: "Earnings",
        subtitle: "Revenue, payouts and statements.",
      },
      "/dashboard/owner/profile": {
        title: "Profile",
        subtitle: "Owner profile and contact info.",
      },
    },
    navGroups: [
      {
        label: "Fleet",
        items: [
          {
            href: "/dashboard/owner/fleet",
            label: "My Fleet",
            description: "All your trailers",
            icon: <IconTruck className="w-4 h-4" />,
          },
          {
            href: "/dashboard/owner/fleet/new",
            label: "Add Trailer",
            description: "Register a new unit",
            icon: <IconPlus className="w-4 h-4" />,
          },
          {
            href: "/dashboard/owner/availability",
            label: "Availability",
            description: "Calendar & blocks",
            icon: <IconCalendar className="w-4 h-4" />,
          },
        ],
      },
      {
        label: "Finance",
        items: [
          {
            href: "/dashboard/owner/earnings",
            label: "Earnings",
            description: "Revenue and payouts",
            icon: <IconWallet className="w-4 h-4" />,
          },
        ],
      },
      {
        label: "Account",
        items: [
          {
            href: "/dashboard/owner/profile",
            label: "Profile",
            description: "Owner information",
            icon: <IconUser className="w-4 h-4" />,
          },
        ],
      },
    ],
    notificationHref: "/dashboard/owner/availability",
  },
  driver: {
    homeHref: "/dashboard/driver",
    homeLabel: "Dashboard",
    eyebrow: "Driver App",
    pageTitles: {
      "/dashboard/driver": {
        title: "Today's Schedule",
        subtitle:
          "Assigned tasks for today. Review open deliveries on the map and accept your next run.",
      },
      "/dashboard/driver/history": {
        title: "History",
        subtitle: "All deliveries you have completed.",
      },
      "/dashboard/driver/earnings": {
        title: "Earnings",
        subtitle: "Track your daily, weekly, and monthly earnings.",
      },
      "/dashboard/driver/profile": {
        title: "Profile",
        subtitle: "Driver information and documents.",
      },
    },
    navGroups: [
      {
        label: "Work",
        items: [
          {
            href: "/dashboard/driver/history",
            label: "History",
            description: "Past deliveries",
            icon: <IconHistory className="w-4 h-4" />,
          },
        ],
      },
      {
        label: "Finance",
        items: [
          {
            href: "/dashboard/driver/earnings",
            label: "Earnings",
            description: "Pay statements",
            icon: <IconWallet className="w-4 h-4" />,
          },
        ],
      },
      {
        label: "Account",
        items: [
          {
            href: "/dashboard/driver/profile",
            label: "Profile",
            description: "Driver information",
            icon: <IconUser className="w-4 h-4" />,
          },
        ],
      },
    ],
    notificationHref: "/dashboard/driver",
  },
};

export interface DashboardShellProps {
  role: DashboardRole;
  children: React.ReactNode;
  alertCount?: number;
  userEmail?: string;
  userName?: string;
}

export default function DashboardShell({
  role,
  children,
  userEmail,
  userName,
}: DashboardShellProps) {
  const pathname = usePathname() ?? "";
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const cfg = ROLE_CONFIG[role];
  const isProfilePage = pathname.endsWith("/profile");
  const isDriverHome = role === "driver" && pathname === "/dashboard/driver";

  /* derive title */
  const pageInfo = useMemo(() => {
    const direct = cfg.pageTitles[pathname];
    if (direct) {
      if (role === "driver" && pathname === "/dashboard/driver") {
        return {
          title: "",
          subtitle: "Below are the deliveries available for today.",
        };
      }
      return direct;
    }
    const keys = Object.keys(cfg.pageTitles).sort((a, b) => b.length - a.length);
    const match = keys.find((k) => pathname.startsWith(k));
    return match ? cfg.pageTitles[match] : { title: "Dashboard", subtitle: "" };
  }, [cfg, pathname, role, userName]);

  const isOnHome = pathname === cfg.homeHref;

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <main className="flex-1 bg-grid-gray pt-40 sm:pt-44 md:pt-48">
      <div className="container-page pb-6 sm:pb-8 md:pb-10">
        {/* ===== Header card ===== */}
        <div className="relative z-[1200] rounded-2xl border border-gray-200/80 bg-white shadow-sm overflow-visible">
          <div
            className={[
              "gap-4 px-5 sm:px-7 py-5",
              isDriverHome
                ? "grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] items-center"
                : "flex flex-col sm:flex-row sm:items-center justify-between",
            ].join(" ")}
          >
            {isDriverHome && <div className="hidden sm:block" />}
            <div className="min-w-0">
              {isDriverHome ? (
                <div className="flex flex-col items-center text-center gap-y-1.5">
                  <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    {cfg.eyebrow}
                  </div>
                  {pageInfo.title && (
                    <h1 className="font-display text-xl sm:text-2xl font-bold text-brand-dark leading-tight">
                      {pageInfo.title}
                    </h1>
                  )}
                  {pageInfo.subtitle && (
                    <p className="text-sm text-brand-gray leading-relaxed">
                      {pageInfo.subtitle}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-orange">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-orange" />
                    {cfg.eyebrow}
                  </div>
                  <h1
                    className={[
                      "font-display text-2xl sm:text-3xl font-bold text-brand-dark mt-1",
                      role === "driver" ? "leading-tight" : "truncate",
                    ].join(" ")}
                  >
                    {pageInfo.title}
                  </h1>
                  {pageInfo.subtitle && (
                    <p
                      className={[
                        "text-sm text-brand-gray mt-0.5",
                        role === "driver" ? "max-w-2xl leading-relaxed" : "",
                      ].join(" ")}
                    >
                      {pageInfo.subtitle}
                    </p>
                  )}
                </>
              )}
            </div>

            <div className={["flex items-center gap-2 shrink-0", isDriverHome ? "justify-end" : ""].join(" ")}>
              <Link
                href="/"
                aria-label="Open app"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold bg-brand-light/70 text-brand-dark hover:bg-brand-dark hover:text-white transition-all duration-200"
              >
                <IconApp className="w-4 h-4" />
                <span className="hidden md:inline">App PWA</span>
              </Link>

              {/* Gear menu */}
              <div className="relative">
                <button
                  ref={buttonRef}
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Open menu"
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

                {menuOpen && (
                  <div
                    ref={menuRef}
                    role="menu"
                    aria-label="Dashboard functionalities"
                    className="absolute right-0 mt-2 w-[min(340px,calc(100vw-2rem))] rounded-xl border border-gray-200 bg-white shadow-2xl ring-1 ring-black/[0.03] z-[1300] origin-top-right animate-[fadeSlide_140ms_ease-out]"
                  >
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-br from-brand-light/50 to-white rounded-t-xl">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-gray">
                        Signed in as
                      </p>
                      <p className="text-sm font-semibold text-brand-dark truncate">
                        {userEmail ?? role}
                      </p>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto py-1.5">
                      {/* Always include Dashboard at top */}
                      <div className="px-2 pt-2 pb-1">
                        <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">
                          Overview
                        </p>
                        <ul className="space-y-0.5">
                          <li>
                            <Link
                              href={cfg.homeHref}
                              role="menuitem"
                              className={[
                                "group flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors",
                                isOnHome
                                  ? "bg-brand-orange/10 text-brand-dark"
                                  : "text-brand-dark hover:bg-brand-light/60",
                              ].join(" ")}
                            >
                              <span
                                className={[
                                  "inline-flex items-center justify-center w-8 h-8 rounded-md shrink-0 transition-colors",
                                  isOnHome
                                    ? "bg-brand-orange text-white"
                                    : "bg-brand-light/80 text-brand-dark group-hover:bg-brand-dark group-hover:text-white",
                                ].join(" ")}
                              >
                                <IconHome className="w-4 h-4" />
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block text-sm font-semibold leading-tight">
                                  {cfg.homeLabel}
                                </span>
                                <span className="block text-xs text-brand-gray truncate">
                                  Main view
                                </span>
                              </span>
                              {isOnHome && (
                                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange shrink-0">
                                  ●
                                </span>
                              )}
                            </Link>
                          </li>
                        </ul>
                      </div>

                      {cfg.navGroups.map((group) => (
                        <div key={group.label} className="px-2 pt-2 pb-1">
                          <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-gray">
                            {group.label}
                          </p>
                          <ul className="space-y-0.5">
                            {group.items.map((item) => {
                              const active =
                                pathname === item.href ||
                                pathname.startsWith(item.href + "/");
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
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-brand-light/80">
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

        <div
          className={[
            "mt-5 rounded-2xl border border-gray-200/80 bg-white shadow-sm p-4 sm:p-6 md:p-8",
            isProfilePage ? "mx-auto w-full max-w-2xl" : "",
          ].join(" ")}
        >
          {children}
        </div>
      </div>

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
