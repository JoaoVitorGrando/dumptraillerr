// Single trailer presentation card. "onSelect" jumps to the booking form
// and prefills the trailer type via a custom event.
export default function TrailerCard({ trailer, onSelect }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Visual */}
      <div className="relative overflow-hidden bg-brand-dark p-4 sm:p-5">
        <div className="relative overflow-hidden rounded-xl bg-brand-dark">
          <img
            src={trailer.image}
            alt={trailer.imageAlt || `${trailer.name} preview`}
            loading="lazy"
            decoding="async"
            className="h-56 sm:h-64 md:h-72 w-full object-contain object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"
            aria-hidden
          />
        </div>

        <div className="relative -mt-8 px-2 flex items-center justify-between gap-2 flex-wrap">
          <span className="rounded-full bg-brand-yellow text-brand-dark text-[10px] sm:text-xs font-bold uppercase px-2.5 sm:px-3 py-1 tracking-wider">
            {trailer.length}
          </span>
          <div className="text-right">
            <p className="text-white/60 text-[10px] sm:text-xs uppercase">
              Starting at
            </p>
            <p className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              ${trailer.price}
            </p>
          </div>
        </div>

        <div className="relative mt-3 sm:mt-4 rounded-xl border border-white/15 bg-white/10 p-3 backdrop-blur-[1px]">
          <p className="text-white/80 text-xs sm:text-sm font-medium">
            Real trailer photo preview
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6">
        <h3 className="text-xl sm:text-2xl font-extrabold text-brand-dark uppercase break-words">
          {trailer.name}
        </h3>
        <p className="mt-1 text-brand-orange font-semibold text-sm sm:text-base">
          {trailer.bestFor}
        </p>

        <dl className="mt-4 sm:mt-5 space-y-2 text-sm">
          <Row label="Size" value={trailer.size} />
          <Row label="Length" value={trailer.length} />
          <Row label="Hitch" value={trailer.hitch} />
          <Row label="Electrical" value={trailer.electrical} />
          <Row label="Capacity" value={trailer.capacity} />
        </dl>

        <ul className="mt-4 sm:mt-5 space-y-2">
          {trailer.highlights.map((h) => (
            <li
              key={h}
              className="flex items-start gap-2 text-gray-700 text-sm"
            >
              <svg
                className="mt-0.5 shrink-0 text-brand-orange"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {h}
            </li>
          ))}
        </ul>

        <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Booking from</span>
          <span className="font-display text-xl sm:text-2xl font-extrabold text-brand-dark">
            ${trailer.price}
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
    </article>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-3 sm:gap-4 border-b border-gray-100 pb-2">
      <dt className="text-gray-500 uppercase text-[11px] sm:text-xs tracking-wider whitespace-nowrap">
        {label}
      </dt>
      <dd className="text-right text-gray-900 font-medium break-words min-w-0">
        {value}
      </dd>
    </div>
  );
}
