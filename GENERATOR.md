# नया मॉक सेट बनाने की विधि (रोज़ एक नया सेट)

This file is the standing instruction for creating each new JNVST mock test set.
It is followed by the scheduled task and by anyone adding a set by hand.
Write all student-facing content in clear, age-appropriate **Hindi** (Class 5 level).

## 1. Decide whether a new set is due

1. Read `sets/manifest.js`. Let `last` be the final entry.
2. Today's date in India (IST, UTC+05:30): `TZ=Asia/Kolkata date +%F`.
3. A new set is due every day. If `today <= last.live` (today's set already exists), it is **not** due. Stop without any commit.
4. Otherwise create the next set: `SET NN` (two digits, +1 from `last`), file `sets/set-NN.js`, `live` = today.

## 2. Official pattern (JNVST 2027 prospectus; this wins over anything else)

80 MCQ · 100 marks · 2 hours · 1.25 marks each · no negative marking · exactly one correct option of four.

| Q | Section | `s` | `g` | Content |
|---|---|---|---|---|
| 1–4 | मानसिक योग्यता भाग I | mat | p1 | पैटर्न पूर्ति (अक्षर व संख्या पैटर्न सहित) |
| 5–8 | भाग II | mat | p2 | आकृति श्रृंखला पूर्ति |
| 9–11 | भाग III | mat | p3 | ज्यामितीय आकृति पूर्ति (त्रिभुज, वर्ग, वृत्त) |
| 12–16 | भाग IV | mat | p4 | दर्पण एवं जल प्रतिबिंब |
| 17–20 | भाग V | mat | p5 | छिपी हुई (अंतर्निहित) आकृति |
| 21–35 | EVS | evs | evs | 15 MCQ |
| 36–40 | EVS | evs | evs | 1 गद्यांश + 5 प्रश्न (`p:'evs'`) |
| 41–60 | अंकगणित | ari | ari | 20 MCQ |
| 61–80 | भाषा (हिंदी) | lan | lan | 4 गद्यांश × 5 प्रश्न (`p:'l1'`…`'l4'`) |

Removed topics, never use: ऑड वन आउट, समान आकृति (mental ability); लाभ-हानि, दशमलव (arithmetic).

## 3. Syllabus to cover (rotate topics across sets)

- **EVS** (prospectus + Tiku's "नया सिलेबस" list):
  - प्राकृतिक जगत: पर्यावरण (जल, थल, वायु), नदियाँ, पर्वत, पौधे, जानवर, जल चक्र, मिट्टी, पृथ्वी, प्राकृतिक आपदाएँ, घर/आवास।
  - मानव शरीर: अंग, इंद्रियाँ, भोजन-पोषण, स्वास्थ्य-स्वच्छता, रोग-सुरक्षा, पाचन/परिसंचरण/श्वसन तंत्र।
  - दैनिक जीवन में विज्ञान: पदार्थ, ऊर्जा, ध्वनि, प्रकाश, सरल मशीनें, खाद्य संरक्षण, जल-वायु प्रदूषण, जल व मृदा संरक्षण।
  - सामाजिक परिवेश: भारत की उपलब्धियाँ/सर्वोच्च, खेल, त्योहार, यातायात, फसलें, देशभक्ति व राष्ट्रीय प्रतीक, राज्य-राजधानियाँ, मुद्रा, मौसम-ऋतुएँ, व्यवसाय, डाकघर-बैंक, बाज़ार, संचार, प्राकृतिक संसाधन, जल स्रोत, वन्य जीवन, मानचित्र-दिशाएँ, नागरिकता-संविधान, अच्छे नागरिक के गुण, वस्त्र व रेशे।
- **अंकगणित** (9 chapters): संख्या पद्धति; पूर्ण संख्याओं पर संक्रियाएँ; गुणनखंड-गुणज (HCF/LCM); भिन्न (सजातीय जोड़-घटाव, गुणा; असजातीय जोड़ और भिन्न से भाग नहीं); मापन (लंबाई, द्रव्यमान, धारिता, समय, मुद्रा); सरलीकरण; परिमाप-क्षेत्रफल (वर्ग, आयत, आयत के भाग के रूप में त्रिभुज); ज्यामिति (कोण, रेखा/किरण, आकृतियों के प्रकार, दिशाएँ); आँकड़ा प्रबंधन (चित्रलेख, दंड आलेख, तालिका)। Include at least 2 ज्यामिति and 1 data question.
- **भाषा**: four original passages, one each of कहानी, सूचना-आधारित, वर्णनात्मक, विचारात्मक. Questions mix fact recall, inference, title/central idea, पर्यायवाची, विलोम, word meaning. Answers must be findable in the passage.

## 4. Quality rules

1. Every question original. Never copy a JNVST previous-year question; never re-use a question from any earlier set, even with changed numbers, names or option order. The same concept in a genuinely new form is fine.
2. Difficulty exactly **24 E / 40 M / 16 D** (`d:'E'|'M'|'D'`).
3. Correct answers balanced across A/B/C/D (roughly 17–23 each).
4. Verify every arithmetic answer by computing it (run a quick `node -e` check). Verify every fact; if unsure of a fact, choose a different question.
5. Distractors plausible but unambiguously wrong. No "all of the above".
6. Every question has a short Hindi explanation `e` and a topic tag `t`.
7. Mental-ability questions must be figure-based or letter/number patterns, drawn with the helpers in `figs.js` (`svg, one, seq, arr, dots, poly, q7, solid, piece, rect, SQ, tri3, clock, W, MV, MH, F`). Check each figure question by reasoning about the exact coordinates: the correct option must be the only one that fits, at the same size and orientation. Set `fo:1` when options are figures/words to be shown in a grid. Prefer new figure ideas over re-drawing SET 01's.

## 5. File format (`sets/set-NN.js`)

Copy the structure of `sets/set-01.js` exactly:

```js
/* JNVST मॉक टेस्ट · SET NN · लाइव: YYYY-MM-DD */
window.JNVST_SET=(function(){
const PASS={ evs:{t:'गद्यांश: …',x:`…`}, l1:{t:'गद्यांश 1',x:`…`}, l2:{…}, l3:{…}, l4:{…} };
const Q=[
  {s:'mat',g:'p1',d:'M',t:'संख्या पैटर्न',q:`…`,fig:`…`,o:['…','…','…','…'],e:'…'},
  …80 items, NO answer field…
];
return {id:'SET NN',live:'YYYY-MM-DD',passages:PASS,questions:Q,key:'<base64>',
  report:{prevSets:'SET 01–SET MM से मिलान: 0 दोहराव',pyq:'0 (उपलब्ध नहीं)'}};
})();
```

- The answer key is **not** stored in the questions. `key` = base64 of the 80-letter answer string **reversed**: `Buffer.from(answers.split('').reverse().join('')).toString('base64')`.
- Build the file with a small script that holds answers alongside questions while drafting, then strips them and writes the key, so answers and questions can never drift apart.
- Use backtick strings for Hindi text; never use a backtick inside content.

## 6. Publish

1. Append to `sets/manifest.js`: `{id:'SET NN',file:'set-NN.js',live:'YYYY-MM-DD'}`.
2. Run `node tools/validate.js`. It must print `सब ठीक` and exit 0. Fix every error; review warnings.
3. Commit only `sets/set-NN.js` and `sets/manifest.js` with message `SET NN जोड़ा (लाइव YYYY-MM-DD)`, then push to `main`. GitHub Pages publishes it in 1–3 minutes; the site automatically opens the newest live set.
4. Do not change `index.html`, `figs.js`, `apps-script.gs` or the Google Sheet URL in a scheduled run.
5. If validation cannot be made to pass, do not push; report what failed.
