#!/usr/bin/env node
/* JNVST मॉक टेस्ट · सेट जाँच उपकरण
   उपयोग: node tools/validate.js            (सभी सेट जाँचें)
          node tools/validate.js set-02.js  (केवल यह सेट, पर दोहराव सभी सेटों से जाँचें)
   त्रुटि होने पर exit code 1 देता है। */
const fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.join(__dirname, '..');
const ctx = { window: {}, Math, String, Number, Array, Object, JSON, console };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'figs.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'sets/manifest.js'), 'utf8'), ctx);
const manifest = ctx.window.JNVST_SETS;
const only = process.argv[2];
const errors = [], warnings = [];
const norm = s => String(s).replace(/<[^>]+>/g, ' ').replace(/[\s।?!.,:;“”"'‘’()-]+/g, ' ').trim().toLowerCase();
const seen = new Map(); // normalized question+options -> where
const seenStem = new Map(); // normalized question text (non-figure) -> where
const SECS = [['mat', 0, 19], ['evs', 20, 39], ['ari', 40, 59], ['lan', 60, 79]];

if (!Array.isArray(manifest) || !manifest.length) { console.error('manifest खाली है'); process.exit(1); }
const ids = new Set(), files = new Set();
let prevLive = '';
manifest.forEach((m, i) => {
  if (ids.has(m.id) || files.has(m.file)) errors.push(`manifest: ${m.id} दोहराया गया`);
  ids.add(m.id); files.add(m.file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(m.live)) errors.push(`manifest: ${m.id} की live तारीख गलत`);
  if (m.live < prevLive) errors.push(`manifest: ${m.id} की तारीख पिछले सेट से पहले की है`);
  prevLive = m.live;
  if (m.id !== 'SET ' + String(i + 1).padStart(2, '0')) errors.push(`manifest: क्रम में ${i + 1}वाँ सेट ${m.id} है`);
});

for (const m of manifest) {
  const file = path.join(ROOT, 'sets', m.file);
  if (!fs.existsSync(file)) { errors.push(`${m.file} फ़ाइल नहीं मिली`); continue; }
  ctx.window.JNVST_SET = undefined;
  try { vm.runInContext(fs.readFileSync(file, 'utf8'), ctx, { filename: m.file }); }
  catch (e) { errors.push(`${m.file}: चलाने में त्रुटि: ${e.message}`); continue; }
  const S = ctx.window.JNVST_SET, tag = m.id;
  const check = !only || only === m.file;
  if (!S) { errors.push(`${m.file}: window.JNVST_SET नहीं बना`); continue; }
  if (check) {
    if (S.id !== m.id) errors.push(`${tag}: id (${S.id}) manifest से अलग`);
    if (S.live !== m.live) errors.push(`${tag}: live तारीख manifest से अलग`);
    const Q = S.questions, key = Buffer.from(S.key || '', 'base64').toString('binary').split('').reverse().join('');
    if (!Array.isArray(Q) || Q.length !== 80) errors.push(`${tag}: 80 प्रश्न चाहिए, मिले ${Q && Q.length}`);
    if (!/^[ABCD]{80}$/.test(key)) errors.push(`${tag}: उत्तर-कुंजी 80 अक्षर (A-D) की नहीं है`);
    const diff = { E: 0, M: 0, D: 0 }, dist = { A: 0, B: 0, C: 0, D: 0 }, passUse = {};
    (Q || []).forEach((q, i) => {
      const n = i + 1, sec = SECS.find(s => i >= s[1] && i <= s[2])[0];
      if (q.s !== sec) errors.push(`${tag} Q${n}: विषय ${q.s} होना चाहिए ${sec}`);
      if (!Array.isArray(q.o) || q.o.length !== 4) errors.push(`${tag} Q${n}: 4 विकल्प चाहिए`);
      else if (new Set(q.o.map(norm)).size !== 4 && !q.fo) errors.push(`${tag} Q${n}: विकल्प दोहराए गए`);
      if (!q.q || !q.e || !q.t) errors.push(`${tag} Q${n}: q/e/t खाली`);
      if (!['E', 'M', 'D'].includes(q.d)) errors.push(`${tag} Q${n}: कठिनाई E/M/D नहीं`); else diff[q.d]++;
      if (!(q.g in { p1: 1, p2: 1, p3: 1, p4: 1, p5: 1, evs: 1, ari: 1, lan: 1 })) errors.push(`${tag} Q${n}: g (${q.g}) अमान्य`);
      if (q.p) { if (!S.passages || !S.passages[q.p]) errors.push(`${tag} Q${n}: गद्यांश ${q.p} नहीं मिला`); passUse[q.p] = (passUse[q.p] || 0) + 1; }
      if (key[i]) dist[key[i]]++;
      if (/a:'[ABCD]'/.test(JSON.stringify(q))) errors.push(`${tag} Q${n}: उत्तर प्रश्न में छूट गया`);
    });
    // section layout per official pattern
    const g = i => Q[i] && Q[i].g;
    [[0, 3, 'p1'], [4, 7, 'p2'], [8, 10, 'p3'], [11, 15, 'p4'], [16, 19, 'p5']].forEach(([a, b, p]) => { for (let i = a; i <= b; i++) if (g(i) !== p) errors.push(`${tag} Q${i + 1}: भाग ${p} होना चाहिए`); });
    const evsPass = (Q || []).slice(20, 40).filter(q => q.p).length;
    if (evsPass !== 5) errors.push(`${tag}: EVS में 15 MCQ + 1 गद्यांश (5 प्रश्न) चाहिए, गद्यांश-प्रश्न ${evsPass}`);
    const lanP = Object.entries(passUse).filter(([k]) => (Q || []).slice(60).some(q => q.p === k));
    if (lanP.length !== 4 || lanP.some(([, c]) => c !== 5)) errors.push(`${tag}: भाषा में 4 गद्यांश × 5 प्रश्न चाहिए`);
    if (diff.E !== 24 || diff.M !== 40 || diff.D !== 16) warnings.push(`${tag}: कठिनाई ${diff.E}/${diff.M}/${diff.D} (लक्ष्य 24/40/16)`);
    if (Object.values(dist).some(v => v < 12 || v > 28)) warnings.push(`${tag}: सही उत्तर असंतुलित A${dist.A} B${dist.B} C${dist.C} D${dist.D}`);
    console.log(`${tag}: ${Q.length} प्रश्न · कठिनाई ${diff.E}/${diff.M}/${diff.D} · उत्तर A${dist.A} B${dist.B} C${dist.C} D${dist.D}`);
  }
  // duplicates across all sets (exact question+options, or same text-only stem)
  (S.questions || []).forEach((q, i) => {
    const raw = s => String(s).replace(/\s+/g, ' ').trim();
    const full = norm(q.q) + '|' + raw(q.fig || '') + '|' + q.o.map(raw).join('|');
    const where = `${m.id} Q${i + 1}`;
    if (seen.has(full)) errors.push(`दोहराव: ${where} = ${seen.get(full)}`); else seen.set(full, where);
    if (!q.fig && !q.p) {
      const st = norm(q.q);
      if (seenStem.has(st)) (check ? errors : warnings).push(`समान प्रश्न-पाठ: ${where} = ${seenStem.get(st)}`); else seenStem.set(st, where);
    }
  });
  if (S.passages) Object.entries(S.passages).forEach(([k, p]) => {
    const st = norm(p.x).slice(0, 120), where = `${m.id} गद्यांश ${k}`;
    if (seenStem.has('P:' + st)) errors.push(`दोहराया गद्यांश: ${where} = ${seenStem.get('P:' + st)}`); else seenStem.set('P:' + st, where);
  });
}
warnings.forEach(w => console.log('चेतावनी: ' + w));
if (errors.length) { errors.forEach(e => console.log('त्रुटि: ' + e)); console.log(`\n${errors.length} त्रुटि। सुधारें, फिर दोबारा चलाएँ।`); process.exit(1); }
console.log('\nसब ठीक: कोई त्रुटि नहीं।');
