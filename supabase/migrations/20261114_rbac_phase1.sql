-- Phase 1 of the role specification: LAB_STAFF role (no access to patient records; sees only a masked lab-order list through functions),
-- and access windows for visiting specialists (valid_from / valid_until).
alter table public.profiles add column if not exists valid_from timestamptz;
alter table public.profiles add column if not exists valid_until timestamptz;
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role = any (array['admin','manager','doctor','nurse','reception','lab']));

create or replace function private.my_clinic() returns text language sql stable security definer set search_path to 'public' as $$
  select p.clinic from public.profiles p left join public.clinics c on c.id = p.clinic
  where p.id = (select auth.uid())
    and (c.id is null or c.approved is not false or c.trial_until is null or c.trial_until > now())
    and (p.valid_from is null or now() >= p.valid_from)
    and (p.valid_until is null or now() <= p.valid_until)
$$;

-- lab staff never read or write patient records or clinic lists directly
drop policy if exists patients_read on public.patients;
create policy patients_read on public.patients for select to authenticated
  using (((select private.my_role()) = 'admin') or ((select private.my_role()) <> 'lab' and clinic = (select private.my_clinic())));
drop policy if exists patients_update on public.patients;
create policy patients_update on public.patients for update to authenticated
  using (((select private.my_role()) = 'admin') or ((select private.my_role()) <> 'lab' and clinic = (select private.my_clinic())))
  with check (((select private.my_role()) = 'admin') or ((select private.my_role()) <> 'lab' and clinic = (select private.my_clinic())));
drop policy if exists lists_read on public.clinic_lists;
create policy lists_read on public.clinic_lists for select to authenticated
  using (((select private.my_role()) = 'admin')
    or ((select private.my_role()) <> 'lab' and kind <> 'fin' and clinic = (select private.my_clinic()))
    or (kind = 'fin' and (select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));

-- masked lab-order list: case number, initials, age, sex, prescribing doctor, order and status only
create or replace function public.lab_orders() returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare r jsonb;
begin
  if (select private.my_role()) is distinct from 'lab' then raise exception 'Only lab staff can use this.'; end if;
  select coalesce(jsonb_agg(x order by coalesce((x->>'at')::bigint,0) desc), '[]'::jsonb) into r from (
    select jsonb_build_object(
      'pid', p.id::text, 'idx', t.ord - 1, 'case', p.data->>'card',
      'initials', (select string_agg(upper(left(w,1)),'') from regexp_split_to_table(coalesce(p.data->>'name',''), '\s+') w),
      'age', p.data->>'age', 'sex', p.data->>'sex',
      'doctor', coalesce(t.o->>'by', p.data->>'doc', ''),
      'type', t.o->>'type', 'note', t.o->>'note', 'urg', t.o->>'urg',
      'st', coalesce(t.o->>'labSt', case when t.o->>'st' = 'done' then 'DISPATCHED' else 'RECEIVED' end),
      'at', t.o->>'at') x
    from public.patients p
    cross join lateral jsonb_array_elements(coalesce(p.data->'d'->'ord','[]'::jsonb)) with ordinality as t(o, ord)
    where p.clinic = (select private.my_clinic()) and t.o->>'cat' = 'pl'
  ) s;
  return r;
end $$;

create or replace function public.lab_set_status(p_id text, p_idx int, p_status text) returns void language plpgsql security definer set search_path to 'public' as $$
declare d jsonb;
begin
  if (select private.my_role()) is distinct from 'lab' then raise exception 'Only lab staff can use this.'; end if;
  if p_status not in ('RECEIVED','IN_PRODUCTION','QUALITY_CHECK','DISPATCHED') then raise exception 'Bad status'; end if;
  select data into d from public.patients where id::text = p_id and clinic = (select private.my_clinic()) for update;
  if d is null or jsonb_typeof(d->'d'->'ord'->p_idx) is distinct from 'object' or d->'d'->'ord'->p_idx->>'cat' <> 'pl' then raise exception 'Order not found'; end if;
  d := jsonb_set(d, array['d','ord',p_idx::text,'labSt'], to_jsonb(p_status));
  if p_status = 'DISPATCHED' then
    d := jsonb_set(d, array['d','ord',p_idx::text,'st'], '"done"'::jsonb);
    d := jsonb_set(d, array['d','ord',p_idx::text,'doneAt'], to_jsonb((extract(epoch from now())*1000)::bigint));
  end if;
  update public.patients set data = d where id::text = p_id and clinic = (select private.my_clinic());
end $$;
revoke all on function public.lab_orders() from public, anon;
revoke all on function public.lab_set_status(text,int,text) from public, anon;
grant execute on function public.lab_orders() to authenticated;
grant execute on function public.lab_set_status(text,int,text) to authenticated;
