-- Self-service "new clinic" requests from the sign-in page. Anyone may send a request; only the administrator can read, approve or delete.
create table if not exists public.clinic_requests(
  id uuid primary key default gen_random_uuid(),
  name text not null check(char_length(name) between 2 and 80),
  owner_name text not null check(char_length(owner_name) between 2 and 80),
  phone text check(char_length(phone)<=30),
  email text check(char_length(email)<=120),
  code text not null check(code ~ '^[a-z0-9]{2,20}$'),
  username text not null check(username ~ '^[a-z0-9._]{3,30}$'),
  note text check(char_length(note)<=300),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);
create unique index if not exists clinic_requests_pending_code on public.clinic_requests(code) where status='pending';
alter table public.clinic_requests enable row level security;
drop policy if exists cr_insert on public.clinic_requests;
drop policy if exists cr_admin on public.clinic_requests;
create policy cr_insert on public.clinic_requests for insert to anon, authenticated with check (status='pending');
create policy cr_admin on public.clinic_requests for all to authenticated using ((select private.my_role())='admin') with check ((select private.my_role())='admin');
revoke select, update, delete on public.clinic_requests from anon;
