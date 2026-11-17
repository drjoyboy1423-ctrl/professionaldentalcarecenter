import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const sha256 = async (t: string) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(t))), (b) => b.toString(16).padStart(2, "0")).join("");

// File types accepted for a CV, checked by the first bytes of the file (not by the name the sender gives it).
const KINDS: Array<{ ext: string; mime: string; magic: number[] }> = [
  { ext: "pdf", mime: "application/pdf", magic: [0x25, 0x50, 0x44, 0x46] },
  { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", magic: [0x50, 0x4b, 0x03, 0x04] },
  { ext: "doc", mime: "application/msword", magic: [0xd0, 0xcf, 0x11, 0xe0] },
  { ext: "jpg", mime: "image/jpeg", magic: [0xff, 0xd8, 0xff] },
  { ext: "png", mime: "image/png", magic: [0x89, 0x50, 0x4e, 0x47] },
];
const MAX = 4 * 1024 * 1024;
const clean = (v: unknown, n: number) => String(v ?? "").replace(/[\u0000-\u001f]+/g, " ").trim().slice(0, n);

// Public endpoint: a person applying for a job at a clinic (found by its clinic code) sends name, phone and a CV file.
// Nothing here reads anything: it can only add one application, limited per sender and per clinic.
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  try {
    const b = await req.json();
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    const code = clean(b.code, 40).toLowerCase();
    if (!code) return json({ error: "This link is incomplete. Ask the clinic for the full link." }, 400);
    const { data: c } = await sb.from("clinics").select("id,name,phone,color,archived").ilike("code", code.replace(/[_%]/g, (x) => "\\" + x)).maybeSingle();
    if (!c || c.archived) return json({ error: "Clinic not found. Check the link with the clinic." }, 404);
    if (b.action === "info") return json({ ok: true, clinic: c.name, phone: c.phone || "", color: c.color || "#0284c7" });

    if (clean(b.website, 50)) return json({ ok: true }); // hidden field that only robots fill in
    const name = clean(b.name, 80), phone = clean(b.phone, 30), position = clean(b.position, 80), message = clean(b.message, 1000);
    if (name.length < 2) return json({ error: "Please write your full name." }, 400);
    if (phone.replace(/\D/g, "").length < 7) return json({ error: "Please write a phone number we can reach you on." }, 400);
    const f = b.file;
    if (!f || typeof f.b64 !== "string") return json({ error: "Please attach your CV (PDF, Word or photo)." }, 400);
    if (f.b64.length > Math.ceil(MAX * 1.4)) return json({ error: "The file is too big. The limit is 4 MB." }, 413);
    let bytes: Uint8Array;
    try { bytes = Uint8Array.from(atob(f.b64), (ch) => ch.charCodeAt(0)); } catch { return json({ error: "The file could not be read. Try again." }, 400); }
    if (bytes.length < 200 || bytes.length > MAX) return json({ error: bytes.length > MAX ? "The file is too big. The limit is 4 MB." : "The file looks empty." }, 400);
    const kind = KINDS.find((k) => k.magic.every((m, i) => bytes[i] === m));
    if (!kind) return json({ error: "Only PDF, Word (doc, docx), JPG or PNG files are accepted." }, 415);

    const ip = (req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown").split(",")[0].trim();
    const ipHash = await sha256(ip + "|" + c.id);
    const hour = new Date(Date.now() - 3600e3).toISOString(), day = new Date(Date.now() - 86400e3).toISOString();
    const { count: mine } = await sb.from("job_applications").select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gt("created_at", hour);
    if ((mine ?? 0) >= 3) return json({ error: "Too many applications from this device. Please try again later." }, 429);
    const { count: all } = await sb.from("job_applications").select("id", { count: "exact", head: true }).eq("clinic", c.id).gt("created_at", day);
    if ((all ?? 0) >= 80) return json({ error: "The clinic is receiving too many applications right now. Please try again tomorrow." }, 429);

    const id = crypto.randomUUID(), path = `${c.id}/${id}.${kind.ext}`;
    const up = await sb.storage.from("applicant-cvs").upload(path, bytes, { contentType: kind.mime, upsert: false });
    if (up.error) return json({ error: "The file could not be saved. Try again." }, 500);
    const fileName = clean(f.name, 100).replace(/[^\w.\- ()]/g, "_") || "cv." + kind.ext;
    const { error } = await sb.from("job_applications").insert({ id, clinic: c.id, name, phone, position: position || null, message: message || null, file_path: path, file_name: fileName, ip_hash: ipHash });
    if (error) { await sb.storage.from("applicant-cvs").remove([path]); return json({ error: "Could not send your application. Try again." }, 500); }
    return json({ ok: true });
  } catch (e) {
    return json({ error: "Something went wrong. Please try again." }, 400);
  }
});
