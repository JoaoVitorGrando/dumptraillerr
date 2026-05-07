import Link from "next/link";

export const metadata = {
  title: "Account — FAGU Home Services",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen overflow-hidden bg-grid-dark text-white flex flex-col">
      {/* Minimal top bar */}
      <header className="py-4 px-6 flex items-center justify-between shrink-0 border-b border-white/10">
        <Link href="/" className="inline-flex items-center gap-2 group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/LOGO1.png"
            alt="FAGU Home Services"
            className="h-9 w-auto object-contain"
          />
        </Link>
        <Link
          href="/"
          className="text-sm font-medium text-white/70 hover:text-brand-yellow transition-colors"
        >
          ← Back to site
        </Link>
      </header>

      {/* Centered card area */}
      <main className="flex-1 min-h-0 flex items-center justify-center px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-3 text-center text-xs text-white/45 shrink-0 border-t border-white/10">
        © {new Date().getFullYear()} FAGU Home Services · Seattle, WA
      </footer>
    </div>
  );
}
