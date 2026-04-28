import { useMemo, useState } from "react";
import { submitLead } from "../services/leads";
import { isDemoMode } from "../config/api";

/* -------------------------------------------------------------------------- */
/* Partner With FAGU                                                          */
/* -------------------------------------------------------------------------- */
/* 3-tab onboarding section + reusable single-form components for the three   */
/* core personas described in the Fagu Technologies & Logistics brief:        */
/*   - Owner          -> trailer owner who wants to monetize the fleet       */
/*   - Customer       -> roofing company that needs trailers                 */
/*   - Driver         -> logistics partner that hauls trailers               */
/*                                                                            */
/* Submission goes through `submitLead(formType, data)` which posts to the    */
/* GoHighLevel webhook configured for the form (or runs in demo mode).        */
/* Field `name` attributes are kept stable so GHL can map them automatically. */
/* -------------------------------------------------------------------------- */

export const PARTNER_TABS_INDEX = ["owner", "customer", "driver"];

const TABS = [
  {
    id: "owner",
    title: "I have trailers",
    short: "Trailer Owner",
    eyebrow: "For Trailer Owners",
    headline: "Put your fleet to work with FAGU.",
    subhead:
      "We connect your dump trailers with steady demand from roofing crews and contractors. Maximize occupancy, automate scheduling, and get paid faster.",
    perks: [
      "Steady recurring demand from vetted roofing & construction crews",
      "Automated bookings, payments and driver dispatch",
      "Visibility on every trailer's status, location and earnings",
    ],
    icon: "trailer",
    cta: "Become a FAGU Owner",
  },
  {
    id: "customer",
    title: "I need a trailer",
    short: "Roofing / Customer",
    eyebrow: "For Roofing & Construction Crews",
    headline: "Reserve a dump trailer for your next job.",
    subhead:
      "Online booking, prepayment, on-time delivery and pickup. We focus on the 12 to 18 ft trailers — the sizes roofing companies use the most.",
    perks: [
      "12, 14, 16 and 18 ft dump trailers — the most-used range",
      "Day-before delivery to keep your crew moving",
      "Transparent pricing with 50% off your second trailer same job",
    ],
    icon: "hammer",
    cta: "Request Customer Account",
  },
  {
    id: "driver",
    title: "I want to drive",
    short: "Driver / Hauler",
    eyebrow: "For Drivers & Haulers",
    headline: "Get paid to deliver and pick up FAGU trailers.",
    subhead:
      "If you have your own truck and tow capacity for dump trailers, FAGU sends you steady delivery and pickup runs (up to 4 trailers/day).",
    perks: [
      "Up to 4 paid trailer movements per day",
      "Optimized routes via the FAGU driver app",
      "Weekly direct deposit — no chasing payments",
    ],
    icon: "truck",
    cta: "Apply to Drive for FAGU",
  },
];

export default function Partner({ initialTab = "owner" }) {
  const [tab, setTab] = useState(
    PARTNER_TABS_INDEX.includes(initialTab) ? initialTab : "owner"
  );
  const active = useMemo(() => TABS.find((t) => t.id === tab) ?? TABS[0], [tab]);

  return (
    <section
      id="partner"
      className="pt-32 sm:pt-36 md:pt-40 pb-16 sm:pb-20 md:pb-28 bg-grid-dark text-white"
    >
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="section-eyebrow">Partner With FAGU</span>
          <h2 className="section-title">
            One platform.{" "}
            <span className="text-brand-yellow">Three ways to grow.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-white/75 text-base sm:text-lg">
            FAGU connects three sides of the dump-trailer business in one
            simple platform — owners with idle trailers, roofing crews who
            need them, and drivers who move them. Pick your path below to get
            started.
          </p>
        </div>

        {/* Tabs */}
        <div
          role="tablist"
          aria-label="Partner with FAGU"
          className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3"
        >
          {TABS.map((t) => {
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`partner-panel-${t.id}`}
                id={`partner-tab-${t.id}`}
                onClick={() => setTab(t.id)}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-4 text-left transition-all
                  ${
                    isActive
                      ? "border-brand-yellow bg-brand-yellow/10 text-white shadow-glow"
                      : "border-white/10 bg-white/[0.03] text-white/80 hover:border-white/30 hover:bg-white/[0.06]"
                  }`}
              >
                <span
                  className={`grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-lg transition-colors
                    ${
                      isActive
                        ? "bg-brand-yellow text-brand-dark"
                        : "bg-white/10 text-white/80 group-hover:bg-white/15"
                    }`}
                >
                  <TabIcon name={t.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-[0.18em] text-white/50 font-semibold">
                    {t.eyebrow}
                  </span>
                  <span className="block font-display text-base sm:text-lg font-extrabold leading-tight">
                    {t.title}
                  </span>
                </span>
              </button>
            );
          })}
        </div>

        {/* Panel */}
        <div
          id={`partner-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`partner-tab-${active.id}`}
          className="mt-6 sm:mt-8 grid lg:grid-cols-[1.1fr,1.4fr] gap-6 lg:gap-8"
        >
          {/* Pitch column */}
          <aside className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 md:p-8">
            <h3 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight">
              {active.headline}
            </h3>
            <p className="mt-3 text-white/75 text-sm sm:text-base leading-relaxed">
              {active.subhead}
            </p>

            <ul className="mt-5 sm:mt-6 space-y-3">
              {active.perks.map((p) => (
                <li key={p} className="flex items-start gap-3">
                  <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-yellow text-brand-dark">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </span>
                  <span className="text-white/85 text-sm sm:text-base">
                    {p}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-6 sm:mt-8 rounded-xl border border-brand-yellow/30 bg-brand-yellow/10 p-3 sm:p-4 text-sm">
              <p className="font-semibold text-brand-yellow">
                Coming soon — full FAGU dashboard
              </p>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                Bookings, dispatch, payouts and driver tracking in real time.
                Lock in your spot today and we'll onboard you when the platform
                goes live in your city.
              </p>
            </div>
          </aside>

          {/* Form column */}
          <div className="rounded-2xl border border-white/10 bg-white text-brand-dark p-5 sm:p-6 md:p-8 shadow-2xl">
            {tab === "owner" && <OwnerForm cta={active.cta} />}
            {tab === "customer" && <CustomerForm cta={active.cta} />}
            {tab === "driver" && <DriverForm cta={active.cta} />}
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Forms                                                                      */
/* -------------------------------------------------------------------------- */

export function OwnerForm({ cta = "Become a FAGU Owner" }) {
  const initial = {
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    trailerCount: "1-3",
    trailerSizes: [],
    yardAddress: "",
    insurance: "yes-active",
    notes: "",
  };
  return (
    <FormShell
      formType="owner_signup"
      initial={initial}
      cta={cta}
      heading="Trailer Owner Application"
      subheading="Tell us about your fleet. We'll reach out within 1 business day to schedule onboarding."
      validate={(v) => {
        const e = {};
        if (!v.fullName.trim()) e.fullName = "Required";
        if (!v.phone.trim()) e.phone = "Required";
        else if (v.phone.replace(/\D/g, "").length < 7)
          e.phone = "Enter a valid phone";
        if (!v.email.trim()) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
          e.email = "Enter a valid email";
        if (!v.city.trim()) e.city = "Required";
        if (!v.state.trim()) e.state = "Required";
        if (!v.yardAddress.trim()) e.yardAddress = "Required";
        if (!v.trailerSizes.length) e.trailerSizes = "Pick at least one size";
        return e;
      }}
      render={({ data, errors, update, toggleArray }) => (
        <>
          <Row2>
            <Input
              label="Full Name"
              name="fullName"
              value={data.fullName}
              onChange={update("fullName")}
              error={errors.fullName}
              required
            />
            <Input
              label="Business Name"
              name="businessName"
              value={data.businessName}
              onChange={update("businessName")}
              placeholder="Optional"
            />
          </Row2>
          <Row2>
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={update("phone")}
              error={errors.phone}
              required
              placeholder="(555) 123-4567"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={data.email}
              onChange={update("email")}
              error={errors.email}
              required
              placeholder="you@email.com"
            />
          </Row2>
          <Row2>
            <Input
              label="City"
              name="city"
              value={data.city}
              onChange={update("city")}
              error={errors.city}
              required
            />
            <Input
              label="State"
              name="state"
              value={data.state}
              onChange={update("state")}
              error={errors.state}
              required
              placeholder="FL"
            />
          </Row2>
          <Row2>
            <Select
              label="How many trailers do you own?"
              name="trailerCount"
              value={data.trailerCount}
              onChange={update("trailerCount")}
              required
              options={[
                { value: "1-3", label: "1 – 3 trailers" },
                { value: "4-7", label: "4 – 7 trailers" },
                { value: "8-15", label: "8 – 15 trailers" },
                { value: "16+", label: "16+ trailers" },
              ]}
            />
            <Select
              label="Insurance coverage"
              name="insurance"
              value={data.insurance}
              onChange={update("insurance")}
              required
              options={[
                { value: "yes-active", label: "Yes — active policy" },
                { value: "yes-need-help", label: "Yes — need help renewing" },
                { value: "no-yet", label: "Not yet" },
              ]}
            />
          </Row2>

          <CheckboxGroup
            label="Trailer sizes you own"
            name="trailerSizes"
            options={[
              { value: "12ft", label: "12 ft" },
              { value: "14ft", label: "14 ft" },
              { value: "16ft", label: "16 ft" },
              { value: "18ft", label: "18 ft" },
              { value: "other", label: "Other" },
            ]}
            values={data.trailerSizes}
            onToggle={toggleArray("trailerSizes")}
            error={errors.trailerSizes}
            required
          />

          <Input
            label="Yard / Storage address"
            name="yardAddress"
            value={data.yardAddress}
            onChange={update("yardAddress")}
            error={errors.yardAddress}
            required
            placeholder="Where the trailers are stored"
          />

          <TextArea
            label="Anything else we should know?"
            name="notes"
            value={data.notes}
            onChange={update("notes")}
            placeholder="Special equipment, schedule preferences, current contracts…"
          />
        </>
      )}
    />
  );
}

export function CustomerForm({ cta = "Request Customer Account" }) {
  const initial = {
    companyName: "",
    contactName: "",
    phone: "",
    email: "",
    serviceArea: "",
    jobsPerMonth: "3-5",
    preferredSize: "16ft",
    cadence: "project",
    notes: "",
  };
  return (
    <FormShell
      formType="customer_signup"
      initial={initial}
      cta={cta}
      heading="Roofing / Customer Account"
      subheading="Open a recurring rental account so your crews can book in seconds."
      validate={(v) => {
        const e = {};
        if (!v.companyName.trim()) e.companyName = "Required";
        if (!v.contactName.trim()) e.contactName = "Required";
        if (!v.phone.trim()) e.phone = "Required";
        else if (v.phone.replace(/\D/g, "").length < 7)
          e.phone = "Enter a valid phone";
        if (!v.email.trim()) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
          e.email = "Enter a valid email";
        if (!v.serviceArea.trim()) e.serviceArea = "Required";
        return e;
      }}
      render={({ data, errors, update }) => (
        <>
          <Row2>
            <Input
              label="Company Name"
              name="companyName"
              value={data.companyName}
              onChange={update("companyName")}
              error={errors.companyName}
              required
            />
            <Input
              label="Contact Name"
              name="contactName"
              value={data.contactName}
              onChange={update("contactName")}
              error={errors.contactName}
              required
            />
          </Row2>
          <Row2>
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={update("phone")}
              error={errors.phone}
              required
              placeholder="(555) 123-4567"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={data.email}
              onChange={update("email")}
              error={errors.email}
              required
              placeholder="ops@yourcompany.com"
            />
          </Row2>
          <Input
            label="Service Area / City"
            name="serviceArea"
            value={data.serviceArea}
            onChange={update("serviceArea")}
            error={errors.serviceArea}
            required
            placeholder="Orlando, FL"
          />
          <Row2>
            <Select
              label="Average jobs per month"
              name="jobsPerMonth"
              value={data.jobsPerMonth}
              onChange={update("jobsPerMonth")}
              required
              options={[
                { value: "1-2", label: "1 – 2 jobs" },
                { value: "3-5", label: "3 – 5 jobs" },
                { value: "6-10", label: "6 – 10 jobs" },
                { value: "10+", label: "10+ jobs" },
              ]}
            />
            <Select
              label="Preferred trailer size"
              name="preferredSize"
              value={data.preferredSize}
              onChange={update("preferredSize")}
              required
              options={[
                { value: "12ft", label: "12 ft" },
                { value: "14ft", label: "14 ft" },
                { value: "16ft", label: "16 ft" },
                { value: "18ft", label: "18 ft" },
                { value: "any", label: "Any / Multiple" },
              ]}
            />
          </Row2>
          <Select
            label="Rental cadence"
            name="cadence"
            value={data.cadence}
            onChange={update("cadence")}
            required
            options={[
              { value: "weekly", label: "Recurring — weekly" },
              { value: "monthly", label: "Recurring — monthly" },
              { value: "project", label: "Project-based" },
              { value: "one-time", label: "One-time job" },
            ]}
          />
          <TextArea
            label="Anything else we should know?"
            name="notes"
            value={data.notes}
            onChange={update("notes")}
            placeholder="Typical materials, urgent dates, account requirements…"
          />
        </>
      )}
    />
  );
}

export function DriverForm({ cta = "Apply to Drive for FAGU" }) {
  const initial = {
    fullName: "",
    phone: "",
    email: "",
    city: "",
    licenseNumber: "",
    licenseClass: "regular",
    truckYear: "",
    truckMakeModel: "",
    towCapacity: "",
    dailyCapacity: "2",
    insurance: "yes",
    availability: [],
    experienceYears: "1-2",
    notes: "",
  };
  return (
    <FormShell
      formType="driver_signup"
      initial={initial}
      cta={cta}
      heading="Driver Application"
      subheading="Drive your own truck and earn per trailer movement. Up to 4 trailers per day."
      validate={(v) => {
        const e = {};
        if (!v.fullName.trim()) e.fullName = "Required";
        if (!v.phone.trim()) e.phone = "Required";
        else if (v.phone.replace(/\D/g, "").length < 7)
          e.phone = "Enter a valid phone";
        if (!v.email.trim()) e.email = "Required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email))
          e.email = "Enter a valid email";
        if (!v.city.trim()) e.city = "Required";
        if (!v.licenseNumber.trim()) e.licenseNumber = "Required";
        if (!v.truckYear.trim()) e.truckYear = "Required";
        if (!v.truckMakeModel.trim()) e.truckMakeModel = "Required";
        if (!v.towCapacity.trim()) e.towCapacity = "Required";
        if (!v.availability.length) e.availability = "Pick at least one";
        return e;
      }}
      render={({ data, errors, update, toggleArray }) => (
        <>
          <Row2>
            <Input
              label="Full Name"
              name="fullName"
              value={data.fullName}
              onChange={update("fullName")}
              error={errors.fullName}
              required
            />
            <Input
              label="City / Service area"
              name="city"
              value={data.city}
              onChange={update("city")}
              error={errors.city}
              required
              placeholder="Orlando, FL"
            />
          </Row2>
          <Row2>
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={data.phone}
              onChange={update("phone")}
              error={errors.phone}
              required
              placeholder="(555) 123-4567"
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={data.email}
              onChange={update("email")}
              error={errors.email}
              required
              placeholder="you@email.com"
            />
          </Row2>
          <Row2>
            <Input
              label="Driver's License #"
              name="licenseNumber"
              value={data.licenseNumber}
              onChange={update("licenseNumber")}
              error={errors.licenseNumber}
              required
            />
            <Select
              label="License class"
              name="licenseClass"
              value={data.licenseClass}
              onChange={update("licenseClass")}
              required
              options={[
                { value: "regular", label: "Regular driver license" },
                { value: "cdl-a", label: "CDL Class A" },
                { value: "cdl-b", label: "CDL Class B" },
                { value: "cdl-c", label: "CDL Class C" },
              ]}
            />
          </Row2>
          <Row2>
            <Input
              label="Truck year"
              name="truckYear"
              type="number"
              value={data.truckYear}
              onChange={update("truckYear")}
              error={errors.truckYear}
              required
              placeholder="2021"
              inputMode="numeric"
            />
            <Input
              label="Truck make & model"
              name="truckMakeModel"
              value={data.truckMakeModel}
              onChange={update("truckMakeModel")}
              error={errors.truckMakeModel}
              required
              placeholder="Ford F-250"
            />
          </Row2>
          <Row2>
            <Input
              label="Tow capacity (lbs)"
              name="towCapacity"
              type="number"
              value={data.towCapacity}
              onChange={update("towCapacity")}
              error={errors.towCapacity}
              required
              placeholder="14000"
              inputMode="numeric"
            />
            <Select
              label="Trailers you can move per day"
              name="dailyCapacity"
              value={data.dailyCapacity}
              onChange={update("dailyCapacity")}
              required
              options={[
                { value: "1", label: "1 trailer" },
                { value: "2", label: "2 trailers" },
                { value: "3", label: "3 trailers" },
                { value: "4", label: "4 trailers (max)" },
              ]}
            />
          </Row2>
          <Row2>
            <Select
              label="Commercial insurance"
              name="insurance"
              value={data.insurance}
              onChange={update("insurance")}
              required
              options={[
                { value: "yes", label: "Yes — active" },
                { value: "in-progress", label: "In progress" },
                { value: "no", label: "Not yet" },
              ]}
            />
            <Select
              label="Years of towing experience"
              name="experienceYears"
              value={data.experienceYears}
              onChange={update("experienceYears")}
              required
              options={[
                { value: "0-1", label: "Less than 1 year" },
                { value: "1-2", label: "1 – 2 years" },
                { value: "3-5", label: "3 – 5 years" },
                { value: "6+", label: "6+ years" },
              ]}
            />
          </Row2>

          <CheckboxGroup
            label="Availability"
            name="availability"
            options={[
              { value: "weekdays", label: "Weekdays" },
              { value: "weekends", label: "Weekends" },
              { value: "evenings", label: "Evenings" },
              { value: "on-call", label: "On-call" },
            ]}
            values={data.availability}
            onToggle={toggleArray("availability")}
            error={errors.availability}
            required
          />

          <TextArea
            label="Anything else we should know?"
            name="notes"
            value={data.notes}
            onChange={update("notes")}
            placeholder="Equipment, depots you're closer to, special skills…"
          />
        </>
      )}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* Form shell + primitives                                                    */
/* -------------------------------------------------------------------------- */

function FormShell({
  formType,
  initial,
  validate,
  render,
  cta,
  heading,
  subheading,
}) {
  const [data, setData] = useState(initial);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

  const toggleArray = (field) => (value) => {
    setData((d) => {
      const set = new Set(d[field] || []);
      if (set.has(value)) set.delete(value);
      else set.add(value);
      return { ...d, [field]: [...set] };
    });
    setErrors((errs) => {
      if (!errs[field]) return errs;
      const next = { ...errs };
      delete next[field];
      return next;
    });
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
    await submitLead(formType, data);
    setSubmitting(false);
    setSubmitted(true);
  };

  if (submitted) {
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
        <h3 className="mt-4 sm:mt-5 font-display text-2xl sm:text-3xl font-extrabold text-brand-dark">
          You're on the list.
        </h3>
        <p className="mt-2 text-gray-600 max-w-md mx-auto text-sm sm:text-base">
          Our team will review your info and reach out within 1 business day to
          finish onboarding.
        </p>
        <button
          type="button"
          onClick={() => {
            setData(initial);
            setSubmitted(false);
          }}
          className="btn-secondary mt-6"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3 className="font-display text-xl sm:text-2xl font-extrabold text-brand-dark">
        {heading}
      </h3>
      <p className="mt-1 text-gray-600 text-sm sm:text-base">{subheading}</p>

      <div className="mt-5 sm:mt-6 space-y-4">
        {render({ data, errors, update, toggleArray })}
      </div>

      <div className="mt-6 sm:mt-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs text-gray-500">
          By submitting you agree to be contacted by FAGU about onboarding.
          {isDemoMode && (
            <span className="block mt-0.5 text-amber-600">
              Demo mode — connect a GHL webhook in <code>.env</code> to start
              receiving leads.
            </span>
          )}
        </p>
        <button
          type="submit"
          disabled={submitting}
          className="btn-primary w-full sm:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? "Sending…" : cta}
        </button>
      </div>
    </form>
  );
}

function Row2({ children }) {
  return <div className="grid sm:grid-cols-2 gap-4">{children}</div>;
}

const FIELD_BASE =
  "w-full rounded-lg border bg-white px-3.5 sm:px-4 py-2.5 text-base text-gray-900 outline-none transition-colors focus:border-brand-yellow focus:ring-4 focus:ring-brand-yellow/20";

function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  placeholder,
  required,
  className = "",
  ...rest
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
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
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  required,
  className = "",
}) {
  return (
    <label className={`block min-w-0 ${className}`}>
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${FIELD_BASE} appearance-none bg-no-repeat bg-[right_0.75rem_center] pr-10 border-gray-300`}
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
    </label>
  );
}

function TextArea({ label, name, value, onChange, placeholder }) {
  return (
    <label className="block min-w-0">
      <span className="block text-sm font-semibold text-gray-700 mb-1.5">
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={3}
        placeholder={placeholder}
        className={`${FIELD_BASE} resize-y border-gray-300`}
      />
    </label>
  );
}

function CheckboxGroup({
  label,
  name,
  options,
  values,
  onToggle,
  error,
  required,
}) {
  return (
    <fieldset className="block min-w-0">
      <legend className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-brand-orange"> *</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const checked = values.includes(o.value);
          return (
            <label
              key={o.value}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors
                ${
                  checked
                    ? "border-brand-yellow bg-brand-yellow/10 text-brand-dark"
                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                }`}
            >
              <input
                type="checkbox"
                name={name}
                value={o.value}
                checked={checked}
                onChange={() => onToggle(o.value)}
                className="sr-only"
              />
              <span
                className={`grid h-4 w-4 place-items-center rounded-sm border ${
                  checked
                    ? "bg-brand-yellow border-brand-yellow text-brand-dark"
                    : "border-gray-400"
                }`}
              >
                {checked && (
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </span>
              {o.label}
            </label>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </fieldset>
  );
}

/* -------------------------------------------------------------------------- */
/* Tab icons                                                                  */
/* -------------------------------------------------------------------------- */
function TabIcon({ name }) {
  const p = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };
  switch (name) {
    case "trailer":
      return (
        <svg {...p}>
          <rect x="2" y="7" width="18" height="9" rx="1" />
          <line x1="20" y1="11.5" x2="23" y2="11.5" />
          <circle cx="7" cy="18" r="2" />
          <circle cx="15" cy="18" r="2" />
        </svg>
      );
    case "hammer":
      return (
        <svg {...p}>
          <path d="M14 2 22 10 18 14 10 6 z" />
          <path d="M10 6 2 14 6 18 14 10" />
          <path d="M9 13l-4 4" />
        </svg>
      );
    case "truck":
      return (
        <svg {...p}>
          <rect x="1" y="6" width="14" height="11" rx="1" />
          <polygon points="15 9 21 9 23 13 23 17 15 17 15 9" />
          <circle cx="6" cy="19" r="2" />
          <circle cx="18" cy="19" r="2" />
        </svg>
      );
    default:
      return null;
  }
}
