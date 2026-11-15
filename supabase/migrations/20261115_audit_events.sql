-- App-level audit events (print, export, refund, delete, sign, assign, sign-in/out, opening a patient file).
-- Row changes (add / change / delete) are already recorded by triggers in public.audit_log; this table adds
-- the things triggers cannot see. Rows can be added by any signed-in user for themselves, read by the clinic
-- manager (own clinic) and the administrator, and can never be changed or deleted.
create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  at timestamptz not null default now(),
  clinic text,
  user_id uuid,
  user_name text,
  role text,
  action text not null check (length(action) between 1 and 30),
  resource text,
  detail jsonb,
  ip text
);
create index if not exists audit_events_clinic_at on public.audit_events (clinic, at desc);
alter table public.audit_events enable row level security;

create or replace function private.audit_events_fill() returns trigger
language plpgsql security definer set search_path = '' as $$
declare h json; r text;
begin
  begin h := current_setting('request.headers', true)::json; exception when others then h := null; end;
  r := (select private.my_role());
  new.user_id := (select auth.uid());
  new.role := r;
  if r is distinct from 'admin' or new.clinic is null then new.clinic := (select private.my_clinic()); end if;
  new.at := now();
  new.ip := nullif(trim(split_part(coalesce(h->>'x-forwarded-for', h->>'cf-connecting-ip', ''), ',', 1)), '');
  if new.detail is not null and length(new.detail::text) > 4000 then new.detail := jsonb_build_object('truncated', true); end if;
  return new;
end $$;
drop trigger if exists audit_events_fill on public.audit_events;
create trigger audit_events_fill before insert on public.audit_events for each row execute function private.audit_events_fill();

create or replace function private.audit_events_block() returns trigger
language plpgsql security definer set search_path = '' as $$
begin raise exception 'The audit log cannot be changed or deleted.'; end $$;
drop trigger if exists audit_events_no_change on public.audit_events;
create trigger audit_events_no_change before update or delete on public.audit_events for each row execute function private.audit_events_block();
drop trigger if exists audit_events_no_truncate on public.audit_events;
create trigger audit_events_no_truncate before truncate on public.audit_events for each statement execute function private.audit_events_block();

drop policy if exists audit_events_ins on public.audit_events;
drop policy if exists audit_events_read on public.audit_events;
create policy audit_events_ins on public.audit_events for insert to authenticated with check (user_id is null or user_id = (select auth.uid()));
create policy audit_events_read on public.audit_events for select to authenticated
  using ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
revoke all on public.audit_events from anon;
revoke update, delete, truncate on public.audit_events from authenticated;
