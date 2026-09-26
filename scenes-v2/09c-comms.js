/* 09c · Where the stories travel (v3) — the communication plan.
   Stop 0: a cadence map. The cadence line runs across the frame in four stretches,
   ALWAYS · MONTHLY · QUARTERLY · ANNUAL, and its marks thin out as the rhythm slows
   (one continuous light, twelve, four, one). The columns light left to right like a
   timeline and five glass channel cards unfold beneath; the story email is the hero
   (live glass) and carries the chip "preferred by 123 of 158", where the spark lands.
   A support strip across the foot: every story in Arabic and English, approved by
   the colleague before it is shared.
   Ambient (stop 0): two story lights, half a lap apart, travel the cadence line (each mark flares and each
   card's top edge catches the light as it passes), a light keeps running the ALWAYS
   stretch, the email card's edge light turns, and a glow breathes behind it.
   Stop 1: "Designed with what colleagues asked for." The map steps away; four rows
   read as sentences — the exact numbers are the heroes (123 / 158 · 47% · 32% · 49%),
   the finding follows in quiet type, and a leader line carries each one across to the
   design decision it produced. Ambient: a light runs each leader line in turn and a
   glow breathes behind each number (the numbers never change while parked).
   All state keys off .st-n / data-step, so back navigation lands on the same frame. */
(function () {
  /* ── stop 0 · the cadence map ── */
  const CW = 306, GAP = 25, X0 = 144;              // five cards across 144 → 1774
  const cx = (k) => X0 + k * (CW + GAP);
  const RAIL = 374, CARD_Y = 416, CARD_H = 282;
  const COLS = [
    { k: 'Always', a: 0, b: 0, marks: 0 },
    { k: 'Monthly', a: 1, b: 2, marks: 12 },
    { k: 'Quarterly', a: 3, b: 3, marks: 4 },
    { k: 'Annual', a: 4, b: 4, marks: 1 },
  ];
  const CARDS = [
    { t: 'Intranet<br>story wall', l: 'Every story, plus the nomination form.', i: 'content-layout' },
    { t: 'Story email', l: 'One story, one takeaway.', i: 'person-message', hero: true },
    { t: 'Team story<br>moment', l: 'Five minutes in the monthly team meeting.', i: 'team' },
    { t: 'Spotlight', l: 'A 60-second video and a town-hall story.', i: 'users-connected' },
    { t: 'Story<br>collection', l: 'The year’s featured stories at a company event.', i: 'document-certified' },
  ];
  // build: the columns light left to right (s after the build starts)
  const COL_D = [.3, .44, .62, .76];
  // the story lights: each crosses the line (x 144 → 1774) in RUN s, then rests; one lap is LAP s,
  // and a second light runs half a lap behind. Each mark and each card edge flares on the same
  // clock as the lights, so they stay in step.
  const LAP = 9, RUN = 7, XA = 144, XB = 1774;
  const passAt = (x) => (x - XA) / (XB - XA) * RUN;
  const dl = (t) => ((t % LAP) - LAP).toFixed(2) + 's';
  const r1 = (v) => Math.round(v * 10) / 10;

  const segs = COLS.map((c, j) => {
    const x0 = cx(c.a), x1 = cx(c.b) + CW, w = x1 - x0;
    let marks = '';
    for (let i = 0; i < c.marks; i++) {
      const mx = x0 + (i + .5) * w / c.marks;
      marks += `<i class="cm-mk m${c.marks}" style="left:${r1(mx - x0)}px;--dl:${dl(passAt(mx))};--dl2:${dl(passAt(mx) + LAP / 2)};--md:${(COL_D[j] + .25 + i / Math.max(1, c.marks) * .35).toFixed(2)}s"></i>`;
    }
    return `
      <div class="cm-col c${j}" style="left:${x0}px;width:${w}px;--d:${COL_D[j]}s">
        <div class="cm-lab a-wipe" data-in="0" style="--d:${COL_D[j]}s;--dur:.7s">${c.k}</div>
        <div class="cm-seg${c.marks ? '' : ' always'}">${c.marks ? '' : '<b class="cm-run"></b>'}${marks}</div>
      </div>`;
  }).join('');

  const cards = CARDS.map((c, k) => {
    const x = cx(k), j = k === 0 ? 0 : k <= 2 ? 1 : k - 1;
    const d = (COL_D[j] + .1 + (k === 2 ? .12 : 0)).toFixed(2);
    return `
      <div class="cm-card glass${c.hero ? ' live hero' : ''} a-unfold" data-in="0" style="left:${x}px;top:${CARD_Y}px;width:${CW}px;height:${CARD_H}px;--d:${d}s;--dur:1s">
        <i class="cm-catch" style="--dl:${dl(passAt(x + CW / 2))}"></i><i class="cm-catch" style="--dl:${dl(passAt(x + CW / 2) + LAP / 2)}"></i>
        <span class="cm-ic">${Deck.icon(c.i)}</span>
        <h3 class="cm-t">${c.t}</h3>
        <p class="cm-l">${c.l}</p>
      </div>`;
  }).join('');

  /* ── stop 1 · finding → decision ── */
  const PAIRS = [
    { n: '123', s: '<span class="cm-of">/ 158</span>', f: 'prefer email', d: 'The monthly story email leads.' },
    { n: '47', s: '<span class="cm-pc">%</span>', f: 'want a monthly rhythm', d: 'One story a month.' },
    { n: '32', s: '<span class="cm-pc">%</span>', f: 'want to nominate anonymously', d: 'An anonymous option on the form.' },
    { n: '49', s: '<span class="cm-pc">%</span>', f: 'want to approve their story', d: 'Nothing is shared without the colleague’s approval.' },
  ];
  const ROW0 = 408, PITCH = 128, NUM_R = 548;       // row centres; the numbers' right edge
  const rows = PAIRS.map((p, i) => {
    const d = .38 + i * .14;
    return `
      <div class="cm-row r${i}" style="top:${ROW0 + i * PITCH}px;--k:${i}">
        <i class="cm-nglow" style="right:${1920 - NUM_R - 90}px"></i>
        <div class="cm-num a-pop" data-in="1" style="right:${1920 - NUM_R}px;--d:${d.toFixed(2)}s"${i === 0 ? ' data-spark="1" data-spark-delay=".5"' : ''}><span class="num">${p.n}</span>${p.s}</div>
        <p class="cm-find a-fade" data-in="1" style="left:${NUM_R + 26}px;--d:${(d + .12).toFixed(2)}s">${p.f}</p>
        <i class="cm-lead" style="--d:${(d + .22).toFixed(2)}s"><b></b></i>
        <i class="cm-arrive"></i>
        <p class="cm-dec a-left" data-in="1" style="--d:${(d + .3).toFixed(2)}s">${p.d}</p>
      </div>`;
  }).join('');

  Deck.scene({
    id: 'comms',
    title: 'Where the stories travel',
    act: 3,
    bg: 'navy',
    transition: 'push',
    cues: ['Where the stories travel · cadence and channels', 'Designed with what colleagues asked for'],
    holds: [22, 16],
    notes: [
      'Where do the stories travel? On channels we already have. The intranet story wall is always open. A story email goes out every month, and email is what 123 of 158 colleagues prefer. Teams give stories five minutes a month. Each quarter brings a short video and a town-hall spotlight, and once a year a story collection. Every story is in Arabic and English. [Team: confirm channels.]',
      'We designed it with what colleagues told us. Email first. A monthly rhythm, which 47% asked for. An anonymous nomination option for the 32% who want one. And the 49% who want to approve their story get exactly that: nothing is shared without approval.',
    ],
    field: [
      { dim: .3, lit: .03, litFrom: null, travel: .35, warm: .05, offset: [-220, -40], links: .5, wave: .55, streaks: .12, sparkle: 1.2, drift: 1,
        calm: [[100, 120, 1300, 270, .8], [100, 300, 1800, 720, .82], [100, 720, 1800, 930, .85]] },
      { offset: [-120, 130], travel: .25, warm: .12,
        calm: [[100, 120, 1760, 270, .8], [100, 300, 1800, 920, .88]] },
    ],
    html: `
      <i class="cm-wash w1"></i><i class="cm-wash w2"></i>

      <div class="pad cm-head">
        <div class="kicker a-wipe" data-in="0" style="--d:.05s">Communication plan</div>
        <div class="cm-hbox">
          <h2 class="h2 cm-h cm-h0" data-in="0" data-out="1" data-split style="--d:.12s">Where the stories travel.</h2>
          <h2 class="h2 cm-h cm-h1" data-in="1" data-split style="--d:.14s;--wstep:.045s">Designed with what <em class="hl">colleagues</em> <em class="hl">asked</em> <em class="hl">for.</em></h2>
        </div>
      </div>

      <!-- stop 0 · the cadence map -->
      <div class="cm-map" data-out="1">
        <div class="cm-rail" style="top:${RAIL}px">
          ${segs}
          <div class="cm-runner a-fade" data-in="0" style="--d:1.5s"><i class="cm-story"><b class="light"></b></i><i class="cm-story s2"><b class="light"></b></i></div>
        </div>
        <i class="cm-eglow" style="left:${cx(1) + CW / 2 + 60}px;top:${CARD_Y + CARD_H + 60}px"></i>
        ${cards}
        <div class="cm-chip a-pop" data-in="0" data-spark="0" data-spark-delay=".75" style="left:${cx(1)}px;top:${CARD_Y + CARD_H + 26}px;--d:1.02s">
          <i class="cm-stem"></i>
          <span class="cm-chip-l">Preferred by</span><b class="cm-chip-n num">123 of 158</b>
        </div>
        <div class="cm-strip a-fade" data-in="0" style="--d:1.16s;--dur:.8s">
          <span class="cm-lang" aria-hidden="true"><b class="ar">ع</b><i></i><b>A</b></span>
          <p>Every story in Arabic and English <i class="cm-dot">·</i> approved by the colleague before it is shared.</p>
        </div>
      </div>

      <!-- stop 1 · designed with what colleagues asked for -->
      <div class="cm-pairs">
        <div class="cm-cap a-fade" data-in="1" style="--d:.3s"><span class="c1">Finding</span><span class="c2">Design decision</span></div>
        <div class="cm-panel glass live a-unfold" data-in="1" style="--d:.26s;--dur:1s"></div>
        ${rows}
        <p class="cm-src a-fade" data-in="1" style="--d:1.1s">Source: Tahakom internal survey, 158 responses.</p>
      </div>
    `,
    step(n, prev, ctx) {
      // leader lines: from the end of each finding to its decision
      ctx.$$('.cm-row').forEach((row) => {
        const f = row.querySelector('.cm-find'), ld = row.querySelector('.cm-lead');
        if (!f || !ld || !f.offsetWidth) return;
        const x0 = f.offsetLeft + f.offsetWidth + 26;
        ld.style.left = x0 + 'px';
        ld.style.width = Math.max(0, 1098 - x0) + 'px';
      });
      // one-shot lights (the line's leading light, the chip's flare) only on a live click
      const el = ctx.el;
      el.classList.remove('cm-live', 'cm-live1');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('cm-live');
      if (!ctx.instant && n === 1 && prev === 0) el.classList.add('cm-live1');
    },
  });
})();
