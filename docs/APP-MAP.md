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
- `src/features/dashboard/recQueue.js`: "Sent to reception" panel on the dashboard (reception, manager, admin): invoices with a balance (Collect / Print), prescriptions not yet printed and pending orders (Print / Done); printed items leave the list (`x.printed`, `o.slip`).
- `src/features/dashboard/presence.js` + table `presence` (migration `20261114_presence.sql`): every signed-in user sends a heartbeat each minute; reception/manager/admin see a green (online) or grey (offline) dot in "Staff in the clinic today"; signing out marks offline at once; no internet = offline after about 3 minutes. Online staff are also treated as in the clinic in assign lists.
- Backup location choice (`bkfChoose` in `myData.js`): folder on a computer (automatic, daily), phone share menu (Files, Drive, WhatsApp, email; weekly reminder), or the Downloads folder. Offered from the dashboard reminder, My data and Backup & Storage.
- `src/features/admin/devNotes.js` + table `dev_notes` (migration `20261114_dev_notes.sql`): managers send a question, problem or idea to the developer (administrator), who reads, replies and marks done; the administrator sees a dashboard notice for new notes.

## Roles from the specification (phase 1)
- Role names are editable by the administrator (System settings > Role names, key `role.names`): Manager, Reception, Doctor, BDS, Dental therapist, Nurse, Visiting specialist, Lab staff, Support staff.
- New database roles `lab` and `support` (migrations `20261114_rbac_phase1.sql`, `20261114_rbac_support_role.sql`): no access to patient records or clinic lists. Lab staff use functions `lab_orders()` and `lab_set_status()` that return only case number, initials, age, sex, prescribing doctor, order and notes (`src/features/lab/labStaff.js`); support staff see only their pay and profile.
- Visiting specialist access window: `profiles.valid_from` / `valid_until` (set in the user form), enforced by `private.my_clinic()` on the server.
- Optional auto sign-out for doctors and nurses (System settings > Sign-up and access, `lock.sec`).
- Not built yet: append-only audit log, 24-hour lock with addendums, nurse draft signing, manager broadcasts, staff chat rooms, lab instrument registry, external lab partners, payroll for all staff types, government export packets.

## Audit events and the 24-hour record lock (roles phase 2, part 1)
- **Activity Log** (`src/features/admin/activity.js`): the database triggers in `public.audit_log` still record every add / change / delete. A new filter, "Prints, exports, sign-ins, refunds, signatures", shows app-level events from `public.audit_events`.
- **`src/features/admin/auditEvents.js`**: `AUD.log(action, resource, detail)` queues an event (kept on the device while offline, sent when the internet returns). Logged: LOGIN, LOGOUT, READ (opening a patient file, once per 10 minutes per patient), PRINT (every `printHtml`), EXPORT (`dlJson`, `csvDl`), REFUND and DELETE (invoice section, patient delete), SIGN, ADDENDUM. The database fills in user, role, clinic, time and IP address; rows cannot be changed or deleted (migration `20261115_audit_events.sql`). Managers see their own clinic, the administrator sees all.
- **`src/features/records/noteLock.js`**: doctors, BDS, visiting specialists and dental therapists can **Sign** a record (`x.sig={by,role,lic,at}`). For 24 hours it can still be corrected; after that the edit and delete buttons disappear and `recEdit`, `delI('rec')` and `rfSave` refuse. A dated **Addendum** (`x.add[]`, append-only) can be added to any signed record. The printed record shows the signature (name, ID / licence no., time) and the addendums.
- **Database rule** `private.rec_guard` (migration `20261115_note_lock.sql`, trigger `rec_guard` on `patients`): managers and reception cannot change `data.d.rec`; a record signed more than 24 hours ago cannot be changed or removed (only appended addendums); a signature dated in the future is refused. Server tools without a signed-in user (restore, admin scripts) are not affected. This sits beside the older `guard_patient_update` (assigned doctor only).
- Not built yet from the specification: nurse draft state "waiting for signature" (not needed while only assigned staff can edit), watermark on printed prescriptions, manager broadcasts with read receipts, staff chat rooms, lab instrument registry and external labs, biomedical staff and chair maintenance, payroll for all staff types, government export packets and inspector token, reception discount / void limits, keyboard shortcuts and emoji reactions, barcode scanner.

## Announcements and print watermark (roles phase 2, part 2)
- **`src/features/admin/broadcasts.js`**, tables `broadcasts` and `broadcast_reads` (migration `20261115_broadcasts.sql`): the manager (or administrator) posts an announcement (optional "urgent" in red) from **Announcements** in the menu. Unread announcements show at the top of every staff member's dashboard with an "I have read this" button. The manager sees "Read by 5 of 8" and who has not read it yet. Everyone in the clinic can read; only the manager / administrator can post or delete.
- **`src/features/records/printMark.js`**: printed prescriptions and the record summary end with the provider's name, ID / licence number and the print time (and who printed). The licence number is saved on the prescription when it is written (from the profile's ID code).

## Staff chat (roles phase 2, part 3)
- **`src/features/admin/chat.js`**, table `chat_msgs` + function `chat_react` (migration `20261115_chat.sql`): rooms `# general` (everyone incl. lab and support staff), `# clinical-floor` (doctors, nurses, manager), `# front-desk` (reception, manager). Room access is enforced by the database. Messages cannot be edited or deleted. Tap the smile icon on a message to react (👍 ✅ ⚠️ 🦷 🕒 ❤️). The list refreshes every 6 seconds while the page is open.

## Quick search and keyboard shortcuts
- **`src/app/omnibox.js`**: `Ctrl+K` / `Cmd+K` opens a search window (patient name, phone, card number, or any page); Up / Down / Enter / Esc work as expected. `Ctrl+Shift+A` opens appointments. `Alt+N` (and `Ctrl+N` in the installed app) starts a new patient for reception. `Esc` closes any window. The camera barcode scanner already existed (`src/lib/barcode.js`).

## Chairs and equipment, Biomedical staff
- **`src/features/admin/maintenance.js`**, table `maint_items` (migration `20261115_maintenance.sql`): "Chairs & equipment" page with a chair status grid (Online / Under maintenance / Out of service, from open fault tickets; number of chairs is set in System settings > Clinic routine), fault reports (doctors, nurses, reception, manager), and checks recorded by the manager or biomedical staff: preventive maintenance, calibration, waterline disinfection, electrical safety, other, each with an optional next-due date (alerts show 7 days ahead). Equipment can be a chair, autoclave, compressor, X-ray unit, amalgam separator, lab equipment or anything typed in, which also serves as the equipment / instrument register. Done / reopen / notes by manager and biomedical staff only. Rules are enforced by row-level security.
- **Biomedical staff** is a staff type of the support role (`profiles.stype='biomed'`, constraint updated; `manage-users` v52). No patient access; lands on Chairs & equipment. Its display name is editable in System settings > Role names.

## Payroll for every staff type
- `src/features/finance/payroll.js`: **Add all staff** puts every staff account of the clinic (doctors, BDS, specialists, therapists, nurses, reception, manager, lab, support, biomedical) on the month's payroll with salary 0, no duplicates. **Add doctor commission** copies each doctor's commission due this month (from Doctor Earnings) into the Service charge column so tax and pension are calculated with it.

## Compliance exports and on-site inspector link
- **`src/features/admin/compliance.js`** (page "Compliance exports", manager and administrator): *Health Ministry packet* (counts of procedures and diagnoses by month, sex and age group with no names; sterilization log; staff licence register) and *Tax / fiscal packet* (invoice ledger in order, monthly tax summary, refunds and deleted items). Downloads are CSV and are written to the audit log. A period filter limits them to one month.
- **Inspector link**: the manager creates a link valid for 1 to 24 hours (`inspector_tokens`, migration `20261115_inspector.sql`; only a hash of the token is stored; the link is shown once). It opens `/inspect` (`inspect.html`, copied to `dist` by `build.mjs` with the project address and public key), which calls the edge function `inspector-view` and shows only the sterilization log and equipment checks of that clinic (no patient data, no account). Every view is written to the audit log (action INSPECT). The manager can cancel a link at any time.

## Translations for the newer screens
- `src/app/i18n.js`: Amharic, Afaan Oromoo and Somali lines added for the menu items and main buttons of announcements, staff chat, chairs and equipment, compliance exports, signing and addendums, payroll buttons, and several earlier screens. Please have a native speaker of each language review the new lines; any phrase that is missing simply stays in English.
- Already existing before this: clinic / accent colours (`colours.js`), text size (`textsize.js`), four languages (`i18n.js`) and the administrator's two-step sign-in (`mfa.js`). Quick PIN switching on shared tablets is deliberately not built: it would require keeping other users' sign-in on the device.

## Lab messages (case thread, manager thread, lab invoices)
- **`src/features/lab/labThreads.js`**, table `lab_msgs` (migration `20261115_lab_threads.sql`): a **case thread** on each lab order between doctors (incl. BDS and specialists) and lab staff (Discuss button on the doctor's "Lab messages" page and on each lab order of the lab queue); a **manager thread** between the manager and lab staff ("Messages / invoices" on the lab queue, "Lab messages" for the manager); lab staff **submit invoices** (amount, number, description) which only the manager can read. Messages cannot be edited or deleted. Read and write rules are enforced by row-level security (nurses, reception and other doctors' roles see nothing of the manager thread; manager cannot read case threads).

## Nurse draft notes
- `src/features/records/noteLock.js`: a record saved by a nurse (not a dental therapist) is marked **Draft - waiting for a doctor's signature**; a nurse editing an already signed record removes the signature so it must be signed again. A doctor sees a reminder on the dashboard with the number of nurse drafts on their patients; Sign clears the draft.
- Reception discount / refund limits: already enforced by design. Reception cannot create or edit invoices (the assigned doctor does) and cannot refund (manager, administrator or the owning doctor only); reception only collects payments.

## Bell alerts, lab specialty chat rooms, equipment & purchases room
- **`src/app/alerts.js`**: every 30 seconds (app open, signed in, online; also on coming back online / to the foreground) it checks announcements, chat rooms, lab messages, urgent equipment faults and regular checks due (within 3 days or overdue). New items go into the same bell as the patient alerts (`nfPush` -> badge, toast, phone alert when the app is in the background). Tapping an item opens the right page (`nfGo` in `notify.js` supports `pg` and `room`). First check on a device only sets a baseline, so old items do not flood the bell. State: `nf:x:<uid>:<clinic>` on the device, removed at logout. One bell item per chat room. Messages in the room you are looking at do not alert. Lab messages alert doctor/manager (lab staff are told through the lab chat rooms). Faults and checks due alert manager and biomedical staff.
- **Lab specialties**: lab staff can be Prosthodontic, Endodontic or Orthodontic (`profiles.stype` = prostho / endo / ortho, role lab; set in Users, names editable in System settings > Role names; `manage-users` v53). Chat has three lab rooms (`lab_prostho`, `lab_endo`, `lab_ortho`): doctors (all types), manager and administrator see all three and choose which lab to talk to; lab staff see only their own specialty (lab staff with no specialty set see all three).
- **Equipment & purchases room** (`equip`): biomedical staff, doctors, manager and administrator talk about regular checks and items to buy. Button "Discuss checks / purchases" on the Chairs & equipment page.
- Database (migration `20261116_lab_specialty_chat.sql`): `private.my_stype()`, `private.chat_ok(room)` replaces the per-role check in the chat policies and `chat_react`; `chat_msgs.room` constraint extended. Tested in a rolled-back transaction for doctor, lab(endo), biomedical, plain support and nurse.

## My CV, public "Send your CV" page, Job applications
- **`src/features/admin/cv.js`**: page **My CV** (every staff role): position, phone, email, licence number, experience, languages, about, education, work, skills. Saved in `staff_cv` (own row only; the clinic manager and administrator can read the clinic's CVs, listed under "Staff CVs" on the same page). **Send by WhatsApp** (phone share menu, or WhatsApp web link on a computer) sends the CV as text; **Print / PDF** uses the normal print screen.
- **`apply.html`** (copied to `dist/apply.html` by `build.mjs`, gets the Supabase address and public key like `inspect.html`): public page `https://<site>/apply.html?c=<clinic code>`. An applicant writes name, phone, position, short message and attaches a CV (PDF, Word, JPG, PNG, up to 4 MB), or uses the **Send by WhatsApp** button (opens WhatsApp to the clinic phone number from Clinic details). Hidden field for robots.
- **Edge function `job-apply`** (v1, no sign-in): finds the clinic by code, checks name/phone, checks the file type by its first bytes, 4 MB limit, at most 3 applications per sender per hour and 80 per clinic per day, stores the file in the private bucket `applicant-cvs` (folder = clinic id) and adds a row to `job_applications`. It cannot read anything back.
- **Job applications** page (manager and administrator): link to share (WhatsApp / copy / open), list with status (New, Shortlisted, Not selected, Hired), Open CV (link valid 5 minutes), WhatsApp the applicant, delete (also removes the file). New applications also raise a bell alert for the manager (`alerts.js`).
- Database (migration `20261117_cv_job_applications.sql`): `staff_cv`, `job_applications` (RLS: manager of the clinic and administrator only; nobody inserts directly), storage policies for `applicant-cvs`. Tested in a rolled-back transaction: other clinic's manager and a doctor see no applications, a doctor cannot insert one, a staff member can save only their own CV.
- **Update: WhatsApp is optional and goes to the manager.** On the Job applications page the manager can switch on a "Send by WhatsApp" button for the applicant page and write their own WhatsApp number (table `job_config`, migration `20261117_job_config_files.sql`; only that clinic's manager and the administrator can change it). It is off by default, so applicants only see the in-app upload until the manager switches it on. The manager can also write the documents asked for ("CV, certificates, ID copy"), shown on the applicant page. Applicants can attach up to 3 files (PDF, Word, JPG, PNG; 4 MB each); each application lists all its files. `job-apply` v2.
- **Sending the applicant link** (Job applications page): one button opens the phone's share menu (WhatsApp, Telegram, SMS, Facebook, email...), or the manager types an applicant's phone number and taps **WhatsApp** or **SMS** to send the link to that person directly.

## Clinic address (one web address per clinic)
- Every clinic opens at `https://<site>/<clinic code>` (for example `/kal`), also `?c=<code>`. The sign-in page starts with that clinic: code filled in, clinic logo and colour shown, staff type only username and password. An unknown address shows "Clinic address not found". `src/features/auth/clinicUrl.js` (reads the address, wraps `lcInit`), `vercel.json` rewrite and `netlify.toml` redirect send `/<code>` to the app; real files (`/apply`, `/inspect`, `/privacy`) are served as usual.
- The address does not sign anybody in or change what they can see; it only picks which clinic the sign-in page starts with. Staff of another clinic still cannot sign in there.
- Shown to the administrator on each clinic card (tap to copy) and to the manager on the dashboard with **Copy** and **Send to staff** (share menu / WhatsApp).
- Reserved codes that cannot be used for a clinic: admin, administrator, apply, inspect, privacy, index, api, sw, manifest, favicon, robots, icon.
- A subdomain per clinic (`kal.example.com`) needs a domain the clinic owner buys and a wildcard record; not set up.

## Simple side menu
- The side menu now shows only the important pages of each role (`NAV_CORE` in `src/app/menuOrder.js`) plus Settings. Manager: Dashboard, Appointment, Recent Patient, All Patients, Dental Records, Invoice Manager, Finance, Reports, Users, Staff chat, Announcements. Doctor: Dashboard, Appointment, Recent Patient, Dental Records, All Patients, Finished Laboratory, Staff chat. Nurse and Reception similar; Lab and Support staff keep their short menus.
- **Settings > Side menu and all pages** (`src/app/menuSimple.js`) lists every page the person may open: **Open** goes to the page, the tick adds or removes it from the side menu (saved on this device for that user). Buttons **Simple menu** (back to the default) and **Show all pages**. "Arrange menu" (move up/down) still works on what is shown.
- Search (Ctrl+K) finds every page, including ones not in the side menu. Dashboard tiles and links still open any page.

## Waiting-room queue, clinic ads, job ads (2026-11-18/19)
- **Queue & screen** (`src/features/appointments/queue.js`, tables `queue_tickets`, rpc `queue_add`): reception gives a number, calls it to a chair; the waiting-room monitor (`qtvOpen`) shows NOW CALLING + chair, NEXT numbers, clinic ads and logo. Patient names are never shown.
- **Clinic ads** (`clinic_ads`, kind `promo` = monitor, `job` = vacancy shown on the public apply page). Managed on the "Clinic ads" page (manager). `job-apply` edge function v3 returns the clinic logo and active job ads; `apply.html` shows them and "Apply for this position" fills the position.
- Sign-in page: small "Jobs / CV" button next to "New clinic" (`jobsOpen()` in `clinicUrl.js`) opens `apply.html?c=<code>`.
- Migration files: `20261118_clinic_ads_queue.sql`, `20261119_rx_templates_patient_files.sql`.

## Prescriptions, Rx plans, X-ray / DICOM files, scanner (2026-11-19)
- **Why "Save prescription" was missing**: when a patient is not assigned to the logged-in doctor the record is read-only and `access.js` hides the save buttons. The banner now says who the patient is assigned to, and a doctor can press **Take this patient** (`ptTake`) when nobody is assigned.
- **Rx plans** (`rxPlans.js`, `consentPrescription.js`): Adult / Child toggle, specialty filter, built-in common cases (`RX_DEF`) the doctor can edit, delete (hide) or add to; custom plans live in `S.rxt` (`clinic_lists.kind='rxt'`). Child weight helper shows mg/kg arithmetic only. Typed medicines can be added; "Save as a plan" turns the current prescription into a plan.
- **Images / X-ray** (`xrayFiles.js`): Take photo, Choose from gallery, or choose DICOM (.dcm), CBCT .zip, PDF, STL/PLY/OBJ files (private bucket `patient-files`, 50 MB each, clinic folder only). Open/Share sends the file to IDV (IMAIOS DICOM Viewer) or any app through the phone share sheet; Download on computers. Pictures are kept inside the record (resized to 1400 px).
- **Barcode scanner** (`barcode.js`): live camera with clear error reasons (permission / camera in use / none), fallback to any camera, plus **Choose from gallery** and **Take a photo** (built-in BarcodeDetector, ZXing from jsDelivr as backup). Camera stops when the scanner is closed, Esc is pressed or the app goes to the background. `inputHints.js` sets phone / email / decimal keyboards on all fields.
- **GitHub Pages** (`.github/workflows/pages.yml`): builds `dist`, copies `index.html` to `404.html` so clinic addresses (`/kal`) work, deploys with GitHub Actions. One-time: Settings > Pages > Source = GitHub Actions, then add the repository variable PAGES_ENABLED = true (until then the workflow is skipped). App links use `siteBase()` so it also works under `/<repository>/`. A custom domain is added later in Settings > Pages with no app change (also update Supabase Auth Site URL).
- Sign-in "Jobs / CV" button turns green, pulses and reads "We're hiring - send CV" when the typed clinic has an active job ad (`jhCheck` in `clinicUrl.js`, uses the `job-apply` info call). The manager controls it with Clinic ads (job kind, active on/off).
- **Ortho treatment plans** (`orthoPlans.js`): "New Ortho Record" in Dental Records > Orthodontics opens a list of 12 adult / teenager and 11 child plans (crowding, Class II/III, deep/open bite, aligners, space maintainer, habit, expansion, face mask, impacted canine, retention...). Pick one, edit the text, save. Doctors and managers can edit, delete or add plans (kept in `S.rxt.oc` / `S.rxt.oh`).
- **Queue upgrades**: dashboard card "Queue today" for reception and manager (waiting / with a chair / served / average wait, now + next numbers, Give number / Open queue / Screen buttons, refreshes every 20 s); priority numbers (urgent, elderly, pregnant, child) are called first and shown with a star on the monitor; short note on a ticket; today's appointments shown as one-tap chips when giving a number; ticket window with people ahead and estimated wait; printable slip (`quPrint`). Migration `20261122_queue_priority_note.sql`.
