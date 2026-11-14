alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role = any (array['admin','manager','doctor','nurse','reception','lab','support']));
drop policy if exists patients_read on public.patients;
create policy patients_read on public.patients for select to authenticated
  using (((select private.my_role()) = 'admin') or ((select private.my_role()) not in ('lab','support') and clinic = (select private.my_clinic())));
drop policy if exists patients_update on public.patients;
create policy patients_update on public.patients for update to authenticated
  using (((select private.my_role()) = 'admin') or ((select private.my_role()) not in ('lab','support') and clinic = (select private.my_clinic())))
  with check (((select private.my_role()) = 'admin') or ((select private.my_role()) not in ('lab','support') and clinic = (select private.my_clinic())));
drop policy if exists lists_read on public.clinic_lists;
create policy lists_read on public.clinic_lists for select to authenticated
  using (((select private.my_role()) = 'admin')
    or ((select private.my_role()) not in ('lab','support') and kind <> 'fin' and clinic = (select private.my_clinic()))
    or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
