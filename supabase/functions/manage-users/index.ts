import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (b: unknown, s = 200) =>
  new Response(JSON.stringify(b), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
const fail = (m: string, s = 400) => json({ error: m }, s);

const ROLES = ["admin", "manager", "doctor", "nurse", "reception"];
// Usernames are unique PER CLINIC: clinic staff sign in as <username>@<clinic>.dental.app, admins as <username>@dental.app.
const emailOf = (u: string, clinic: string) => (!clinic || clinic === "all") ? `${u.toLowerCase()}@dental.app` : `${u.toLowerCase()}@${clinic.toLowerCase()}.dental.app`;
const USERNAME = /^[a-zA-Z0-9_.-]{3,30}$/;
const EDITABLE = ["name", "phone", "email", "title", "exp", "idcode", "blood", "expiry"];

function tempPassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  const b = crypto.getRandomValues(new Uint8Array(10));
  return "Dc-" + Array.from(b, (x) => chars[x % chars.length]).join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return fail("Method not allowed", 405);
  try {
    const sb = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: ud, error: ue } = await sb.auth.getUser(token);
    if (ue || !ud?.user) return fail("Please sign in again.", 401);
    const { data: me } = await sb.from("profiles").select("*").eq("id", ud.user.id).single();
    if (!me || !["admin", "manager"].includes(me.role)) return fail("You do not have permission to manage users.", 403);
    const isAdmin = me.role === "admin";
    const body = await req.json();
    const action = body.action as string;

    const getTarget = async (id: string) => {
      const { data: t } = await sb.from("profiles").select("*").eq("id", id).single();
      if (!t) throw new Error("User not found.");
      if (!isAdmin && (t.clinic !== me.clinic || t.role === "admin")) throw new Error("You can only manage staff of your own clinic.");
      return t;
    };
    const adminCount = async () => {
      const { count } = await sb.from("profiles").select("id", { count: "exact", head: true }).eq("role", "admin");
      return count ?? 0;
    };
    const clinicName = async (id: string) => {
      if (id === "all") return "All clinics";
      const { data: c } = await sb.from("clinics").select("name").eq("id", id).single();
      return c?.name ?? null;
    };

    // Is this username already used by someone else in that clinic?
    const taken = async (clinic: string, username: string, exceptId?: string) => {
      let q = sb.from("profiles").select("id").eq("clinic", clinic).ilike("username", username.replace(/[_%]/g, (c) => "\\" + c));
      if (exceptId) q = q.neq("id", exceptId);
      const { data } = await q.limit(1);
      return !!(data && data.length);
    };

    if (action === "create") {
      const username = String(body.username || "").trim();
      const password = String(body.password || "");
      const role = String(body.role || "");
      if (!USERNAME.test(username)) return fail("Username must be 3-30 letters, numbers, dots, dashes or underscores.");
      if (password.length < 6) return fail("Password must be at least 6 characters.");
      if (!ROLES.includes(role)) return fail("Choose a valid role.");
      if (!isAdmin && role === "admin") return fail("Only an admin can create an admin.", 403);
      const clinic = role === "admin" ? "all" : isAdmin ? String(body.clinic || "") : me.clinic;
      const cname = await clinicName(clinic);
      if (!cname) return fail("Choose a valid clinic.");
      if (await taken(clinic, username)) return fail("The username \"" + username + "\" is already used in " + cname + ". Choose a different username for this clinic.");
      const { data: created, error } = await sb.auth.admin.createUser({
        email: emailOf(username, clinic), password, email_confirm: true,
      });
      if (error || !created.user) return fail(/already/i.test(error?.message || "") ? "Username already exists." : (error?.message || "Could not create user."));
      const row: Record<string, unknown> = {
        id: created.user.id, username, role, clinic, branch: cname, name: String(body.name || username),
      };
      for (const k of EDITABLE) if (k !== "name" && body[k] != null) row[k] = String(body[k]);
      const { error: pe } = await sb.from("profiles").insert(row);
      if (pe) {
        await sb.auth.admin.deleteUser(created.user.id);
        return fail(/duplicate/i.test(pe.message) ? "Username already exists." : pe.message);
      }
      return json({ ok: true, id: created.user.id });
    }

    if (action === "update") {
      const t = await getTarget(String(body.id));
      const patch: Record<string, unknown> = {};
      for (const k of EDITABLE) if (body[k] !== undefined) patch[k] = String(body[k]);
      let role = t.role, clinic = t.clinic;
      if (body.role !== undefined && body.role !== t.role) {
        if (!ROLES.includes(body.role)) return fail("Choose a valid role.");
        if (!isAdmin && body.role === "admin") return fail("Only an admin can make an admin.", 403);
        if (t.id === me.id) return fail("You cannot change your own role.");
        if (t.role === "admin" && (await adminCount()) < 2) return fail("At least one admin is required.");
        role = body.role;
      }
      if (isAdmin && body.clinic !== undefined) clinic = String(body.clinic);
      if (role === "admin") clinic = "all";
      else if (clinic === "all") return fail("Choose a clinic for this user.");
      const cname = await clinicName(clinic);
      if (!cname) return fail("Choose a valid clinic.");
      patch.role = role; patch.clinic = clinic; patch.branch = cname;
      {
        const nu = body.username ? String(body.username).trim() : t.username;
        if (nu !== t.username && !USERNAME.test(nu)) return fail("Username must be 3-30 letters, numbers, dots, dashes or underscores.");
        if (nu !== t.username || clinic !== t.clinic) {
          if (await taken(clinic, nu, t.id)) return fail("The username \"" + nu + "\" is already used in " + cname + ". Change this user's username first, then move or save.");
          const { error } = await sb.auth.admin.updateUserById(t.id, { email: emailOf(nu, clinic) });
          if (error) return fail(/already|registered|exists|updating user/i.test(error.message) ? "That username is already used in the chosen clinic." : error.message);
          patch.username = nu;
        }
      }
      if (body.password) {
        if (String(body.password).length < 6) return fail("Password must be at least 6 characters.");
        const { error } = await sb.auth.admin.updateUserById(t.id, { password: String(body.password) });
        if (error) return fail(error.message);
      }
      const { error: pe } = await sb.from("profiles").update(patch).eq("id", t.id);
      if (pe) return fail(/duplicate/i.test(pe.message) ? "Username already exists." : pe.message);
      return json({ ok: true });
    }

    if (action === "reset") {
      const t = await getTarget(String(body.id));
      const pw = tempPassword();
      const { error } = await sb.auth.admin.updateUserById(t.id, { password: pw });
      if (error) return fail(error.message);
      return json({ ok: true, password: pw });
    }

    if (action === "delete") {
      const t = await getTarget(String(body.id));
      if (t.id === me.id) return fail("You cannot delete your own account.");
      if (t.role === "admin" && (await adminCount()) < 2) return fail("At least one admin is required.");
      const { error } = await sb.auth.admin.deleteUser(t.id);
      if (error) return fail(error.message);
      return json({ ok: true });
    }

    if (action === "purge_clinic") {
      if (!isAdmin) return fail("Only an admin can delete a clinic.", 403);
      const { data: list } = await sb.from("profiles").select("id").eq("clinic", String(body.clinic)).neq("role", "admin");
      for (const u of list ?? []) await sb.auth.admin.deleteUser(u.id);
      return json({ ok: true, removed: (list ?? []).length });
    }

    if (action === "archive_clinic") {
      if (!isAdmin) return fail("Only an admin can archive a clinic.", 403);
      const archive = !!body.archive;
      const { data: list } = await sb.from("profiles").select("id").eq("clinic", String(body.clinic)).neq("role", "admin");
      for (const u of list ?? []) {
        const { error } = await sb.auth.admin.updateUserById(u.id, { ban_duration: archive ? "876000h" : "none" });
        if (error) return fail(error.message);
      }
      return json({ ok: true, users: (list ?? []).length });
    }

    return fail("Unknown action.");
  } catch (e) {
    return fail((e as Error).message || "Something went wrong.", 400);
  }
});
