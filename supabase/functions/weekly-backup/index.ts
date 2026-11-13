import { createClient } from "npm:@supabase/supabase-js@2";

// Weekly backup of every clinic. Called by pg_cron (Sundays) or by an admin ("Backup now").
// Saves one JSON file per clinic in the private "backups" bucket (same format the app's "Restore backup" reads),
// keeps the newest 8 per clinic, and emails every admin a link that works for 7 days.
// Safe to call by anyone: unless an admin forces it, it does nothing if a backup is less than 6 days old.
const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) => new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const esc = (s: string) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const BUCKET = "backups"; let KEEP = 8, MIN_DAYS = 6;
// only public https addresses (no localhost, private ranges or raw IPs) so this cannot be used to reach internal services
const publicHttps = (u: string) => { try { const x = new URL(u); const h = x.hostname.toLowerCase(); return x.protocol === "https:" && !/^(localhost|.*\.(local|internal|lan))$/.test(h) && !/^[\d.]+$/.test(h) && !h.includes(":") && h.includes("."); } catch { return false; } };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false, autoRefreshToken: false } });
    let body: Record<string, unknown> = {};
    try { body = await req.json(); } catch { /* cron sends {} */ }

    KEEP = 8; MIN_DAYS = 6;
    { const { data: st } = await sb.from("app_settings").select("key,value").in("key", ["backup.keep", "backup.minDays"]); const g = (k: string) => st?.find((r) => r.key === k)?.value; if (Number(g("backup.keep")) > 0) KEEP = Number(g("backup.keep")); if (g("backup.minDays") !== undefined && Number(g("backup.minDays")) >= 0) MIN_DAYS = Number(g("backup.minDays")); }
    let forced = false;
    if (body.force) {
      const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
      const { data: ud } = await sb.auth.getUser(token);
      const { data: me } = ud?.user ? await sb.from("profiles").select("role").eq("id", ud.user.id).single() : { data: null };
      if (me?.role !== "admin") return json({ error: "Only an admin can run a backup now." }, 403);
      forced = true;
    }

    const { data: buckets } = await sb.storage.listBuckets();
    if (!buckets?.some((b) => b.name === BUCKET)) await sb.storage.createBucket(BUCKET, { public: false });

    const { data: clinics, error: ce } = await sb.from("clinics").select("*").order("created_at");
    if (ce) return json({ error: ce.message }, 500);
    if (!clinics?.length) return json({ ok: true, note: "No clinics." });

    if (!forced) {
      const { data: last } = await sb.storage.from(BUCKET).list(clinics[0].id, { limit: 1, sortBy: { column: "created_at", order: "desc" } });
      const t = last?.[0]?.created_at ? Date.parse(last[0].created_at) : 0;
      if (t && Date.now() - t < MIN_DAYS * 864e5) return json({ ok: true, skipped: `A backup was made less than ${MIN_DAYS} days ago.` });
    }

    const day = new Date().toISOString().slice(0, 10);
    let site = 0, siteError = "";
    const rows: { name: string; patients: number; kb: number; url: string; file: string }[] = [];
    for (const c of clinics) {
      const patients: unknown[] = [];
      for (let i = 0; ; i += 1000) {
        const { data } = await sb.from("patients").select("id,data").eq("clinic", c.id).order("id").range(i, i + 999);
        patients.push(...(data ?? []).map((r) => r.data));
        if (!data || data.length < 1000) break;
      }
      const { data: lists } = await sb.from("clinic_lists").select("kind,data").eq("clinic", c.id);
      const { data: staff } = await sb.from("profiles").select("username,role,name,phone,email,title").eq("clinic", c.id);
      const file = JSON.stringify({ format: "prodental-clinic-backup", version: 1, created: new Date().toISOString(), clinic: c, patients, lists: (lists ?? []).map((l) => l.kind === "fin" && l.data?.bk ? { ...l, data: { ...l.data, bk: { ...l.data.bk, token: "" } } } : l), staff: staff ?? [] });
      // Optional per-clinic copy to the clinic's own website/server (Settings > Where backups are kept)
      const bk = (lists ?? []).find((l) => l.kind === "fin")?.data?.bk;
      if (bk?.cloud && bk.token && publicHttps(String(bk.url || ""))) {
        try {
          const sr = await fetch(String(bk.url), { method: "POST", headers: { "Content-Type": "application/json", "X-Backup-Token": String(bk.token), "X-Backup-Name": `backup-${String(c.name).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${day}.json` }, body: file, signal: AbortSignal.timeout(60000) });
          if (sr.ok) site++; else siteError = `${c.name}: server answered ${sr.status}`;
        } catch (e) { siteError = `${c.name}: ${(e as Error).message}`; }
      }
      const path = `${c.id}/${day}.json`;
      const up = await sb.storage.from(BUCKET).upload(path, new Blob([file], { type: "application/json" }), { upsert: true, contentType: "application/json" });
      if (up.error) return json({ error: `Could not save ${c.name}: ${up.error.message}` }, 500);
      const { data: all } = await sb.storage.from(BUCKET).list(c.id, { limit: 100, sortBy: { column: "name", order: "desc" } });
      const old = (all ?? []).slice(KEEP).map((f) => `${c.id}/${f.name}`);
      if (old.length) await sb.storage.from(BUCKET).remove(old);
      const { data: s } = await sb.storage.from(BUCKET).createSignedUrl(path, 7 * 86400, { download: `backup-${c.id}-${day}.json` });
      rows.push({ name: c.name, patients: patients.length, kb: Math.round(file.length / 1024), url: s?.signedUrl ?? "", file: `backup-${c.id}-${day}.json` });
    }

    // Optional: also save each backup file straight into a Google Drive folder (see supabase/GOOGLE-DRIVE-BACKUP.md).
    let drive = 0, driveError = "";
    const hook = (Deno.env.get("DRIVE_WEBHOOK_URL") || "").trim(), dtok = (Deno.env.get("DRIVE_TOKEN") || "").replace(/[\s\u200b"']/g, "");
    if (hook && dtok) {
      for (const r of rows) {
        try {
          const dr = await fetch(hook, { method: "POST", headers: { "Content-Type": "text/plain" }, body: JSON.stringify({ token: dtok, name: r.file, url: r.url }) });
          const dj = await dr.json().catch(() => ({}));
          if (dr.ok && dj.ok) drive++; else driveError = `${r.name}: ${dj.error || dr.status}`;
        } catch (e) { driveError = `${r.name}: ${(e as Error).message}`; }
      }
    }

    let emailed = 0;
    const key = Deno.env.get("RESEND_API_KEY");
    const { data: admins } = await sb.from("profiles").select("email,name").eq("role", "admin");
    // Extra backup mailboxes: set the BACKUP_EMAILS secret (comma list). Empty by default so a client's data only goes to its own admins.
    const extra = (Deno.env.get("BACKUP_EMAILS") || "").split(",");
    // pull a clean address out of each entry (ignores stray quotes, spaces, brackets or "NAME=" text)
    const clean = (v: string) => (String(v).match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/) || [""])[0].toLowerCase();
    const to = [...new Set([...(admins ?? []).map((a) => String(a.email || "")), ...extra].map(clean).filter(Boolean))];
    let mailError = "";
    if (!key) mailError = "Email is not set up (RESEND_API_KEY secret is missing).";
    else if (!to.length) mailError = "No valid email address to send to.";
    else {
      const html = `<p>Weekly backup finished on <b>${day}</b>. The links work for 7 days; the files stay saved in your Supabase storage (newest ${KEEP} per clinic).</p><table cellpadding="6" style="border-collapse:collapse">${rows.map((r) => `<tr><td style="border-bottom:1px solid #ddd"><b>${esc(r.name)}</b><br>${r.patients} patients, ${r.kb} KB</td><td style="border-bottom:1px solid #ddd"><a href="${r.url}">Download backup</a></td></tr>`).join("")}</table><p style="color:#666;font-size:12px">Keep these files private: they contain patient data. To restore, open Clinics &gt; Restore backup in the app.</p>`;
      // one email per address, so one rejected address never blocks the others
      for (const addr of to) {
        const r = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ from: Deno.env.get("MAIL_FROM") || "ProDental Records <onboarding@resend.dev>", to: [addr], subject: `Weekly backup ${day}: ${rows.length} clinic${rows.length == 1 ? "" : "s"}`, html }),
        });
        if (r.ok) emailed++;
        else { const t = await r.text(); console.log("backup email failed", addr, r.status, t); mailError = `${addr}: ${t.slice(0, 160)}`; }
      }
    }
    return json({ ok: true, clinics: rows.length, site, siteError, emailed, mailError, drive, driveError, driveOn: !!(hook && dtok), day });
  } catch (e) {
    return json({ error: (e as Error).message || "Backup failed." }, 500);
  }
});
