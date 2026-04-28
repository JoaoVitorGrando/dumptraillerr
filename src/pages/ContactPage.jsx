import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { submitLead } from "../services/leads";
import { API_CONFIG, isDemoMode } from "../config/api";

/* -------------------------------------------------------------------------- */
/* Contact page                                                               */
/* -------------------------------------------------------------------------- */
/* Lightweight contact form that uses the same submitLead pipeline so any    */
/* general inquiry also lands in GoHighLevel via VITE_GHL_CONTACT_WEBHOOK.   */
/* -------------------------------------------------------------------------- */

const INITIAL = {
  fullName: "",
  email: "",
  phone: "",
  topic: "general",
  message: "",
};

export default function ContactPage() {
  const [data, setData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, []);

  const update = (k) => (e) => {
    const value = e?.target?.value ?? "";
    setData((d) => ({ ...d, [k]: value }));
    setErrors((errs) => {
      if (!errs[k]) return errs;
      const next = { ...errs };
      delete next[k];
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!data.fullName.trim()) errs.fullName = "Required";
    if (!data.email.trim()) errs.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
      errs.email = "Enter a valid email";
    if (!data.message.trim()) errs.message = "Tell us how we can help";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setSubmitting(true);
    await submitLead("contact", data);
    setSubmitting(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-light">
      <Header />

      <main className="flex-1 pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-28">
        <div className="container-page">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
            <Link to="/" className="hover:text-brand-orange">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-brand-dark">Contact</span>
          </nav>

          <div className="mt-6 grid lg:grid-cols-[1fr,1.2fr] gap-8 lg:gap-12 items-start">
            <div>
              <span className="section-eyebrow">Talk to FAGU</span>
              <h1 className="section-title text-brand-dark">
                Questions, partnerships{" "}
                <span className="text-brand-orange">or anything else.</span>
              </h1>
              <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
                Pick a channel below — or send us a message and we'll get back
                to you within 1 business day.
              </p>

              <ul className="mt-6 space-y-3 text-sm sm:text-base">
                <li className="flex items-start gap-3">
                  <Pill>Phone</Pill>
                  <a
                    href={`tel:${API_CONFIG.contact.phone.replace(/\s+/g, "")}`}
                    className="font-semibold text-brand-dark hover:text-brand-orange"
                  >
                    {API_CONFIG.contact.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Pill>Email</Pill>
                  <a
                    href={`mailto:${API_CONFIG.contact.email}`}
                    className="font-semibold text-brand-dark hover:text-brand-orange break-all"
                  >
                    {API_CONFIG.contact.email}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Pill>Hours</Pill>
                  <span className="text-gray-700">
                    {API_CONFIG.contact.hours}
                  </span>
                </li>
              </ul>

              <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
                <p className="font-display text-lg font-extrabold text-brand-dark">
                  Looking for a specific flow?
                </p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link
                      to="/services/dump-trailer#booking"
                      className="text-brand-yellow hover:text-brand-orange font-semibold"
                    >
                      → Reserve a dump trailer
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/partner/owner"
                      className="text-brand-yellow hover:text-brand-orange font-semibold"
                    >
                      → I have trailers (owner signup)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/partner/customer"
                      className="text-brand-yellow hover:text-brand-orange font-semibold"
                    >
                      → I need trailers (customer account)
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/partner/driver"
                      className="text-brand-yellow hover:text-brand-orange font-semibold"
                    >
                      → I want to drive (driver application)
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6 md:p-8">
              {submitted ? (
                <div className="text-center py-6">
                  <div className="mx-auto grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full bg-green-100 text-green-700">
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <h3 className="mt-4 sm:mt-5 font-display text-2xl sm:text-3xl font-extrabold text-brand-dark">
                    Message received!
                  </h3>
                  <p className="mt-2 text-gray-600 max-w-md mx-auto text-sm sm:text-base">
                    Thanks for reaching out. The FAGU team will get back to you
                    within 1 business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setData(INITIAL);
                      setSubmitted(false);
                    }}
                    className="btn-secondary mt-6"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-brand-dark">
                    Send us a message
                  </h3>
                  <p className="mt-1 text-gray-600 text-sm sm:text-base">
                    We answer every inbound — no bots.
                  </p>

                  <div className="mt-6 space-y-4">
                    <Field
                      label="Full Name"
                      name="fullName"
                      required
                      value={data.fullName}
                      onChange={update("fullName")}
                      error={errors.fullName}
                    />
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field
                        label="Email"
                        type="email"
                        name="email"
                        required
                        value={data.email}
                        onChange={update("email")}
                        error={errors.email}
                      />
                      <Field
                        label="Phone (optional)"
                        type="tel"
                        name="phone"
                        value={data.phone}
                        onChange={update("phone")}
                      />
                    </div>
                    <label className="block min-w-0">
                      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Topic
                      </span>
                      <select
                        name="topic"
                        value={data.topic}
                        onChange={update("topic")}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3.5 py-3 text-base outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20"
                      >
                        <option value="general">General question</option>
                        <option value="booking">Booking / availability</option>
                        <option value="partnership">
                          Partnership / fleet integration
                        </option>
                        <option value="press">Press / media</option>
                      </select>
                    </label>
                    <label className="block min-w-0">
                      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
                        Message <span className="text-brand-orange">*</span>
                      </span>
                      <textarea
                        name="message"
                        rows={4}
                        value={data.message}
                        onChange={update("message")}
                        placeholder="How can we help?"
                        className={`w-full rounded-lg border bg-white px-3.5 py-3 text-base outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 ${
                          errors.message ? "border-red-400" : "border-gray-300"
                        }`}
                      />
                      {errors.message && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.message}
                        </p>
                      )}
                    </label>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-xs text-gray-500">
                      By submitting you agree to be contacted by FAGU.
                      {isDemoMode && (
                        <span className="block mt-0.5 text-amber-600">
                          Demo mode — connect a contact webhook in{" "}
                          <code>.env</code>.
                        </span>
                      )}
                    </p>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {submitting ? "Sending…" : "Send Message"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Pill({ children }) {
  return (
    <span className="inline-block rounded-full bg-brand-yellow/15 text-brand-orange text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5">
      {children}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required,
  ...rest
}) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg border bg-white px-3.5 py-3 text-base outline-none focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}
