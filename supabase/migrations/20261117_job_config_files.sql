-- Optional WhatsApp button on the applicant page (manager chooses, own number), a note of documents asked for, and up to 3 files per application.
create table if not exists public.job_config (
  clinic text primary key,
  wa text check (wa is null or length(wa) <= 30),
  wa_on boolean not null default false,
  note text check (note is null or length(note) <= 300),
  updated_at timestamptz not null default now()
);
alter table public.job_config enable row level security;
revoke all on public.job_config from anon;
drop policy if exists jc_sel on public.job_config;
drop policy if exists jc_ins on public.job_config;
drop policy if exists jc_upd on public.job_config;
create policy jc_sel on public.job_config for select to authenticated using (
  (select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy jc_ins on public.job_config for insert to authenticated with check (
  (select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
create policy jc_upd on public.job_config for update to authenticated using (
  (select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())))
  with check ((select private.my_role()) = 'admin' or ((select private.my_role()) = 'manager' and clinic = (select private.my_clinic())));
alter table public.job_applications
  add column if not exists files jsonb not null default '[]'::jsonb check (jsonb_typeof(files) = 'array' and jsonb_array_length(files) <= 3);
