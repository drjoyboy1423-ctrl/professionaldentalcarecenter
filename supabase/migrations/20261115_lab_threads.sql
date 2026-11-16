-- Lab messages. 'tech' = technical case thread on one lab order (doctor / BDS / specialist and lab staff).
-- 'sla' = commercial thread between the manager and lab staff. 'invoice' = a lab invoice submitted by lab staff to the manager.
create table if not exists public.lab_msgs (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  kind text not null check (kind in ('tech','sla','invoice')),
  pid text,
  idx int,
  amount numeric check (amount is null or (amount >= 0 and amount < 100000000)),
  ref text check (ref is null or length(ref) <= 80),
  body text not null check (length(body) between 1 and 2000),
  from_id uuid not null default auth.uid(),
  from_name text,
  role text,
  created_at timestamptz not null default now(),
  check (kind <> 'tech' or (pid is not null and idx is not null))
);
create index if not exists lab_msgs_clinic on public.lab_msgs (clinic, kind, created_at desc);
alter table public.lab_msgs enable row level security;
drop policy if exists labm_read on public.lab_msgs;
drop policy if exists labm_ins on public.lab_msgs;
create policy labm_read on public.lab_msgs for select to authenticated
  using ((select private.my_role()) = 'admin' or (clinic = (select private.my_clinic()) and (
    (kind = 'tech' and (select private.my_role()) in ('doctor','lab'))
    or (kind in ('sla','invoice') and (select private.my_role()) in ('manager','lab')))));
create policy labm_ins on public.lab_msgs for insert to authenticated
  with check (from_id = (select auth.uid()) and clinic = (select private.my_clinic()) and role = (select private.my_role()) and (
    (kind = 'tech' and role in ('doctor','lab'))
    or (kind = 'sla' and role in ('manager','lab'))
    or (kind = 'invoice' and role = 'lab' and amount is not null)));
revoke all on public.lab_msgs from anon;
revoke update, delete, truncate on public.lab_msgs from authenticated;
