/**
 * JNVST Mock Test → Google Sheet
 * यह कोड Google Sheet "JNVST Mock Test परिणाम" के Extensions → Apps Script में चिपकाएँ,
 * फिर Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone) करें।
 */
const SHEET_ID = '18yWmmo0XIy8ujs2hFN_CzgvaCOXD2ATyveUeOkRxDAo';
const ID_COL = 98;   // कॉलम CT: प्रविष्टि ID (दोहरी प्रविष्टि रोकने के लिए)
const TRY_COL = 99;  // कॉलम CU: इस मोबाइल से इस सेट का प्रयास क्रमांक
const KIND_COL = 100; // कॉलम CV: रैंकिंग प्रकार (प्रतियोगी / अभ्यास)
const LIVE_COL = 101; // कॉलम CW: सेट की लाइव तारीख
const TZ = 'Asia/Kolkata';
const COMP_DAYS = 1;  // सेट लाइव होने से इतने दिन के भीतर का पहला प्रयास ही प्रतियोगी (रोज़ नया सेट = उसी दिन)

/*
 * दो अलग रैंकिंग (रैंकिंग नियम, README देखें)
 * 1. प्रतियोगी परीक्षा लीडरबोर्ड: हर मोबाइल नंबर का हर सेट पर केवल पहला जमा प्रयास,
 *    और वह भी सेट लाइव होने वाले दिन ही (अगला सेट आने से पहले)। बाद के प्रयास इसमें नहीं गिने जाते।
 *    अवधि में एक से अधिक सेट हों तो उन पहले प्रयासों का औसत अंक।
 * 2. अभ्यास लीडरबोर्ड: सभी प्रयास गिने जाते हैं; अवधि में विद्यार्थी का सर्वश्रेष्ठ अंक।
 * दोनों में बराबरी होने पर: अधिक सटीकता, फिर कम समय, फिर पहले जमा।
 */

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const d = JSON.parse(e.postData.contents);
    if (!d || !d.id || !Array.isArray(d.answers) || d.answers.length !== 80) {
      return out({ ok: false, error: 'अधूरा डेटा' });
    }
    const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];

    if (sh.getRange(1, ID_COL).getValue() === '') {
      sh.getRange(1, ID_COL).setValue('प्रविष्टि ID');
    }
    if (sh.getRange(1, TRY_COL).getValue() === '') {
      sh.getRange(1, TRY_COL, 1, 3).setValues([['प्रयास क्रमांक', 'रैंकिंग प्रकार', 'सेट लाइव तारीख']]);
    }
    // वही प्रविष्टि दोबारा आए तो फिर से न जोड़ें
    if (sh.getLastRow() > 1) {
      const found = sh.getRange(2, ID_COL, sh.getLastRow() - 1, 1)
        .createTextFinder(String(d.id)).matchEntireCell(true).findNext();
      if (found) return out({ ok: true, duplicate: true });
    }

    // इस मोबाइल से इसी सेट के पिछले प्रयास गिनें
    const mobile = String(d.mobile).replace(/\D/g, '');
    let tries = 1;
    if (sh.getLastRow() > 1) {
      const cd = sh.getRange(2, 3, sh.getLastRow() - 1, 2).getValues();
      cd.forEach(r => { if (String(r[0]).replace(/\D/g, '') === mobile && String(r[1]) === String(d.set)) tries++; });
    }
    const live = /^\d{4}-\d{2}-\d{2}$/.test(String(d.live || '')) ? String(d.live) : '';
    const kind = (tries === 1 && inWindow(new Date(d.ts), live)) ? 'प्रतियोगी' : 'अभ्यास';

    const row = [
      new Date(d.ts),
      safe(d.name),
      "'" + String(d.mobile).replace(/\D/g, ''),
      safe(d.set),
      num(d.score), num(d.pct), num(d.correct), num(d.wrong), num(d.skipped),
      num(d.acc), num(d.minutes),
      num(d.mat), num(d.evs), num(d.ari), num(d.lan),
      safe(d.qual),
      d.auto ? 'समय समाप्त (स्वतः जमा)' : 'विद्यार्थी द्वारा जमा'
    ].concat(d.answers.map(safe)).concat([safe(d.id), tries, kind, live]);

    sh.appendRow(row);
    CacheService.getScriptCache().remove('lb');
    return out({ ok: true, attempt: tries, kind: kind });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.lb) return out(leaderboard(String(p.me || '').replace(/\D/g, '')));
  return out({ ok: true, message: 'JNVST परिणाम Sheet तैयार है' });
}

/* ---------------- लीडरबोर्ड ---------------- */
function ist(d) { return Utilities.formatDate(d, TZ, 'yyyy-MM-dd'); }
function addDays(ymd, n) {
  const t = new Date(ymd + 'T00:00:00Z'); t.setUTCDate(t.getUTCDate() + n);
  return t.toISOString().slice(0, 10);
}
function inWindow(d, live) {
  if (!live) return true; // पुराने प्रयास जिनमें लाइव तारीख नहीं भेजी गई
  const day = ist(d);
  return day >= live && day < addDays(live, COMP_DAYS);
}

function allAttempts() {
  const sh = SpreadsheetApp.openById(SHEET_ID).getSheets()[0];
  const n = sh.getLastRow() - 1;
  if (n < 1) return [];
  const width = Math.max(LIVE_COL, sh.getLastColumn());
  const v = sh.getRange(2, 1, n, width).getValues();
  const rows = v.map(r => ({
    ts: r[0] instanceof Date ? r[0] : new Date(r[0]),
    name: String(r[1] || '').trim(),
    mobile: String(r[2] || '').replace(/\D/g, ''),
    set: String(r[3] || ''),
    score: Number(r[4]) || 0, acc: Number(r[9]) || 0, min: Number(r[10]) || 0,
    live: r[LIVE_COL - 1] instanceof Date ? ist(r[LIVE_COL - 1]) : String(r[LIVE_COL - 1] || '')
  })).filter(r => r.mobile && r.set && !isNaN(r.ts));
  // प्रयास क्रमांक समय के क्रम से फिर से निकालें (पुरानी पंक्तियों के लिए भी सही)
  rows.sort((a, b) => a.ts - b.ts);
  const count = {};
  rows.forEach(r => {
    const k = r.mobile + '|' + r.set;
    r.attempt = count[k] = (count[k] || 0) + 1;
    r.day = ist(r.ts);
    r.comp = r.attempt === 1 && inWindow(r.ts, r.live);
  });
  return rows;
}

function periods() {
  const today = ist(new Date());
  const dow = (new Date(today + 'T00:00:00Z').getUTCDay() + 6) % 7; // सोमवार = 0
  return { day: today, week: addDays(today, -dow), month: today.slice(0, 8) + '01' };
}

function better(a, b) { // a, b से बेहतर है?
  return a.score !== b.score ? a.score > b.score : a.acc !== b.acc ? a.acc > b.acc : a.min !== b.min ? a.min < b.min : a.ts < b.ts;
}

function board(rows, from, competitive) {
  const by = {};
  rows.forEach(r => {
    if (r.day < from) return;
    if (competitive && !r.comp) return;
    (by[r.mobile] = by[r.mobile] || []).push(r);
  });
  const list = Object.keys(by).map(m => {
    const a = by[m], last = a[a.length - 1];
    if (competitive) {
      const k = a.length;
      return { mobile: m, name: last.name, sets: k,
        score: round(a.reduce((s, r) => s + r.score, 0) / k), acc: round(a.reduce((s, r) => s + r.acc, 0) / k),
        min: round(a.reduce((s, r) => s + r.min, 0) / k), ts: a[0].ts, set: k === 1 ? a[0].set : k + ' सेट' };
    }
    let best = a[0];
    a.forEach(r => { if (better(r, best)) best = r; });
    return { mobile: m, name: best.name, tries: a.length, score: best.score, acc: best.acc, min: best.min,
      ts: best.ts, set: best.set, gain: round(best.score - a.find(r => r.set === best.set).score) };
  });
  list.sort((x, y) => better(x, y) ? -1 : better(y, x) ? 1 : 0);
  return list;
}

function leaderboard(me) {
  const cache = CacheService.getScriptCache();
  let full = null;
  const c = cache.get('lb');
  if (c) full = JSON.parse(c);
  if (!full) {
    const rows = allAttempts(), p = periods();
    full = { ok: true, updated: new Date().toISOString(), periods: p, comp: {}, prac: {} };
    ['day', 'week', 'month'].forEach(k => {
      full.comp[k] = board(rows, p[k], true);
      full.prac[k] = board(rows, p[k], false);
    });
    try { cache.put('lb', JSON.stringify(full), 60); } catch (err) {}
  }
  const res = { ok: true, updated: full.updated, periods: full.periods, comp: {}, prac: {}, me: null };
  if (me) res.me = { comp: {}, prac: {} };
  ['comp', 'prac'].forEach(b => ['day', 'week', 'month'].forEach(k => {
    const L = full[b][k];
    res[b][k] = { total: L.length, top: L.slice(0, 10).map(pub) };
    if (me) {
      const i = L.findIndex(x => x.mobile === me);
      res.me[b][k] = i < 0 ? null : Object.assign(pub(L[i]), { rank: i + 1, total: L.length });
    }
  }));
  return res;
}
function pub(x) { // मोबाइल नंबर पूरा न दिखे
  const o = Object.assign({}, x);
  o.mob = '••••••' + x.mobile.slice(-4);
  delete o.mobile; delete o.ts;
  return o;
}
function round(n) { return Math.round(n * 100) / 100; }

// शीट में फ़ॉर्मूला न बन जाए, इसलिए =, +, -, @ से शुरू होने वाले पाठ के आगे ' लगाएँ
function safe(v) {
  const s = String(v == null ? '' : v).slice(0, 200);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}
function num(v) {
  const n = Number(v);
  return isFinite(n) ? n : '';
}
function out(o) {
  return ContentService.createTextOutput(JSON.stringify(o))
    .setMimeType(ContentService.MimeType.JSON);
}
