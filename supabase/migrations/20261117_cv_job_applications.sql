-- Staff CVs (own row; manager reads own clinic) and job applications (written only by the job-apply edge function; manager reads/updates).
-- Applicant CV files go to a private bucket, folder = clinic id; only that clinic's manager and the administrator can read them.
create table if not exists public.staff_cv (
  user_id uuid primary key default auth.uid(),
  clinic text not null,
  name text,
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 20000),
  updated_at timestamptz not null default now()
);
alter table public.staff_cv enable row level security;
revoke all on public.staff_cv from anon;
drop policy if exists cv_sel on public.staff_cv;
drop policy if exists cv_ins on public.staff_cv;
drop policy if exists cv_upd on public.staff_cv;
drop policy if exists cv_del on public.staff_cv;
create policy cv_sel on public.staff_cv for select to authenticated using (
  user_id = (select auth.uid())
  or ((select private.my_role()) = 'admin')
  or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy cv_ins on public.staff_cv for insert to authenticated with check (user_id = (select auth.uid()) and clinic = (select private.my_clinic()));
create policy cv_upd on public.staff_cv for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()) and clinic = (select private.my_clinic()));
create policy cv_del on public.staff_cv for delete to authenticated using (user_id = (select auth.uid()));

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  clinic text not null,
  name text not null check (length(name) between 2 and 80),
  phone text not null check (length(phone) between 5 and 30),
  position text check (position is null or length(position) <= 80),
  message text check (message is null or length(message) <= 1000),
  file_path text,
  file_name text,
  status text not null default 'new' check (status in ('new','shortlisted','rejected','hired')),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists job_applications_clinic_at on public.job_applications (clinic, created_at desc);
alter table public.job_applications enable row level security;
revoke all on public.job_applications from anon;
drop policy if exists ja_sel on public.job_applications;
drop policy if exists ja_upd on public.job_applications;
drop policy if exists ja_del on public.job_applications;
create policy ja_sel on public.job_applications for select to authenticated using (
  (select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy ja_upd on public.job_applications for update to authenticated using (
  (select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())))
  with check ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy ja_del on public.job_applications for delete to authenticated using (
  (select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('applicant-cvs', 'applicant-cvs', false, 4194304,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png'])
on conflict (id) do update set public = false, file_size_limit = 4194304, allowed_mime_types = excluded.allowed_mime_types;
drop policy if exists applicant_cvs_read on storage.objects;
create policy applicant_cvs_read on storage.objects for select to authenticated using (
  bucket_id = 'applicant-cvs' and (
    (select private.my_role()) = 'admin'
    or ((select private.my_role()) = 'manager' and (storage.foldername(name))[1] = (select private.my_clinic()))));
drop policy if exists applicant_cvs_del on storage.objects;
create policy applicant_cvs_del on storage.objects for delete to authenticated using (
  bucket_id = 'applicant-cvs' and (
    (select private.my_role()) = 'admin'
    or ((select private.my_role()) = 'manager' and (storage.foldername(name))[1] = (select private.my_clinic()))));
