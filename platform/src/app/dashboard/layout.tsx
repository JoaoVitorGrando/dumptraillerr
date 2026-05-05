import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type UserRole = "customer" | "owner" | "driver" | "admin";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(role: UserRole): NavItem[] {
  const icons = {
    home: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    calendar: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    truck: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" /><polygon points="16 8 20 8 23 11 23 16 16 16 16 8" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
    dollar: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    map: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" /><line x1="9" y1="3" x2="9" y2="18" /><line x1="15" y1="6" x2="15" y2="21" />
      </svg>
    ),
    user: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    ),
    settings: (
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  };

  const base = "/dashboard";

  switch (role) {
    case "customer":
      return [
        { href: `${base}/customer`, label: "Overview", icon: icons.home },
        { href: `${base}/customer/bookings`, label: "My Bookings", icon: icons.calendar },
        { href: `${base}/customer/book`, label: "New Booking", icon: icons.truck },
        { href: `${base}/customer/profile`, label: "Profile", icon: icons.user },
      ];
    case "owner":
      return [
        { href: `${base}/owner`, label: "Overview", icon: icons.home },
        { href: `${base}/owner/fleet`, label: "My Fleet", icon: icons.truck },
        { href: `${base}/owner/availability`, label: "Availability", icon: icons.calendar },
        { href: `${base}/owner/earnings`, label: "Earnings", icon: icons.dollar },
        { href: `${base}/owner/profile`, label: "Profile", icon: icons.user },
      ];
    case "driver":
      return [
        { href: `${base}/driver`, label: "Today's Jobs", icon: icons.home },
        { href: `${base}/driver/route`, label: "Route", icon: icons.map },
        { href: `${base}/driver/history`, label: "History", icon: icons.calendar },
        { href: `${base}/driver/earnings`, label: "Earnings", icon: icons.dollar },
        { href: `${base}/driver/profile`, label: "Profile", icon: icons.user },
      ];
    case "admin":
      return [
        { href: "/admin", label: "Dashboard", icon: icons.home },
        { href: "/admin/users", label: "Users", icon: icons.user },
        { href: "/admin/bookings", label: "Bookings", icon: icons.calendar },
        { href: "/admin/fleet", label: "Fleet", icon: icons.truck },
        { href: "/admin/settings", label: "Settings", icon: icons.settings },
      ];
  }
}

const ROLE_LABELS: Record<UserRole, string> = {
  customer: "Customer",
  owner: "Trailer Owner",
  driver: "Driver",
  admin: "Admin",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Middleware should have caught this, but double-check
  if (!user) redirect("/auth/login?redirectTo=/dashboard/customer");

  const role = (user.user_metadata?.role as UserRole | undefined) ?? "customer";
  const navItems = getNavItems(role);
  const displayName =
    user.user_metadata?.full_name ?? user.email?.split("@")[0] ?? "User";

  return (
    <div className="min-h-screen flex bg-brand-light">
      {/* ── Sidebar ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 bg-brand-dark text-white">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/LOGO1.png"
              alt="FAGU"
              className="h-8 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-orange flex items-center justify-center text-white font-bold text-sm shrink-0">
              {displayName[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{displayName}</p>
              <p className="text-xs text-white/50">{ROLE_LABELS[role]}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all group"
            >
              <span className="text-white/50 group-hover:text-brand-orange transition-colors">
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div className="px-3 py-4 border-t border-white/10">
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Mobile header ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-brand-dark text-white px-4 py-3 flex items-center justify-between">
        <Link href="/">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/LOGO1.png" alt="FAGU" className="h-7 w-auto brightness-0 invert" />
        </Link>
        <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
          {ROLE_LABELS[role]}
        </span>
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 flex flex-col min-w-0 pt-0 md:pt-0">
        <div className="flex-1 px-4 py-6 md:px-8 md:py-8 mt-14 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
