import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const NAV = [
  { href: "/admin", label: "Overview", emoji: "📊" },
  { href: "/admin/users", label: "Users", emoji: "👥" },
  { href: "/admin/bookings", label: "Bookings", emoji: "📅" },
  { href: "/admin/fleet", label: "Fleet", emoji: "🚛" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login?redirectTo=/admin");

  // Only admin role can access this panel
  const role = user.user_metadata?.role as string | undefined;
  if (role !== "admin") redirect("/dashboard/customer");

  return (
    <div className="min-h-screen flex bg-brand-light">
      {/* Admin sidebar */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 bg-brand-dark text-white">
        <div className="px-5 py-5 border-b border-white/10 flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/LOGO1.png" alt="FAGU" className="h-8 w-auto brightness-0 invert" />
          <span className="text-xs font-bold text-brand-orange uppercase tracking-widest ml-1">
            Admin
          </span>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/10 transition-all"
            >
              <span>{item.emoji}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Back to site
          </Link>
          <form action="/auth/signout" method="POST">
            <button type="submit" className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white/70 transition-colors">
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-brand-dark text-white px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-brand-orange text-sm uppercase tracking-widest">
          FAGU Admin
        </span>
        <div className="flex gap-4 text-xs text-white/60">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-white">{n.emoji}</Link>
          ))}
        </div>
      </div>

      {/* Main */}
      <main className="flex-1 min-w-0 px-4 py-6 md:px-8 md:py-8 mt-14 md:mt-0">
        {children}
      </main>
    </div>
  );
}
