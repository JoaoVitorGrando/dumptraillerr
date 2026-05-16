import { z } from "zod";

/**
 * Validação centralizada de variáveis de ambiente.
 * Nenhum outro arquivo deve ler process.env diretamente.
 * Se uma variável obrigatória faltar, o app lança erro claro no startup.
 */

const envSchema = z.object({
  // ── Supabase ────────────────────────────────────────────────────────────
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY é obrigatória"),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, "SUPABASE_SERVICE_ROLE_KEY é obrigatória"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL é obrigatória"),

  // ── Stripe (opcionais até Fase 6) ───────────────────────────────────────
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),

  // ── GoHighLevel (opcionais até Fase 7) ──────────────────────────────────
  NEXT_PUBLIC_GHL_BOOKING_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_OWNER_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_DRIVER_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_CONTACT_WEBHOOK: z.string().optional(),
  GHL_API_KEY: z.string().optional(),

  // ── Mapas (opcional até Fase 8) ─────────────────────────────────────────
  NEXT_PUBLIC_MAPS_KEY: z.string().optional(),

  // ── Monitoramento ────────────────────────────────────────────────────────
  SENTRY_DSN: z.string().optional(),

  // ── Contato público ──────────────────────────────────────────────────────
  NEXT_PUBLIC_CONTACT_PHONE: z.string().default("+1 (206) 555-0199"),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().default("hello@faguhomeservices.com"),
  NEXT_PUBLIC_CONTACT_HOURS: z.string().default("Mon–Sat · 7:00 AM – 7:00 PM"),
});

function envForParse(source: NodeJS.ProcessEnv) {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value != null && String(value).trim() !== "")
  );
}

// Em desenvolvimento, usa parse parcial para não bloquear antes das credenciais
const _parsed =
  process.env.NODE_ENV === "production"
    ? envSchema.parse(envForParse(process.env))
    : envSchema.partial().parse(envForParse(process.env));

export const env = _parsed as z.infer<typeof envSchema>;

// Helpers de modo
export const isDemoMode = !env.NEXT_PUBLIC_GHL_BOOKING_WEBHOOK;
export const isStripeConfigured = Boolean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY);
