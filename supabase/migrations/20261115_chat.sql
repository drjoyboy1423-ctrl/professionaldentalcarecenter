-- Staff chat rooms (kept as a record: messages cannot be edited or deleted). Emoji reactions through chat_react().
create or replace function private.chat_room_ok(p_room text, p_role text) returns boolean
language sql immutable set search_path = '' as $$
  select case p_room
    when 'general'  then p_role in ('manager','reception','doctor','nurse','lab','support','admin')
    when 'clinical' then p_role in ('manager','doctor','nurse','admin')
    when 'front'    then p_role in ('manager','reception','admin')
    else false end
$$;
create table if not exists public.chat_msgs (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  room text not null check (room in ('general','clinical','front')),
  from_id uuid not null default auth.uid(),
  from_name text,
  role text,
  body text not null check (length(body) between 1 and 2000),
  reactions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index if not exists chat_msgs_room_at on public.chat_msgs (clinic, room, created_at desc);
alter table public.chat_msgs enable row level security;
drop policy if exists chat_read on public.chat_msgs;
drop policy if exists chat_ins on public.chat_msgs;
create policy chat_read on public.chat_msgs for select to authenticated
  using (private.chat_room_ok(room, (select private.my_role())) and (clinic = (select private.my_clinic()) or (select private.my_role()) = 'admin'));
create policy chat_ins on public.chat_msgs for insert to authenticated
  with check (from_id = (select auth.uid()) and private.chat_room_ok(room, (select private.my_role())) and clinic = (select private.my_clinic()) and role = (select private.my_role()));
revoke all on public.chat_msgs from anon;
revoke update, delete, truncate on public.chat_msgs from authenticated;

create or replace function public.chat_react(p_id uuid, p_emoji text) returns void
language plpgsql security definer set search_path = '' as $$
declare m public.chat_msgs; u text := (select auth.uid())::text; cur jsonb; nw jsonb;
begin
  if p_emoji not in ('👍','✅','⚠️','🦷','🕒','❤️') then raise exception 'Emoji not allowed'; end if;
  select * into m from public.chat_msgs where id = p_id;
  if m.id is null then raise exception 'Message not found'; end if;
  if not private.chat_room_ok(m.room, (select private.my_role())) or (m.clinic <> (select private.my_clinic()) and (select private.my_role()) <> 'admin') then
    raise exception 'Not allowed'; end if;
  cur := coalesce(m.reactions -> p_emoji, '[]'::jsonb);
  if cur ? u then nw := coalesce((select jsonb_agg(x) from jsonb_array_elements_text(cur) x where x <> u), '[]'::jsonb);
  else nw := cur || to_jsonb(u); end if;
  update public.chat_msgs set reactions = jsonb_set(reactions, array[p_emoji], nw) where id = p_id;
end $$;
revoke all on function public.chat_react(uuid, text) from public, anon;
grant execute on function public.chat_react(uuid, text) to authenticated;
