import { useState } from "react";

const QUESTIONS = [
  {
    q: "Are disposal fees included in the rental?",
    a: "No. The rental price covers trailer delivery and pickup only. Dump and landfill fees are billed separately and depend on weight, material, and local regulations.",
  },
  {
    q: "When will my trailer be delivered?",
    a: "Whenever possible, we deliver in the afternoon or evening before your scheduled service date so you can start work as soon as you're ready.",
  },
  {
    q: "Can I request a second trailer if the first one fills up?",
    a: "Yes. Just let us know in advance. If it's for the same job site and the same project, your second trailer is 50% off the first one (for example, $350 for the first trailer and $175 for the second).",
  },
  {
    q: "How do I lock in my reservation?",
    a: "Reservations are confirmed only after the rental fee is paid in advance. Once your payment is received, your service date is officially booked.",
  },
  {
    q: "What materials can I load into the trailer?",
    a: "Most renovation debris, construction waste, yard waste, furniture, and general cleanout items are fine. Hazardous materials, paint, oils, batteries, and tires are not allowed — please ask if you're unsure.",
  },
  {
    q: "What if I need to cancel or reschedule?",
    a: "Please reach out as early as possible. We do our best to accommodate changes — cancellation terms are included in your booking confirmation email.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="py-16 sm:py-20 md:py-28 bg-white">
      <div className="container-page grid lg:grid-cols-[1fr,2fr] gap-8 lg:gap-10">
        <div>
          <span className="section-eyebrow">FAQ</span>
          <h2 className="section-title text-brand-dark">
            Got questions?{" "}
            <span className="text-brand-orange">We've got answers.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-gray-600 text-base sm:text-lg">
            Can't find what you're looking for? Reach out and we'll help you
            choose the right trailer for your project.
          </p>
          <a
            href="#booking"
            className="btn-secondary mt-5 sm:mt-6 w-full sm:w-auto"
          >
            Get a Quote
          </a>
        </div>

        <div className="divide-y divide-gray-200 border-y border-gray-200">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-3 sm:gap-4 py-4 sm:py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-display text-base sm:text-lg md:text-xl font-bold text-brand-dark pr-1">
                    {item.q}
                  </span>
                  <span
                    className={`grid h-8 w-8 sm:h-9 sm:w-9 shrink-0 place-items-center rounded-full transition-all ${
                      isOpen
                        ? "bg-brand-yellow text-brand-dark rotate-45"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-4 sm:pb-5 pr-2 sm:pr-12 text-gray-600 leading-relaxed text-sm sm:text-base">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
