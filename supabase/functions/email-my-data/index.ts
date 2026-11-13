import { createClient } from "npm:@supabase/supabase-js@2";

// Emails a signed-in user a copy of their own data file, ONLY to the email address saved on their own profile.
// Body: { filename, content (text), gzip? (content is base64 of a gzip file) }. Secrets: RESEND_API_KEY, MAIL_FROM (optional).
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const b64 = (s: string) => { const u = new TextEncoder().encode(s); let bin = ""; for (let i = 0; i < u.length; i += 0x8000) bin += String.fromCharCode(...u.subarray(i, i + 0x8000)); return btoa(bin); };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  try {
    const key = Deno.env.get("RESEND_API_KEY");
    if (!key) return json({ error: "Email is not set up on the server yet (RESEND_API_KEY)." }, 503);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: ud } = await sb.auth.getUser(token);
    if (!ud?.user) return json({ error: "Please sign in again." }, 401);
    const { data: me } = await sb.from("profiles").select("name,email,role,clinic").eq("id", ud.user.id).single();
    const to = String(me?.email || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) return json({ error: "Your profile has no email address. Open Profile > Edit and add it first." }, 400);
    const b = await req.json();
    const filename = String(b.filename || "my-data.json").replace(/[^A-Za-z0-9._-]+/g, "-").slice(0, 80);
    const content = String(b.content || "");
    if (!content) return json({ error: "Nothing to send." }, 400);
    if (content.length > 18_000_000) return json({ error: "The file is too large to email. Save it to your device instead." }, 413);
    const att = b.gzip ? content : b64(content);
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: Deno.env.get("MAIL_FROM") || "ProDental Records <onboarding@resend.dev>",
        to: [to],
        subject: `Your ProDental Records data (${new Date().toISOString().slice(0, 10)})`,
        html: `<p>Hello ${esc(me?.name || "")},</p><p>Your data copy is attached (${esc(filename)}).</p><p style="color:#666;font-size:12px">It may contain patient information. Keep it private and delete it when you no longer need it.</p>`,
        attachments: [{ filename, content: att }],
      }),
    });
    if (!r.ok) { const t = await r.text(); console.log("email-my-data", r.status, t); return json({ error: "The email could not be sent: " + t.slice(0, 160) }, 502); }
    return json({ ok: true, to: to.replace(/^(.).*(@.*)$/, "$1***$2") });
  } catch (e) {
    return json({ error: (e as Error).message || "Failed." }, 500);
  }
});
