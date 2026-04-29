import FaguBadge from "./FaguBadge";
import faguLogo from "../assets/LOGO1.png";

/* -------------------------------------------------------------------------- */
/* TrailerCard                                                                */
/* -------------------------------------------------------------------------- */
/* Standardized colour system using the FAGU palette:                         */
/*   - brand-yellow (Fluxo  #EB7231)  — primary accent (badges, checks,      */
/*                                       prices, hover borders)              */
/*   - brand-orange (Fundamento #D75227) — section titles / strong hover      */
/*   - brand-dark   (Autoridade #3E3E3E) — card hero background               */
/* The FAGU badge is anchored on the photo so every card carries the brand. */
/* -------------------------------------------------------------------------- */

export default function TrailerCard({ trailer, onSelect }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:border-brand-yellow/60">
      <div className="grid lg:grid-cols-[1.15fr,1fr]">
        <div className="relative bg-brand-dark">
          <img
            src={trailer.image}
            alt={trailer.imageAlt || `${trailer.name} preview`}
            loading="lazy"
            decoding="async"
            className="h-64 sm:h-80 md:h-[24rem] lg:h-full w-full object-cover"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-brand-dark/60 via-brand-dark/20 to-transparent"
            aria-hidden
          />

          <div className="absolute top-4 left-4 rounded-xl bg-white/95 backdrop-blur px-3 py-2 shadow">
            <img
              src={faguLogo}
              alt="FAGU logo"
              loading="lazy"
              decoding="async"
              className="h-8 w-auto object-contain"
            />
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
            <div>
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/75 font-semibold">
                Selected Size
              </p>
              <p className="text-3xl sm:text-4xl font-bold tabular-nums">
                {trailer.length}
              </p>
            </div>
            <p className="text-2xl sm:text-3xl font-bold tabular-nums">
              <span className="text-brand-yellow">$</span>
              {trailer.price}
            </p>
          </div>
        </div>

        <div className="flex flex-col p-5 sm:p-6">
          <FaguBadge size="xs" variant="transparent" className="self-end" />
          <h3 className="mt-2 text-xl sm:text-2xl font-extrabold text-brand-dark uppercase">
            {trailer.name}
          </h3>
          <p className="mt-1 text-brand-orange font-semibold text-sm sm:text-base">
            {trailer.bestFor}
          </p>

          <dl className="mt-4 sm:mt-5 space-y-2.5 text-sm">
            <Row label="Width" value={trailer.width} />
            <Row label="Length" value={trailer.length} />
            <Row label="Side Height" value={trailer.sideHeight} />
            <Row label="Capacity" value={trailer.capacity} />
            {trailer.gvwr && <Row label="GVWR" value={trailer.gvwr} />}
            {trailer.payload && <Row label="Payload" value={trailer.payload} />}
            <Row label="Hitch" value={trailer.hitch} />
            <Row label="Electrical" value={trailer.electrical} />
          </dl>

          <ul className="mt-4 sm:mt-5 space-y-2">
            {trailer.highlights.map((h) => (
              <li
                key={h}
                className="flex items-start gap-2 text-gray-700 text-sm"
              >
                <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-brand-yellow/15 text-brand-orange">
                  <svg
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                {h}
              </li>
            ))}
          </ul>

          <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-sm text-gray-500">Booking from</span>
            <span className="text-xl sm:text-2xl font-bold tabular-nums text-brand-dark">
              <span className="text-brand-yellow">$</span>
              {trailer.price}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onSelect?.(trailer)}
            className="btn-primary mt-4 w-full"
          >
            Select This Trailer
          </button>
        </div>
      </div>
    </article>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-2">
      <dt className="text-gray-500 uppercase text-[11px] sm:text-xs tracking-wider whitespace-nowrap">
        {label}
      </dt>
      <dd className="text-right text-brand-dark font-semibold break-words min-w-0">
        {value}
      </dd>
    </div>
  );
}
