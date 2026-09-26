/* 09c · Where the stories travel (v4) — the communication plan.
   Stop 0: a cadence map. The cadence line runs across the frame in four stretches,
   ALWAYS · MONTHLY · QUARTERLY · ANNUAL, and its marks thin out as the rhythm slows
   (one continuous light, twelve, four, one). The columns light left to right like a
   timeline and five glass channel cards unfold beneath, each carrying its channel as a
   small device drawn in perspective (one tilted plane each): a laptop on the intranet
   story wall, a phone with the monthly story email (the hero, live glass, with the chip
   "preferred by 123 of 158", where the spark lands), a team meeting around a story, a
   spotlight video over a town-hall audience, and the year's collection as a book.
   A support strip across the foot: every story in Arabic and English, approved by
   the colleague before it is shared.
   Ambient (stop 0): two story lights, half a lap apart, travel the cadence line (each mark
   flares and each card's top edge catches the light as it passes), a light keeps running
   the ALWAYS stretch, the phone floats, the spotlight video plays, the email card's edge
   light turns, and a glow breathes behind it.
   Stop 1: "Designed with what colleagues asked for." The map steps away; four rows
   read as sentences — each exact number carries its own small chart (123 of 158 as a
   waffle of 158 colleagues; 47%, 32% and 49% as rings), the finding follows in quiet
   type, and a leader line carries each one across to the design decision it produced.
   Ambient: a light runs each leader line in turn and a glow breathes behind each number
   (the numbers never change while parked).
   GPU: every container is sized to what it holds; glows are drawn small and scaled up;
   each mark and card edge flares for both story lights from one animation; each stop's
   content turns visibility:hidden once it has faded, so its layers go away.
   All state keys off .st-n / data-step, so back navigation lands on the same frame. */
(function () {
  /* ── stop 0 · the cadence map ── */
  const CW = 306, GAP = 25, X0 = 144;              // five cards across 144 → 1774
  const cx = (k) => X0 + k * (CW + GAP);
  const RAIL = 374, CARD_Y = 410, CARD_H = 334;
  const CHIP_Y = CARD_Y + CARD_H + 24;
  const MX = 144, MY = 300;                        // the map's own box (x 144–1776, y 300–940): its children are placed in it
  const COLS = [
    { k: 'Always', a: 0, b: 0, marks: 0 },
    { k: 'Monthly', a: 1, b: 2, marks: 12 },
    { k: 'Quarterly', a: 3, b: 3, marks: 4 },
    { k: 'Annual', a: 4, b: 4, marks: 1 },
  ];
  const CARDS = [
    { t: 'Intranet<br>story wall', l: 'Every story, plus the nomination form.', dev: 'laptop' },
    { t: 'Story email', l: 'One story, one takeaway.', dev: 'phone', hero: true },
    { t: 'Team story<br>moment', l: 'Five minutes in the monthly team meeting.', dev: 'meet' },
    { t: 'Spotlight', l: 'A 60-second video and a town-hall story.', dev: 'video' },
    { t: 'Story<br>collection', l: 'The year’s featured stories at a company event.', dev: 'book' },
  ];
  // build: the columns light left to right (s after the build starts)
  const COL_D = [.3, .44, .62, .76];
  // the story lights: each crosses the line (x 144 → 1774) in RUN s, then rests; one lap is LAP s,
  // and a second light runs half a lap behind. Each mark and each card edge flares on the same
  // clock as the lights, so they stay in step.
  const LAP = 9, RUN = 7, XA = 144, XB = 1774;
  const passAt = (x) => (x - XA) / (XB - XA) * RUN;
  // each flare starts at its first pass after the story light has arrived (GATE s: the runner's
  // fade-in plus the push entrance), LEAD s early so it has eased up as the light arrives;
  // after that it keeps the lap's clock. Nothing is mid-flare when the flares turn visible.
  // One animation serves both lights (it flares at 0% and 50% of the lap), so it starts at
  // whichever of the two passes comes first.
  const GATE = 1.85;
  const dl1 = (t, lead) => { let d = (((t - lead) % LAP) + LAP) % LAP; while (d < GATE) d += LAP; return d; };
  const dl = (t, lead = 0) => Math.min(dl1(t, lead), dl1(t + LAP / 2, lead)).toFixed(2) + 's';
  const r1 = (v) => Math.round(v * 10) / 10;

  const segs = COLS.map((c, j) => {
    const x0 = cx(c.a), x1 = cx(c.b) + CW, w = x1 - x0;
    let marks = '';
    for (let i = 0; i < c.marks; i++) {
      const mx = x0 + (i + .5) * w / c.marks;
      marks += `<i class="cm-mk m${c.marks}" style="left:${r1(mx - x0)}px;--dl:${dl(passAt(mx), .12)};--md:${(COL_D[j] + .25 + i / Math.max(1, c.marks) * .35).toFixed(2)}s"></i>`;
    }
    return `
      <div class="cm-col c${j}" style="left:${x0 - MX}px;width:${w}px;--d:${COL_D[j]}s">
        <div class="cm-lab a-wipe" data-in="0" style="--d:${COL_D[j]}s;--dur:.7s">${c.k}</div>
        <div class="cm-seg${c.marks ? '' : ' always'}">${c.marks ? '' : '<b class="cm-run"></b>'}${marks}</div>
      </div>`;
  }).join('');

  /* ── the channels as devices: flat line drawings (250×150), each tilted as one plane ── */
  const bust = (x, y, r, cls) => `<circle class="${cls}" cx="${x}" cy="${r1(y - r * 1.25)}" r="${r}"/><path class="${cls}" d="M${r1(x - r * 2)} ${r1(y + r * 1.25)}c${r1(r * .22)}-${r1(r * 1.45)} ${r1(r * .95)}-${r1(r * 2.1)} ${r1(r * 2)}-${r1(r * 2.1)}s${r1(r * 1.78)} ${r1(r * .65)} ${r1(r * 2)} ${r1(r * 2.1)}z"/>`;
  const line = (x, y, w, cls = 't2', h = 2.6) => `<rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}"/>`;
  const tile = (x, y, on) => `<rect class="tile${on ? ' on' : ''}" x="${x}" y="${y}" width="44" height="33" rx="3"/><rect class="img" x="${x + 3}" y="${y + 3}" width="38" height="16" rx="2"/>${bust(x + 22, y + 12, 3, 'p')}${line(x + 3, y + 22.5, 30, on ? 't' : 't2', 2.4)}${line(x + 3, y + 27.5, 21, 't2', 2.4)}`;
  const ART = {
    // the intranet story wall, open on a laptop (with the nomination button in its bar)
    laptop: `<path class="b" d="M24 123h202l-14-9H38z"/><rect class="b" x="18" y="123" width="214" height="5.5" rx="2.75"/>
      <rect class="b" x="40" y="5" width="170" height="109" rx="9"/><rect class="s" x="48" y="13" width="154" height="93" rx="3"/>
      <rect class="bar" x="48" y="13" width="154" height="11" rx="3"/><circle class="a" cx="56" cy="18.5" r="2.4"/>${line(62, 17.2, 26, 't', 2.6)}<rect class="a" x="177" y="15.5" width="20" height="6" rx="3"/>
      ${tile(54, 30, false)}${tile(103, 30, true)}${tile(152, 30, false)}${tile(54, 69, false)}${tile(103, 69, false)}${tile(152, 69, false)}`,
    // the monthly story email, on a phone; a new-mail bubble beside it
    phone: `<rect class="b" x="84" y="3" width="80" height="144" rx="13"/><rect class="s" x="90" y="11" width="68" height="128" rx="7"/>${line(114, 6.2, 20, 't2', 3)}
      <rect class="a" x="95" y="17" width="12" height="9" rx="1.6"/><path class="env" d="M95.9 18.2l5.1 3.9 5.1-3.9"/>${line(111, 17.6, 40, 't', 3)}${line(111, 23, 28)}
      <rect class="img hot" x="95" y="31" width="58" height="40" rx="4"/>${bust(124, 56, 7, 'ink')}
      ${line(95, 77, 52, 't', 4)}${line(95, 84.5, 40, 't', 4)}${line(95, 94, 58)}${line(95, 99.5, 54)}${line(95, 105, 46)}
      <rect class="a" x="95" y="114" width="38" height="11" rx="5.5"/>${line(112, 141.5, 24, 't2', 2)}
      <circle class="a glow" cx="182" cy="26" r="13"/><rect class="ink" x="175" y="21.2" width="14" height="10" rx="1.6"/><path class="env2" d="M175.9 22.4l6.1 4.5 6.1-4.5"/>`,
    // five minutes in the monthly team meeting: a story on the wall, a table, the team
    meet: `<rect class="b" x="66" y="5" width="118" height="66" rx="6"/><rect class="s" x="72" y="11" width="106" height="54" rx="3"/>
      <circle class="img" cx="96" cy="38" r="15"/>${bust(96, 40, 4.6, 'p')}${line(118, 26, 48, 't', 3.4)}${line(118, 34, 44)}${line(118, 40, 48)}${line(118, 46, 34)}
      <circle class="tmr" cx="171" cy="17" r="8"/><path class="a" d="M171 17V9.6a7.4 7.4 0 0 1 3.7 1z"/>
      ${[52, 88, 125, 162, 198].map((x) => bust(x, 94, 6.2, 'p')).join('')}
      <ellipse class="b" cx="125" cy="116" rx="97" ry="19"/><ellipse class="rim" cx="125" cy="113" rx="84" ry="12"/>
      ${bust(84, 142, 8, 'back')}${bust(166, 142, 8, 'back')}`,
    // the quarterly spotlight: a 60-second video, and the town hall watching it
    video: `<rect class="b" x="36" y="4" width="178" height="102" rx="8"/><rect class="vid" x="43" y="11" width="164" height="80" rx="4"/>
      <path class="cone" d="M116 11h18l27 80H89z"/>${bust(125, 72, 9.5, 'lit')}
      <path class="a" d="M47.5 95.5v6.4l5.4-3.2z"/>${line(58, 97.5, 146, 't2', 2.4)}
      <path class="stage" d="M16 115h218"/>${[40, 73, 107, 143, 177, 210].map((x) => bust(x, 141, 6.4, 'back')).join('')}`,
    // the year's featured stories, collected in a book
    book: `<path class="cv" d="M125 25C100 16 62 16 30 23v100c32-6 70-6 95 4 25-10 63-10 95-4V23c-32-7-70-7-95 2z"/>
      <path class="pg" d="M125 31C102 22 68 22 38 28v88c30-5 64-5 87 5 23-10 57-10 87-5V28c-30-6-64-6-87 3z"/><path class="spine" d="M125 31v90"/>
      <rect class="img" x="50" y="38" width="60" height="38" rx="3"/>${bust(80, 62, 6, 'p')}${line(50, 83, 60)}${line(50, 89.5, 54)}${line(50, 96, 58)}${line(50, 102.5, 40)}
      <path class="a" d="M160 40l2.2 4.5 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7z"/>${line(140, 62, 60, 't', 3)}${line(140, 70, 54)}${line(140, 76.5, 58)}${line(140, 83, 50)}${line(140, 89.5, 56)}${line(140, 96, 38)}
      <path class="a rib" d="M191 24v29l5-4.4 5 4.4V23.6"/>`,
  };

  const cards = CARDS.map((c, k) => {
    const x = cx(k), j = k === 0 ? 0 : k <= 2 ? 1 : k - 1;
    const d = (COL_D[j] + .1 + (k === 2 ? .12 : 0)).toFixed(2);
    return `
      <div class="cm-card glass${c.hero ? ' live hero' : ''}" data-in="0" style="left:${x - MX}px;top:${CARD_Y - MY}px;width:${CW}px;height:${CARD_H}px;--d:${d}s;--dur:1s">
        <i class="cm-catch" style="--dl:${dl(passAt(x + CW / 2), .05)}"></i>
        <div class="cm-dev ${c.dev}"><svg class="cm-art" viewBox="0 0 250 150" aria-hidden="true">${ART[c.dev]}</svg>${c.dev === 'video' ? '<i class="cm-prog"></i>' : ''}</div>
        <h3 class="cm-t">${c.t}</h3>
        <p class="cm-l">${c.l}</p>
      </div>`;
  }).join('');

  /* ── stop 1 · finding → decision, each number with its own chart ── */
  // 123 of 158: a waffle of 158 colleagues (16 across, ten rows; the first 123 filled)
  const waffle = (() => {
    let on = '', off = '';
    for (let i = 0; i < 158; i++) {
      const r = `<rect x="${(i % 16) * 8}" y="${Math.floor(i / 16) * 8}" width="6" height="6" rx="1.4"/>`;
      if (i < 123) on += r; else off += r;
    }
    return `<svg class="cm-waf" viewBox="0 0 126 78" aria-hidden="true"><g class="off">${off}</g><g class="on">${on}</g></svg>`;
  })();
  // a share as a ring (pathLength 100, so the arc is exactly the figure)
  const ring = (v) => `<svg class="cm-ring" viewBox="0 0 88 88" style="--v:${v}" aria-hidden="true"><circle class="tr" cx="44" cy="44" r="38"/><circle class="arc" cx="44" cy="44" r="38" pathLength="100" transform="rotate(-90 44 44)"/></svg>`;
  const PAIRS = [
    { n: '123', s: '<span class="cm-of">/ 158</span>', c: waffle, f: 'prefer email', d: 'The monthly story email leads.' },
    { n: '47', s: '<span class="cm-pc">%</span>', c: ring(47), f: 'want a monthly rhythm', d: 'One story a month.' },
    { n: '32', s: '<span class="cm-pc">%</span>', c: ring(32), f: 'want to nominate anonymously', d: 'An anonymous option on the form.' },
    { n: '49', s: '<span class="cm-pc">%</span>', c: ring(49), f: 'want to approve their story', d: 'Nothing is shared without the colleague’s approval.' },
  ];
  const ROW0 = 408, PITCH = 128, NUM_R = 560;       // row centres; the numbers' right edge
  const rows = PAIRS.map((p, i) => {
    const d = .38 + i * .14;
    return `
      <div class="cm-row r${i}" style="top:${ROW0 + i * PITCH}px;--k:${i}">
        <i class="cm-nglow" style="left:${NUM_R - 272}px"><b></b></i>
        <div class="cm-num a-pop" data-in="1" style="right:${-NUM_R}px;--d:${d.toFixed(2)}s"${i === 0 ? ' data-spark="1" data-spark-at="t" data-spark-delay=".5"' : ''}><span class="cm-ch">${p.c}</span><span class="num">${p.n}</span>${p.s}</div>
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
      <i class="cm-wash w1"><b></b></i><i class="cm-wash w2"><b></b></i>

      <div class="pad cm-head">
        <div class="kicker a-wipe" data-in="0" style="--d:.05s">Communication plan</div>
        <div class="cm-hbox">
          <h2 class="h2 cm-h cm-h0" data-in="0" data-out="1" data-split style="--d:.12s">Where the stories travel.</h2>
          <h2 class="h2 cm-h cm-h1" data-in="1" data-split style="--d:.14s;--wstep:.045s">Designed with what <em class="hl">colleagues</em> <em class="hl">asked</em> <em class="hl">for.</em></h2>
        </div>
      </div>

      <!-- stop 0 · the cadence map (its own box: x 144–1776, y 300–940) -->
      <div class="cm-map" data-out="1">
        <div class="cm-rail" style="top:${RAIL - MY}px">
          ${segs}
          <div class="cm-runner">${[0, 1].map((k) => `<i class="cm-story" style="--dl:${-k * LAP / 2}s"><b class="cm-sin"><i class="cm-pool"></i><i class="cm-trail"></i><b class="light"></b></b></i>`).join('')}</div>
        </div>
        <i class="cm-eglow" style="left:${cx(1) + CW / 2 + 60 - MX}px;top:${CARD_Y + CARD_H + 40 - MY}px"><b></b><b class="g2"></b></i>
        ${cards}
        <div class="cm-chip a-pop" data-in="0" data-spark="0" data-spark-delay=".75" style="left:${cx(1) - MX}px;top:${CHIP_Y - MY}px;--d:1.02s">
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
        <div class="cm-panel glass a-fade" data-in="1" style="--d:.26s;--dur:1s"></div>
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
      // the chip's ring has ended (at opacity 0) by then; dropping the class releases its layer
      if (el.classList.contains('cm-live')) ctx.after(3600, () => el.classList.remove('cm-live'));
    },
  });
})();
