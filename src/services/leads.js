import { API_CONFIG } from "../config/api";

/* -------------------------------------------------------------------------- */
/* Lead submission service                                                    */
/* -------------------------------------------------------------------------- */
/* Single entry point used by every form on the site. Builds a normalized     */
/* payload and POSTs it to the GoHighLevel webhook configured for the form    */
/* type. If no webhook is configured we run in "demo mode" — the call simply  */
/* logs to the console and resolves successfully so the UI keeps flowing.    */
/* -------------------------------------------------------------------------- */

/**
 * Submit a lead/form payload.
 *
 * @param {string} formType - one of: booking | owner_signup | customer_signup
 *                            | driver_signup | contact
 * @param {object} data     - the form's raw data (matches input name attrs)
 * @param {object} [meta]   - optional extra metadata (page, utm, etc.)
 * @returns {Promise<{ ok: boolean, demo?: boolean, error?: string }>}
 */
export async function submitLead(formType, data, meta = {}) {
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

  // Always log to make integration debugging easier in dev tools.
  // eslint-disable-next-line no-console
  console.log(`[FAGU lead:${formType}]`, payload);

  const webhook = API_CONFIG.ghl[formType];

  // Demo mode — no webhook configured yet. Simulate a short async call so
  // the submit button still shows the loading state.
  if (!webhook) {
    await new Promise((r) => setTimeout(r, 700));
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
    // eslint-disable-next-line no-console
    console.error(`[FAGU lead:${formType}] failed`, err);
    return { ok: false, error: err?.message || "network_error" };
  }
}
