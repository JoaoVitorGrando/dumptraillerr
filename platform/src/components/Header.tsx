"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FaguBadge from "@/components/FaguBadge";
import { PUBLIC_SERVICES } from "@/data/services";
import { createClient } from "@/lib/supabase/client";

const isSingleService = PUBLIC_SERVICES.length === 1;
const RESERVE_HREF = "/services/dump-trailer#booking";

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/partner", label: "Partner" },
  { to: "/faq", label: "FAQ" },
];

type UserRole = "customer" | "owner" | "driver" | "admin";

function normalizeRole(value: unknown): UserRole {
  const role = String(value ?? "").toLowerCase();
  if (role === "owner" || role === "driver" || role === "admin") return role;
  return "customer";
}

function getRoleHome(role: UserRole) {
  if (role === "admin") return "/admin";
  return `/dashboard/${role}`;
}

function getProfileLinks(role: UserRole) {
  if (role === "owner") {
    return [
      { href: "/dashboard/owner", label: "Dashboard" },
      { href: "/dashboard/owner/fleet", label: "My Fleet" },
      { href: "/dashboard/owner/earnings", label: "Earnings" },
      { href: "/dashboard/owner/profile", label: "Profile" },
    ];
  }
  if (role === "driver") {
    return [
      { href: "/dashboard/driver", label: "Dashboard" },
      { href: "/dashboard/driver", label: "Today's Jobs" },
      { href: "/dashboard/driver/earnings", label: "Earnings" },
      { href: "/dashboard/driver/profile", label: "Profile" },
    ];
  }
  if (role === "admin") {
    return [{ href: "/admin", label: "Admin Panel" }];
  }
  return [
    { href: "/dashboard/customer", label: "Dashboard" },
    { href: "/dashboard/customer/bookings", label: "My Bookings" },
    { href: "/dashboard/customer/profile", label: "Profile" },
  ];
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginHref, setLoginHref] = useState("/auth/login");
  const [userRole, setUserRole] = useState<UserRole>("customer");
  const [displayName, setDisplayName] = useState("User");
  const pathname = usePathname();
  const profileLinks = useMemo(() => getProfileLinks(userRole), [userRole]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setServicesOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  useEffect(() => {
    let mounted = true;

    try {
      const supabase = createClient();
      setLoginHref(`/auth/login?redirectTo=${encodeURIComponent(window.location.pathname + window.location.search)}`);

      const applyUser = (user: { email?: string | null; user_metadata?: Record<string, unknown> } | null) => {
        if (!mounted) return;
        const authenticated = Boolean(user);
        setIsAuthenticated(authenticated);
        if (authenticated && user) {
          setUserRole(normalizeRole(user.user_metadata?.role));
          const fullName = String(user.user_metadata?.full_name ?? "").trim();
          setDisplayName(fullName || String(user.email ?? "User").split("@")[0] || "User");
        } else {
          setUserRole("customer");
          setDisplayName("User");
        }
        setAuthChecked(true);
      };

      supabase.auth.getUser().then(({ data }) => {
        if (!mounted) return;
        applyUser(data.user ?? null);
      });

      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        if (!mounted) return;
        applyUser(session?.user ?? null);
      });

      return () => {
        mounted = false;
        listener.subscription.unsubscribe();
      };
    } catch {
      if (mounted) {
        setIsAuthenticated(false);
        setAuthChecked(true);
      }
    }

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      {/* Promo bar */}
      <div
        className={`promo-bar-attention overflow-hidden bg-brand-yellow text-white transition-[max-height,opacity] duration-300 ${
          scrolled ? "max-h-0 opacity-0" : "max-h-14 opacity-100"
        }`}
        role="region"
        aria-label="Promotional offer"
      >
        <div className="container-page flex items-center justify-center gap-2 sm:gap-3 py-2 sm:py-2.5 text-center">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-brand-dark text-brand-yellow text-xs font-bold uppercase px-2.5 py-1 tracking-widest">
            Limited Offer
          </span>
          <p className="promo-copy-attention text-xs sm:text-base font-semibold leading-tight">
            <span className="font-extrabold uppercase">Save 50%</span> on your second dump trailer for the same job site.{" "}
            <Link href="/services/dump-trailer#booking" className="underline underline-offset-2 hover:no-underline font-bold whitespace-nowrap">
              See terms
            </Link>
          </p>
        </div>
      </div>

      {/* Main nav */}
      <div className={`bg-brand-dark/75 backdrop-blur-md transition-all duration-300 ${scrolled ? "shadow-lg bg-brand-dark/80" : ""}`}>
        <div className="container-page flex h-28 md:h-32 items-center justify-between gap-3">
          <Link href="/" className="flex items-center text-white min-w-0 flex-1" aria-label="FAGU Home Services — Home">
            <FaguBadge size="xl" bare className="!h-24 !w-24 sm:!h-32 sm:!w-32 md:!h-36 md:!w-36" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            <Link href="/" className="text-white/90 hover:text-brand-yellow text-lg xl:text-xl font-semibold transition-colors">
              Home
            </Link>

            {isSingleService ? (
              <Link href={`/services/${PUBLIC_SERVICES[0].slug}`} className="text-white/90 hover:text-brand-yellow text-lg xl:text-xl font-semibold transition-colors">
                Dump Trailers
              </Link>
            ) : (
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
                  className="text-white/90 hover:text-brand-yellow text-lg xl:text-xl font-semibold transition-colors inline-flex items-center gap-1"
                >
                  Services
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
                    className={`transition-transform ${servicesOpen ? "rotate-180" : ""}`}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                {servicesOpen && (
                  <div role="menu" className="absolute top-full left-0 pt-3 min-w-[260px]">
                    <div className="rounded-xl border border-white/10 bg-brand-dark/95 backdrop-blur shadow-2xl overflow-hidden">
                      {PUBLIC_SERVICES.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/services/${s.slug}`}
                          role="menuitem"
                          className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-white/90 hover:bg-white/5 hover:text-brand-yellow border-b border-white/5 last:border-b-0"
                        >
                          <span className="font-semibold">{s.name}</span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider ${s.available ? "text-brand-yellow" : "text-white/40"}`}>
                            {s.available ? "Live" : "Soon"}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
              <Link key={l.to} href={l.to} className="text-white/90 hover:text-brand-yellow text-lg xl:text-xl font-semibold transition-colors">
                {l.label}
              </Link>
            ))}

            <Link href={RESERVE_HREF} className="btn-primary !py-3 !px-6 !text-sm xl:!text-base">
              Reserve a Trailer
            </Link>
            {authChecked && !isAuthenticated && (
              <Link href={loginHref} className="btn-outline-light !py-3 !px-6 !text-sm xl:!text-base">
                Login
              </Link>
            )}
            {authChecked && isAuthenticated && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="menu"
                  aria-expanded={profileOpen}
                  className="inline-flex items-center gap-2 rounded-md border border-white/25 px-3 py-2 text-sm font-semibold text-white hover:border-brand-yellow hover:text-brand-yellow transition-colors"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-orange text-white text-xs font-bold">
                    {displayName[0]?.toUpperCase() ?? "U"}
                  </span>
                  Profile
                </button>

                {profileOpen && (
                  <div role="menu" className="absolute right-0 top-full pt-3 min-w-[220px] z-30">
                    <div className="rounded-xl border border-white/10 bg-brand-dark/95 backdrop-blur shadow-2xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-xs text-white/50 uppercase tracking-wider">{userRole}</p>
                        <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                      </div>

                      {profileLinks.map((item) => (
                        <Link
                          key={item.href + item.label}
                          href={item.href}
                          role="menuitem"
                          className="block px-4 py-3 text-sm text-white/90 hover:bg-white/5 hover:text-brand-yellow border-b border-white/5 last:border-b-0"
                          onClick={() => setProfileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}

                      <form action="/auth/signout" method="POST">
                        <button
                          type="submit"
                          className="w-full text-left px-4 py-3 text-sm text-white/70 hover:bg-white/5 hover:text-brand-yellow"
                        >
                          Sign out
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-white hover:bg-white/10 active:bg-white/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
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
      <div className={`lg:hidden overflow-hidden bg-brand-dark border-t border-white/10 transition-[max-height] duration-300 ${open ? "max-h-[44rem]" : "max-h-0"}`}>
        <nav className="container-page flex flex-col py-3">
          <Link href="/" className="py-3.5 text-white/90 border-b border-white/5 hover:text-brand-yellow text-lg font-semibold">
            Home
          </Link>

          {isSingleService ? (
            <Link href={`/services/${PUBLIC_SERVICES[0].slug}`} className="py-3.5 text-white/90 border-b border-white/5 hover:text-brand-yellow text-lg font-semibold">
              Dump Trailers
            </Link>
          ) : (
            <div className="py-3 border-b border-white/5">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-semibold mb-2">Services</p>
              <ul className="grid grid-cols-1 gap-1">
                {PUBLIC_SERVICES.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="flex items-center justify-between rounded-md px-2 py-2.5 text-base text-white/85 hover:bg-white/5 hover:text-brand-yellow">
                      <span>{s.name}</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${s.available ? "text-brand-yellow" : "text-white/40"}`}>
                        {s.available ? "Live" : "Soon"}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {NAV_LINKS.filter((l) => l.to !== "/").map((l) => (
            <Link key={l.to} href={l.to} className="py-3.5 text-white/90 border-b border-white/5 hover:text-brand-yellow text-lg">
              {l.label}
            </Link>
          ))}

          <Link href={RESERVE_HREF} onClick={() => setOpen(false)} className="btn-primary mt-3 w-full">
            Reserve a Trailer
          </Link>
          {authChecked && !isAuthenticated && (
            <Link href={loginHref} onClick={() => setOpen(false)} className="btn-outline-light mt-2 w-full">
              Login
            </Link>
          )}
          {authChecked && isAuthenticated && (
            <div className="mt-3 rounded-lg border border-white/10 p-3">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/45 font-semibold mb-2">
                Profile
              </p>
              <div className="space-y-1">
                {profileLinks.map((item) => (
                  <Link
                    key={item.href + item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-md px-2 py-2.5 text-base text-white/85 hover:bg-white/5 hover:text-brand-yellow"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              <form action="/auth/signout" method="POST" className="mt-2">
                <button
                  type="submit"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-md border border-white/20 px-2 py-2.5 text-base text-white/85 hover:text-brand-yellow hover:border-brand-yellow transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
