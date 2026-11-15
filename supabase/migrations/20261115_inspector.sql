-- On-site inspector links: a temporary, read-only view of sterilization and equipment-check logs. No account is created.
-- The link carries a random token; only its SHA-256 hash is stored. The manager can revoke it at any time.
create table if not exists public.inspector_tokens (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  token_hash text not null unique,
  label text check (label is null or length(label) <= 100),
  created_by uuid not null default auth.uid(),
  created_name text,
  expires_at timestamptz not null,
  revoked boolean not null default false,
  created_at timestamptz not null default now(),
  check (expires_at <= created_at + interval '25 hours')
);
alter table public.inspector_tokens enable row level security;
drop policy if exists insp_read on public.inspector_tokens;
drop policy if exists insp_ins on public.inspector_tokens;
drop policy if exists insp_upd on public.inspector_tokens;
create policy insp_read on public.inspector_tokens for select to authenticated
  using ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy insp_ins on public.inspector_tokens for insert to authenticated
  with check (created_by = (select auth.uid()) and ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic()))));
create policy insp_upd on public.inspector_tokens for update to authenticated
  using ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())))
  with check ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
revoke all on public.inspector_tokens from anon;
revoke update, delete on public.inspector_tokens from authenticated;
grant update (revoked) on public.inspector_tokens to authenticated;

-- audit rows written by server tools (no signed-in user) keep the clinic they were given
create or replace function private.audit_events_fill() returns trigger
language plpgsql security definer set search_path = '' as $$
declare h json; r text; u uuid := (select auth.uid());
begin
  begin h := current_setting('request.headers', true)::json; exception when others then h := null; end;
  r := (select private.my_role());
  new.user_id := u;
  new.role := r;
  if u is not null and (r is distinct from 'admin' or new.clinic is null) then new.clinic := (select private.my_clinic()); end if;
  new.at := now();
  new.ip := nullif(trim(split_part(coalesce(h->>'x-forwarded-for', h->>'cf-connecting-ip', ''), ',', 1)), '');
  if new.detail is not null and length(new.detail::text) > 4000 then new.detail := jsonb_build_object('truncated', true); end if;
  return new;
end $$;
