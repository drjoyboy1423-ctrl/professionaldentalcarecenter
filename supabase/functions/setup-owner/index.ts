import { createClient } from "npm:@supabase/supabase-js@2";

// First-run setup for a NEW clinic database: creates the clinic and its owner (administrator) account.
// Works ONLY while the database has no users at all; after that it always answers { open: false }.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const USERNAME = /^[a-zA-Z0-9_.-]{3,30}$/;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { count, error } = await sb.from("profiles").select("id", { count: "exact", head: true });
    if (error) return json({ open: false, error: error.message });
    if ((count ?? 0) > 0) return json({ open: false });
    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* status check */ }
    if (body.action !== "create") return json({ open: true });

    const clinicName = String(body.clinic || "").trim();
    const ownerName = String(body.name || "").trim();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");
    if (clinicName.length < 2) return json({ error: "Enter the clinic name." }, 400);
    if (!ownerName) return json({ error: "Enter the owner's full name." }, 400);
    if (!USERNAME.test(username)) return json({ error: "Username must be 3-30 letters, numbers, dots, dashes or underscores." }, 400);
    if (password.length < 8) return json({ error: "Password must be at least 8 characters." }, 400);

    const id = (clinicName.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 12) || "clinic") + Math.random().toString(36).slice(2, 6);
    const { error: ce } = await sb.from("clinics").insert({ id, name: clinicName, type: "private", color: "#0284c7", icon: "tooth", phone: String(body.phone || "").trim() || null });
    if (ce) return json({ error: ce.message }, 500);
    const { data: created, error: ue } = await sb.auth.admin.createUser({ email: `${username.toLowerCase()}@dental.app`, password, email_confirm: true });
    if (ue || !created.user) { await sb.from("clinics").delete().eq("id", id); return json({ error: ue?.message || "Could not create the owner account." }, 500); }
    const { error: pe } = await sb.from("profiles").insert({ id: created.user.id, username, role: "admin", clinic: "all", branch: clinicName, name: ownerName, phone: String(body.phone || "").trim(), title: "Owner" });
    if (pe) { await sb.auth.admin.deleteUser(created.user.id); await sb.from("clinics").delete().eq("id", id); return json({ error: pe.message }, 500); }
    return json({ ok: true, clinic: id });
  } catch (e) {
    return json({ error: (e as Error).message || "Setup failed." }, 500);
  }
});
