import { API_CONFIG } from "@/config/api";

export const metadata = {
  title: "Contact — FAGU Home Services",
  description: "Get in touch with FAGU Home Services for dump trailer rental inquiries.",
};

export default function ContactPage() {
  const { phone, email, hours } = API_CONFIG.contact;
  const phoneHref = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <main className="flex-1 pt-32 sm:pt-36 md:pt-40">
      <section className="py-16 sm:py-20 md:py-28 bg-white">
        <div className="container-page max-w-2xl">
          <span className="section-eyebrow">Contact Us</span>
          <h1 className="section-title text-brand-dark">
            Get in <span className="text-brand-orange">touch.</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg">
            Have questions about booking, pricing, or availability? We&apos;re here to help.
          </p>

          <div className="mt-8 space-y-4">
            <ContactCard icon="phone" label="Phone" value={phone} href={phoneHref} />
            <ContactCard icon="email" label="Email" value={email} href={`mailto:${email}`} />
            <ContactCard icon="clock" label="Support Hours" value={hours} />
          </div>
        </div>
      </section>
    </main>
  );
}

function ContactCard({
  icon, label, value, href,
}: {
  icon: string; label: string; value: string; href?: string;
}) {
  const content = (
    <div className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-5 hover:border-brand-yellow hover:shadow-md transition-all">
      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-brand-dark text-brand-yellow">
        <ContactIcon name={icon} />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wider text-gray-500">{label}</p>
        <p className="font-bold text-brand-dark text-lg">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href}>{content}</a> : content;
}

function ContactIcon({ name }: { name: string }) {
  const p = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "phone": return <svg {...p}><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 .84h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" /></svg>;
    case "email": return <svg {...p}><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>;
    case "clock": return <svg {...p}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
    default: return null;
  }
}
