-- System-wide settings and rules, editable only by the administrator.
create table if not exists public.app_settings (
  key text primary key,
  value jsonb not null,
  public boolean not null default false,
  updated_by text,
  updated_at timestamptz not null default now()
);
alter table public.app_settings enable row level security;
drop policy if exists app_settings_read on public.app_settings;
drop policy if exists app_settings_public_read on public.app_settings;
drop policy if exists app_settings_admin_write on public.app_settings;
create policy app_settings_read on public.app_settings for select to authenticated using (true);
create policy app_settings_public_read on public.app_settings for select to anon using (public);
create policy app_settings_admin_write on public.app_settings for all to authenticated
  using ((select private.my_role()) = 'admin') with check ((select private.my_role()) = 'admin');
