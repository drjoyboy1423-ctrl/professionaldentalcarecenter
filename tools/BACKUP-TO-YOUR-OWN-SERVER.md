# Keep backups on your own website or server

In the app: Settings > **Where backups are kept** (manager or administrator).

1. Choose a secret word and type it in the app, then press **Download receiver file** (receive.php with your secret inside).
2. Upload receive.php to your hosting (any PHP hosting, e.g. Yegara HOST), for example `https://yourwebsite.com/prodental/receive.php`.
3. Paste that address in the app, **Save**, then **Test connection** and **Send backup now**.
4. Optional: tick *send from the cloud every Sunday* (public https address only) or *from this device once a week*.

Backups are saved in a private `backups` folder next to receive.php (newest 20 per clinic).
Local server in the clinic: its address must be https:// (browsers block plain http), or run it on the same computer as http://localhost.
The secret word is never written into the backup files.
