/**
 * Micro Write Bank — Google Sheet sync (Apps Script web app)
 *
 * 1. Change SECRET below to your own phrase. Type the same phrase into the site's sync panel.
 * 2. Deploy → New deployment → type "Web app" → Execute as: Me → Who has access: Anyone.
 * 3. Copy the Web app URL (ends in /exec) into the site's sync panel.
 *
 * The site sends every finished answer and every grade here.
 *   "Answers" tab — one row per written answer (batch, question, what you wrote, hints used). Never deleted.
 *   "Grades"  tab — one row per grade you paste back (key points got / of, score, Claude's note). Never deleted.
 *   "Summary" tab — rebuilt after every sync: one row per question with times answered, latest and best score, latest note.
 * Every device reads both tabs back, so batches written on the iPad can be graded or reviewed anywhere.
 */
const SECRET = 'change-this-phrase';

const ANSWERS = 'Answers', GRADES = 'Grades', SUMMARY = 'Summary';
const A_HEAD = ['uid', 'When', 'ts', 'Device', 'Batch', 'Pos', 'Module', 'Question ID', 'Question', 'Answer', 'Hints used', 'Hints available', 'Level'];
const G_HEAD = ['uid', 'When', 'ts', 'Device', 'Batch', 'Module', 'Question ID', 'Question', 'Got', 'Of', 'Score', 'Note', 'Level'];

function doGet(e) {
  const key = e && e.parameter ? e.parameter.key : '';
  if (key !== SECRET) return out_({ ok: false, error: 'Wrong secret phrase' });
  return out_({ ok: true, answers: readAnswers_(), grades: readGrades_() });
}

function doPost(e) {
  let body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return out_({ ok: false, error: 'Bad request' }); }
  if (!body || body.key !== SECRET) return out_({ ok: false, error: 'Wrong secret phrase' });
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const rows = Array.isArray(body.rows) ? body.rows : [];
    const aRows = [], gRows = [];
    const haveA = uids_(tab_(ANSWERS, A_HEAD)), haveG = uids_(tab_(GRADES, G_HEAD));
    rows.forEach(function (r) {
      if (!r || !r.uid || !r.id) return;
      const ts = Number(r.ts) || Date.now();
      if (r.kind === 'answer' && !haveA.has(String(r.uid))) {
        haveA.add(String(r.uid));
        aRows.push([r.uid, new Date(ts), ts, r.device || '', r.bid || '', Number(r.pos) || 0, r.topic || '', r.id, safe_(r.q), safe_(r.text), Number(r.hints) || 0, Number(r.hintsOf) || 0, lvl_(r.lvl)]);
      }
      if (r.kind === 'grade' && !haveG.has(String(r.uid))) {
        haveG.add(String(r.uid));
        const got = Number(r.got) || 0, of = Number(r.of) || 1;
        gRows.push([r.uid, new Date(ts), ts, r.device || '', r.bid || '', r.topic || '', r.id, safe_(r.q), got, of, Math.round(100 * got / of) / 100, safe_(r.note), lvl_(r.lvl)]);
      }
    });
    if (aRows.length) { const sh = tab_(ANSWERS, A_HEAD); sh.getRange(sh.getLastRow() + 1, 1, aRows.length, A_HEAD.length).setValues(aRows); }
    if (gRows.length) { const sh = tab_(GRADES, G_HEAD); sh.getRange(sh.getLastRow() + 1, 1, gRows.length, G_HEAD.length).setValues(gRows); sh.getRange(2, 11, sh.getLastRow() - 1, 1).setNumberFormat('0%'); }
    const answers = readAnswers_(), grades = readGrades_();
    if (aRows.length || gRows.length) summary_(answers, grades);
    return out_({ ok: true, answers: answers, grades: grades, added: aRows.length + gRows.length });
  } finally {
    lock.releaseLock();
  }
}

function lvl_(v) { v = String(v || 'extreme').toLowerCase(); return ['easy', 'medium', 'hard', 'extreme'].indexOf(v) >= 0 ? v : 'extreme'; }

/* a leading = + - @ would make Sheets treat your writing as a formula */
function safe_(s) { s = String(s == null ? '' : s); return /^[=+\-@]/.test(s) ? "'" + s : s; }
function unsafe_(s) { s = String(s == null ? '' : s); return /^'[=+\-@]/.test(s) ? s.slice(1) : s; }

const TEXT_COLS = { Answers: ['Batch', 'Question ID', 'Question', 'Answer'], Grades: ['Batch', 'Question ID', 'Question', 'Note'] };
function tab_(name, head) {
  const ss = SpreadsheetApp.getActive();
  let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name); sh.getRange(1, 1, 1, head.length).setValues([head]); sh.setFrozenRows(1); sh.hideColumns(1); sh.hideColumns(3);
    // keep your writing as plain text so Sheets never turns "3/4" into a date or "1346-1350" into a number
    (TEXT_COLS[name] || []).forEach(function (h) { const c = head.indexOf(h) + 1; sh.getRange(1, c, sh.getMaxRows(), 1).setNumberFormat('@'); });
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold');
  } else if (sh.getLastColumn() < head.length) {
    sh.getRange(1, 1, 1, head.length).setValues([head]).setFontWeight('bold');   // older Sheet: add the new Level column header
  }
  return sh;
}
function uids_(sh) {
  const have = new Set(), n = sh.getLastRow() - 1;
  if (n > 0) sh.getRange(2, 1, n, 1).getValues().forEach(function (r) { have.add(String(r[0])); });
  return have;
}
function readAnswers_() {
  const sh = tab_(ANSWERS, A_HEAD), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, A_HEAD.length).getValues().map(function (r) {
    return { uid: String(r[0]), ts: Number(r[2]), device: r[3], bid: String(r[4]), pos: Number(r[5]), id: String(r[7]), text: unsafe_(r[9]), hints: Number(r[10]), hintsOf: Number(r[11]), lvl: lvl_(r[12]) };
  });
}
function readGrades_() {
  const sh = tab_(GRADES, G_HEAD), n = sh.getLastRow() - 1;
  if (n < 1) return [];
  return sh.getRange(2, 1, n, G_HEAD.length).getValues().map(function (r) {
    return { uid: String(r[0]), ts: Number(r[2]), device: r[3], bid: String(r[4]), id: String(r[6]), got: Number(r[8]), of: Number(r[9]), note: unsafe_(r[11]), lvl: lvl_(r[12]) };
  });
}

function summary_(answers, grades) {
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName(SUMMARY) || ss.insertSheet(SUMMARY);
  const info = {}, ans = tab_(ANSWERS, A_HEAD);
  if (ans.getLastRow() > 1) ans.getRange(2, 7, ans.getLastRow() - 1, 3).getValues().forEach(function (r) { info[String(r[1])] = { topic: r[0], q: r[2] }; });
  const st = {};
  answers.forEach(function (a) { const s = st[a.id] || (st[a.id] = { n: 0, g: [], lastAns: 0 }); s.n++; s.lastAns = Math.max(s.lastAns, a.ts); });
  grades.forEach(function (g) { const s = st[g.id] || (st[g.id] = { n: 0, g: [], lastAns: 0 }); s.g.push(g); });
  const rows = [['Question ID', 'Module', 'Question', 'Times answered', 'Times graded', 'Latest level', 'Latest score', 'Best Hard/Extreme score', 'Mastered (full credit at Hard/Extreme)', 'Latest note', 'Last answered']];
  Object.keys(st).sort(function (a, b) { return a.localeCompare(b, undefined, { numeric: true }); }).forEach(function (id) {
    const s = st[id], i = info[id] || {};
    s.g.sort(function (a, b) { return a.ts - b.ts; });
    const last = s.g[s.g.length - 1], hard = s.g.filter(function (g) { return g.lvl === 'hard' || g.lvl === 'extreme'; });
    const best = hard.reduce(function (m, g) { return Math.max(m, g.got / g.of); }, 0), lastHard = hard[hard.length - 1];
    rows.push([id, i.topic || '', i.q || '', s.n, s.g.length, last ? last.lvl : '', last ? last.got / last.of : '', hard.length ? best : '', lastHard && lastHard.got >= lastHard.of ? 'yes' : 'no', last ? last.note : '', s.lastAns ? new Date(s.lastAns) : '']);
  });
  sh.clearContents();
  sh.getRange(1, 1, rows.length, rows[0].length).setValues(rows);
  if (rows.length > 1) { sh.getRange(2, 7, rows.length - 1, 1).setNumberFormat('0%'); sh.getRange(2, 8, rows.length - 1, 1).setNumberFormat('0%'); }
  sh.setFrozenRows(1);
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
