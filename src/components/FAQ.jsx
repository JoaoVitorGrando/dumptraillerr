import { useState } from "react";
import logoBiografia from "../assets/LOGObiografia.png";
import { API_CONFIG } from "../config/api";

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
  {
    q: "How long can I keep the trailer?",
    a: "Standard rentals are priced per service window shown at booking. If you need extra time, contact us before pickup and we can extend your rental based on availability.",
  },
  {
    q: "Do I need to be on-site for delivery and pickup?",
    a: "It is recommended, but not always required. If you cannot be present, send clear placement instructions (driveway spot, gate code, landmarks) so our team can complete delivery safely.",
  },
  {
    q: "Can the trailer be placed on the street?",
    a: "In many cities, street placement may require a permit. We recommend checking local rules before booking. You are responsible for required permits or HOA approvals.",
  },
  {
    q: "Is there a weight limit?",
    a: "Yes. Each trailer size has a maximum payload and legal transport limit. Overloading is not allowed for safety and compliance reasons, and extra charges may apply if limits are exceeded.",
  },
  {
    q: "How high can I load the trailer?",
    a: "Please keep debris level with the top rail unless your booking specifically includes high-side configuration. Material stacked above safe transport height may need to be reloaded before pickup.",
  },
  {
    q: "Can I mix different materials in one load?",
    a: "You can mix many common debris types, but some materials must be separated due to landfill and recycling rules. If your project includes special waste, tell us in advance so we can guide you.",
  },
  {
    q: "Are mattresses, appliances, tires, or concrete allowed?",
    a: "These items may be accepted with special handling or additional disposal fees depending on local facilities. Let us know before delivery so we can confirm pricing and acceptance.",
  },
  {
    q: "What happens if the trailer blocks access or sinks on soft ground?",
    a: "Use a firm, level surface and keep clear access for pickup. If relocation or recovery is required due to site conditions, additional service charges may apply.",
  },
  {
    q: "How quickly can I get a trailer?",
    a: "Availability varies by day and route density. We often support next-day service, and in some areas same-day may be possible. The earlier you book, the better your delivery window options.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept prepaid online or approved invoicing workflows for eligible recurring accounts. Payment must be completed before a reservation is confirmed.",
  },
  {
    q: "Do you offer recurring service for contractors?",
    a: "Yes. We support recurring and multi-trailer workflows for roofing and construction teams. Contact us to set up a repeat schedule and account-level pricing options.",
  },
  {
    q: "What phone number should I use to contact FAGU?",
    a: `You can call us directly at ${API_CONFIG.contact.phone}.`,
  },
  {
    q: "What is the best email to reach FAGU?",
    a: `Send your questions to ${API_CONFIG.contact.email} and our team will respond as soon as possible.`,
  },
  {
    q: "What are FAGU's support hours?",
    a: `Our current support hours are ${API_CONFIG.contact.hours}.`,
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
          <div className="mt-8 sm:mt-10">
            <img
              src={logoBiografia}
              alt="FAGU logo"
              loading="lazy"
              decoding="async"
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl h-auto object-contain"
            />
          </div>
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
