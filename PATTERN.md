# प्रश्न-पैटर्न गाइड (पिछले वर्षों के प्रश्नपत्रों के आधार पर)

Standing companion to `GENERATOR.md`. Read it fully before writing a set. It describes **how real JNVST questions look**, so every new set feels like the actual exam.

**Sources studied (12-10-2026):**
- **Official JNVST Class 6 papers:**
  - 2018 (180604);
  - 2019 (19ENGL-C);
  - 2021 (APST21);
  - 2023 (NJ623, Hindi and English);
  - J20 HIND/ENGL-R.
- **Coaching model papers:** "All Rounder BSS" SET-01/02/04/06/13 (Dec 2025). These follow the old pattern and are not official.
- **Official rules:** NVS JNVST-2027 prospectus, including its sample questions.
- **Files rejected:** two uploaded files were Class 9 papers, and they were left out.

**Authority order:** the 2027 prospectus wins over everything. The old papers had 40 mental-ability questions in 10 parts and no EVS. Use them only for the style of the five parts that remain, and for the arithmetic and language sections. Never copy, translate, or lightly edit a question from these papers. Only the *kind* of question may be reused, never its figure, numbers or wording. The real papers sometimes repeat old questions; we never do.

## मानसिक योग्यता (Q1–20) — all figure-based

All figures are drawn with `figs.js` helpers in a 100×100 box. Every figure question needs the same three checks:
- the correct option is the only one that fits;
- each distractor differs from it in one clear way;
- the explanation names that difference.

### भाग I · पैटर्न पूर्ति (Q1–4)

**What the exam asks.** A problem figure, usually a square with a 2×2 grid or with diagonals, has one part missing. The answer is the piece that fits the missing part "बिना दिशा बदले".
- The missing part is usually one quadrant; the bottom-right is the most common.
- Draw it as an empty or "?" quadrant.

**Mix per set:**
- **at least 3 of the 4** must be this figure type;
- **at most 1** may be a letter/number pattern, drawn as a grid figure with one cell missing (`ngrid` table or SVG). It is never a plain text series.

**Design ideas** (use a new one each set):
1. Each quadrant has a diagonal line plus small marks (dots, ×, +) on one side. The marks rotate 90° from quadrant to quadrant.
2. Quarter-arcs or semicircles cross the quadrant borders, so the missing piece must carry the correct arc stubs.
3. Black/white triangles form a pinwheel or bow-tie; the missing quadrant must keep the shading order.
4. Arrows in all four quadrants point toward, or away from, the centre.
5. A circle or diamond through the centre spills into every quadrant.
6. Corner decorations (small squares, dot rows, scallops) repeat in all four corners.
7. Lines cross the whole square; the missing piece must continue them at the right edge points.

**How to draw it:**
- Write the whole pattern as one SVG.
- Cover the missing quadrant with a white `<rect>` and a "?" (e.g. `x=50 y=50 w=47 h=47`).
- Draw each option by zooming into that quadrant: `svg(100,100,'<g transform="translate(-100 -100) scale(2)">'+FULL+'</g>')` for the bottom-right quadrant. This keeps the correct option exactly consistent with the figure.

**Distractors:**
- the correct piece rotated 90° or 180°;
- the correct piece mirrored;
- one mark too many or too few;
- a line meeting the edge at the wrong point.

**Hard version:** rotational symmetry (rather than mirror symmetry) plus two kinds of marks.

### भाग II · आकृति श्रृंखला पूर्ति (Q5–8)

**What the exam asks.** Three figures and a "?"; the answer completes the series.

**Rules seen in real papers:**
1. Something is added each step: a dot, petal, arrow or cross-line. The direction of the added arrows alternates (← → ←).
2. A line, arm or arrow rotates 45° or 90° each step, while the marks at its ends alternate.
3. A small symbol moves corner to corner clockwise. Symbols around a figure (+ − × ÷) shift one place each step.
4. A square loses one side per step, or a frame shrinks while inner dots increase.
5. The number of polygon sides grows. Shading alternates.
6. The figure flips 180° each step while a count inside grows.

**Difficulty:**
- **E** questions use one rule.
- **M** and **D** questions use **two rules at once** (count + rotation, position + shading).
- Distractors keep one rule right and break the other.

### भाग III · ज्यामितीय आकृति पूर्ति (Q9–11)

**What the exam asks.** A square, triangle or circle has an **irregular bite** missing. Examples:
- a zigzag;
- a step or L-notch;
- a V-notch;
- a keyhole (circle plus trapezoid);
- a wavy or S-shaped edge;
- a semicircular bump or dent.

**Orientation:** the correct piece is shown in the orientation in which it fits, so no rotation is needed. Mirrored or rotated versions are used only as distractors.

**Distractors:**
- one zigzag tooth too many or too few;
- a bump instead of a dent;
- the edge mirrored;
- a notch that is too deep or too wide;
- a straight edge where a curve should be.

**How to draw it:**
- Draw the problem shape and the pieces at the **same absolute coordinates** in the 100 box.
- Avoid simple rectangles or plain triangles as the missing piece; they are too easy.

**Mix per set:** at least one square, and one triangle or circle.

### भाग IV · दर्पण एवं जल प्रतिबिंब (Q12–16)

**What the exam asks.** In the real papers the mirror XY is usually on the **right**, and most items are **figures**, not words.

**Mix per set (5 questions):**
- **at least 2 figure mirrors** (vertical mirror);
- **1–2 capital-letter words or number strings** with asymmetric letters (B, E, K, P, S, N, D, R, J, Z);
- **at most 1 water image** (mirror below). The prospectus heading names water images.
- **Clock mirror: at most 1 per set, and optional.** No real paper had one.

**What to put in a figure mirror:** dots or small circles at corners, crossed arrows with **four different heads** (filled dot, open dot, triangle, arrowhead), hatching, or a hook/swastika-like figure.

**How to draw a figure mirror:**
- Question: the figure in `svg` with the XY line on the right, as with `MV`.
- Options: the same `FIG` with a transform applied:

  | Option | Transform |
  |---|---|
  | Mirror image (correct for a vertical mirror) | `'<g transform="translate(100 0) scale(-1 1)">'+FIG+'</g>'` |
  | Water image | `translate(0 100) scale(1 -1)` |
  | 180° rotation | `rotate(180 50 50)` |
  | Original unchanged | `FIG` |

  A "one inner mark not mirrored" variant is also a good distractor.
- The figure must have **no** left–right symmetry; otherwise two options look the same.

### भाग V · छिपी हुई आकृति (Q17–20)

**What the exam asks.**
- **Target:** a simple open line shape, such as L, Z/N, a step, a hook, T, F, a V-wedge, an arrow on a stem, or a lens.
- **Answer figures:** busier, such as a square with diagonals and a grid, a star polygon, a hexagon with chords, or a simple picture drawn in lines (umbrella, house, fish).
- **Size and orientation:** the target appears at **the same size and orientation**.

**Distractors:** contain the target rotated, mirrored, or with one segment too short or long.

**Hard version:**
- the target shares lines with its neighbours;
- several near-matches appear in a dense grid.

**Do not use** a full closed square or rectangle as the target more than once per set.

## EVS (Q21–40)

**Source:** no real paper has an EVS section yet, so follow the **prospectus sample questions**. Their style:
- short, clear stems linked to everyday life ("पुलिस किस जानवर का उपयोग उसकी सूँघने की शक्ति के कारण करती है?", "कच्चे आम को साल भर कैसे सुरक्षित रखते हैं?");
- one clearly correct option and three plausible ones.

**Mix (15 MCQ):**
- about 8 direct-knowledge questions (process names, national symbols, states and capitals, festivals, crops, fibres);
- about 7 application/"क्यों" questions (food preservation, water conservation, hygiene, disasters, senses, body systems).

**Passage:** like the prospectus sample (a story of a lake and step-wells), a 110–160 word factual or cultural story about nature, water, a place or a tradition. Its 5 questions:
- 1 word meaning taken from the passage;
- 2 facts (who/where/how many);
- 1 "क्या होता है जब…";
- 1 naming or inference question.

## अंकगणित (Q41–60)

Follow the 2027 syllabus in `GENERATOR.md`. Old papers also used percent, profit-loss, interest, decimals, trains and speed; **these are out of syllabus, so never use them.** A simple average (like the prospectus example "पहले चार विषम संख्याओं का औसत") is allowed.

**Question kinds seen in real papers that fit the syllabus:**
- the greatest/smallest number from given digits, and their difference;
- number names; place value; consecutive numbers;
- divisibility rules (8, 9, 11);
- prime factorisation;
- HCF of lengths; LCM of bells/lights;
- HCF × LCM = product of the two numbers;
- the largest number that divides with remainder r;
- "fraction of the remainder" chains, e.g. a quarter spent, then ₹500 of the rest, ₹1000 left;
- start or arrival time; a clock running fast or slow;
- unit conversion inside a word problem;
- tiles on a floor; equal perimeters (square vs rectangle);
- BODMAS, and "इनमें से कौन-सा ___ के बराबर **नहीं** है?";
- a bar graph or pictograph (keep at least 1 data question).

**Steps:** about 35% one-step, 45% two-step and 20% three-step. Move toward more multi-step questions as the difficulty table rises.

**Distractors:**
- the intermediate value (the answer before the last step);
- a place-value shift;
- added instead of subtracted;
- the other number of a pair;
- a unit slip;
- off-by-one.

## भाषा (Q61–80)

**Passages:** 4, of 90–170 words each, in the four genres named in `GENERATOR.md`. Real papers also used:
- biography (a great Indian);
- science/geography (volcano, autumn leaves);
- health (laughter, cycling);
- how-to-play;
- village market;
- moral story;
- history/trade.

Rotate these as the subject of the सूचना / वर्णनात्मक / विचारात्मक passages.

**Question mix per set (20)** — matches the real papers:
- 8–10 fact/detail questions, **at least half as sentence-completion stems**, e.g. "गद्यांश के अनुसार, भारत ___ का केंद्र था।" or "कौआ ___";
- 2–3 word meanings in context;
- 1–2 antonyms;
- 1–2 synonyms, including "इनमें से कौन-सा ___ का पर्यायवाची **नहीं** है?";
- 1–2 "कौन-सी बात सही **नहीं** है / किसका उल्लेख **नहीं** है";
- 1–2 reason (क्योंकि);
- 1–2 inference or character trait;
- at most 2 titles in the whole set.

**Distractors:** use words or facts that do occur in the passage but answer a different question, so careless reading is caught.
