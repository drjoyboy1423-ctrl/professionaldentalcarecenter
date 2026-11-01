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
