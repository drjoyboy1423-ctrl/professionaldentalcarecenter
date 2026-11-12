-- Self-service clinics start immediately as a one-free-year period; after that the administrator must approve them.
alter table public.clinics add column if not exists approved boolean not null default true;
alter table public.clinics add column if not exists trial_until timestamptz;
-- A clinic whose trial has ended without approval loses access to its data (admin is unaffected).
create or replace function private.my_clinic() returns text language sql stable security definer set search_path to 'public' as $$
  select p.clinic from public.profiles p left join public.clinics c on c.id = p.clinic
  where p.id = (select auth.uid())
    and (c.id is null or c.approved is not false or c.trial_until is null or c.trial_until > now())
$$;
drop table if exists public.clinic_requests;
