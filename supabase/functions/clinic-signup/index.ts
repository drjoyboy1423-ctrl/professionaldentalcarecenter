import { createClient } from "npm:@supabase/supabase-js@2";

// Self-service clinic sign-up from the sign-in page. The clinic and its manager account are created at once as a
// one-year free period (approved=false). The administrator must approve the clinic before the free year ends, otherwise it is locked.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const CODE = /^[a-z0-9]{2,20}$/;
const USER = /^[a-z0-9._]{3,30}$/;
const MAX_PER_DAY = 25;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "POST only" }, 405);
  let created: string | null = null, clinicId: string | null = null;
  const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
  try {
    const b = await req.json();
    if (b.website) return json({ ok: true }); // honeypot
    const name = String(b.name || "").trim(), owner = String(b.owner || "").trim(), phone = String(b.phone || "").trim(), email = String(b.email || "").trim();
    const code = String(b.code || "").trim().toLowerCase(), username = String(b.username || "").trim().toLowerCase(), password = String(b.password || "");
    if (name.length < 2 || name.length > 80) return json({ error: "Enter the clinic name." }, 400);
    if (owner.length < 2 || owner.length > 80) return json({ error: "Enter your name." }, 400);
    if (!phone && !email) return json({ error: "Enter a phone number or an email." }, 400);
    if (email && !/^\S+@\S+\.\S+$/.test(email)) return json({ error: "That email does not look right." }, 400);
    if (!CODE.test(code) || ["admin", "administrator"].includes(code)) return json({ error: "Clinic code: 2 to 20 letters or numbers (not \"admin\")." }, 400);
    if (!USER.test(username)) return json({ error: "Username: 3 to 30 letters, numbers, dot or underscore." }, 400);
    if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);

    const since = new Date(Date.now() - 864e5).toISOString();
    const { count } = await sb.from("clinics").select("id", { count: "exact", head: true }).eq("approved", false).gte("created_at", since);
    if ((count ?? 0) >= MAX_PER_DAY) return json({ error: "Too many new clinics today. Please try again tomorrow or contact us." }, 429);
    const { data: ex } = await sb.from("clinics").select("id").ilike("code", code).maybeSingle();
    if (ex) return json({ error: "That clinic code is already taken. Choose another." }, 409);

    clinicId = "c" + Date.now();
    const trialUntil = new Date(Date.now() + 365 * 864e5).toISOString();
    const { error: ce } = await sb.from("clinics").insert({ id: clinicId, name, code, type: "private", color: "#0284c7", icon: "tooth", phone: phone || null, approved: false, trial_until: trialUntil });
    if (ce) return json({ error: /duplicate|clinics_code_key/i.test(ce.message) ? "That clinic code is already taken. Choose another." : ce.message }, 500);
    const { data: u, error: ue } = await sb.auth.admin.createUser({ email: `${username}@${clinicId}.dental.app`, password, email_confirm: true });
    if (ue || !u.user) { await sb.from("clinics").delete().eq("id", clinicId); return json({ error: ue?.message || "Could not create the account." }, 500); }
    created = u.user.id;
    const { error: pe } = await sb.from("profiles").insert({ id: created, username, role: "manager", clinic: clinicId, branch: name, name: owner, phone, email });
    if (pe) { await sb.auth.admin.deleteUser(created); await sb.from("clinics").delete().eq("id", clinicId); return json({ error: pe.message }, 500); }
    return json({ ok: true, code, trial_until: trialUntil });
  } catch (e) {
    if (created) await sb.auth.admin.deleteUser(created).catch(() => {});
    if (clinicId) await sb.from("clinics").delete().eq("id", clinicId).catch(() => {});
    return json({ error: (e as Error).message || "Sign-up failed." }, 500);
  }
});
