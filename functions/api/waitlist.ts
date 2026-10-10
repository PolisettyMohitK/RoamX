// Cloudflare Pages Function: POST /api/waitlist
// Set WAITLIST_WEBHOOK_URL in the Pages project (Settings → Variables) to forward signups,
// e.g. to a Google Apps Script web app that appends rows to a Sheet.

interface Env {
  WAITLIST_WEBHOOK_URL?: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"];

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  if (!EMAIL.test(email) || email.length > 200) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }

  const entry: Record<string, string> = { email, at: new Date().toISOString() };
  for (const k of UTM_KEYS) {
    const v = body?.[k];
    if (typeof v === "string" && v.length <= 100) entry[k] = v;
  }

  if (env.WAITLIST_WEBHOOK_URL) {
    const res = await fetch(env.WAITLIST_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entry),
    });
    if (!res.ok) return Response.json({ ok: false }, { status: 502 });
  } else {
    console.log("[waitlist]", JSON.stringify(entry));
  }

  return Response.json({ ok: true });
};
