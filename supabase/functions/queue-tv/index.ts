import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json", "Cache-Control": "no-store" } });
const clean = (v: unknown, n: number) => String(v ?? "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);
const same = (a: string, b: string) => { if (a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i); return d === 0; };

// Waiting-room TV: the TV page sends the clinic code and the secret key from the TV link.
// It gets back numbers and chairs only (no patient names), the clinic name/logo and the monitor ads. It cannot change anything.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const b = await req.json();
    const code = clean(b.code, 40).toLowerCase(), key = clean(b.key, 40);
    if (!code || !key) return json({ error: "This TV link is incomplete. Open the TV link again from the clinic app." }, 400);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: c } = await sb.from("clinics").select("id,name,color,logo,archived").ilike("code", code.replace(/[_%]/g, (x) => "\\" + x)).maybeSingle();
    const { data: k } = c ? await sb.from("clinic_tv").select("key").eq("clinic", c.id).maybeSingle() : { data: null };
    if (!c || c.archived || !k || !same(String(k.key), key)) return json({ error: "This TV link is not valid any more. Ask the clinic for the new link." }, 403);

    const day = new Date(Date.now() + 3 * 3600e3).toISOString().slice(0, 10); // Addis Ababa date, same as the app
    const { data: t } = await sb.from("queue_tickets").select("id,no,chair,status,called_at,priority").eq("clinic", c.id).eq("day", day).in("status", ["waiting", "called"]).order("no").limit(300);
    const list = t || [];
    const called = list.filter((x) => x.status === "called").sort((a, b) => String(b.called_at).localeCompare(String(a.called_at))).slice(0, 4);
    const waiting = list.filter((x) => x.status === "waiting").sort((a, b) => (b.priority || 0) - (a.priority || 0) || a.no - b.no).slice(0, 8);
    let ads: unknown[] = [];
    if (b.ads) {
      const r = await sb.from("clinic_ads").select("id,title,body,image").eq("clinic", c.id).eq("kind", "promo").eq("active", true).order("sort").order("created_at", { ascending: false }).limit(10);
      ads = r.data || [];
    }
    const logo = typeof c.logo === "string" && c.logo.startsWith("data:image/") && c.logo.length < 200000 ? c.logo : "";
    return json({ ok: true, clinic: c.name, color: c.color || "#0284c7", logo, called, waiting, total: list.length, ads: b.ads ? ads : undefined });
  } catch (_e) {
    return json({ error: "Something went wrong. Please try again." }, 400);
  }
});
