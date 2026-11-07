-- Role hardening: (1) only admin/manager delete patients and deleted files are kept,
-- (3) clinical/finance sections of a patient can only be changed by the people allowed to.

-- 1. kept copy of every deleted patient (admin/manager can read; restore with an insert from this table)
create table if not exists public.deleted_patients(
  id bigint, clinic text, data jsonb, deleted_at timestamptz default now(), deleted_by uuid, deleted_by_name text);
alter table public.deleted_patients enable row level security;
drop policy if exists deleted_read on public.deleted_patients;
create policy deleted_read on public.deleted_patients for select using (
  (select private.my_role())='admin' or ((select private.my_role())='manager' and clinic=(select private.my_clinic())));

create or replace function private.keep_deleted_patient() returns trigger language plpgsql security definer set search_path='public' as $$
begin
  insert into public.deleted_patients(id,clinic,data,deleted_by,deleted_by_name)
  values(old.id,old.clinic,old.data,(select auth.uid()),(select coalesce(nullif(name,''),username) from public.profiles where id=(select auth.uid())));
  return old;
end $$;
drop trigger if exists keep_deleted_patient on public.patients;
create trigger keep_deleted_patient before delete on public.patients for each row execute function private.keep_deleted_patient();

drop policy if exists patients_delete on public.patients;
create policy patients_delete on public.patients for delete using (
  (select private.my_role()) in ('admin','manager')
  and ((select private.my_role())='admin' or clinic=(select private.my_clinic())));

-- 3. who may change which part of a patient file
create or replace function private.guard_patient_update() returns trigger language plpgsql security definer set search_path='public' as $$
declare r text:=(select private.my_role()); me text; k text;
begin
  if (select auth.uid()) is null or r='admin' then return new; end if;      -- admin tools / administrator
  select name into me from public.profiles where id=(select auth.uid());
  if r='doctor' and coalesce(me,'')<>'' and coalesce(old.data->>'doc','')=me then return new; end if;  -- the assigned doctor
  foreach k in array array['rec','presc','consent','plan'] loop      -- clinical sections: assigned doctor / administrator only
    if (old.data->'d'->k) is distinct from (new.data->'d'->k) then
      raise exception 'Not allowed: a % cannot change the "%" section of this patient file. Only the assigned doctor can.', r, k using errcode='42501';
    end if;
  end loop;
  if r in ('doctor','nurse') and (old.data->'d'->'inv') is distinct from (new.data->'d'->'inv') then
    raise exception 'Not allowed: a % cannot change invoices of this patient file.', r using errcode='42501';
  end if;
  return new;
end $$;
drop trigger if exists guard_patient_update on public.patients;
create trigger guard_patient_update before update on public.patients for each row execute function private.guard_patient_update();
