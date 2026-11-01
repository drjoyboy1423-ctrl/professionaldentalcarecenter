-- SECURITY FIX: without this, any signed-in user could PATCH their own profile row and set role='admin' or another clinic.
create or replace function private.profiles_guard() returns trigger
language plpgsql security definer set search_path to 'public' as $$
begin
  -- Signed-in users (auth.uid() not null) may only edit personal details.
  -- role / clinic / username / id change only via the manage-users edge function (service role, auth.uid() is null).
  if (select auth.uid()) is not null and (
       new.id is distinct from old.id or new.role is distinct from old.role
    or new.clinic is distinct from old.clinic or new.username is distinct from old.username) then
    raise exception 'You cannot change your role, clinic or username.' using errcode = '42501';
  end if;
  return new;
end $$;
revoke all on function private.profiles_guard() from public, anon, authenticated;
drop trigger if exists profiles_guard on public.profiles;
create trigger profiles_guard before update on public.profiles for each row execute function private.profiles_guard();
revoke update on public.profiles from anon;
