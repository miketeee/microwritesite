# Micro Write Bank

The **written-answer** site for Microbiology, made for the iPad and Apple Pencil. It's separate from the other two sites:

| Site | What it is | Where it runs |
|---|---|---|
| **Micro Quiz Bank** | Click-to-grade quizzes, Navigator, Practice Bank | GitHub Pages |
| **Micro Voice Bank** | Practice Bank with voice mode | Locally on your Mac/PC |
| **Micro Write Bank** (this) | Write answers from memory; Claude grades them | GitHub Pages, used on your iPad |

## How it works

1. Pick modules, which questions (all, weak, never answered, answered but not graded), how many, and the order. Tap **Start writing**.
2. Write each answer by hand on the ruled pad. The **Apple Pencil writes and your finger scrolls**, so resting your palm or scrolling won't leave marks. Tools: **Pen**, **Eraser** (touch a stroke to remove it), **Undo**, **Clear**. The pad grows as you near the bottom, or tap **More room**.
3. **Hint** first tells you how many key points to cover and shows the key terms with letters blanked (like `c________`). Each hint after that reveals one key point.
4. Every stroke is saved on the iPad as you write, so you can leave and **Resume** later.
5. After the last question, tap **Finish batch**. The site makes a PDF with one page per question: the question at the top and your handwriting below.
   - Tap **Share PDF…** and pick the Claude app, or **Save PDF** and attach it in Claude.
   - Tap **Copy grading message** and paste it into the same Claude chat. It has the grading rules, each question's answer key and the hints you used. Then send.
6. Claude ends its reply with an **MWB-GRADES** block. Copy the reply (or just that block), paste it into **Paste the grades back**, and tap **Save grades**.
7. Anything below full credit goes on the **Weak list**. Open **Your answer** on any graded question to see your handwriting next to Claude's note.

Your handwriting stays on the iPad (in the site's browser storage). Grades, notes, the weak list and a record of each answer sync to your Google Sheet. Use the home-screen version so Safari doesn't clear the site's storage after a few weeks without visits.

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
