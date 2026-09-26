/* 05 · Reading the numbers (v2) — one full-frame dumbbell chart on a shared 0–100%
   axis, built in one choreographed sequence (about 2.2 s): two glass panels unfold
   (the mechanism in plum, the willingness in teal), the axis draws with a leading
   light, then the mechanism rows (the Tahakom dot slides LEFT from the benchmark,
   purple) and the willingness rows (it slides RIGHT, teal; +48 is the sea-green
   hero). Each difference counts up as its dot travels and lands with a punch.
   Stop 1: the headline turns into the reading, and a light runs along each group
   as the reading names it. The caveat and the sources stay on screen throughout.
   Ambient: comets travel each segment, halos breathe, a scan light crosses the
   axis, light travels round the willingness panel, and the +48 glows. */
(function () {
  const X0 = 624, W = 860;                  // stage x of 0%, and the width of 0–100%
  const X = (v) => X0 + W * v / 100;
  // the two group panels (stage px) and the rows inside them
  const PANELS = [
    { g: 'mech', label: 'The mechanism', top: 380, h: 184, d: .28 },
    { g: 'will', label: 'The willingness', top: 588, h: 184, d: .4 },
  ];
  // d: when the row starts (s after the click); the dot leaves the benchmark .2 s later
  const ROWS = [
    { g: 'mech', label: 'Org-wide recognition', t: 8, b: 22, y: 444, d: .5 },
    { g: 'mech', label: 'Choice in recognition', t: 49, b: 64, y: 514, d: .64 },
    { g: 'will', label: 'Peer recognition', t: 89, b: 41, y: 652, d: .98, hero: true },
    { g: 'will', label: 'Connection / loyalty', t: 80, b: 77, y: 722, d: 1.12, note: 'broadly aligned' },
  ];
  const AXIS_Y = 792, GRID_TOP = 380;
  const TICKS = [0, 25, 50, 75, 100];
  const TRAVEL = .78;                        // s: the Tahakom dot's journey
  // where +48 ends (its delta starts at deltaX; "+48" 88px ≈ 156 + gap + "pts" ≈ 40)
  const hero = ROWS[2], heroDelta = Math.max(X(hero.t), X(hero.b)) + 16 + 12 + 75 + 22;

  const row = (r, i) => {
    const tx = X(r.t), bx = X(r.b);
    const behind = r.t < r.b;                // Tahakom dot sits left of the benchmark
    const diff = r.t - r.b;
    // the difference sits beyond the right-hand value label:
    // half a dot (16) + label gap (12) + widest label, "89%" at 32px (75) + gap (22)
    const deltaX = Math.max(tx, bx) + 16 + 12 + 75 + 22;
    // the comet keeps clear of both dots: it leaves the benchmark dot's edge and
    // fades out before the Tahakom dot, so it never reads as a data point
    const sg = Math.sign(tx - bx), g0 = sg * 32, g1 = (tx - bx) - sg * 38;
    const glint = Math.abs(tx - bx) > 90;   // no room on a 3-point segment
    const cnt = `<span class="num cnt ${diff < 0 ? 'neg' : 'pos'}" data-count="${Math.abs(diff)}" data-dur="${TRAVEL}" data-delay="${(r.d + .2).toFixed(2)}">0</span>`;
    return `
      <div class="bm-row ${r.g}${r.hero ? ' hero' : ''} a-none" data-in="0" style="top:${r.y - 36}px;--d:${r.d}s;--dur:.5s;--dx:${(tx - bx).toFixed(1)}px;--gp:${[0, 1.1, .4, 0][i]}s;--gt:${[3.6, 3.9, 3.3, 3.6][i]}s;--g0:${g0}px;--g1:${g1.toFixed(1)}px;--bp:${(-i * .85 - .4).toFixed(2)}s">
        <div class="bm-lab">${r.label}</div>
        <i class="bm-seg ${behind ? 'to-l' : 'to-r'}" style="left:${Math.min(tx, bx)}px;width:${Math.abs(tx - bx)}px"></i>
        ${r.hero ? `<i class="bm-hero-halo" style="left:${deltaX - 80}px"></i>` : ''}
        <span class="bm-dot bm-b" style="left:${bx}px"><i><u></u></i><b class="${behind ? 'r' : 'l'}">${r.b}%</b></span>
        <span class="bm-dot bm-t" style="left:${bx}px"><i><u></u></i><b class="${behind ? 'l' : 'r'}">${r.t}%</b></span>
        ${glint ? `<i class="bm-glint ${behind ? 'l' : 'r'}" style="left:${bx}px"></i>` : ''}
        <div class="bm-delta" style="left:${deltaX}px">${cnt}<small>pts</small>${r.note ? `<em>${r.note}</em>` : ''}</div>
      </div>`;
  };

  Deck.scene({
    id: 'benchmark',
    title: 'Reading the numbers',
    act: 1,
    bg: 'deep',
    transition: 'push',
    cues: ['Willingness is strong; the mechanism is weak · the chart builds', 'Reading · build the channel, then test it'],
    holds: [12, 8],
    notes: [
      'Against outside benchmarks, the mechanism is behind: org-wide recognition 8% against 22%, choice 49% against 64%. The willingness is ahead: peer recognition 89% against 41% — plus 48, our standout. Directional only: different measures, not Saudi norms. [Team: confirm the source of “Choice in recognition”.]',
      'So: behind on the mechanism, ahead on the willingness. People are ready; the channel is missing. Build the channel, then test it — that is the pilot we are asking you to approve.',
    ],
    field: [
      { dim: .3, lit: 0, travel: .25, warm: 0, offset: [-190, 110], links: .45, wave: .55, streaks: .1, sparkle: 1, drift: 1,
        calm: [[100, 120, 1600, 300, .6], [100, 330, 1820, 960, .5]] },
      { dim: .3, wave: .6, calm: [[100, 120, 1600, 350, .8], [100, 350, 1820, 960, .5]] },
    ],
    html: `
      <div class="pad bm-head">
        <div class="bm-kick">
          <div class="kicker a-wipe" data-in="0" data-out="1">Reading the numbers</div>
          <div class="kicker a-wipe" data-in="1" style="--d:.1s">Reading</div>
        </div>
        <div class="bm-swap">
          <h2 class="h2 bm-h" data-in="0" data-out="1" data-split style="--d:.12s">Willingness is strong; the mechanism is weak.</h2>
          <p class="bm-read" data-in="1" data-split style="--d:.18s;--wstep:.045s"><span class="purple">Behind on the mechanism,</span> <span class="teal">ahead on the willingness</span><br>— build the channel, then test it.</p>
        </div>
      </div>
      <i class="bm-read-mark" data-spark="1" data-spark-xy="110,236" data-spark-delay=".2"></i>

      <div class="bm-chart">
        <!-- two glass panels: the mechanism (plum) and the willingness (teal, the hero group) -->
        ${PANELS.map((p) => `
        <div class="bm-panel ${p.g} glass${p.g === 'mech' ? ' plum' : ' live'} a-unfold" data-in="0" style="top:${p.top}px;height:${p.h}px;--d:${p.d}s;--dur:.9s"><i class="bm-pglow"></i></div>
        <div class="bm-tab ${p.g} glass${p.g === 'mech' ? ' plum' : ''} a-wipe" data-in="0" style="top:${p.top - 21}px;--d:${p.d + .22}s;--dur:.7s"><i></i><span>${p.label}</span></div>`).join('')}
        <!-- stop 1: a light runs along each group as the reading names it -->
        <i class="bm-band mech" style="top:${PANELS[0].top}px;height:${PANELS[0].h}px"></i><i class="bm-band will" style="top:${PANELS[1].top}px;height:${PANELS[1].h}px"></i>

        <!-- the shared axis: grid rises, the axis draws behind a leading light -->
        ${TICKS.map((v, k) => `<i class="bm-grid${v % 50 ? '' : ' major'}" data-in="0" style="left:${X(v)}px;top:${GRID_TOP}px;height:${AXIS_Y - GRID_TOP}px;--d:${.36 + k * .06}s;--dur:.8s"></i>`).join('')}
        <i class="bm-axis a-wipe" data-in="0" style="left:${X0}px;top:${AXIS_Y - 1}px;width:${W}px;--d:.28s;--dur:1s"></i>
        <i class="bm-tip" style="left:${X0}px;top:${AXIS_Y}px;--w:${W}px"></i>
        ${ROWS.map((r, k) => `<i class="bm-lane a-wipe" data-in="0" style="top:${r.y}px;left:${X0}px;width:${W}px;--d:${.4 + k * .07}s;--dur:.9s"></i>`).join('')}
        <div class="bm-ticks">${TICKS.map((v, k) => `<span class="a-fade" data-in="0" style="left:${X(v) - 50}px;top:${AXIS_Y + 13}px;--d:${.5 + k * .06}s;--dur:.6s">${v}%</span>`).join('')}</div>
        <div class="bm-scan" style="left:${X0}px;top:${GRID_TOP}px;height:${AXIS_Y - GRID_TOP}px;--w:${W}px"></div>

        ${ROWS.map(row).join('')}
        <!-- the hero lands: the spark comes to rest beside +48 -->
        <i class="bm-mark" data-spark="0" data-spark-xy="${Math.round(heroDelta + 156 + 10 + 40 + 32)},${hero.y}" data-spark-delay="1.02"></i>
      </div>

      <p class="bm-cav a-fade" data-in="0" style="--d:.85s">Directional comparison only: measures and populations are not identical.</p>
      <div class="bm-legend glass a-wipe" data-in="0" style="top:${PANELS[0].top - 21}px;--d:.9s;--dur:.7s">
        <span><i class="k-t"></i>Tahakom</span><span><i class="k-b"></i>Benchmark</span>
      </div>

      <p class="bm-src a-fade" data-in="0" style="--d:1s"><b>Sources:</b> Tahakom internal survey (158 responses); Gallup &amp; Workhuman 2024, Achievers Workforce Institute, Globoforce/Workhuman.<br>Benchmarks are directional and are not Saudi norms.</p>
    `,
    step(n, prev, ctx) {
      // one-shot lights (the axis tip, the hero's ring, the reading's sweeps) play only
      // on a live click; their resting state is invisible, so any stop reached by a
      // jump or by going back shows the same settled frame
      const el = ctx.el;
      el.classList.remove('bm-live', 'bm-read-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('bm-live');
      if (!ctx.instant && n === 1 && prev === 0) el.classList.add('bm-read-live');
    },
  });
})();
