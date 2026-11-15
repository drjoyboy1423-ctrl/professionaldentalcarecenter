import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const sha256 = async (t: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))), (b) => b.toString(16).padStart(2, "0")).join("");

// Read-only view for an on-site inspector: sterilization log and equipment checks of ONE clinic. Nothing about patients.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const { token } = await req.json();
    if (typeof token !== "string" || token.length < 20 || token.length > 100) return json({ error: "This link is not valid." }, 403);
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: t } = await sb.from("inspector_tokens").select("id,clinic,expires_at,revoked").eq("token_hash", await sha256(token)).maybeSingle();
    if (!t || t.revoked) return json({ error: "This link is not valid or was cancelled." }, 403);
    if (new Date(t.expires_at).getTime() < Date.now()) return json({ error: "This link has expired. Ask the clinic manager for a new one." }, 403);
    const { data: c } = await sb.from("clinics").select("name").eq("id", t.clinic).maybeSingle();
    const { data: st } = await sb.from("clinic_lists").select("data").eq("clinic", t.clinic).eq("kind", "stock").maybeSingle();
    const ster = ((st?.data as { ster?: Array<Record<string, unknown>> } | null)?.ster ?? [])
      .slice().sort((a, b) => Number(b.t ?? 0) - Number(a.t ?? 0)).slice(0, 500)
      .map((x) => ({ t: x.t, machine: x.machine, type: x.type, res: x.res, by: x.by, note: x.note }));
    const { data: mt } = await sb.from("maint_items").select("kind,equipment,title,status,note,due,done_at,created_name,assigned_name,created_at")
      .eq("clinic", t.clinic).neq("kind", "fault").order("created_at", { ascending: false }).limit(300);
    await sb.from("audit_events").insert({ clinic: t.clinic, action: "INSPECT", resource: "inspector link " + String(t.id).slice(0, 8), user_name: "Inspector (link)" });
    return json({ ok: true, clinic: c?.name ?? t.clinic, expires_at: t.expires_at, ster, checks: mt ?? [] });
  } catch (_e) {
    return json({ error: "Something went wrong." }, 400);
  }
});
