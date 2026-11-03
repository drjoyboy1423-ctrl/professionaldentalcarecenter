# Setting up a new client clinic (own database, you cannot see their data)

Same code, a separate Supabase project and a separate Vercel project per client. About 30 minutes.

## 1. Their database
1. Create a new Supabase project (ideally in the CLIENT's own Supabase account, or in yours and transfer it to them later: Project Settings > General > Transfer project).
2. SQL Editor > paste ALL of `supabase/new-client.sql` > Run.
3. Deploy the four edge functions from `supabase/functions/` (`manage-users`, `recover-password`, `weekly-backup`, `setup-owner`), each with "Verify JWT" OFF (see `config.toml`).
4. Edge Functions > Secrets: add `RESEND_API_KEY` (their own Resend key) and, for password-reset links, `APP_URLS` = their website address. Optional: `MAIL_FROM`, `BACKUP_EMAILS` (leave empty so backups go only to their own admins).
5. Weekly backup schedule (SQL Editor): copy the `cron.schedule('weekly-backup', ...)` job from the live project, changing the URL to the new project's.
6. Settings > API: copy the Project URL and the publishable key (`sb_publishable_...`). Never copy the service-role key.

## 2. Their website
1. Vercel > Add New Project > import the same GitHub repo.
2. Environment variables: `SB_URL` = their project URL, `SB_KEY` = their publishable key, `SUPABASE_URL` = same URL, `SUPABASE_ANON_KEY` = same key (the finance report API reads these two).
3. Deploy. Every time you push an update to the repo, all client sites redeploy with the new version.

## 3. First start
Open their website. Because the database is empty, the app shows **Welcome**: the owner types the clinic name, their name, a username and a password. That creates the clinic and the owner (administrator) account. After that this screen never appears again.

## 4. Support
The owner can turn on **Settings > Support access** to give you a temporary `support` administrator login, and turn it off again. Without it you cannot see their data.

## Android app (Google Play)
Build the Android app (PWABuilder) from that client's website address. Each client has its own app listing and its own signing key; add that app's fingerprint to `well-known/assetlinks.json` of THEIR deployment.
