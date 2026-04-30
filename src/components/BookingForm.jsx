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
  renterType: "person",
  renterName: "",
  renterPhone: "",
  companyName: "",
  email: "",
  jobSiteClientName: "",
  jobSiteClientPhone: "",
  jobSiteAddress: "",
  jobSiteCity: "",
  jobSiteZip: "",
  trailerType: "standard-14x7",
  trailerQuantity: "1",
  customTrailerModel: "",
  customTrailerSize: "",
  customTrailerHeight: "",
  customTrailerCapacity: "",
  serviceDate: "",
  deliveryWindow: "afternoon",
  loads: "1",
  customLoads: "",
  materialType: "construction-debris",
  notes: "",
};

const REQUIRED_FIELDS = [
  "renterType",
  "renterName",
  "renterPhone",
  "email",
  "jobSiteClientName",
  "jobSiteClientPhone",
  "jobSiteAddress",
  "jobSiteCity",
  "jobSiteZip",
  "trailerType",
  "trailerQuantity",
  "serviceDate",
  "deliveryWindow",
  "loads",
  "materialType",
];

const CUSTOM_TRAILER_ID = "custom-dump-trailer";

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

  const usingCustomTrailer = data.trailerType === CUSTOM_TRAILER_ID;

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
    if (values.trailerType === CUSTOM_TRAILER_ID) {
      if (!String(values.customTrailerModel).trim()) {
        errs.customTrailerModel = "Tell us the model name";
      }
      if (!String(values.customTrailerSize).trim()) {
        errs.customTrailerSize = "Tell us width x length";
      }
      if (!String(values.customTrailerHeight).trim()) {
        errs.customTrailerHeight = "Tell us side height";
      }
      if (!String(values.customTrailerCapacity).trim()) {
        errs.customTrailerCapacity = "Tell us estimated capacity";
      }
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errs.email = "Please enter a valid email address";
    }
    if (values.renterPhone && values.renterPhone.replace(/\D/g, "").length < 7) {
      errs.renterPhone = "Please enter a valid phone number";
    }
    if (
      values.jobSiteClientPhone &&
      values.jobSiteClientPhone.replace(/\D/g, "").length < 7
    ) {
      errs.jobSiteClientPhone = "Please enter a valid phone number";
    }
    if (
      values.jobSiteZip &&
      !/^\d{4,10}$/.test(values.jobSiteZip.replace(/\D/g, ""))
    ) {
      errs.jobSiteZip = "Please enter a valid ZIP code";
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
      trailerName: usingCustomTrailer
        ? data.customTrailerModel
        : selectedTrailer?.name,
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
    <section id="booking" className="pt-8 sm:pt-10 md:pt-12 pb-16 sm:pb-20 md:pb-28 bg-brand-light">
      <div className="container-page">
        <div className="max-w-3xl mx-auto text-center">
          <span className="section-eyebrow inline-block">Book Online</span>
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
                <FieldGroup title="Renter Information">
                  <SelectField
                    label="Renter Type"
                    name="renterType"
                    value={data.renterType}
                    onChange={update("renterType")}
                    error={errors.renterType}
                    options={[
                      { value: "person", label: "Person" },
                      { value: "company", label: "Company" },
                    ]}
                  />
                  <Field
                    label="Renter Name"
                    name="renterName"
                    value={data.renterName}
                    onChange={update("renterName")}
                    error={errors.renterName}
                    placeholder="John Smith"
                    autoComplete="name"
                  />
                  {data.renterType === "company" && (
                    <Field
                      label="Company Name"
                      name="companyName"
                      value={data.companyName}
                      onChange={update("companyName")}
                      error={errors.companyName}
                      placeholder="ABC Roofing LLC"
                      autoComplete="organization"
                      className="sm:col-span-2"
                    />
                  )}
                  <Field
                    label="Renter Phone Number"
                    name="renterPhone"
                    type="tel"
                    value={data.renterPhone}
                    onChange={update("renterPhone")}
                    error={errors.renterPhone}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                  />
                  <Field
                    label="Renter Email"
                    name="email"
                    type="email"
                    value={data.email}
                    onChange={update("email")}
                    error={errors.email}
                    placeholder="you@email.com"
                    autoComplete="email"
                    className="sm:col-span-2"
                  />
                </FieldGroup>

                <FieldGroup title="Job Site Client Information">
                  <Field
                    label="Client Name"
                    name="jobSiteClientName"
                    value={data.jobSiteClientName}
                    onChange={update("jobSiteClientName")}
                    error={errors.jobSiteClientName}
                    placeholder="Homeowner / client name"
                  />
                  <Field
                    label="Client Phone Number"
                    name="jobSiteClientPhone"
                    type="tel"
                    value={data.jobSiteClientPhone}
                    onChange={update("jobSiteClientPhone")}
                    error={errors.jobSiteClientPhone}
                    placeholder="(555) 123-4567"
                    autoComplete="tel"
                  />
                  <Field
                    label="Delivery Address"
                    name="jobSiteAddress"
                    value={data.jobSiteAddress}
                    onChange={update("jobSiteAddress")}
                    error={errors.jobSiteAddress}
                    placeholder="1234 Main Street"
                    autoComplete="street-address"
                    className="sm:col-span-2"
                  />
                  <Field
                    label="City"
                    name="jobSiteCity"
                    value={data.jobSiteCity}
                    onChange={update("jobSiteCity")}
                    error={errors.jobSiteCity}
                    placeholder="Dallas"
                    autoComplete="address-level2"
                  />
                  <Field
                    label="ZIP Code"
                    name="jobSiteZip"
                    value={data.jobSiteZip}
                    onChange={update("jobSiteZip")}
                    error={errors.jobSiteZip}
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
                    options={[
                      ...TRAILERS.map((t) => ({
                        value: t.id,
                        label: `${t.name} — ${t.width} × ${t.length}`,
                      })),
                      {
                        value: CUSTOM_TRAILER_ID,
                        label: "Custom dump trailer (model/size/capacity)",
                      },
                    ]}
                  />
                  <SelectField
                    label="Quantity of Dump Trailers"
                    name="trailerQuantity"
                    value={data.trailerQuantity}
                    onChange={update("trailerQuantity")}
                    error={errors.trailerQuantity}
                    options={[
                      { value: "1", label: "1 trailer" },
                      { value: "2", label: "2 trailers" },
                      { value: "3", label: "3 trailers" },
                    ]}
                  />
                  {usingCustomTrailer && (
                    <>
                      <Field
                        label="Model / Series"
                        name="customTrailerModel"
                        value={data.customTrailerModel}
                        onChange={update("customTrailerModel")}
                        error={errors.customTrailerModel}
                        placeholder="Ex: DTX Pro 16"
                      />
                      <Field
                        label="Size (width x length)"
                        name="customTrailerSize"
                        value={data.customTrailerSize}
                        onChange={update("customTrailerSize")}
                        error={errors.customTrailerSize}
                        placeholder="Ex: 7 ft x 16 ft"
                      />
                      <Field
                        label="Side Height"
                        name="customTrailerHeight"
                        value={data.customTrailerHeight}
                        onChange={update("customTrailerHeight")}
                        error={errors.customTrailerHeight}
                        placeholder="Ex: 4 ft"
                      />
                      <Field
                        label="Estimated Capacity"
                        name="customTrailerCapacity"
                        value={data.customTrailerCapacity}
                        onChange={update("customTrailerCapacity")}
                        error={errors.customTrailerCapacity}
                        placeholder="Ex: 16 yd3 or 12 tons"
                      />
                    </>
                  )}
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
  const quantity = Number.parseInt(data.trailerQuantity || "1", 10) || 1;
  const safeQuantity = Math.max(1, quantity);
  const secondUnitPrice = Math.round(trailer.price * 0.5);
  const additionalUnits = Math.max(0, safeQuantity - 2);
  const totalToday =
    trailer.price +
    (safeQuantity >= 2 ? secondUnitPrice : 0) +
    additionalUnits * trailer.price;
  const usingCustomTrailer = data.trailerType === CUSTOM_TRAILER_ID;
  const trailerLabel = usingCustomTrailer
    ? data.customTrailerModel || "Custom dump trailer"
    : trailer.name;
  const trailerSize = usingCustomTrailer
    ? data.customTrailerSize || "—"
    : trailer.size;
  const trailerHeight = usingCustomTrailer
    ? data.customTrailerHeight || "—"
    : trailer.sideHeight || "—";
  const trailerCapacity = usingCustomTrailer
    ? data.customTrailerCapacity || "—"
    : trailer.capacity;
  return (
    <div className="rounded-2xl bg-brand-dark text-white p-5 sm:p-6 md:p-8 shadow-xl">
      <div className="flex items-center gap-3">
        <FaguBadge size="md" variant="dark" />
        <div className="min-w-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">
            Booking Summary
          </p>
          <p className="font-display text-lg sm:text-xl font-extrabold truncate">
            {trailerLabel}
          </p>
        </div>
      </div>

      <div className="mt-5 sm:mt-6 space-y-3 text-sm">
        <Line label="First Trailer" value={`$${trailer.price}`} highlight />
        {safeQuantity >= 2 && (
          <Line
            label="Second Trailer (50% off, same job)"
            value={`$${secondUnitPrice}`}
          />
        )}
        {additionalUnits > 0 && (
          <Line
            label={`Extra Trailer${additionalUnits > 1 ? "s" : ""} (after second)`}
            value={`$${additionalUnits * trailer.price}`}
          />
        )}
        <Line label="Quantity" value={`${safeQuantity}`} />
        <Line label="Trailer Size" value={trailerSize} />
        <Line label="Side Height" value={trailerHeight} />
        <Line label="Capacity" value={trailerCapacity} />
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
        <Line label="Total Today" value={`$${totalToday}`} highlight />
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
  const trailerLabel =
    data.trailerType === CUSTOM_TRAILER_ID
      ? data.customTrailerModel || "Custom dump trailer"
      : TRAILERS.find((t) => t.id === data.trailerType)?.name || data.trailerType;
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
          {data.renterName.split(" ")[0] || "there"}
        </strong>
        ! Thank you for trusting FAGU Home Services. Our team will review your
        request and contact you shortly with final confirmation.
      </p>
      <p className="mt-2 text-gray-600 max-w-xl mx-auto text-sm sm:text-base px-2">
        Your trailer and date are only secured after payment confirmation. As
        soon as payment is completed, we officially lock your reservation and
        send your booking confirmation.
      </p>
      <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3 max-w-xl mx-auto text-left">
        <SuccessTile label="Trailer" value={trailerLabel} />
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
        <button type="button" className="btn-primary w-full sm:w-auto">
          Proceed to Payment
        </button>
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
