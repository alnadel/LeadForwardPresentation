/* 06b · Three ways to close the gap (v3) — strategic options, then one recommendation.
   Stop 0: the kicker and the headline land while the act opens from the chapter
   card's centre line. The three option columns (glass) open from that same line
   (y 540) with a line of light at each edge, the criteria column opens with them,
   then the ratings pop in row by row, left to right. The spark settles above C.
   Stop 1: A and B dim and step back, C lifts and goes live (a light travels its
   edge, its badge lights), a light runs down C's column lighting each mark, and the
   recommendation replaces the headline as the hero; the support line lands under it.
   Audience first: the option titles and the recommendation are the heroes; the
   one-line descriptions, criteria labels and watch-outs are small and dim; the
   ratings are drawn shapes (full, half, empty), big enough to read at a glance.
   Ambient: stop 0, a reading band walks the five criteria rows (each row's marks
   glow as it passes), glow pools drift behind the columns and a sheen crosses the
   cards; stop 1, C's edge light, a reading band walks C's rows (each mark flares and
   ripples as it arrives), C's glow and the hero's glow breathe. Nothing moves inside text.
   All state keys off .st-n / .is-in; one-shot lights play only on a live click and
   rest invisible, so back navigation lands on the same frame. */
(function () {
  /* ── geometry (stage px) ── */
  const T = 322;                    // top of the table (stop 0; the table steps down DROP px at stop 1)
  const H = 558;                    // column height
  const DROP = 58;
  const LX = 144, LW = 250;         // the criteria column
  const X0 = 420, CW = 436, GAP = 24;
  const colX = (i) => X0 + i * (CW + GAP);   // 420 · 880 · 1340 (C ends at 1776)
  const ROW0 = 164, ROWH = 60;      // first rating row (column-relative) and row height
  const WO = ROW0 + 5 * ROWH;       // the watch-out row (column-relative)
  const SEAM = 540 - T;             // the chapter card's centre line, column-relative
  const WALK = 7.5;                 // s: one lap of the reading band over the five rows

  const OPTS = [
    { k: 'A', t: 'Awards', s: 'Employee of the month or year.', w: 'Rewards a few; popularity can decide.' },
    { k: 'B', t: 'A new platform', s: 'Buy a digital recognition tool.', w: 'Cost and adoption risk; points don’t teach.' },
    { k: 'C', t: 'A story campaign', s: 'Real stories on the channels we already have.', w: 'Needs curation time and leaders’ participation, <em>both built into the plan.</em>' },
  ];
  const CRIT = ['Reaches everyone', 'The learning travels', 'Fair and credible', 'Low cost', 'Fast to launch'];
  // 2 strong · 1 partial · 0 weak, per row: [A, B, C]
  const RATE = [
    [0, 1, 2],
    [0, 0, 2],
    [1, 1, 2],
    [1, 0, 2],
    [2, 0, 2],
  ];
  const COL_D = [.24, .34, .44];    // s: each column opens
  const MARK_AT = .9, ROW_STEP = .11, COL_STEP = .04;     // the ratings pop row by row, left to right
  const r2 = (v) => Math.round(v * 100) / 100;

  const mark = (v, cls, style) => `<span class="op-mk s${v} ${cls || ''}" ${style || ''}><i></i></span>`;

  const cols = OPTS.map((o, c) => {
    const rows = RATE.map((row, r) => `
          <div class="op-row" style="top:${ROW0 + r * ROWH}px;--r:${r}">
            ${mark(row[c], '', `data-in="0" style="--d:${r2(MARK_AT + r * ROW_STEP + c * COL_STEP)}s;--r:${r}"`)}
          </div>`).join('');
    return `
      <div class="op-col ${o.k.toLowerCase()}" style="left:${colX(c)}px;top:${T}px;width:${CW}px;height:${H}px;--d:${COL_D[c]}s">
        <div class="op-card glass" data-in="0">
          <div class="op-hd">
            <span class="op-bd">${o.k}</span>
            <h3 class="op-t">${o.t}</h3>
          </div>
          <p class="op-s">${o.s}</p>
          ${rows}
          <div class="op-row op-worow" style="top:${WO}px"><p class="op-w">${o.w}</p></div>
          ${c === 2 ? '<i class="op-cband"></i><i class="op-run"></i>' : ''}
        </div>
        <i class="op-edge t"></i><i class="op-edge b"></i>
      </div>`;
  }).join('');

  const crit = CRIT.map((t, r) => `<div class="op-cl" style="top:${ROW0 + r * ROWH}px">${t}</div>`).join('');
  const warn = '<svg viewBox="0 0 20 18" aria-hidden="true"><path d="M10 1.6 18.4 16.4H1.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 6.8v4.4M10 13.5v.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  Deck.scene({
    id: 'options',
    title: 'Three ways to close the gap',
    act: 2,
    bg: 'navy',
    transition: 'chapter',
    cues: ['Three options · five criteria', 'We recommend C · the story campaign'],
    holds: [16, 11],
    notes: [
      'We did not start from the answer. We weighed three ways to close the gap: awards, a new recognition platform, and a story campaign. Awards reward a few. A platform costs money and teaches little. Doing nothing keeps reach at 8%. [Team: confirm the assessment.]',
      'So we recommend the story campaign. It reaches everyone, the learning travels, it is fair by design, it costs little and it starts now, on the channels we already have. Awards and tools can plug into it later.',
    ],
    field: [
      { dim: .3, lit: .02, travel: .22, offset: [-110, 170], litFrom: null, warm: .12, links: .45, wave: .55, streaks: .1, sparkle: 1.1, drift: 1,
        calm: [[100, 120, 1560, 290, .75], [110, 300, 1810, 930, .85]] },
      { lit: .06, litFrom: [1565, 600], warm: 0, travel: .35, wave: .65, sparkle: 1.5,
        calm: [[100, 120, 1790, 330, .8], [110, 300, 1810, 930, .85]] },
    ],
    html: `
      <i class="op-pool ab"></i><i class="op-pool c"></i>

      <div class="op-head">
        <div class="kicker a-wipe" data-in="0" style="--d:.05s">Strategic options</div>
        <i class="op-hglow"></i>
        <h2 class="h2 op-h" data-in="0" data-out="1" data-split style="--d:.12s">We weighed three ways to close the gap.</h2>
        <h2 class="h2 op-h op-hero" data-in="1" data-split data-spark="1" data-spark-delay=".5" style="--d:.34s;--wstep:.045s">We recommend <em class="hl">C: a story campaign</em><br>on the channels we already have.</h2>
        <p class="op-sub a-fade" data-in="1" style="--d:.95s;--dur:.8s">Awards and tools can plug into it later.</p>
      </div>

      <!-- the table: it steps down at stop 1 to make room for the recommendation -->
      <div class="op-table" style="--seam:${SEAM}px;--rest:${H - SEAM}px;--drop:${DROP}px">
      <!-- the criteria: support, small and dim -->
      <div class="op-crit" data-in="0" style="left:${LX}px;top:${T}px;width:${LW}px;height:${H}px;--d:.2s">
        <div class="op-leg">
          <span>${mark(2, 'sm')}Strong</span>
          <span>${mark(1, 'sm')}Partial</span>
          <span>${mark(0, 'sm')}Weak</span>
        </div>
        ${crit}
        <div class="op-cl op-cwo" style="top:${WO}px"><span class="op-wi">${warn}</span>Watch-out</div>
      </div>

      ${cols}

      <!-- stop 0 ambient: a reading band walks the five rows -->
      <div class="op-band" style="left:${LX - 12}px;top:${T + ROW0}px;width:${1776 - LX + 24}px;height:${ROWH}px;--walk:${WALK}s"><i></i></div>

      </div>

      <i class="op-spk" data-spark="0" data-spark-xy="${colX(2) + CW / 2},${T - 36}" data-spark-delay=".62"></i>
    `,
    step(n, prev, ctx) {
      const el = ctx.el;
      // one-shot lights (the columns' opening edges, the ripples as marks land, the run down
      // C's column, the blooms) play only on a live click; their resting state is invisible
      el.classList.remove('op-live0', 'op-live1');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('op-live0');
      if (!ctx.instant && n === 1 && prev === 0) {
        el.classList.add('op-live1');
        ctx.after(420, () => window.Field && Field.burst(colX(2) + CW / 2, T + DROP + H / 2, { radius: 620, dur: 1.6 }));
      }
      // stop 1: C is the one card that goes live
      ctx.$('.op-col.c .op-card').classList.toggle('live', n >= 1);
    },
  });
})();
