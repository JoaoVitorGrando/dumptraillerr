import { z } from "zod";

/**
 * Validação centralizada de variáveis de ambiente.
 * Nenhum outro arquivo deve ler process.env diretamente.
 * Se uma variável obrigatória faltar, o app lança erro claro no startup.
 */

/** Variáveis expostas ao browser (NEXT_PUBLIC_*). */
const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL deve ser uma URL válida")
    .optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),

  // ── Stripe (opcionais até Fase 6) ───────────────────────────────────────
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),

  // ── GoHighLevel (opcionais até Fase 7) ──────────────────────────────────
  NEXT_PUBLIC_GHL_BOOKING_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_OWNER_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_CUSTOMER_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_DRIVER_WEBHOOK: z.string().optional(),
  NEXT_PUBLIC_GHL_CONTACT_WEBHOOK: z.string().optional(),
  // ── Mapas (opcional até Fase 8) ─────────────────────────────────────────
  NEXT_PUBLIC_MAPS_KEY: z.string().optional(),

  // ── Contato público ──────────────────────────────────────────────────────
  NEXT_PUBLIC_CONTACT_PHONE: z.string().default("+1 (206) 555-0199"),
  NEXT_PUBLIC_CONTACT_EMAIL: z.string().default("hello@faguhomeservices.com"),
  NEXT_PUBLIC_CONTACT_HOURS: z.string().default("Mon–Sat · 7:00 AM – 7:00 PM"),
});

/** Segredos só no servidor — nunca validar no bundle do browser. */
const serverEnvSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  DATABASE_URL: z.string().min(1).optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  GHL_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
});

const envSchema = publicEnvSchema.merge(serverEnvSchema);

function envForParse(source: NodeJS.ProcessEnv) {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value != null && String(value).trim() !== "")
  );
}

// Durante `next build` o Next coleta page data executando módulos; nesse momento
// nem sempre temos as ENV (ex.: preview sem secrets). Validamos estritamente
// apenas em runtime de produção; em build/dev usamos parse parcial.
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
const isBrowser = typeof window !== "undefined";
const strictServer =
  process.env.NODE_ENV === "production" && !isBuildPhase && !isBrowser;

const source = envForParse(process.env);
const _parsed = strictServer
  ? envSchema.parse(source)
  : publicEnvSchema.partial().parse(source);

export const env = _parsed as z.infer<typeof envSchema>;

// Helpers de modo
export const isDemoMode = !env.NEXT_PUBLIC_GHL_BOOKING_WEBHOOK;
export const isStripeConfigured = Boolean(env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && env.STRIPE_SECRET_KEY);
