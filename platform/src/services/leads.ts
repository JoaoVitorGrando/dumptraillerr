import { API_CONFIG } from "@/config/api";
import type { FormType, LeadResult } from "@/types";

/**
 * Submit a lead/form payload to the matching GoHighLevel webhook.
 * If the webhook URL is not configured we run in "demo mode": the call
 * simulates a short async delay and resolves successfully so the UI
 * keeps flowing without errors.
 *
 * @param formType - one of: booking | owner_signup | customer_signup | driver_signup | contact
 * @param data     - the form's raw data (matches input name attrs)
 * @param meta     - optional extra metadata (page, utm, etc.)
 */
export async function submitLead(
  formType: FormType,
  data: Record<string, unknown>,
  meta: Record<string, unknown> = {}
): Promise<LeadResult> {
  const payload = {
    formType,
    submittedAt: new Date().toISOString(),
    source: API_CONFIG.leadSource,
    page: typeof window !== "undefined" ? window.location.pathname : "",
    referrer:
      typeof document !== "undefined" ? document.referrer || null : null,
    ...meta,
    data,
  };

  // Always log to simplify integration debugging
  console.log(`[FAGU lead:${formType}]`, payload);

  const webhook = API_CONFIG.ghl[formType];

  // Demo mode — no webhook configured yet
  if (!webhook) {
    await new Promise<void>((r) => setTimeout(r, 700));
    return { ok: true, demo: true };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    const message = err instanceof Error ? err.message : "network_error";
    console.error(`[FAGU lead:${formType}] failed`, err);
    return { ok: false, error: message };
  }
}
