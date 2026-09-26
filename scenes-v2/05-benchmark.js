/* 05 · Reading the numbers (v2) — audience-first: two columns, three big numbers.
   Stop 0: the headline, then a luminous divider splits the frame. Left, in plum:
   THE MECHANISM, two deltas (−14, −15) whose Tahakom dot slides LEFT from the
   benchmark on a slim 0–100% mini-bar. Right, in teal: THE WILLINGNESS, the hero
   +48 (its dot slides RIGHT, 41% → 89%), which lands with a punch and a glow, then
   the quiet +3 line. The raw pairs, the legend, the caveat and the sources are
   small and dim; they stay on screen on both stops.
   Stop 1: the reading maps onto the columns. "Behind on the mechanism," becomes
   the left header (plum), "ahead on the willingness" the right header (teal), the
   metrics step back, and "— build the channel, then test it." lands as the hero
   line with the spark.
   Ambient: light flows along each mini-bar, a glow breathes behind +48, a light
   travels the divider, the column washes drift, and the field stays calm behind
   the copy. Nothing inside the text moves; numbers never change while parked.
   Every piece of state keys off .st-n and .is-in, so back lands on the same frame. */
(function () {
  const W = 732;                              // column width (stage px); the mini-bars span it: 0–100%
  const TRAVEL = .72;                         // s: the Tahakom dot's journey from the benchmark
  const MECH = [
    { name: 'Org-wide recognition', t: 8, b: 22, d: .42 },
    { name: 'Choice in recognition', t: 49, b: 64, d: .6 },
  ];
  const HERO = { name: 'Peer recognition', t: 89, b: 41, d: .82 };
  const AUX = { t: 80, b: 77 };               // connection / loyalty: supporting only

  // a slim 0–100% mini-dumbbell: benchmark ring, Tahakom dot, the gap between them
  const bar = (m, hero) => {
    const lo = Math.min(m.t, m.b), hi = Math.max(m.t, m.b);
    const dx = (m.b - m.t) * W / 100;          // the dot starts on the benchmark
    return `
        <div class="bm-bar ${m.t < m.b ? 'to-l' : 'to-r'}${hero ? ' hero' : ''}" style="--t:${m.t};--b:${m.b};--lo:${lo};--hi:${hi};--from:${dx.toFixed(1)}px;--run:${(-dx).toFixed(1)}px">
          <i class="bm-track"></i>
          <i class="bm-seg"></i>
          <i class="bm-flow"></i>
          <i class="bm-ring"></i>
          <i class="bm-dot"></i>
          <span class="bm-v bm-vt">${m.t}%</span>
          <span class="bm-v bm-vb">${m.b}%</span>
        </div>`;
  };
  // the delta counts up as the dot travels; a hidden copy of the final value holds
  // its width, so "pts" and the name never shift while it counts
  const metric = (m, sign, hero) => {
    const v = Math.abs(m.t - m.b);
    return `
      <div class="bm-m${hero ? ' hero' : ''}" data-in="0" style="--d:${m.d}s">
        <div class="bm-fig">
          <span class="bm-n ${sign}"><span class="bm-dg"><span class="bm-gh" aria-hidden="true">${v}</span><span class="bm-ct" data-count="${v}" data-dur="${TRAVEL}" data-delay="${(m.d + .2).toFixed(2)}">0</span></span></span>
          <span class="bm-cap"><b>pts</b><em>${m.name}</em></span>
        </div>
        ${bar(m, hero)}
      </div>`;
  };

  Deck.scene({
    id: 'benchmark',
    title: 'Reading the numbers',
    act: 1,
    bg: 'deep',
    transition: 'push',
    cues: ['Willingness is strong; the mechanism is weak · the numbers build', 'Reading · build the channel, then test it'],
    holds: [12, 8],
    notes: [
      'Against outside benchmarks, the mechanism is behind: org-wide recognition 8% against 22%, minus 14; choice in recognition 49% against 64%, minus 15. The willingness is ahead: peer recognition 89% against 41% — plus 48, our standout. Connection is broadly aligned, 80% against 77%. Directional only: different measures, not Saudi norms. [Team: confirm the source of “Choice in recognition”.]',
      'So: behind on the mechanism, ahead on the willingness. People are ready; the channel is missing. Build the channel, then test it — that is the pilot we are asking you to approve.',
    ],
    field: [
      { dim: .3, lit: 0, travel: .25, warm: .15, offset: [-190, 110], links: .45, wave: .6, streaks: .1, sparkle: 1.1, drift: 1,
        calm: [[100, 120, 1640, 290, .7], [100, 330, 900, 810, .4], [1020, 330, 1800, 780, .4], [100, 860, 1440, 950, .75]] },
      { dim: .32, wave: .8, sparkle: 1.4, calm: [[100, 120, 1760, 270, .7], [100, 290, 1760, 610, .35], [100, 660, 1460, 820, .75], [100, 860, 1440, 950, .75]] },
    ],
    html: `
      <i class="bm-wash mech"></i><i class="bm-wash will"></i>

      <div class="pad bm-head">
        <div class="bm-kick">
          <div class="kicker a-wipe" data-in="0" data-out="1">Reading the numbers</div>
          <div class="kicker a-wipe" data-in="1" style="--d:.1s">Reading</div>
        </div>
        <h2 class="h2 bm-h" data-in="0" data-out="1" data-split style="--d:.1s">Willingness is strong; the mechanism is weak.</h2>
      </div>

      <!-- the luminous divider: draws down at stop 0, re-fits the reading at stop 1 -->
      <div class="bm-divider" data-in="0" style="--d:.24s;--dur:1s"><i class="bm-div-run"></i></div>

      <!-- left: THE MECHANISM (plum) -->
      <section class="bm-col mech">
        <div class="bm-lab a-wipe" data-in="0" data-out="1" style="--d:.3s"><i></i>The mechanism</div>
        <h3 class="bm-say" data-in="1" data-split style="--d:.12s">Behind on the mechanism,</h3>
        <div class="bm-body">
          <i class="bm-mglow"></i>
          ${MECH.map((m) => metric(m, 'neg')).join('')}
        </div>
      </section>

      <!-- right: THE WILLINGNESS (teal), the hero -->
      <section class="bm-col will">
        <div class="bm-lab a-wipe" data-in="0" data-out="1" style="--d:.66s"><i></i>The willingness</div>
        <h3 class="bm-say" data-in="1" data-split style="--d:.34s">ahead on the willingness</h3>
        <div class="bm-body">
          <i class="bm-halo"></i>
          ${metric(HERO, 'pos', true)}
          <p class="bm-aux a-fade" data-in="0" style="--d:1.62s;--dur:.8s"><b>+${AUX.t - AUX.b}<small> pts</small></b><span>Connection / loyalty · broadly aligned</span><em>${AUX.t}% vs ${AUX.b}%</em></p>
        </div>
      </section>
      <i class="bm-mark" data-spark="0" data-spark-xy="1484,420" data-spark-delay=".95"></i>

      <!-- stop 1: the takeaway, the hero of the reading -->
      <div class="bm-takebox">
        <i class="bm-tglow"></i>
        <p class="bm-take" data-in="1" data-split data-spark="1" data-spark-delay=".55" style="--d:.52s;--wstep:.05s">— build the channel, then test it.</p>
        <i class="bm-uline a-wipe" data-in="1" style="--d:1s;--dur:1s"></i>
      </div>

      <!-- supporting: legend, caveat, sources (small and dim, on both stops) -->
      <div class="bm-foot a-fade" data-in="0" style="--d:1.05s;--dur:.8s">
        <p class="bm-cav"><span class="bm-key"><i class="k-t"></i>Tahakom</span><span class="bm-key"><i class="k-b"></i>Benchmark</span><span class="bm-sep"></span>Directional comparison only: measures and populations are not identical.</p>
        <p class="bm-src"><b>Sources:</b> Tahakom internal survey (158 responses); Gallup &amp; Workhuman 2024, Achievers Workforce Institute, Globoforce/Workhuman. Benchmarks are directional and are not Saudi norms.</p>
      </div>
    `,
    step(n, prev, ctx) {
      // one-shot lights (the divider's leading light, the ring and bloom on +48, the bloom
      // behind the takeaway) play only on a live click; their resting state is invisible, so a stop
      // reached by a jump or by going back shows the same settled frame
      const el = ctx.el;
      el.classList.remove('bm-live', 'bm-read-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('bm-live');
      if (!ctx.instant && n === 1 && prev === 0) el.classList.add('bm-read-live');
    },
  });
})();
