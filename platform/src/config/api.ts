import { env } from "@/config/env";

/**
 * Centralized integration config — Next.js version.
 * Reads from the validated `env` object (Zod-parsed at startup).
 * Components never touch process.env directly.
 */
export const API_CONFIG = {
  ghl: {
    booking:        env.NEXT_PUBLIC_GHL_BOOKING_WEBHOOK  ?? "",
    owner_signup:   env.NEXT_PUBLIC_GHL_OWNER_WEBHOOK    ?? "",
    customer_signup:env.NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK ?? "",
    driver_signup:  env.NEXT_PUBLIC_GHL_DRIVER_WEBHOOK   ?? "",
    contact:        env.NEXT_PUBLIC_GHL_CONTACT_WEBHOOK  ?? "",
  },

  stripe: {
    publishableKey: env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "",
  },

  contact: {
    phone: env.NEXT_PUBLIC_CONTACT_PHONE ?? "+1 (206) 555-0199",
    email: env.NEXT_PUBLIC_CONTACT_EMAIL ?? "hello@faguhomeservices.com",
    hours: env.NEXT_PUBLIC_CONTACT_HOURS ?? "Mon–Sat · 7:00 AM – 7:00 PM",
  },

  leadSource: "fagu-platform",
} as const;

export type GhlFormType = keyof typeof API_CONFIG.ghl;
