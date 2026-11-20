-- Clinic ads (waiting-room screen + job vacancies) and the waiting-room queue.
-- Applied to the live project as migration "clinic_ads_and_queue".
create table if not exists public.clinic_ads(
 id uuid primary key default gen_random_uuid(),
 clinic text not null references public.clinics(id) on delete cascade,
 kind text not null default 'promo' check (kind in ('promo','job')),
 title text not null default '',
 body text not null default '',
 image text check (image is null or length(image)<=350000),
 active boolean not null default true,
 sort int not null default 0,
 created_at timestamptz not null default now());
alter table public.clinic_ads enable row level security;
create policy ads_sel on public.clinic_ads for select to authenticated using (private.my_role()='admin' or (private.my_role() in ('manager','reception','doctor','nurse') and clinic=private.my_clinic()));
create policy ads_ins on public.clinic_ads for insert to authenticated with check (private.my_role()='admin' or (private.my_role()='manager' and clinic=private.my_clinic()));
create policy ads_upd on public.clinic_ads for update to authenticated using (private.my_role()='admin' or (private.my_role()='manager' and clinic=private.my_clinic())) with check (private.my_role()='admin' or (private.my_role()='manager' and clinic=private.my_clinic()));
create policy ads_del on public.clinic_ads for delete to authenticated using (private.my_role()='admin' or (private.my_role()='manager' and clinic=private.my_clinic()));

create table if not exists public.queue_tickets(
 id uuid primary key default gen_random_uuid(),
 clinic text not null references public.clinics(id) on delete cascade,
 day date not null default (now() at time zone 'Africa/Addis_Ababa')::date,
 no int not null,
 pid text,
 chair text,
 status text not null default 'waiting' check (status in ('waiting','called','done','skipped')),
 created_by uuid default auth.uid(),
 created_at timestamptz not null default now(),
 called_at timestamptz,
 unique(clinic,day,no));
alter table public.queue_tickets enable row level security;
create policy qt_sel on public.queue_tickets for select to authenticated using (private.my_role()='admin' or (private.my_role() in ('manager','reception','doctor','nurse') and clinic=private.my_clinic()));
create policy qt_upd on public.queue_tickets for update to authenticated using (private.my_role() in ('manager','reception','doctor','nurse') and clinic=private.my_clinic()) with check (private.my_role() in ('manager','reception','doctor','nurse') and clinic=private.my_clinic());
create policy qt_del on public.queue_tickets for delete to authenticated using (private.my_role()='manager' and clinic=private.my_clinic());

create or replace function public.queue_add(p_pid text) returns int language plpgsql security definer set search_path='' as $$
declare c text:=private.my_clinic(); d date:=(now() at time zone 'Africa/Addis_Ababa')::date; n int;
begin
 if private.my_role() not in ('manager','reception','doctor','nurse') then raise exception 'not allowed'; end if;
 perform pg_advisory_xact_lock(hashtext('queue:'||c||d::text));
 select coalesce(max(no),0)+1 into n from public.queue_tickets where clinic=c and day=d;
 insert into public.queue_tickets(clinic,day,no,pid) values(c,d,n,nullif(p_pid,''));
 return n;
end $$;
revoke all on function public.queue_add(text) from public, anon;
grant execute on function public.queue_add(text) to authenticated;
