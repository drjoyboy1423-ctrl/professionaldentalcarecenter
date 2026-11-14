-- BDS and visiting specialists are doctors, dental therapists are nurses: same permissions, different label/rules (stype).
alter table public.profiles add column if not exists stype text;
alter table public.profiles drop constraint if exists profiles_stype_check;
alter table public.profiles add constraint profiles_stype_check check (stype is null or (stype in ('bds','specialist') and role = 'doctor') or (stype = 'therapist' and role = 'nurse'));
