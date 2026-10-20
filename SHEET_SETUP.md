# Connect Micro Write Bank to a Google Sheet

Same setup as your other practice sites, with its **own new Sheet**, so written answers never mix with the Practice Bank or CCMA Sheets.

1. Create a new blank Google Sheet. Name it something like **Micro Write Bank**.
2. In the Sheet, go to **Extensions → Apps Script**. Delete the starter code and paste everything from `Code.gs` (in this folder).
3. Near the top, change `SECRET = 'change-this-phrase'` to your own secret phrase. Save.
4. **Deploy → New deployment** → gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy** and approve the permissions prompt.
5. Copy the **Web app URL** (it starts with `https://script.google.com/` and ends with `/exec`).
6. Open Micro Write Bank on your iPad → tap **Google Sheet: not connected** → paste the URL and your secret phrase → **Connect and sync**. Do the same on any other device you use.

What you'll see in the Sheet:
- **Answers**: one row per written answer (when, device, batch, module, question, what you wrote, hints used). Nothing is ever deleted.
- **Grades**: one row per grade you paste back (key points got / out of, score, Claude's note). Nothing is ever deleted.
- **Summary**: one row per question: times answered, times graded, latest score, best score, latest note. Rebuilt after every sync.

Notes:
- Everything is saved in the browser first, then sent. If the connection drops, it waits and goes through on the next try.
- Every device reads the Sheet back, so you can write a batch on the iPad and see its grades on your Mac.
- If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit (pencil) → Version: New version → Deploy** so the URL stays the same.
