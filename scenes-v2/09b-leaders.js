/* 09b · Leaders go first (v3) — leadership involvement, act IV opens.
   Stop 0 builds while the chapter card's line opens the frame: the headline, then
   the three roles as a cascade. Left: the role names are the heroes (Executive
   sponsor · Department leaders · Managers), their actions small and dim beneath.
   Right: the same tiers as a tree of light — one sponsor, their department
   leaders, the managers, and every team at the foot. The spark lands just after
   "Executive sponsor"; a level line carries its light to the tree's root and the
   links draw down, tier by tier, to the teams.
   Ambient (stop 0): stories keep flowing down the cascade (sponsor → a leader →
   a manager → a colleague; each node flares as a light arrives, each colleague
   lights), a light runs the sponsor's level line into the root, the root's halo
   breathes, and two washes drift.
   Stop 1: the headline swaps to "Leaders spotlight others, never themselves.";
   the role texts step out and two quiet lists (do / don't) take their place. The
   cascade stays behind, dimmed and set back to the right; the leaders go dark and
   two soft spotlights from the top of the tree sweep across the teams; soft teal and
   plum washes breathe behind the lists.
   All state keys off .st-n / data-step, so back navigation lands on the same frame;
   the one-shot lights of the build play only on a live click. */
(function () {
  const TX = 1400;                              // the tree's centre line (stage px)
  const Y = [420, 590, 760, 890];               // tiers: sponsor · department leaders · managers · teams
  const X2 = [-285, -95, 95, 285].map((d) => TX + d);
  const X3 = X2.flatMap((x) => [x - 48, x + 48]);
  const X4 = X3.flatMap((x) => [x - 30, x, x + 30]);
  const HALF = [32, 20, 13, 7];                 // node half-sizes per tier
  const r1 = (v) => Math.round(v * 10) / 10;

  const ROLES = [
    { t: 'Executive sponsor', i: 'person-message', a: 'Opens the campaign with the story of a colleague who inspired them.<br>Chairs the quarterly review and decides: scale, adjust or stop.' },
    { t: 'Department leaders', i: 'handshake', a: 'Nominate at least one colleague every quarter.<br>Acknowledge each featured colleague in person, within a week.' },
    { t: 'Managers', i: 'team', a: 'Hold a five-minute story moment in every monthly team meeting.' },
  ];

  /* ── the cascade's links: an S-curve from the foot of a parent to the head of a child ── */
  const link = (px, py, pr, cx, cy, cr) => {
    const y0 = py + pr, y1 = cy - cr, h = y1 - y0;
    return `M${px} ${y0} C${px} ${r1(y0 + h * .55)} ${cx} ${r1(y1 - h * .55)} ${cx} ${y1}`;
  };
  const L1 = X2.map((x) => link(TX, Y[0], HALF[0], x, Y[1], HALF[1]));
  const L2 = X3.map((x, j) => link(X2[j >> 1], Y[1], HALF[1], x, Y[2], HALF[2]));
  const L3 = X4.map((x, j) => link(X3[Math.floor(j / 3)], Y[2], HALF[2], x, Y[3], HALF[3]));
  // build timing (s after the build starts): the links draw down behind the spark's light
  const T0 = .3, T1 = .38, T2 = .64, T3 = .9;
  const LVL1 = .74;                             // the sponsor's level line draws as the spark lands
  const paths = [
    ...L1.map((d, j) => ({ d, k: 1, dl: T1 + Math.abs(j - 1.5) * .02, dr: .3 })),
    ...L2.map((d, j) => ({ d, k: 2, dl: T2 + Math.abs(j - 3.5) * .012, dr: .28 })),
    ...L3.map((d, j) => ({ d, k: 3, dl: T3 + Math.abs(j - 11.5) * .006, dr: .24 })),
  ];
  const svgLinks = paths.map((p) => `<path class="ld-lk k${p.k}" d="${p.d}" pathLength="100" style="--d:${p.dl.toFixed(2)}s;--dr:${p.dr}s"/>`).join('');
  // one-shot leading lights while the links draw (live build only)
  const leads = paths.map((p) => `<i class="ld-lead k${p.k}" style="offset-path:path('${p.d}');--d:${p.dl.toFixed(2)}s;--dr:${p.dr}s"></i>`).join('');

  /* ── nodes ── */
  const node = (cls, x, y, d) => `<i class="ld-n ${cls}" style="left:${x}px;top:${y}px;--d:${d.toFixed(2)}s"></i>`;
  const nodes2 = X2.map((x, j) => node('t2', x, Y[1], T1 + .2 + Math.abs(j - 1.5) * .02)).join('');
  const nodes3 = X3.map((x, j) => node('t3', x, Y[2], T2 + .2 + Math.abs(j - 3.5) * .012)).join('');
  const team = X4.map((x, j) => `<i class="ld-tm" style="left:${x}px;top:${Y[3]}px;--d:${(T3 + .12 + Math.abs(j - 11.5) * .007).toFixed(2)}s"></i>`).join('');

  /* ── stories flowing down: sponsor → a leader → a manager → a colleague ──
     8 routes on an 8 s cycle, one leaving the sponsor every second; each hop takes
     .8 s. Every light and every flare shares the cycle, so they stay in step. */
  const D = 8, HOP = .8;
  const ROUTES = [[0, 1, 4], [2, 4, 13], [1, 2, 7], [3, 7, 22], [0, 0, 1], [2, 5, 16], [1, 3, 10], [3, 6, 19]];
  const dl = (t) => ((t % D) - D).toFixed(2) + 's';
  const flows = ROUTES.map(([a, b, c], r) => {
    const s = r * (D / ROUTES.length);
    const segs = [L1[a], L2[b], L3[c]].map((d, k) => `<i class="ld-f k${k + 1}" style="offset-path:path('${d}');--dl:${dl(s + k * HOP)}"><b></b></i>`).join('');
    const hits = [[X2[a], Y[1], 't2'], [X3[b], Y[2], 't3'], [X4[c], Y[3], 'tm']]
      .map(([x, y, cls], k) => `<i class="ld-hit ${cls}" style="left:${x}px;top:${y}px;--dl:${dl(s + (k + 1) * HOP)}"></i>`).join('');
    return segs + hits;
  }).join('');

  /* ── the role rows (left) ── */
  const rows = ROLES.map((x, k) => `
    <div class="ld-row r${k + 1}" data-out="1" style="top:${Y[k] - 30}px">
      <span class="ld-chip a-materialize" data-in="0" style="--d:${(.3 + k * .16).toFixed(2)}s">${Deck.icon(x.i)}</span>
      <h3 class="ld-role" data-in="0" style="--d:${(.34 + k * .16).toFixed(2)}s"${k === 0 ? ' data-spark="0" data-spark-at="r" data-spark-delay=".2"' : ''}>${x.t}</h3>
      <p class="ld-act a-fade" data-in="0" style="--d:${(.52 + k * .16).toFixed(2)}s;--dur:.8s">${x.a}</p>
    </div>`).join('');

  /* ── stop 1: the quiet lists ── */
  const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 12.6l4.3 4.3 8.7-9.4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const DO = ['Nominate colleagues.', 'Tell other people’s stories.', 'Protect consent and fairness.'];
  const DONT = ['Nominate themselves.', 'Rank people or pick winners.', 'Turn it into a broadcast.'];
  const list = (items, mark, d0) => items.map((t, i) => `<li class="ld-li" data-in="1" style="--d:${(d0 + i * .1).toFixed(2)}s"><span class="ld-mk">${mark}</span>${t}</li>`).join('');

  Deck.scene({
    id: 'leaders',
    title: 'Leaders go first',
    act: 3,
    bg: 'navy',
    transition: 'chapter',
    cues: ['Leaders go first · sponsor, leaders, managers', 'Leaders spotlight others, never themselves'],
    holds: [22, 16],
    notes: [
      'Inspiration is role-modelled, not announced. So leaders go first. Our sponsor opens the campaign with the story of a colleague who inspired them. Every department leader nominates at least one colleague a quarter and thanks featured colleagues in person. Managers give stories five minutes in every monthly meeting. [Team: confirm the commitments.]',
      'And one rule keeps it honest: leaders spotlight others, never themselves. No self-nomination, no rankings, no broadcast. Consent and fairness come first. That is the leadership behaviour we want the campaign to model.',
    ],
    field: [
      { dim: .32, lit: .04, litFrom: [1400, 900], travel: .3, warm: .1, offset: [70, 160], links: .5, wave: .5, streaks: .1, sparkle: 1.1, drift: 1,
        calm: [[100, 120, 1100, 350, .8], [100, 360, 1010, 940, .85], [1010, 360, 1800, 940, .45]] },
      { lit: .07, warm: .3, offset: [20, 190], travel: .22,
        calm: [[100, 120, 1760, 290, .8], [100, 380, 1300, 800, .88], [1300, 380, 1800, 940, .5]] },
    ],
    html: `
      <i class="ld-wash w1"></i><i class="ld-wash w2"></i>

      <div class="pad ld-head">
        <div class="kicker a-wipe" data-in="0" style="--d:.1s">Leadership involvement</div>
        <div class="ld-hbox">
          <h1 class="ld-h ld-h0" data-in="0" data-out="1" data-split style="--d:.16s;--wstep:.07s">Leaders go first.</h1>
          <h2 class="ld-h ld-h1" data-in="1" data-split data-spark="1" data-spark-at="r" data-spark-delay=".7" style="--d:.2s;--wstep:.045s">Leaders <em class="hl">spotlight</em> <em class="hl">others,</em> never themselves.</h2>
        </div>
        <p class="ld-sub" data-in="0" data-out="1" style="--d:.44s">Inspiration is role-modelled, not announced.</p>
      </div>

      <!-- the cascade (right): one sponsor, their leaders, the managers, every team -->
      <div class="ld-tree" aria-hidden="true">
        <div class="ld-tbody">
          <i class="ld-halo" style="left:${TX}px;top:${Y[0]}px"></i>
          <svg class="ld-links" viewBox="0 0 1920 1080">${svgLinks}</svg>
          <div class="ld-leads">${leads}</div>
          <div class="ld-flows">${flows}</div>
          ${nodes3}${nodes2}
          <i class="ld-n t1" style="left:${TX}px;top:${Y[0]}px;--d:${T0}s"><b class="ld-ring"></b><b class="ld-ring r2"></b></i>
        </div>
        <div class="ld-spots">
          <i class="ld-cone c1" style="left:${TX}px;top:${Y[0]}px;--len:${Y[3] - Y[0]}px"><b class="ld-pool"></b></i>
          <i class="ld-cone c2" style="left:${TX}px;top:${Y[0]}px;--len:${Y[3] - Y[0]}px"><b class="ld-pool"></b></i>
        </div>
        <div class="ld-team">${team}</div>
      </div>

      <!-- the roles (left): the names are the heroes, the actions support -->
      <i class="ld-lvl l1" style="top:${Y[0]}px;--d:${LVL1}s"><b></b></i>
      <i class="ld-lvl l2" style="top:${Y[1]}px;--d:.72s"></i>
      <i class="ld-lvl l3" style="top:${Y[2]}px;--d:.9s"></i>
      <i class="ld-lvl l4" style="top:${Y[3]}px;--d:1.04s"></i>
      ${rows}
      <div class="ld-row r4" data-out="1" style="top:${Y[3] - 30}px">
        <span class="ld-chip sm a-materialize" data-in="0" style="--d:.78s">${Deck.icon('users-connected')}</span>
        <span class="ld-tlab a-fade" data-in="0" style="--d:.82s">Teams</span>
      </div>

      <!-- stop 1: leaders spotlight others, never themselves -->
      <i class="ld-lglow g1"></i><i class="ld-lglow g2"></i>
      <div class="ld-lists">
        <div class="ld-list do">
          <div class="ld-lh a-wipe" data-in="1" style="--d:.42s"><i></i>Leaders do</div>
          <ul>${list(DO, TICK, .5)}</ul>
        </div>
        <i class="ld-div a-wipe-down" data-in="1" style="--d:.5s;--dur:1s"><b></b></i>
        <div class="ld-list dont">
          <div class="ld-lh a-wipe" data-in="1" style="--d:.62s"><i></i>Leaders don’t</div>
          <ul>${list(DONT, CROSS, .7)}</ul>
        </div>
      </div>
    `,
    step(n, prev, ctx) {
      const el = ctx.el;
      // level lines: from just after each role name to the first node of its tier
      const first = [TX, X2[0], X3[0], X4[0]];
      ctx.$$('.ld-row').forEach((row, k) => {
        const nm = row.querySelector('.ld-role, .ld-tlab'), lv = ctx.$('.ld-lvl.l' + (k + 1));
        if (!nm || !lv || !nm.offsetWidth) return;
        const x0 = row.offsetLeft + nm.offsetLeft + nm.offsetWidth + (k === 0 ? 76 : 34);
        const x1 = first[k] - HALF[k] - 16;
        lv.style.left = x0 + 'px';
        lv.style.width = Math.max(0, x1 - x0) + 'px';
      });
      // one-shot lights (the links' leading lights, the root's flare) play only on a live
      // click; their resting state is invisible, so a jump or a step back shows the same frame
      el.classList.remove('ld-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) {
        el.classList.add('ld-live');
        const enter = parseFloat(getComputedStyle(el).getPropertyValue('--enter')) || 0;
        ctx.after((enter + LVL1 + .5) * 1000, () => window.Field && Field.burst(TX, Y[0], { radius: 520, dur: 1.4 }));
        ctx.after((enter + T3 + .4) * 1000, () => window.Field && Field.burst(TX, Y[3], { radius: 700, dur: 1.6 }));
      }
    },
  });
})();
