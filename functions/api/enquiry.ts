// Cloudflare Pages Function: POST /api/enquiry
// Set ENQUIRY_WEBHOOK_URL in the Pages project (Settings → Variables) to forward enquiries,
// e.g. to a Google Apps Script web app that appends rows to a Sheet, or an email/CRM webhook.

interface Env {
  ENQUIRY_WEBHOOK_URL?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FIELDS = ["name", "email", "phone", "destination", "when", "travellers", "kind"];
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const entry: Record<string, string> = { at: new Date().toISOString() };
  for (const k of [...FIELDS, ...UTM_KEYS]) {
    const v = body?.[k];
    if (typeof v === "string" && v.trim()) entry[k] = v.trim().slice(0, 200);
  }

  const reachable = EMAIL.test(entry.email ?? "") || (entry.phone ?? "").replace(/\D/g, "").length >= 7;
  if (!entry.name || !reachable) {
    return Response.json({ ok: false, error: "Name and an email or phone number are required" }, { status: 400 });
  }

  if (env.ENQUIRY_WEBHOOK_URL) {
    const res = await fetch(env.ENQUIRY_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) return Response.json({ ok: false }, { status: 502 });
  } else {
    console.log("[enquiry]", JSON.stringify(entry));
  }

  return Response.json({ ok: true });
};
