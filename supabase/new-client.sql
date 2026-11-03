-- ONE-SHOT SETUP for a NEW client's EMPTY Supabase project. Paste all of this into SQL Editor > Run.
-- SmartDent / Professional Dental Care Center: database schema (reference copy of the LIVE project).
-- Row-level security is per clinic and per role. Do NOT replace it with "using (true)" policies.
-- Live project: qorufqosjdhefnafwfzh. Only run this on a NEW, empty Supabase project.

create schema if not exists private;

create table public.clinics (
  id text primary key,
  name text not null,
  type text not null default 'private',
  color text not null default '#dc2626',
  icon text not null default 'tooth',
  logo text,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  role text not null check (role in ('admin','manager','doctor','nurse','reception')),
  clinic text not null default 'kal',
  branch text not null default '',
  name text not null default '',
  phone text not null default '',
  email text not null default '',
  title text, exp text, idcode text, blood text, expiry text, avatar text,
  created_at timestamptz not null default now()
);

create table public.patients (
  id bigint primary key,
  clinic text not null references public.clinics(id),
  data jsonb not null,                       -- whole patient record (invoices, records, payments ...)
  updated_at timestamptz not null default now()
);

create table public.clinic_lists (
  clinic text not null references public.clinics(id),
  kind text not null check (kind in ('dis','proc','fin')),   -- fin = salaries + expenses (manager/admin only)
  data jsonb not null,
  updated_at timestamptz not null default now(),
  primary key (clinic, kind)
);

-- helpers used by the policies (security definer so they can read profiles)
create or replace function private.my_role() returns text
  language sql stable security definer set search_path to 'public'
  as $$ select role from public.profiles where id = (select auth.uid()) $$;
create or replace function private.my_clinic() returns text
  language sql stable security definer set search_path to 'public'
  as $$ select clinic from public.profiles where id = (select auth.uid()) $$;

alter table public.clinics enable row level security;
alter table public.profiles enable row level security;
alter table public.patients enable row level security;
alter table public.clinic_lists enable row level security;

-- clinics
create policy clinics_read on public.clinics for select using (true);
create policy clinics_admin_ins on public.clinics for insert with check ((select private.my_role()) = 'admin');
create policy clinics_admin_upd on public.clinics for update using ((select private.my_role()) = 'admin') with check ((select private.my_role()) = 'admin');
create policy clinics_admin_del on public.clinics for delete using ((select private.my_role()) = 'admin');

-- profiles (writes go through the manage-users edge function, which uses the service role)
create policy profiles_read on public.profiles for select using (
  id = (select auth.uid()) or (select private.my_role()) = 'admin'
  or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy profiles_update_own on public.profiles for update
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- patients
create policy patients_read on public.patients for select using (
  (select private.my_role()) = 'admin' or clinic = (select private.my_clinic()));
create policy patients_insert on public.patients for insert with check (
  (select private.my_role()) in ('reception','manager') and clinic = (select private.my_clinic()));
create policy patients_update on public.patients for update
  using ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic()))
  with check ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic()));
create policy patients_delete on public.patients for delete using (
  (select private.my_role()) in ('admin','manager','reception')
  and ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic())));

-- clinic_lists: dis/proc for manager+doctor of the clinic; fin ONLY for the clinic manager (and admin)
create policy lists_read on public.clinic_lists for select using (
  (select private.my_role()) = 'admin'
  or (kind <> 'fin' and clinic = (select private.my_clinic()))
  or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy lists_insert on public.clinic_lists for insert with check (
  (select private.my_role()) = 'admin'
  or (kind <> 'fin' and (select private.my_role()) in ('manager','doctor') and clinic = (select private.my_clinic()))
  or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy lists_update on public.clinic_lists for update
  using (
    (select private.my_role()) = 'admin'
    or (kind <> 'fin' and (select private.my_role()) in ('manager','doctor') and clinic = (select private.my_clinic()))
    or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())))
  with check (
    (select private.my_role()) = 'admin'
    or (kind <> 'fin' and (select private.my_role()) in ('manager','doctor') and clinic = (select private.my_clinic()))
    or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy lists_delete on public.clinic_lists for delete using (
  (select private.my_role()) = 'admin'
  or (kind <> 'fin' and (select private.my_role()) in ('manager','doctor') and clinic = (select private.my_clinic()))
  or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));

-- ===== columns added after the first version =====
alter table public.clinics add column if not exists name_am text, add column if not exists phone text, add column if not exists address text, add column if not exists archived boolean not null default false;

-- ===== 20261030_block_profile_privilege_escalation.sql =====
-- SECURITY FIX: without this, any signed-in user could PATCH their own profile row and set role='admin' or another clinic.
create or replace function private.profiles_guard() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  -- Signed-in users (auth.uid() not null) may only edit personal details.
  -- role / clinic / username / id change only via the manage-users edge function (service role, auth.uid() is null).
  if (select auth.uid()) is not null and (
       new.id is distinct from old.id or new.role is distinct from old.role
    or new.clinic is distinct from old.clinic or new.username is distinct from old.username) then
    raise exception 'You cannot change your role, clinic or username.' using errcode = '42501';
  end if;
  return new;
end $$;
revoke all on function private.profiles_guard() from public, anon, authenticated;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles for each row execute function private.profiles_guard();
revoke update on public.profiles from anon;

-- ===== 20261031_activity_log.sql =====
-- Activity log: records who added / changed / deleted what. Run ONCE in the Supabase SQL editor.
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid, actor_name text, clinic text,
  tbl text not null, op text not null, rec text, summary text
);
create index if not exists audit_log_clinic_at on public.audit_log (clinic, at desc);
create index if not exists audit_log_at on public.audit_log (at desc);
alter table public.audit_log enable row level security;
drop policy if exists audit_read on public.audit_log;
create policy audit_read on public.audit_log for select using (
  (select private.my_role()) = 'admin'
  or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));

create or replace function private.audit() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare a uuid := (select auth.uid()); an text; cl text; rc text; sm text; k text; ch text[] := '{}'; o jsonb; n jsonb;
begin
  select coalesce(nullif(name,''),username)||' ('||role||')' into an from public.profiles where id = a;
  if an is null then an := case when a is null then 'System / admin tools' else 'Unknown user' end; end if;
  if TG_TABLE_NAME = 'patients' then
    cl := coalesce(new.clinic, old.clinic); rc := coalesce(new.id, old.id)::text;
    if TG_OP = 'INSERT' then sm := 'Added patient ' || coalesce(new.data->>'name','?');
    elsif TG_OP = 'DELETE' then sm := 'Deleted patient ' || coalesce(old.data->>'name','?');
    else
      o := old.data; n := new.data;
      for k in select key from jsonb_each(n) where key <> 'd' loop if n->k is distinct from o->k then ch := ch || k; end if; end loop;
      for k in select key from jsonb_each(coalesce(n->'d','{}'::jsonb)) loop if (n->'d'->k) is distinct from (o->'d'->k) then ch := ch || k; end if; end loop;
      for k in select key from jsonb_each(coalesce(o->'d','{}'::jsonb)) loop if not (coalesce(n->'d','{}'::jsonb) ? k) then ch := ch || k; end if; end loop;
      if array_length(ch,1) is null then return null; end if;
      sm := 'Changed ' || coalesce(n->>'name','?') || ': ' || array_to_string(ch, ', ');
    end if;
  elsif TG_TABLE_NAME = 'clinic_lists' then
    cl := coalesce(new.clinic, old.clinic); rc := coalesce(new.kind, old.kind);
    sm := case TG_OP when 'DELETE' then 'Deleted list ' else 'Saved list ' end || rc;
  elsif TG_TABLE_NAME = 'profiles' then
    cl := coalesce(new.clinic, old.clinic); rc := coalesce(new.username, old.username);
    if TG_OP = 'INSERT' then sm := 'Added user ' || new.username || ' as ' || new.role;
    elsif TG_OP = 'DELETE' then sm := 'Deleted user ' || old.username || ' (' || old.role || ')';
    else
      if new.role is distinct from old.role then ch := ch || ('role ' || old.role || ' to ' || new.role); end if;
      if new.clinic is distinct from old.clinic then ch := ch || ('clinic ' || old.clinic || ' to ' || new.clinic); end if;
      if new.username is distinct from old.username then ch := ch || ('username ' || old.username || ' to ' || new.username); end if;
      if array_length(ch,1) is null then return null; end if;
      sm := 'Changed user ' || old.username || ': ' || array_to_string(ch, ', ');
    end if;
  elsif TG_TABLE_NAME = 'clinics' then
    cl := coalesce(new.id, old.id); rc := coalesce(new.name, old.name);
    if TG_OP = 'INSERT' then sm := 'Created clinic ' || new.name;
    elsif TG_OP = 'DELETE' then sm := 'Deleted clinic ' || old.name;
    else
      if new.archived is distinct from old.archived then ch := ch || (case when new.archived then 'archived' else 'restored' end); end if;
      if new.name is distinct from old.name then ch := ch || 'name'; end if;
      if array_length(ch,1) is null then return null; end if;
      sm := 'Clinic ' || new.name || ': ' || array_to_string(ch, ', ');
    end if;
  end if;
  insert into public.audit_log(actor, actor_name, clinic, tbl, op, rec, summary) values (a, an, cl, TG_TABLE_NAME, TG_OP, rc, sm);
  return null;
end $$;
revoke all on function private.audit() from public, anon, authenticated;
drop trigger if exists audit_patients on public.patients;
create trigger audit_patients after insert or update or delete on public.patients for each row execute function private.audit();
drop trigger if exists audit_lists on public.clinic_lists;
create trigger audit_lists after insert or update or delete on public.clinic_lists for each row execute function private.audit();
drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles after insert or update or delete on public.profiles for each row execute function private.audit();
drop trigger if exists audit_clinics on public.clinics;
create trigger audit_clinics after insert or update or delete on public.clinics for each row execute function private.audit();

-- ===== stock.sql =====
-- One-time update: lets reception and manager save the dental materials stock list.
alter table public.clinic_lists drop constraint if exists clinic_lists_kind_check;
alter table public.clinic_lists add constraint clinic_lists_kind_check check (kind in ('dis','proc','fin','stock'));
drop policy if exists lists_insert on public.clinic_lists;
drop policy if exists lists_update on public.clinic_lists;
drop policy if exists lists_delete on public.clinic_lists;
create policy lists_insert on public.clinic_lists for insert with check ((select private.my_role())='admin' or (kind not in ('fin','stock') and (select private.my_role()) in ('manager','doctor') and clinic=(select private.my_clinic())) or (kind='stock' and (select private.my_role()) in ('manager','reception','nurse') and clinic=(select private.my_clinic())) or (kind='fin' and (select private.my_role())='manager' and clinic=(select private.my_clinic())));
create policy lists_update on public.clinic_lists for update using ((select private.my_role())='admin' or (kind not in ('fin','stock') and (select private.my_role()) in ('manager','doctor') and clinic=(select private.my_clinic())) or (kind='stock' and (select private.my_role()) in ('manager','reception','nurse') and clinic=(select private.my_clinic())) or (kind='fin' and (select private.my_role())='manager' and clinic=(select private.my_clinic()))) with check ((select private.my_role())='admin' or (kind not in ('fin','stock') and (select private.my_role()) in ('manager','doctor') and clinic=(select private.my_clinic())) or (kind='stock' and (select private.my_role()) in ('manager','reception','nurse') and clinic=(select private.my_clinic())) or (kind='fin' and (select private.my_role())='manager' and clinic=(select private.my_clinic())));
create policy lists_delete on public.clinic_lists for delete using ((select private.my_role())='admin' or (kind not in ('fin','stock') and (select private.my_role()) in ('manager','doctor') and clinic=(select private.my_clinic())) or (kind='stock' and (select private.my_role()) in ('manager','reception','nurse') and clinic=(select private.my_clinic())) or (kind='fin' and (select private.my_role())='manager' and clinic=(select private.my_clinic())));
