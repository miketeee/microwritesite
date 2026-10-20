# Micro Write Bank

The **written-answer** site for Microbiology, made for the iPad and Apple Pencil. It's separate from the other two sites:

| Site | What it is | Where it runs |
|---|---|---|
| **Micro Quiz Bank** | Click-to-grade quizzes, Navigator, Practice Bank | GitHub Pages |
| **Micro Voice Bank** | Practice Bank with voice mode | Locally on your Mac/PC |
| **Micro Write Bank** (this) | Write answers from memory; Claude grades them | GitHub Pages, used on your iPad |

## How it works

1. Pick modules, which questions (all, weak, never answered, answered but not graded), how many, and the order. Tap **Start writing**.
2. Write each answer in the box with the Apple Pencil. iPadOS Scribble turns your handwriting into text. **Hint** first tells you how many key points to cover and gives masked key terms (like `Y_______ p_____`). Each hint after that reveals one key point. Everything saves as you write, so you can leave and **Resume** later.
3. After the last question, tap **Finish batch**, then **Copy for Claude** and paste into a Claude chat. Claude grades each answer against your study-guide answer key, with notes on what was missing or wrong.
4. Claude ends its reply with an **MWB-GRADES** block. Copy the reply (or just that block), paste it into **Paste the grades back**, and tap **Save grades**.
5. Anything below full credit goes on the **Weak list**. Practice it from there, or pick "Weak" when you set up a batch.

Questions and answer keys come from the Study Guide Q&A pages for Modules 1–17 (334 questions).

## Publishing to GitHub Pages (its own repo)

1. Create a **new** repository on GitHub, for example `micro-write-bank`. Keep it separate from the Micro Quiz Bank repo.
2. Push the **contents** of this folder (not the folder itself) to the repo root:
   ```
   git init
   git add .
   git commit -m "Micro Write Bank"
   git branch -M main
   git remote add origin https://github.com/<your-username>/micro-write-bank.git
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages** → Source **Deploy from a branch**, branch `main`, folder `/ (root)`. Save.
4. Open the Pages URL on the iPad in Safari → **Share → Add to Home Screen** so it opens full-screen like an app.

A home-screen web app keeps its own storage, separate from Safari's. Connect the Google Sheet (below) in whichever one you use, and both stay in step.

## Google Sheet sync

See `SHEET_SETUP.md`. It's the same pattern as the Practice Bank: deploy `Code.gs` as an Apps Script web app on a new Sheet, then paste the /exec URL and your secret phrase into the sync panel.

## Files

```
index.html            the whole site (questions and answer keys are embedded in it)
apple-touch-icon.png  home-screen icon
Code.gs               Apps Script for the Google Sheet
SHEET_SETUP.md        Sheet setup steps
```
