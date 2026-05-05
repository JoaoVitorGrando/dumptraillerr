// ─── Trailer ─────────────────────────────────────────────────────────────────

export interface Trailer {
  id: string;
  name: string;
  image: string;          // path relative to public/ (e.g. "/assets/7x12.png")
  imageAlt: string;
  length: string;
  width: string;
  sideHeight: string;
  size: string;
  bestFor: string;
  capacity: string;
  gvwr?: string;
  payload?: string;
  hitch: string;
  electrical: string;
  price: number;          // USD, whole dollars
  highlights: string[];
}

// ─── Service ─────────────────────────────────────────────────────────────────

export interface ServiceSpec {
  label: string;
  value: string;
}

export interface ServiceCTA {
  label: string;
  href: string;
}

export interface Service {
  slug: string;
  name: string;
  image: string;          // path relative to public/
  badge: string;
  available: boolean;
  tagline: string;
  short: string;
  sizes: string[];
  startingPrice: number | null;
  bestFor: string[];
  specs: ServiceSpec[];
  highlights: string[];
  primaryCta: ServiceCTA;
  secondaryCta: ServiceCTA;
}

// ─── Lead / Forms ─────────────────────────────────────────────────────────────

export type FormType =
  | "booking"
  | "owner_signup"
  | "customer_signup"
  | "driver_signup"
  | "contact";

export interface LeadResult {
  ok: boolean;
  demo?: boolean;
  error?: string;
}

// ─── Booking Form ─────────────────────────────────────────────────────────────

export interface BookingFormValues {
  trailerModel: string;
  serviceDate: string;
  deliveryWindow: string;
  deliveryAddress: string;
  zipCode: string;
  materialType: string;
  loads: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  notes?: string;
}
