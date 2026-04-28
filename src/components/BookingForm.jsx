import { useEffect, useMemo, useState } from "react";
import { TRAILERS } from "../data/trailers";
import { submitLead } from "../services/leads";
import { isDemoMode } from "../config/api";
import FaguBadge from "./FaguBadge";

/* -------------------------------------------------------------------------- */
/* Booking form                                                               */
/* -------------------------------------------------------------------------- */
/* Collects customer + rental info, validates required fields, builds an      */
/* automatic price summary and simulates submission with a success message.   */
/* -------------------------------------------------------------------------- */

const INITIAL = {
  fullName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  zip: "",
  trailerType: "7x14x4",
  serviceDate: "",
  deliveryWindow: "afternoon",
  loads: "1",
  customLoads: "",
  materialType: "construction-debris",
  notes: "",
};

const REQUIRED_FIELDS = [
  "fullName",
  "phone",
  "email",
  "address",
  "city",
  "zip",
  "trailerType",
  "serviceDate",
  "deliveryWindow",
  "loads",
  "materialType",
];

const MATERIALS = [
  { value: "construction-debris", label: "Construction Debris" },
  { value: "yard-waste", label: "Yard Waste / Brush" },
  { value: "furniture", label: "Furniture" },
  { value: "renovation-debris", label: "Renovation Debris" },
  { value: "cleanout", label: "Property Cleanout" },
  { value: "other", label: "Other" },
];

const LOADS_OPTIONS = ["1", "2", "4", "10", "custom"];

export default function BookingForm() {
  const [data, setData] = useState(INITIAL);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Listen for trailer selection events fired from TrailerCard
  useEffect(() => {
    const handler = (e) => {
      const id = e.detail?.id;
      if (id) setData((d) => ({ ...d, trailerType: id }));
    };
    window.addEventListener("trailer:select", handler);
    return () => window.removeEventListener("trailer:select", handler);
  }, []);

  const selectedTrailer = useMemo(
    () => TRAILERS.find((t) => t.id === data.trailerType) ?? TRAILERS[0],
    [data.trailerType]
  );

  const update = (field) => (e) => {
    const value = e?.target?.value ?? "";
    setData((d) => ({ ...d, [field]: value }));
    setErrors((errs) => {
      if (!errs[field]) return errs;
      const next = { ...errs };
      delete next[field];
      return next;
    });
  };

  // Lightweight validation: required + email + phone + zip patterns
  const validate = (values) => {
    const errs = {};
    REQUIRED_FIELDS.forEach((f) => {
      if (!String(values[f] || "").trim()) errs[f] = "Required";
    });
    if (values.loads === "custom" && !String(values.customLoads).trim()) {
      errs.customLoads = "Tell us how many loads you need";
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (values.phone && values.phone.replace(/\D/g, "").length < 7) {
      errs.phone = "Please enter a valid phone number";
    }
    if (values.zip && !/^\d{4,10}$/.test(values.zip.replace(/\D/g, ""))) {
      errs.zip = "Please enter a valid ZIP code";
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(data);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      const firstEl = document.querySelector(`[name="${firstKey}"]`);
      if (firstEl?.focus) firstEl.focus();
      return;
    }
    setSubmitting(true);
    await submitLead("booking", {
      ...data,
      trailerName: selectedTrailer?.name,
      trailerPrice: selectedTrailer?.price,
    });
    setSubmitting(false);
    setSubmitted(true);
    window.scrollTo({ top: window.scrollY, behavior: "smooth" });
  };

  const resetForm = () => {
    setData(INITIAL);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <section id="booking" className="py-16 sm:py-20 md:py-28 bg-brand-light">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="section-eyebrow">Book Online</span>
          <h2 className="section-title text-brand-dark">
            Reserve your trailer{" "}
            <span className="text-brand-orange">in minutes.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
            Fill out the form below and we'll confirm availability and payment
            details by phone or email.
          </p>
        </div>

        <div className="mt-10 sm:mt-12 grid lg:grid-cols-[1fr,380px] gap-6 lg:gap-8">
          {/* Form card */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6 md:p-10 order-2 lg:order-1">
            {submitted ? (
              <SuccessState onReset={resetForm} data={data} />
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <FieldGroup title="Customer Information">
                  <Field
                    label="Full Name"
                    name="fullName"
                    value={data.fullName}
                    onChange={update("fullName")}
                    error={errors.fullName}
                    placeholder="John Smith"
                    autoComplete="name"
                  />
                  <Field
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={data.phone}
                    onChange={update("phone")}
                    error={errors.phone}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                  />
                  <Field
                    label="Email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={update("email")}
                    error={errors.email}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="sm:col-span-2"
                  />
                  <Field
                    label="Job Site Address"
                    name="address"
                    value={data.address}
                    onChange={update("address")}
                    error={errors.address}
                    placeholder="1234 Main Street"
                    autoComplete="street-address"
                    className="sm:col-span-2"
                  />
                  <Field
                    label="City"
                    name="city"
                    value={data.city}
                    onChange={update("city")}
                    error={errors.city}
                    placeholder="Dallas"
                    autoComplete="address-level2"
                  />
                  <Field
                    label="ZIP Code"
                    name="zip"
                    value={data.zip}
                    onChange={update("zip")}
                    error={errors.zip}
                    placeholder="75201"
                    autoComplete="postal-code"
                    inputMode="numeric"
                  />
                </FieldGroup>

                <FieldGroup title="Rental Details">
                  <SelectField
                    label="Trailer Type"
                    name="trailerType"
                    value={data.trailerType}
                    onChange={update("trailerType")}
                    error={errors.trailerType}
                    options={TRAILERS.map((t) => ({
                      value: t.id,
                      label: `${t.name} (${t.length})`,
                    }))}
                  />
                  <Field
                    label="Service Date"
                    name="serviceDate"
                    type="date"
                    value={data.serviceDate}
                    onChange={update("serviceDate")}
                    error={errors.serviceDate}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  <SelectField
                    label="Preferred Delivery Window"
                    name="deliveryWindow"
                    value={data.deliveryWindow}
                    onChange={update("deliveryWindow")}
                    error={errors.deliveryWindow}
                    options={[
                      { value: "morning", label: "Morning" },
                      { value: "afternoon", label: "Afternoon" },
                      { value: "evening", label: "Evening" },
                    ]}
                  />
                  <SelectField
                    label="Estimated Number of Loads"
                    name="loads"
                    value={data.loads}
                    onChange={update("loads")}
                    error={errors.loads}
                    options={LOADS_OPTIONS.map((l) => ({
                      value: l,
                      label: l === "custom" ? "Custom" : l,
                    }))}
                  />
                  {data.loads === "custom" && (
                    <Field
                      label="Custom Number of Loads"
                      name="customLoads"
                      type="number"
                      min="1"
                      value={data.customLoads}
                      onChange={update("customLoads")}
                      error={errors.customLoads}
                      placeholder="e.g., 6"
                      className="sm:col-span-2"
                    />
                  )}
                  <SelectField
                    label="Material Type"
                    name="materialType"
                    value={data.materialType}
                    onChange={update("materialType")}
                    error={errors.materialType}
                    options={MATERIALS}
                    className="sm:col-span-2"
                  />
                  <TextArea
                    label="Additional Notes"
                    name="notes"
                    value={data.notes}
                    onChange={update("notes")}
                    placeholder="Access details, gate code, special instructions…"
                    className="sm:col-span-2"
                  />
                </FieldGroup>

                <div className="mt-7 sm:mt-8 flex flex-col-reverse sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <p className="text-xs sm:text-sm text-gray-500">
                    By submitting this form, you agree to be contacted about
                    your booking.
                    {isDemoMode && (
                      <span className="block mt-0.5 text-amber-600">
                        Demo mode — connect a GHL booking webhook in{" "}
                        <code>.env</code> to deliver leads.
                      </span>
                    )}
                  </p>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Sending…" : "Request Booking"}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Summary sidebar - shows above form on mobile/tablet for context */}
          <aside className="order-1 lg:order-2 lg:sticky lg:top-32 self-start">
            <Summary trailer={selectedTrailer} data={data} />
          </aside>
        </div>
      </div>
    </section>
  );
}

/* ---------- Sub-components ------------------------------------------------ */

function FieldGroup({ title, children }) {
  return (
    <fieldset className="border-0 p-0 mb-2 mt-6 first:mt-0">
      <legend className="font-display text-lg sm:text-xl font-extrabold uppercase text-brand-dark mb-4 pb-2 border-b border-gray-200 w-full">
        {title}
      </legend>
      <div className="grid sm:grid-cols-2 gap-4">{children}</div>
    </fieldset>
  );
}

// Shared input class. text-base prevents iOS auto-zoom on focus.
const FIELD_BASE =
  "w-full rounded-lg border bg-white px-3.5 sm:px-4 py-3 text-base text-gray-900 outline-none transition-colors focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20";

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  className = "",
  ...rest
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        <span className="text-brand-orange"> *</span>
      </span>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`${FIELD_BASE} ${
          error ? "border-red-400" : "border-gray-300"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </label>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  error,
  options,
  className = "",
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        <span className="text-brand-orange"> *</span>
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${FIELD_BASE} appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-10 ${
          error ? "border-red-400" : "border-gray-300"
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
        }}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </label>
  );
}

function TextArea({
  label,
  name,
  value,
  onChange,
  placeholder,
  className = "",
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        placeholder={placeholder}
        className={`${FIELD_BASE} resize-y border-gray-300`}
      />
    </label>
  );
}

function Summary({ trailer, data }) {
  const second = Math.round(trailer.price * 0.5);
  return (
    <div className="rounded-2xl bg-brand-dark text-white p-5 sm:p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-3">
        <FaguBadge size="md" variant="dark" />
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">
            Booking Summary
          </p>
          <p className="font-display text-lg sm:text-xl font-extrabold truncate">
            {trailer.name}
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 space-y-3 text-sm">
        <Line label="First Trailer" value={`$${trailer.price}`} highlight />
        <Line
          label="Second Trailer (50% off, same job)"
          value={`$${second}`}
        />
        <Line label="Service Date" value={data.serviceDate || "—"} />
        <Line
          label="Delivery Window"
          value={capitalize(data.deliveryWindow) || "—"}
        />
        <Line
          label="Loads"
          value={
            data.loads === "custom"
              ? data.customLoads || "Custom"
              : data.loads
          }
        />
      </div>

      <div className="mt-5 sm:mt-6 rounded-lg border border-brand-yellow/40 bg-brand-yellow/10 p-3 sm:p-4 text-sm text-brand-yellow">
        <p className="font-semibold">Heads up:</p>
        <p className="text-white/80 mt-1 text-xs sm:text-sm">
          Disposal and dump fees are not included. The rental price covers
          trailer delivery and pickup only.
        </p>
      </div>

      <div className="mt-3 sm:mt-4 flex items-start gap-2 text-[11px] sm:text-xs text-white/70">
        <span className="h-2 w-2 mt-1 shrink-0 rounded-full bg-orange-400 animate-pulse" />
        <span>Status: reservation pending until our team confirms availability.</span>
      </div>
    </div>
  );
}

function Line({ label, value, highlight }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-2">
      <span className="text-white/70 text-xs sm:text-sm">{label}</span>
      <span
        className={`font-bold text-right shrink-0 ${
          highlight ? "text-brand-yellow text-base sm:text-lg" : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function capitalize(s) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* ---------- Success state ------------------------------------------------- */

function SuccessState({ onReset, data }) {
  return (
    <div className="text-center py-4 sm:py-6">
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
      <h3 className="mt-4 sm:mt-5 text-xl sm:text-2xl md:text-3xl font-extrabold uppercase text-brand-dark">
        Request received!
      </h3>
      <p className="mt-2 text-gray-600 max-w-lg mx-auto text-sm sm:text-base px-2">
        Thanks,{" "}
        <strong>
          {data.fullName.split(" ")[0] || "there"}
        </strong>
        ! We'll reach out shortly to confirm availability and payment so we can
        lock in your service date.
      </p>
      <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto text-left">
        <SuccessTile label="Trailer" value={data.trailerType} />
        <SuccessTile label="Date" value={data.serviceDate || "—"} />
        <SuccessTile
          label="Window"
          value={capitalize(data.deliveryWindow) || "—"}
        />
      </div>
      <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <button
          type="button"
          onClick={onReset}
          className="btn-secondary w-full sm:w-auto"
        >
          Submit Another Request
        </button>
        <a href="#booking" className="btn-primary w-full sm:w-auto">
          Review request details
        </a>
      </div>
    </div>
  );
}

function SuccessTile({ label, value }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-2.5 sm:p-3 min-w-0">
      <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-gray-500">
        {label}
      </p>
      <p className="font-bold text-brand-dark text-sm sm:text-base truncate">
        {value}
      </p>
    </div>
  );
}
