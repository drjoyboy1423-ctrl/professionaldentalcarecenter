-- Notes from clinic managers to the developer (administrator), with the developer's reply.
create table if not exists public.dev_notes (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  clinic_name text,
  from_id uuid not null default auth.uid(),
  from_name text,
  kind text not null default 'question' check (kind in ('question','problem','idea')),
  body text not null check (length(body) between 1 and 4000),
  status text not null default 'new' check (status in ('new','seen','done')),
  reply text,
  created_at timestamptz not null default now(),
  replied_at timestamptz
);
alter table public.dev_notes enable row level security;
drop policy if exists dev_notes_read on public.dev_notes;
drop policy if exists dev_notes_ins on public.dev_notes;
drop policy if exists dev_notes_upd on public.dev_notes;
drop policy if exists dev_notes_del on public.dev_notes;
create policy dev_notes_read on public.dev_notes for select to authenticated
  using ((select private.my_role()) = 'admin' or (from_id = (select auth.uid())) or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy dev_notes_ins on public.dev_notes for insert to authenticated
  with check ((select private.my_role()) in ('manager','admin') and from_id = (select auth.uid()) and ((select private.my_role()) = 'admin' or clinic = (select private.my_clinic())));
create policy dev_notes_upd on public.dev_notes for update to authenticated
  using ((select private.my_role()) = 'admin') with check ((select private.my_role()) = 'admin');
create policy dev_notes_del on public.dev_notes for delete to authenticated
  using ((select private.my_role()) = 'admin');
