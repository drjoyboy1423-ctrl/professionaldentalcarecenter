import { createClient } from "npm:@supabase/supabase-js@2";

// Public endpoint: emails a one-time password-reset link to the address saved on the user's profile.
// Secrets: RESEND_API_KEY (required to send), MAIL_FROM (optional), APP_URLS (optional, comma list of allowed app origins).
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const DEFAULT_APPS = [
  "https://dental-clinic-reco-jee.vercel.app",
  "https://dental-clinic-reco-jee-dental-clinic-managements-app.vercel.app",
];
const apps = () => [...DEFAULT_APPS, ...(Deno.env.get("APP_URLS") || "").split(",").map((s) => s.trim().replace(/\/+$/, "")).filter(Boolean)];
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const OK = { ok: true, message: "If that account has an email address saved, a reset link has been sent to it." };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ error: "Email recovery is not set up yet. Ask your admin to reset your password." }, 503);
    const body = await req.json();
    const username = String(body.username || "").trim().toLowerCase();
    if (!/^[a-z0-9_.-]{3,30}$/.test(username)) return json(OK);
    const list = apps();
    const origin = String(body.origin || "").replace(/\/+$/, "");
    const base = list.includes(origin) ? origin : list[0];
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const clinic = String(body.clinic || "");
    let q = sb.from("profiles").select("id,name,email,username,clinic").ilike("username", username.replace(/[_%]/g, (c) => "\\" + c));
    q = (!clinic || clinic === "__hq") ? q.eq("clinic", "all") : q.eq("clinic", clinic);
    const { data: p } = await q.maybeSingle();
    const to = String(p?.email || "").trim();
    if (!p || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) { console.log("recover: no profile/email for", username); return json(OK); }
    const { data: au } = await sb.auth.admin.getUserById(p.id);
    const { data: g, error } = await sb.auth.admin.generateLink({ type: "recovery", email: au?.user?.email || `${String(p.username).toLowerCase()}@dental.app` });
    const th = g?.properties?.hashed_token;
    if (error || !th) { console.log("recover: generateLink failed", error?.message); return json(OK); }
    const link = `${base}/#recovery=${encodeURIComponent(th)}`;
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("MAIL_FROM") || "Professional Dental Care Center <onboarding@resend.dev>",
        to: [to],
        subject: "Reset your password",
        html: `<p>Hello ${esc(p.name || username)},</p><p>We received a request to reset the password for <b>${esc(username)}</b>.</p><p><a href="${link}" style="background:#1e3a8a;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Choose a new password</a></p><p>This link works once and expires soon. If you did not ask for this, ignore this email.</p>`,
      }),
    });
    if (!r.ok) { console.log("recover: resend", r.status, await r.text()); return json({ error: "The email could not be sent. Ask your admin to reset your password." }, 502); }
    return json(OK);
  } catch (_e) {
    return json({ error: "Something went wrong. Try again." }, 400);
  }
});
