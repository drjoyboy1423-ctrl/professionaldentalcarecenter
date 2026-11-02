# SmartDent - Google Play listing pack (English)

## Basics
- **App name (max 30):** SmartDent - Dental Clinic
- **Package:** app.dentalcare.smartdent
- **Category:** Medical  (or Business)  | **Type:** App | **Price:** Free
- **Privacy policy URL:** https://professionaldentalcarecenter-nine.vercel.app/privacy
- **Contact email:** professionaldentalcarecenter@gmail.com (also dr.joyboy1423@gmail.com)
- **Contact phone:** +251 915 018 709 (Play Console asks for a phone number with country code: +251915018709)
- **Website:** https://professionaldentalcarecenter-nine.vercel.app

## Short description (max 80)
Run your dental clinic: patients, appointments, records, orders and billing.

## Full description (max 4000)
SmartDent is a complete management app for dental clinics. Reception, doctors, nurses and managers each get the tools they need, on a phone, tablet or computer.

FOR RECEPTION
- Register patients and print patient cards with a barcode
- Book appointments for a specific doctor
- Assign each new patient to a doctor
- Take payments and print receipts; daily cash close
- Desktop front-desk view with waiting list and keyboard shortcuts

FOR DOCTORS
- "My Patients" list: only the patients assigned to you
- Dental records with a tooth chart and before / during / after photos
- Place orders: dental X-rays (IOPA, CBCT, panoramic...), clinical lab tests, prosthodontic lab work, prescriptions and billing
- Track every order until it is completed

FOR NURSES
- Sterilization (autoclave) test log with due-date reminders
- Dental materials check-up and purchase requests

FOR MANAGERS
- Orders inbox, invoices, refunds, finance and expenses
- Reports dashboard with monthly and yearly registrations, revenue, procedures, lab and X-ray volume and materials used
- Print an official A4 report or export CSV

MORE
- Languages: English, Amharic (አማርኛ), Afaan Oromoo, Soomaali
- Ethiopian and Gregorian calendars
- Works offline and syncs when you are back online
- Dark mode and adjustable text size
- Notifications for new orders, assigned patients and ready results
- Role-based access, activity log and optional two-step sign-in

SmartDent is for clinic staff. Accounts are created by your clinic administrator.

## Graphics to prepare
- App icon 512x512 PNG (use icon-512.png from the repo)
- Feature graphic 1024x500 PNG (clinic colour background + tooth logo + "SmartDent")
- Phone screenshots (at least 2, ideally 6-8), take from a phone in English with the SAMPLE data loaded
  (Reports > Load 6-month sample data), in this order:
  1. Login screen
  2. Doctor "My Patients" dashboard
  3. Patient file with tooth chart
  4. Place Order window
  5. Orders Inbox
  6. Dental Materials (red out-of-stock + Order Now)
  7. Reports Dashboard
  8. Reception desk (computer screen) or Appointments

## Content rating questionnaire (IARC)
Category "Utility / Productivity". No violence, sexual content, gambling, user-generated public content or location sharing. Expected rating: Everyone.

## Target audience
18 and over (clinic staff). Not designed for children.

## Health apps declaration
Choose: the app is **not** a medical device and gives no diagnosis or treatment advice. It is a record-keeping and clinic-management tool.

## Data safety form (suggested answers - check against your final app)
- Does the app collect or share data? **Yes - collects, does not share with third parties for their own use.**
- Data types collected: Personal info (name, email, phone, date of birth), Health info (dental and medical records), Financial info (invoices and payments recorded by the clinic), Photos (patient and X-ray images), App activity (activity log).
- Purpose: App functionality; Account management.
- Shared with third parties: No (hosting providers act only as processors).
- Encrypted in transit: **Yes (HTTPS)**.
- Users can request data deletion: **Yes** - by phone or email, see privacy policy section 8. Account / data deletion URL: https://professionaldentalcarecenter-nine.vercel.app/privacy
- Optional data: none. Data is not used for ads or analytics.

## Review access (IMPORTANT - Google needs a working login)
In Play Console > App content > App access, choose "All or some functionality is restricted" and give:
- Clinic: (create a clinic named "Demo Clinic" with sample data)
- Username / password for a reviewer account with role Manager (create it in Users). Use a throw-away password and delete the account after approval.
- Note: "Staff-only app. Choose the Demo clinic, sign in with these details."

## Release steps
1. Create app > Setup tasks (above) > Testing > Closed testing: upload the .aab from PWABuilder, add 12+ testers (needed for new personal accounts), keep testing for 14 days.
2. Setup > App signing: copy the SHA-256 of the "App signing key certificate" and add it to well-known/assetlinks.json (next to the PWABuilder one), then deploy. This removes the browser address bar.
3. Apply for production access > Production > create release > send for review.
