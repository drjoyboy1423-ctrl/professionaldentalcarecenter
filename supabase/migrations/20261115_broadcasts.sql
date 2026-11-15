-- Clinic announcements from the manager, with read receipts.
create table if not exists public.broadcasts (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  from_id uuid not null default auth.uid(),
  from_name text,
  title text not null check (length(title) between 1 and 150),
  body text not null check (length(body) between 1 and 4000),
  urgent boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists broadcasts_clinic_at on public.broadcasts (clinic, created_at desc);
create table if not exists public.broadcast_reads (
  broadcast_id uuid not null references public.broadcasts(id) on delete cascade,
  user_id uuid not null default auth.uid(),
  user_name text,
  role text,
  read_at timestamptz not null default now(),
  primary key (broadcast_id, user_id)
);
alter table public.broadcasts enable row level security;
alter table public.broadcast_reads enable row level security;
drop policy if exists bc_read on public.broadcasts;
drop policy if exists bc_ins on public.broadcasts;
drop policy if exists bc_del on public.broadcasts;
create policy bc_read on public.broadcasts for select to authenticated
  using ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic()));
create policy bc_ins on public.broadcasts for insert to authenticated
  with check (from_id = (select auth.uid()) and (select private.my_role()) in ('manager','admin') and ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic())));
create policy bc_del on public.broadcasts for delete to authenticated
  using ((select private.my_role()) = 'admin' or (from_id = (select auth.uid())));
drop policy if exists bcr_read on public.broadcast_reads;
drop policy if exists bcr_ins on public.broadcast_reads;
create policy bcr_read on public.broadcast_reads for select to authenticated
  using (user_id = (select auth.uid()) or (select private.my_role()) = 'admin'
    or ((select private.my_role()) = 'manager' and exists (select 1 from public.broadcasts b where b.id = broadcast_id and b.clinic = (select private.my_clinic()))));
create policy bcr_ins on public.broadcast_reads for insert to authenticated
  with check (user_id = (select auth.uid()) and exists (select 1 from public.broadcasts b where b.id = broadcast_id and (b.clinic = (select private.my_clinic()) or (select private.my_role()) = 'admin')));
revoke all on public.broadcasts, public.broadcast_reads from anon;
revoke update on public.broadcasts, public.broadcast_reads from authenticated;
