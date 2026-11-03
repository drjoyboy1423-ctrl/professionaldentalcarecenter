# Save backups straight into Google Drive

The weekly backup can also drop each clinic's backup file into a Drive folder. No Google Cloud project is needed:
a small Google Apps Script in the Drive owner's account receives the file and saves it.

1. Sign in to the Google account whose Drive should hold the backups. Open https://script.google.com > New project.
2. Delete the sample code and paste the script below. Change `TOKEN` to a long random text (letters and numbers, 24+ characters).
3. Deploy > New deployment > type **Web app** > Execute as **Me** > Who has access **Anyone** > Deploy. Approve the permissions. Copy the **Web app URL**.
4. In Supabase > Edge Functions > Secrets add:
   - `DRIVE_WEBHOOK_URL` = the Web app URL
   - `DRIVE_TOKEN` = the same random text you put in `TOKEN`
5. In the app: Settings > Backups > Back up all clinics now. The message says "copied to Google Drive". The files appear in the Drive folder "Dental Backups".

```js
const TOKEN = 'PUT-A-LONG-RANDOM-TEXT-HERE';
const FOLDER = 'Dental Backups';
function doPost(e) {
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.token !== TOKEN) return out({ error: 'wrong token' });
    const it = DriveApp.getFoldersByName(FOLDER);
    const folder = it.hasNext() ? it.next() : DriveApp.createFolder(FOLDER);
    const old = folder.getFilesByName(b.name);
    while (old.hasNext()) old.next().setTrashed(true);
    folder.createFile(UrlFetchApp.fetch(b.url).getBlob().setName(b.name));
    return out({ ok: true });
  } catch (err) { return out({ error: String(err) }); }
}
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
```

Keep the Drive folder private (never share it by link): the files contain patient data.
