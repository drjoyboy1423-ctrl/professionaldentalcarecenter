-- Activity log: records who added / changed / deleted what. Run ONCE in the Supabase SQL editor.
create table if not exists public.audit_log (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  actor uuid, actor_name text, clinic text,
  tbl text not null, op text not null, rec text, summary text
);
create index if not exists audit_log_clinic_at on public.audit_log (clinic, at desc);
create index if not exists audit_log_at on public.audit_log (at desc);
alter table public.audit_log enable row level security;
drop policy if exists audit_read on public.audit_log;
create policy audit_read on public.audit_log for select using (
  (select private.my_role()) = 'admin'
  or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));

create or replace function private.audit() returns trigger
language plpgsql security definer set search_path to 'public' as $$
declare a uuid := (select auth.uid()); an text; cl text; rc text; sm text; k text; ch text[] := '{}'; o jsonb; n jsonb;
begin
  select coalesce(nullif(name,''),username)||' ('||role||')' into an from public.profiles where id = a;
  if an is null then an := case when a is null then 'System / admin tools' else 'Unknown user' end; end if;
  if TG_TABLE_NAME = 'patients' then
    cl := coalesce(new.clinic, old.clinic); rc := coalesce(new.id, old.id)::text;
    if TG_OP = 'INSERT' then sm := 'Added patient ' || coalesce(new.data->>'name','?');
    elsif TG_OP = 'DELETE' then sm := 'Deleted patient ' || coalesce(old.data->>'name','?');
    else
      o := old.data; n := new.data;
      for k in select key from jsonb_each(n) where key <> 'd' loop if n->k is distinct from o->k then ch := ch || k; end if; end loop;
      for k in select key from jsonb_each(coalesce(n->'d','{}'::jsonb)) loop if (n->'d'->k) is distinct from (o->'d'->k) then ch := ch || k; end if; end loop;
      for k in select key from jsonb_each(coalesce(o->'d','{}'::jsonb)) loop if not (coalesce(n->'d','{}'::jsonb) ? k) then ch := ch || k; end if; end loop;
      if array_length(ch,1) is null then return null; end if;
      sm := 'Changed ' || coalesce(n->>'name','?') || ': ' || array_to_string(ch, ', ');
    end if;
  elsif TG_TABLE_NAME = 'clinic_lists' then
    cl := coalesce(new.clinic, old.clinic); rc := coalesce(new.kind, old.kind);
    sm := case TG_OP when 'DELETE' then 'Deleted list ' else 'Saved list ' end || rc;
  elsif TG_TABLE_NAME = 'profiles' then
    cl := coalesce(new.clinic, old.clinic); rc := coalesce(new.username, old.username);
    if TG_OP = 'INSERT' then sm := 'Added user ' || new.username || ' as ' || new.role;
    elsif TG_OP = 'DELETE' then sm := 'Deleted user ' || old.username || ' (' || old.role || ')';
    else
      if new.role is distinct from old.role then ch := ch || ('role ' || old.role || ' to ' || new.role); end if;
      if new.clinic is distinct from old.clinic then ch := ch || ('clinic ' || old.clinic || ' to ' || new.clinic); end if;
      if new.username is distinct from old.username then ch := ch || ('username ' || old.username || ' to ' || new.username); end if;
      if array_length(ch,1) is null then return null; end if;
      sm := 'Changed user ' || old.username || ': ' || array_to_string(ch, ', ');
    end if;
  elsif TG_TABLE_NAME = 'clinics' then
    cl := coalesce(new.id, old.id); rc := coalesce(new.name, old.name);
    if TG_OP = 'INSERT' then sm := 'Created clinic ' || new.name;
    elsif TG_OP = 'DELETE' then sm := 'Deleted clinic ' || old.name;
    else
      if new.archived is distinct from old.archived then ch := ch || (case when new.archived then 'archived' else 'restored' end); end if;
      if new.name is distinct from old.name then ch := ch || 'name'; end if;
      if array_length(ch,1) is null then return null; end if;
      sm := 'Clinic ' || new.name || ': ' || array_to_string(ch, ', ');
    end if;
  end if;
  insert into public.audit_log(actor, actor_name, clinic, tbl, op, rec, summary) values (a, an, cl, TG_TABLE_NAME, TG_OP, rc, sm);
  return null;
end $$;
revoke all on function private.audit() from public, anon, authenticated;
drop trigger if exists audit_patients on public.patients;
create trigger audit_patients after insert or update or delete on public.patients for each row execute function private.audit();
drop trigger if exists audit_lists on public.clinic_lists;
create trigger audit_lists after insert or update or delete on public.clinic_lists for each row execute function private.audit();
drop trigger if exists audit_profiles on public.profiles;
create trigger audit_profiles after insert or update or delete on public.profiles for each row execute function private.audit();
drop trigger if exists audit_clinics on public.clinics;
create trigger audit_clinics after insert or update or delete on public.clinics for each row execute function private.audit();
