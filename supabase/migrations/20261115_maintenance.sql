-- Chairs and equipment: fault tickets, preventive maintenance, calibration and compliance checks.
-- Biomedical staff are "support" accounts with staff type 'biomed'.
create or replace function private.is_biomed() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'support' and stype = 'biomed')
$$;
create table if not exists public.maint_items (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  kind text not null default 'fault' check (kind in ('fault','pm','calibration','waterline','electrical','other')),
  equipment text not null check (length(equipment) between 1 and 80),
  title text not null check (length(title) between 1 and 500),
  priority text not null default 'ROUTINE' check (priority in ('ROUTINE','URGENT')),
  status text not null default 'OPEN' check (status in ('OPEN','IN_PROGRESS','DONE')),
  note text check (note is null or length(note) <= 2000),
  due date,
  done_at timestamptz,
  created_by uuid not null default auth.uid(),
  created_name text,
  assigned_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists maint_items_clinic on public.maint_items (clinic, created_at desc);
alter table public.maint_items enable row level security;
drop policy if exists maint_read on public.maint_items;
drop policy if exists maint_ins on public.maint_items;
drop policy if exists maint_upd on public.maint_items;
drop policy if exists maint_del on public.maint_items;
create policy maint_read on public.maint_items for select to authenticated
  using ((select private.my_role()) = 'admin' or (clinic = (select private.my_clinic()) and (select private.my_role()) <> 'lab'));
create policy maint_ins on public.maint_items for insert to authenticated
  with check (created_by = (select auth.uid()) and (select private.my_role()) <> 'lab' and (select private.my_role()) is not null and (
    (select private.my_role()) = 'admin'
    or (clinic = (select private.my_clinic()) and (
      (select private.my_role()) in ('manager') or (select private.is_biomed())
      or ((select private.my_role()) in ('doctor','nurse','reception') and kind = 'fault')))));
create policy maint_upd on public.maint_items for update to authenticated
  using ((select private.my_role()) = 'admin' or (clinic = (select private.my_clinic()) and ((select private.my_role()) = 'manager' or (select private.is_biomed()))))
  with check ((select private.my_role()) = 'admin' or (clinic = (select private.my_clinic()) and ((select private.my_role()) = 'manager' or (select private.is_biomed()))));
create policy maint_del on public.maint_items for delete to authenticated
  using ((select private.my_role()) = 'admin' or (clinic = (select private.my_clinic()) and (select private.my_role()) = 'manager'));
revoke all on public.maint_items from anon;
