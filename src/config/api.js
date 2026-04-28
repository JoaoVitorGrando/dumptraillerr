/* -------------------------------------------------------------------------- */
/* Centralized integration config                                             */
/* -------------------------------------------------------------------------- */
/* All third-party integration endpoints live here so the rest of the app     */
/* never references env variables directly. Define them in a `.env` file at   */
/* the project root (see `.env.example`) and Vite will inline them at build.  */
/*                                                                            */
/* When a webhook URL is empty we fall back to "demo mode": the form will     */
/* still validate, simulate a request and show the success state, but no     */
/* network call is made. Perfect for previewing without breaking integration. */
/* -------------------------------------------------------------------------- */

export const API_CONFIG = {
  // GoHighLevel webhook URLs — one per lead form
  ghl: {
    booking: import.meta.env.VITE_GHL_BOOKING_WEBHOOK || "",
    owner_signup: import.meta.env.VITE_GHL_OWNER_WEBHOOK || "",
    customer_signup: import.meta.env.VITE_GHL_CUSTOMER_WEBHOOK || "",
    driver_signup: import.meta.env.VITE_GHL_DRIVER_WEBHOOK || "",
    contact: import.meta.env.VITE_GHL_CONTACT_WEBHOOK || "",
  },

  // Stripe — used by the (future) payment page
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "",
    checkoutEndpoint: import.meta.env.VITE_STRIPE_CHECKOUT_ENDPOINT || "",
  },

  // Optional Google Maps key (delivery address autocomplete, route planning)
  googleMapsKey: import.meta.env.VITE_GOOGLE_MAPS_KEY || "",

  // Public contact info — overridable per environment
  contact: {
    phone: import.meta.env.VITE_CONTACT_PHONE || "+1 (555) 555-0199",
    email: import.meta.env.VITE_CONTACT_EMAIL || "hello@faguhomeservices.com",
    hours: import.meta.env.VITE_CONTACT_HOURS || "Mon–Sat · 7:00 AM – 7:00 PM",
  },

  // Brand-wide source tag attached to every lead payload
  leadSource: "fagu-landing",
};

// True if at least one GHL endpoint is configured (used by the UI to mention
// "demo mode" when previewing without integration).
export const isDemoMode = !Object.values(API_CONFIG.ghl).some(Boolean);
