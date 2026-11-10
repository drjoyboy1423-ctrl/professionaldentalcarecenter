-- Published pay statements: each staff member can read only their own; manager/admin write and read all (own clinic).
create table if not exists public.pay_statements(
  clinic text not null,
  user_id uuid not null,
  month text not null,
  name text,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key(clinic,user_id,month)
);
alter table public.pay_statements enable row level security;
drop policy if exists ps_read on public.pay_statements;
drop policy if exists ps_write on public.pay_statements;
create policy ps_read on public.pay_statements for select using (
  user_id=(select auth.uid())
  or (select private.my_role())='admin'
  or ((select private.my_role())='manager' and clinic=(select private.my_clinic())));
create policy ps_write on public.pay_statements for all using (
  (select private.my_role())='admin'
  or ((select private.my_role())='manager' and clinic=(select private.my_clinic())))
  with check (
  (select private.my_role())='admin'
  or ((select private.my_role())='manager' and clinic=(select private.my_clinic())));
