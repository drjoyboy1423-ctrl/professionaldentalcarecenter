# ProDental Records - full map of the app

Single-page dental clinic management app (plain JavaScript, no framework). Live: https://professionaldentalcarecenter-nine.vercel.app
Code: GitHub `drjoyboy1423-ctrl/professionaldentalcarecenter` (branch `main`, auto-deploys to Vercel).
Android app: a PWABuilder wrapper (package `app.dentalcare.smartdent`) that opens the website.

## 1. How the pieces fit

```
Phone / computer (browser or Android app)
   index.html  + src/**  --build.mjs-->  dist/index.html   (one self-contained page, hosted on Vercel)
        |  sign-in, data, files
        v
   Supabase project qorufqosjdhefnafwfzh
        - Auth        (usernames become  username@<clinicId>.dental.app ; KAL: username@dental.app)
        - Database    (Postgres + row-level security: every row carries its clinic id)
        - Storage     (private "backups" bucket)
        - Edge functions: manage-users, clinic-signup, recover-password, weekly-backup, setup-owner
   Optional per clinic: own website/server receiving backups (tools/backup-receiver.php), Google Drive, email (Resend)
```

Everything is loaded as classic scripts in the order listed in `index.html`; later files override earlier functions by re-assigning them
(for example `go=`, `settingsPage=`, `clinics=`). Keep global names unique.

## 2. Roles and the pages each can open (side menu keys in `src/app/layout.js`)

| Role | Pages |
|---|---|
| administrator | everything: dashboard, appointments, patients, dental records, ortho, orders, materials, sterilization, reports, earnings, pay rules, pay tracking, access overview, payroll, finance, users, clinics, all-clinics report, activity log, cash close, backup and storage, settings |
| manager | same as administrator except clinics management and the all-clinics report |
| doctor | dashboard, appointments, my patients, dental records, order tracker, directory, plans, ortho, materials, sterilization, lab, procedures, my pay, profile, settings |
| nurse | dashboard, appointments, patients, dental records, directory, materials, sterilization, lab, my pay, profile, settings |
| reception | dashboard, appointments, patients, directory, plans, ortho, orders, materials, sterilization, patient cards, analytics, invoice manager, cash close, print center, my pay, profile, settings |

Each person can reorder their side menu (Arrange menu, saved on that device).

## 3. Data (Supabase tables)

| Table | Holds |
|---|---|
| `clinics` | clinics: name, code (sign-in code), colour, icon, logo, `approved`, `trial_until` (free year) |
| `profiles` | staff: username, role, clinic, name, phone, email, title, ID-card data, avatar |
| `patients` | one row per patient; all clinical and money data is JSON in `data` (sections `d.rec`, `d.presc`, `d.consent`, `d.plan`, `d.inv`, `d.orthoV`, ...) |
| `clinic_lists` | per-clinic lists by `kind` (for example `fin` = finance settings: pay rules, lab fees, backup destination; manager/admin only) |
| `pay_statements` | published monthly pay statements; each person reads only their own |
| `deleted_patients` | copy of deleted patient files |
| `audit_log` | activity log written by database triggers |

Important rules in the database: `private.my_role()` and `private.my_clinic()` decide access; `my_clinic()` returns nothing for a clinic whose free year ended without approval;
triggers `guard_patient_update` (clinical sections only for the assigned doctor, invoices not for doctor/nurse) and `keep_deleted_patient`.

## 4. Main flows

- **Sign in:** clinic code -> `clinic_lookup` -> username + password (administrator types ADMIN; admin and manager can use two-step authenticator).
- **New clinic (sign-in page, small "New clinic" button):** edge function `clinic-signup` creates clinic + manager at once, free for one year (`approved=false`); the administrator approves it on the Clinics page (Approve / +7 days). After the year, staff cannot enter until approved. Donation card in Settings (eBirr, CBO, CBE).
- **Patients and records:** register -> assign doctor -> dental record, tooth chart with photos, consent, prescriptions, plans with installments, invoices and payments, receipts.
- **Orders:** doctor orders X-ray, lab tests, prosthodontic lab work; orders inbox and tracker until completed.
- **Ortho follow-up:** package fee, monthly fee, visit log, colour sign in front of ortho patient names.
- **Money:** invoices, cash close, expenses, payroll and tax form; doctor earnings with lab fees taken off, Sunday/night percent; pay rules (part-time nurse/reception, shareholders), pay tracking, published statements (My Pay).
- **Backups:** weekly cloud backup (email link, optional Google Drive, optional copy to the clinic's own server); Backup & Storage page: download, folder on the device, own website/server (receive.php), Restore backup on the Clinics page.
- **Offline:** works without internet, saves on the device and uploads later (`src/app/offline.js`, `sw.js`).
- **Languages:** English, Amharic, Afaan Oromoo, Soomaali (`src/app/i18n.js`, `recordLang.js`); Ethiopian and Gregorian calendars.

## 5. File map

### Root
| File | Purpose |
|---|---|
| `index.html` | page shell and the ordered list of all scripts; sign-in page |
| `build.mjs` | build: inlines scripts and CSS into `dist/index.html`, copies icons, manifest, service worker, `.well-known` |
| `manifest.webmanifest`, `sw.js`, `favicon.svg`, `icon-192.png`, `icon-512.png` | installable app and offline shell |
| `privacy.html`, `robots.txt` | privacy policy (Google Play) and robots |
| `vercel.json`, `netlify.toml` | hosting settings and security headers |
| `well-known/assetlinks.json` | links the Android app to the website (4 signing-key fingerprints) |
| `api/finance.js` | Vercel serverless finance summary |
| `package.json`, `.env.example`, `.gitignore`, `README.md`, `.github/workflows/` | project setup |

### `src/app/` - shell and settings
`layout.js` (page router `go`, role menus), `menuOrder.js` (arrange menu), `settings.js`, `colours.js`, `textsize.js`, `i18n.js`, `mobile.js`, `notify.js`, `offline.js`, `access.js`, `mfa.js`, `dsort.js`, `funcSearch.js`

### `src/features/`
| Folder | Files |
|---|---|
| `auth/` | `session.js` (sign-in, header), `profile.js`, `setup.js` (first run), `badge.js` (staff ID badge) |
| `clinics/` | `clinics.js` (create/edit/restore), `clinicRequests.js` (new clinic form, free year, approval box, donation card) |
| `admin/` | `users.js`, `activity.js`, `clinicsReport.js`, `support.js` |
| `backup/` | `destinations.js` (Backup & Storage page) |
| `dashboard/` | `dashboard.js`, `analytics.js`, `quickActions.js`, `recDesk.js` |
| `patients/` | `newPatient.js`, `patientDetail.js`, `patientSearch.js`, `phoneSearch.js`, `cardSend.js` |
| `appointments/` | `appointments.js` |
| `records/` | `recordForm.js`, `recordSchema.js`, `recordSections.js`, `recordSummary.js`, `recordPrint.js`, `recordLang.js`, `recordsDash.js`, `toothPhotos.js`, `plans.js`, `ortho.js`, `consentForm.js`, `consentPrescription.js`, `diseaseProcedure.js`, `invoiceSection.js` |
| `orders/` | `orders.js` |
| `finance/` | `financePage.js`, `invoiceManager.js`, `receipts.js`, `cashClose.js`, `expenses.js`, `payroll.js`, `yearlyReport.js`, `doctorEarnings.js`, `payRules.js` |
| `inventory/` | `materials.js`, `matExpiry.js` |
| `reports/` | `repDash.js`, `reportList.js`, `printCenter.js`, `clinicCards.js` |
| `dev/` | `sampleData.js` |

### Other `src/`
`lib/supabase.js` (all database calls: `DB.*`), `lib/date.js`, `lib/format.js`, `lib/print.js`, `lib/barcode.js`, `store/patientStore.js` (state `S`, sync), `components/modal.js`, `config/sections.js` (menu list), `index.css`

### `supabase/`
`schema.sql` (reference schema), `new-client.sql` (full setup of a new empty project), `NEW-CLIENT.md`, `GOOGLE-DRIVE-BACKUP.md`, `config.toml`,
`migrations/` (security fix, activity log, role hardening, clinic codes, free-year approval, pay statements, stock),
`functions/` `manage-users`, `clinic-signup`, `recover-password`, `weekly-backup`, `setup-owner`

### `tools/`, `play-store/`, `tests/`, `docs/`
`tools/backup-receiver.php` and its guide; `play-store/` listing text, checklist, icon, feature graphic, 8 screenshots, promo video; `tests/fakedb.js` offline test double; `docs/APP-MAP.md` (this file)

## 6. Build, deploy, operate

- Build locally: `node build.mjs` (output `dist/index.html`). Pushing to `main` deploys to Vercel automatically.
- Edge functions: deploy from Supabase (project `qorufqosjdhefnafwfzh`), all with JWT check off except where the function checks the user itself.
- Android: PWABuilder > Package for stores > Android (package `app.dentalcare.smartdent`, keep the same keystore for every update).
- Clinics: KAL (`kal`), BILAL (`bilal`), Demo (`demo`, review login in `play-store/LISTING.md`).
- Secrets you must keep: Android `signing.keystore` + password, Supabase and Resend keys, Google Drive token.

## System settings (administrator only)
- `src/features/admin/sysSettings.js`: object `AS` (defaults = original behaviour), page `sys`, table `app_settings` (migration `20261113_app_settings.sql`; admin writes, signed-in users read, anonymous read only for `public` keys).
- Editable: new-clinic sign-up on/off, free-period days, sign-ups per day, minimum password length, auto sign-out, who can edit patient files (any doctor / nurse records / nurse invoices), income-tax brackets, pension %, default lab fees, sterilization tests, material-expiry warning days, backups kept and interval, donation note and accounts.
- Edge functions `clinic-signup` and `weekly-backup` read `app_settings` with the old values as fallbacks.

## My data (every role)
- `src/features/backup/myData.js`, page `mydata`, edge function `email-my-data` (emails the file only to the email on the user's own profile). Staff: what they created; manager: whole clinic; administrator: all clinics. Save to device or send to email.
- Offline: with no internet, "Save to device" uses the copy already on the device (manager: open clinic; administrator: open clinic only, marked offlineCopy). "Send to my email" is kept in IndexedDB (`mdq`) and sent automatically when the internet returns.

## Staff types and assignments
- Table `profiles.stype` (bds / specialist for doctors, therapist for nurses; migration `20261114_staff_type.sql`). Same sign-in permissions as doctor/nurse; own labels (`roleLabel`, `STYPES` in `users.js`).
- Visiting specialist: works only on patients assigned to them or where invited (`p.spec`); paid by percent in Doctor Earnings / Pay rules, limited to the range in System settings (default 40-60%).
- `src/features/patients/assignStaff.js`: reception, doctor, manager or admin assigns a nurse or dental therapist (`p.nurses`) who can then edit that patient's invoices, records and prescriptions, and invites a specialist (`p.spec`). Edge function `manage-users` has new action `staff`.
- Backup folder: `myData.js` also saves a daily copy to the chosen folder and shows a dashboard reminder.
- Edit rule (System settings > Who can edit patient files, key `acc.assignedOnly`, default on): everyone reads every patient; a doctor or nurse edits only patients assigned to them. Reception/manager/admin assign the doctor (`p.doc`); reception, manager, admin or the assigned doctor add nurses/therapists (`p.nurses`) and other doctors/specialists (`p.spec`).
- `src/features/orders/duty.js`: "Staff in the clinic today" panel (reception/manager/admin tick who is present; stored in `S.stock.duty`, resets daily) and the "Waiting for a doctor" list; assign dialogs list present staff first with their number of active patients.
- `src/app/contacts.js`: "Choose from phone contacts" / "Choose email from phone contacts" buttons next to phone and email fields (patient, user and new-clinic forms) using the browser Contact Picker; "Save to phone contacts" (vCard) on the patient page.
