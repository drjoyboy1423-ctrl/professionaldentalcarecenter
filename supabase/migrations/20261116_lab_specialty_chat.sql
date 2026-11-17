-- Lab specialties (prosthodontic / endodontic / orthodontic) for lab staff, one chat room per specialty (doctors choose which lab to
-- talk to) and an "equipment" room where biomedical staff talk to the doctors and manager about regular checks and purchases.
alter table public.profiles drop constraint if exists profiles_stype_check;
alter table public.profiles add constraint profiles_stype_check check (
  stype is null
  or (stype in ('bds','specialist') and role = 'doctor')
  or (stype = 'therapist' and role = 'nurse')
  or (stype = 'biomed' and role = 'support')
  or (stype in ('prostho','endo','ortho') and role = 'lab'));

create or replace function private.my_stype() returns text
language sql stable security definer set search_path = '' as $$
  select stype from public.profiles where id = (select auth.uid()) $$;
revoke all on function private.my_stype() from public, anon;
grant execute on function private.my_stype() to authenticated;

create or replace function private.chat_ok(p_room text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case
    when p_room = 'general'  then r in ('manager','reception','doctor','nurse','lab','support','admin')
    when p_room = 'clinical' then r in ('manager','doctor','nurse','admin')
    when p_room = 'front'    then r in ('manager','reception','admin')
    when p_room in ('lab_prostho','lab_endo','lab_ortho') then
      r in ('manager','doctor','admin') or (r = 'lab' and (s is null or 'lab_' || s = p_room))
    when p_room = 'equip' then r in ('manager','doctor','admin') or (r = 'support' and s = 'biomed')
    else false end
  from (select (select private.my_role()) r, (select private.my_stype()) s) x $$;
revoke all on function private.chat_ok(text) from public, anon;
grant execute on function private.chat_ok(text) to authenticated;

alter table public.chat_msgs drop constraint if exists chat_msgs_room_check;
alter table public.chat_msgs add constraint chat_msgs_room_check
  check (room in ('general','clinical','front','lab_prostho','lab_endo','lab_ortho','equip'));

drop policy if exists chat_read on public.chat_msgs;
drop policy if exists chat_ins on public.chat_msgs;
create policy chat_read on public.chat_msgs for select to authenticated
  using (private.chat_ok(room) and (clinic = (select private.my_clinic()) or (select private.my_role()) = 'admin'));
create policy chat_ins on public.chat_msgs for insert to authenticated
  with check (from_id = (select auth.uid()) and private.chat_ok(room) and clinic = (select private.my_clinic()) and role = (select private.my_role()));

create or replace function public.chat_react(p_id uuid, p_emoji text) returns void
language plpgsql security definer set search_path = '' as $$
declare m public.chat_msgs; u text := (select auth.uid())::text; cur jsonb; nw jsonb;
begin
  if p_emoji not in ('👍','✅','⚠️','🦷','🕒','❤️') then raise exception 'Emoji not allowed'; end if;
  select * into m from public.chat_msgs where id = p_id;
  if m.id is null then raise exception 'Message not found'; end if;
  if not private.chat_ok(m.room) or (m.clinic <> (select private.my_clinic()) and (select private.my_role()) <> 'admin') then
    raise exception 'Not allowed'; end if;
  cur := coalesce(m.reactions -> p_emoji, '[]'::jsonb);
  if cur ? u then nw := coalesce((select jsonb_agg(x) from jsonb_array_elements_text(cur) x where x <> u), '[]'::jsonb);
  else nw := cur || to_jsonb(u); end if;
  update public.chat_msgs set reactions = jsonb_set(reactions, array[p_emoji], nw) where id = p_id;
end $$;
revoke all on function public.chat_react(uuid, text) from public, anon;
grant execute on function public.chat_react(uuid, text) to authenticated;
