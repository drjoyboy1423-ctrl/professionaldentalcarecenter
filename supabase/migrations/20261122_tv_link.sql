-- Private link for the waiting-room TV: one secret key per clinic. Only the edge function queue-tv (service role) reads the table.
create table if not exists public.clinic_tv(
 clinic text primary key references public.clinics(id) on delete cascade,
 key text not null,
 created_at timestamptz not null default now());
alter table public.clinic_tv enable row level security;
revoke all on public.clinic_tv from anon, authenticated;

create or replace function public.tv_key_get(p_reset boolean default false) returns text language plpgsql security definer set search_path='' as $$
declare c text:=private.my_clinic(); k text;
begin
 if private.my_role() not in ('manager','reception') or c is null then raise exception 'not allowed'; end if;
 if p_reset and private.my_role()<>'manager' then raise exception 'only the manager can make a new link'; end if;
 if p_reset then delete from public.clinic_tv where clinic=c; end if;
 select key into k from public.clinic_tv where clinic=c;
 if k is null then
  k:=substr(translate(encode(extensions.gen_random_bytes(12),'base64'),'+/=','abc'),1,14);
  insert into public.clinic_tv(clinic,key) values(c,k) on conflict (clinic) do update set key=excluded.key returning key into k;
 end if;
 return k;
end $$;
revoke all on function public.tv_key_get(boolean) from public, anon;
grant execute on function public.tv_key_get(boolean) to authenticated;
