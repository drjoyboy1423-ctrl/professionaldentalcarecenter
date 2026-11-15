-- Clinical record rules enforced in the database:
--  * managers and reception can never change clinical records (patient.data.d.rec)
--  * a record signed more than 24 hours ago is locked: its text cannot change or be removed; only addendums (data.add) can be appended
--  * a signature cannot be dated in the future (a past date only makes the lock start earlier, so offline signing still syncs)
-- Server tools running without a signed-in user (backup restore, admin scripts) are not affected.
create or replace function private.rec_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare r text; o jsonb; n jsonb; i int; j int; oe jsonb; ne jsonb; oa jsonb; na jsonb;
  nowms numeric := extract(epoch from now()) * 1000; lim numeric := extract(epoch from now()) * 1000 - 86400000; s numeric;
begin
  if (select auth.uid()) is null then return new; end if;
  o := coalesce(old.data->'d'->'rec', '[]'::jsonb); n := coalesce(new.data->'d'->'rec', '[]'::jsonb);
  if o is not distinct from n then return new; end if;
  r := (select private.my_role());
  if r in ('manager', 'reception', 'lab', 'support') then
    raise exception 'Only clinical staff can change clinical records.';
  end if;
  if jsonb_typeof(o) = 'array' and jsonb_typeof(n) = 'array' then
    for i in 0 .. jsonb_array_length(o) - 1 loop
      oe := o -> i;
      if jsonb_typeof(oe -> 'sig') = 'object' and (oe -> 'sig' ->> 'at') is not null and (oe -> 'sig' ->> 'at')::numeric < lim then
        ne := n -> i;
        if ne is null then raise exception 'A record signed more than 24 hours ago is locked and cannot be removed.'; end if;
        if (ne - 'add') is distinct from (oe - 'add') then raise exception 'A record signed more than 24 hours ago is locked. Add an addendum instead.'; end if;
        oa := coalesce(oe -> 'add', '[]'::jsonb); na := coalesce(ne -> 'add', '[]'::jsonb);
        if jsonb_array_length(na) < jsonb_array_length(oa) then raise exception 'Addendums cannot be removed.'; end if;
        for j in 0 .. jsonb_array_length(oa) - 1 loop
          if na -> j is distinct from oa -> j then raise exception 'Addendums cannot be changed.'; end if;
        end loop;
      end if;
    end loop;
    for i in 0 .. jsonb_array_length(n) - 1 loop
      ne := n -> i;
      if jsonb_typeof(ne -> 'sig') = 'object' and not (o @> jsonb_build_array(jsonb_build_object('sig', ne -> 'sig'))) then
        s := nullif(ne -> 'sig' ->> 'at', '')::numeric;
        if s is null or s > nowms + 600000 then raise exception 'The signature time is not valid. Check the clock of this device.'; end if;
      end if;
    end loop;
  end if;
  return new;
end $$;
drop trigger if exists rec_guard on public.patients;
create trigger rec_guard before update on public.patients for each row when (old.data is distinct from new.data) execute function private.rec_guard();
