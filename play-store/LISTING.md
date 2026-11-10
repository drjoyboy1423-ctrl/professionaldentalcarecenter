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

FOR THE CLINIC OWNER AND MANAGERS
- Ortho follow-up: fee package, monthly fee, visits and a colour sign for who is paid, paying or behind
- Doctor earnings: normal, Sunday and night percent after lab fees
- Pay rules and tracking: part-time pay for nurses and reception, shareholder shares, monthly payroll and tax form
- Each staff member sees only their own pay statement
- Sign in with a clinic code - no public clinic list

MORE
- Languages: English, Amharic (አማርኛ), Afaan Oromoo, Soomaali
- Ethiopian and Gregorian calendars
- Works offline and syncs when you are back online
- Dark mode and adjustable text size
- Notifications for new orders, assigned patients and ready results
- Role-based access, activity log and optional two-step sign-in

SmartDent is for clinic staff. Accounts are created by your clinic administrator.

## Graphics (ready in this folder)
- App icon 512x512: play-store/brand/icon-512.png
- Feature graphic 1024x500: play-store/brand/feature-1024x500.png
- Phone screenshots (1080x1920, English, sample data): play-store/screenshots/phone-01 ... phone-08 (login, dashboard, patients, dental records, orders inbox, ortho follow-up, reports, pay tracking). Upload them in this order.
- Promo video (30 s, 1080p): play-store/promo-video-1080p.mp4 - upload to YouTube (public or unlisted) and paste the link in Play Console > Store listing > Video.

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
Play Console > App content > App access > "All or some functionality is restricted". Give:
- Clinic code: demo
- Username: demo.manager   Password: DemoReview#2026   (also demo.doctor and demo.reception, same password)
- Note: "Staff-only app. On the sign-in screen type clinic code demo, then the username and password. The Demo clinic contains sample patients only."
After approval you may archive the Demo clinic or change its passwords.

## Release steps
1. Create app > Setup tasks (above) > Testing > Closed testing: upload the .aab from PWABuilder, add 12+ testers (needed for new personal accounts), keep testing for 14 days.
2. Setup > App signing: copy the SHA-256 of the "App signing key certificate" and add it to well-known/assetlinks.json (next to the PWABuilder one), then deploy. This removes the browser address bar.
3. Apply for production access > Production > create release > send for review.
