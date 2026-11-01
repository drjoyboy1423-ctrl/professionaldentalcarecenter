# Professional Dental Care Center (SmartDent)

Clinic management web app: patients, appointments, invoices and payments (Telebirr, CBE Birr, CBE, eBirr, cash),
Ethiopian calendar, X-ray viewer, 15% VAT, analytics, printing, and a manager/admin-only **Finance** section
(staff fees and salaries, clinic expenses, monthly and yearly reports).

Plain JavaScript, no framework and no dependencies. Backend: Supabase (auth + Postgres with row-level security).
Yearly finance report: Vercel serverless function `api/finance.js`.

## Folder map

| Folder / file | What it holds |
|---|---|
| `index.html` | Page shell + the ordered list of `src/` scripts (this order matters) |
| `build.mjs` | `node build.mjs` -> one self-contained `dist/index.html` (this is what gets deployed) |
| `src/index.css` | Theme styles |
| `src/config/sections.js` | Navigation, record sections, disease/procedure/medicine lists |
| `src/store/patientStore.js` | App state, load/save sync with Supabase, auto-refresh |
| `src/lib/` | `date.js` (Ethiopian calendar), `supabase.js` (data layer: auth + database), `format.js`, `print.js` (print + CSV) |
| `src/app/layout.js` | Page chrome, `go()` router, roles per screen |
| `src/components/modal.js` | Pop-up form + modal |
| `src/features/auth/` | `session.js` (sign-in, sign-out, boot), `profile.js` (profile, ID card, password) |
| `src/features/clinics/` | Create / edit / switch / delete clinics (colour, icon, logo) |
| `src/features/dashboard/` | `dashboard.js`, `quickActions.js`, `analytics.js` |
| `src/features/patients/` | `newPatient.js` (reception/manager only), `patientDetail.js` |
| `src/features/records/` | Dental records, X-ray images, invoices, credit, consent, prescriptions, lab, referral... |
| `src/features/appointments/` | Appointment list and booking |
| `src/features/finance/` | `invoiceManager.js`, `expenses.js` (salaries + expenses), `yearlyReport.js`, `financePage.js` |
| `src/features/reports/` | Print center and report list |
| `src/features/admin/users.js` | Staff accounts (admin / manager) |
| `src/features/dev/sampleData.js` | Demo patients (add / remove) |
| `api/finance.js` | Vercel function: yearly finance totals (manager/admin only, token-checked) |
| `supabase/schema.sql` | Database tables + row-level security (reference copy of the live schema) |
| `supabase/functions/manage-users/` | Edge function that creates / edits / resets / deletes staff accounts |
| `tests/` | Fake database used for browser tests |

Every `src/` file is a plain script that shares one global scope, loaded in the order listed in `index.html`.
When you add a file, add its `<script>` tag in the right place there; `build.mjs` inlines them in that order.

## Run locally
```
npm run dev        # static server on http://localhost:5173 (uses the live Supabase project)
npm run build      # writes dist/index.html
```

## Deploy
- **Vercel**: import the repo. `vercel.json` already sets build command `node build.mjs`, output `dist`, and no install.
  `api/finance.js` is deployed automatically.
- **Netlify**: import the repo. `netlify.toml` sets build `node build.mjs`, publish `dist`.
  The Netlify copy calls the Yearly Summary on the Vercel URL (set in `src/features/finance/yearlyReport.js`, `FAPI`; currently `https://dentalclincrecord.vercel.app`).
Each push to the main branch redeploys both.

## Roles
- **Admin**: all clinics, users, analytics, invoices, printing. Cannot add patients.
- **Manager / Reception**: add patients, appointments, invoices, analytics, print center.
- **Doctor / Nurse**: records and queue only.
- **Finance section**: Manager and Admin only, enforced by the database (`clinic_lists` kind `fin`) and by `api/finance.js`.

## Security notes
- The page contains only the public (publishable) Supabase key. The service-role key lives only in the edge function.
- Keep the row-level-security policies in `supabase/schema.sql`. Policies written as `using (true)` would let any signed-in user read every clinic.
- Never commit passwords, access tokens or the service-role key.
