import Link from "next/link";

export const metadata = {
  title: "Account — FAGU Home Services",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      {/* Minimal top bar */}
      <header className="py-4 px-6 flex items-center justify-between">
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
          className="text-sm font-medium text-brand-gray hover:text-brand-dark transition-colors"
        >
          ← Back to site
        </Link>
      </header>

      {/* Centered card area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-brand-gray">
        © {new Date().getFullYear()} FAGU Home Services · Seattle, WA
      </footer>
    </div>
  );
}
