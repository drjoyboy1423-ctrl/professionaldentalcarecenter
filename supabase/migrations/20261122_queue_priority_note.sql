-- Queue: priority tickets (urgent, elderly, pregnant, child...) and a short note for a number without a patient record.
alter table public.queue_tickets add column if not exists priority smallint not null default 0 check (priority in (0,1));
alter table public.queue_tickets add column if not exists note text check (note is null or length(note)<=60);
drop function if exists public.queue_add(text);
create or replace function public.queue_add(p_pid text, p_prio int default 0, p_note text default '') returns int language plpgsql security definer set search_path='' as $$
declare c text:=private.my_clinic(); d date:=(now() at time zone 'Africa/Addis_Ababa')::date; n int;
begin
 if private.my_role() not in ('manager','reception','doctor','nurse') then raise exception 'not allowed'; end if;
 perform pg_advisory_xact_lock(hashtext('queue:'||c||d::text));
 select coalesce(max(no),0)+1 into n from public.queue_tickets where clinic=c and day=d;
 insert into public.queue_tickets(clinic,day,no,pid,priority,note) values(c,d,n,nullif(p_pid,''),case when p_prio=1 then 1 else 0 end,nullif(left(trim(coalesce(p_note,'')),60),''));
 return n;
end $$;
revoke all on function public.queue_add(text,int,text) from public, anon;
grant execute on function public.queue_add(text,int,text) to authenticated;
