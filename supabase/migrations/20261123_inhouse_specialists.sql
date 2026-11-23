-- In-house specialist doctors (work for the clinic, not visiting): same permissions as a doctor, own label and specialty features.
alter table public.profiles drop constraint if exists profiles_stype_check;
alter table public.profiles add constraint profiles_stype_check check (
  stype is null
  or (stype in ('bds','specialist','endodontist','prosthodontist','orthodontist','periodontist','omfs','implantologist') and role = 'doctor')
  or (stype = 'therapist' and role = 'nurse')
  or (stype = 'biomed' and role = 'support')
  or (stype in ('prostho','endo','ortho') and role = 'lab'));
