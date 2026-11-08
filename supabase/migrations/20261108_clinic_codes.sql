-- Clinic codes (applied in two steps: column + lookup function first, then the policy below once the app is updated)
alter table public.clinics add column if not exists code text;
update public.clinics set code=lower(regexp_replace(id,'[^a-zA-Z0-9]','','g')) where code is null;
create unique index if not exists clinics_code_key on public.clinics (lower(code));
create or replace function public.clinic_lookup(p_code text)
returns table(id text,name text,type text,color text,icon text,logo text,name_am text,phone text,address text,code text,archived boolean)
language sql stable security definer set search_path='public' as $$
  select c.id,c.name,c.type,c.color,c.icon,c.logo,c.name_am,c.phone,c.address,c.code,c.archived
  from public.clinics c where lower(c.code)=lower(trim(p_code)) and not c.archived limit 1 $$;
revoke all on function public.clinic_lookup(text) from public;
grant execute on function public.clinic_lookup(text) to anon, authenticated;
-- step 2: hide the clinic list from signed-out visitors
drop policy if exists clinics_read on public.clinics;
create policy clinics_read on public.clinics for select using ((select private.my_role())='admin' or id=(select private.my_clinic()));
