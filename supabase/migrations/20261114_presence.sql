-- Who is signed in right now: every user refreshes their own row about once a minute; reception/manager/admin read their clinic's rows.
create table if not exists public.presence (
  id uuid primary key references auth.users(id) on delete cascade,
  clinic text not null,
  name text,
  role text,
  stype text,
  last_seen timestamptz not null default now()
);
alter table public.presence enable row level security;
drop policy if exists presence_read on public.presence;
drop policy if exists presence_ins on public.presence;
drop policy if exists presence_upd on public.presence;
create policy presence_read on public.presence for select to authenticated
  using ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic()));
create policy presence_ins on public.presence for insert to authenticated
  with check (id = (select auth.uid()) and clinic = (select private.my_clinic()));
create policy presence_upd on public.presence for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()) and clinic = (select private.my_clinic()));
