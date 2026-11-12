# Google Play checklist - ProDental Records (app.dentalcare.smartdent)

Status: [x] done by Claude   [ ] you must do

## Account
- [ ] Google Play developer account (one-time 25 USD) and identity verification
- [ ] Contact phone and email verified (professionaldentalcarecenter@gmail.com / +251915018709)

## App build
- [x] Web app live: https://professionaldentalcarecenter-nine.vercel.app (auto-deploys from GitHub main)
- [x] manifest.webmanifest, icons 192/512, service worker, HTTPS
- [x] Digital Asset Links file (/.well-known/assetlinks.json) with all four package-key fingerprints (incl. the two new ones of 11 Nov 2026)
- [x] App renamed ProDental Records everywhere; theme colour and icons updated (blue tooth)
- [x] Package built with PWABuilder on 11 Nov 2026 (.apk tested on a phone; .aab in the same zip)
- [ ] Save signing.keystore + signing-key-info.txt (Drive + email): needed for every update
- [ ] Upload the .aab to Play Console (closed testing first)
- [ ] After the first upload copy the Play App Signing SHA-256 (Play Console > Setup > App signing) and send it to Claude to add to assetlinks.json

## Store listing
- [x] Title, short and full description (play-store/LISTING.md)
- [x] App icon 512x512, feature graphic 1024x500
- [x] 8 phone screenshots 1080x1920 (play-store/screenshots)
- [x] 30 s promo video file with the new name (upload to YouTube, paste the link)
- [ ] Optional: 7-inch and 10-inch tablet screenshots (only if you want tablet listing)
- [ ] Choose category Medical (or Business) and add the contact details

## App content (all in LISTING.md)
- [x] Privacy policy URL ready: https://professionaldentalcarecenter-nine.vercel.app/privacy
- [x] Data safety answers, health-app declaration, content rating answers, target audience 18+
- [x] Account deletion: described in the privacy policy (section 8)
- [x] App access: Demo clinic created (code demo, demo.manager / DemoReview#2026) with sample patients
- [ ] Enter all of the above in Play Console and press Save on each page

## Testing and release
- [ ] New personal accounts: closed test with 12+ testers for 14 days, then "Apply for production"
- [ ] Production release > send for review (usually a few days)
- [ ] After approval: archive or change the passwords of the Demo clinic
