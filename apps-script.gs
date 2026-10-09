/**
 * JNVST Mock Test → Google Sheet
 * यह कोड Google Sheet "JNVST Mock Test परिणाम" के Extensions → Apps Script में चिपकाएँ,
 * फिर Deploy → New deployment → Web app (Execute as: Me, Who has access: Anyone) करें।
 */
const SHEET_ID = '18yWmmo0XIy8ujs2hFN_CzgvaCOXD2ATyveUeOkRxDAo';
const ID_COL = 98; // कॉलम CT: प्रविष्टि ID (दोहरी प्रविष्टि रोकने के लिए)

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
    // वही प्रविष्टि दोबारा आए तो फिर से न जोड़ें
    if (sh.getLastRow() > 1) {
      const found = sh.getRange(2, ID_COL, sh.getLastRow() - 1, 1)
        .createTextFinder(String(d.id)).matchEntireCell(true).findNext();
      if (found) return out({ ok: true, duplicate: true });
    }

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
    ].concat(d.answers.map(safe)).concat([safe(d.id)]);

    sh.appendRow(row);
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return out({ ok: true, message: 'JNVST परिणाम Sheet तैयार है' });
}

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
