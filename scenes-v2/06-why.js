/* 06 · Why it matters (v3) — one scene, two stops. Enters with a push (the camera
   travels right), so stop 0 builds left to right, in the direction the story flows:
   the header, the individual, the shared story, the beams, the organisation.
   0  "…when the story is shared." with the retention caveat, over the prism flow:
      the employee's glass card and node, the story light travels into the glowing
      "shared story" squircle (the hero: the spark lands on it as the story passes
      through) and leaves as two teal beams that reach the organisation's two glass
      cards (02A, 02B). The cards are support, a step quieter than the statement.
   1  An in-scene camera rise: the flow drifts up and away, Riyadh from above rises
      in behind a plum veil, with the STRATEGIC VALUE statement, the purpose line
      (Urban Intelligence for a Better Life: key, one step below the headline, where
      the spark lands), the six values as glass tiles lighting in turn and the three
      outcomes as glass cards.
   Ambient: light washes and flows along the beams, stories ride them, ripples
   leave the employee node, the shared story breathes in its glow pool and a light
   runs round its rim; at stop 1 the city drifts and shimmers under a light leak,
   the values light in turn and a light passes through the purpose.
   All state is keyed off .st-n; the travelling lights are one-shot on live clicks. */
(function () {
  // Geometry in stage px. The flow runs along y = FY.
  const FY = 668;
  const NODE = { x: 708, r: 52 };          // the individual: 104px squircle
  const PRISM = { x: 922, r: 92 };         // shared story: 184px squircle
  const X0 = PRISM.x + PRISM.r;            // beams leave the prism's right face (1014)
  const X1 = 1214;                         // …and land on the org cards' left edge
  const CARD_A = [430, 646], CARD_B = [690, 906];
  const LAND_A = [CARD_A[0] + 30, CARD_A[1] - 30], LAND_B = [CARD_B[0] + 30, CARD_B[1] - 30];
  const LIGHT_X = NODE.x + NODE.r + 22;    // where the story light rests (782)
  const EMP = { x: 144, w: 470, top: FY - 150, h: 300 };
  const BAND = [410, 926];                 // the beams' vertical band

  const cx1 = X0 + 96, cx2 = X1 - 92;
  const midA = (LAND_A[0] + LAND_A[1]) / 2, midB = (LAND_B[0] + LAND_B[1]) / 2;
  const curve = (y0, y1) => `M${X0} ${y0} C${cx1} ${y0} ${cx2} ${y1} ${X1} ${y1}`;
  // each beam is a wedge: narrow at the prism, as tall as its landing at the far end
  const edgeA = curve(FY - 30, LAND_A[0]), innerA = curve(FY, LAND_A[1]);
  const edgeB = curve(FY + 30, LAND_B[1]), innerB = curve(FY, LAND_B[0]);
  const coreA = curve(FY - 6, midA), coreB = curve(FY + 6, midB);
  const wedge = (y0a, y1a, y1b, y0b) => `M${X0} ${y0a} C${cx1} ${y0a} ${cx2} ${y1a} ${X1} ${y1a} L${X1} ${y1b} C${cx2} ${y1b} ${cx1} ${y0b} ${X0} ${y0b} Z`;
  const wedgeA = wedge(FY - 30, LAND_A[0], LAND_A[1], FY);
  const wedgeB = wedge(FY, LAND_B[0], LAND_B[1], FY + 30);
  // the build light: node → through the prism → out along one beam (two copies split)
  const run = (mid, o) => `M${LIGHT_X} ${FY} L${X0} ${FY} C${cx1} ${FY + o} ${cx2} ${mid} ${X1} ${mid}`;
  // ambient: stories leave the employee's light for the prism
  const feed = `M${LIGHT_X + 20} ${FY} L${PRISM.x - PRISM.r - 8} ${FY}`;
  // …and ride the beams, along the cores and (fainter) between core and edge
  const mid = (a, b) => `M${X0} ${FY + a} C${cx1} ${FY + a} ${cx2} ${b} ${X1} ${b}`;

  // ── the lights ride their paths on transforms (the compositor), not offset-path: each path
  // becomes a sampled keyframe track, written into the scene's own <style> below ──
  const KF = [];
  // stories ride a path on the eased curve the flow uses; opacity keeps its own keyframes (wyDot/wyFeed)
  const EASE = bezier(.4, .1, .6, .9);
  const track = (path) => {
    const name = 'wyM' + KF.length, sp = sampler(path), N = 40;
    KF.push(`@keyframes ${name} {${Array.from({ length: N + 1 }, (_, k) => {
      const p = sp.at(EASE(k / N) * sp.L);
      return ` ${(k / N * 100).toFixed(2)}% { transform: translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px); }`;
    }).join('')} }`);
    return name;
  };
  const dots = (path, n, dur, cls, off) => {
    const name = track(path);
    return Array.from({ length: n }, (_, i) =>
      `<i class="wy-dot ${cls || ''}" style="animation-name:${name},${cls === 'in' ? 'wyFeed' : 'wyDot'};animation-duration:${dur}s;animation-delay:${(-(i + (off || 0)) * dur / n).toFixed(2)}s"></i>`).join('');
  };
  // light flows along a beam core as dashes (GAP px apart at V px/s), clipped at both ends by
  // the flow's box: each dash rides the path once, then waits past the end for its next lap
  const flow = (path, dx, dy, gap, v) => {
    const name = 'wyF' + KF.length, sp = sampler(path), pad = 4, run = sp.L + 2 * pad;
    const n = Math.ceil(run / gap), f = run / (n * gap), M = Math.ceil(run / 6);
    const key = (k) => { const p = sp.at(-pad + run * k / M); return `transform: translate(${(p.x - dx).toFixed(1)}px, ${(p.y - dy).toFixed(1)}px) rotate(${p.a.toFixed(1)}deg);`; };
    KF.push(`@keyframes ${name} {${Array.from({ length: M + 1 }, (_, k) => ` ${(f * k / M * 100).toFixed(2)}% { ${key(k)} }`).join('')} 100% { ${key(M)} } }`);
    const P = n * gap / v;
    return Array.from({ length: n }, (_, i) => `<i style="animation-name:${name};animation-duration:${P.toFixed(3)}s;animation-delay:${(-i * gap / v).toFixed(3)}s"></i>`).join('');
  };
  // local copies of the beam wedges, for the glint's clip
  const local = (d) => d.replace(/(-?[\d.]+) (-?[\d.]+)/g, (m, x, y) => `${+x - X0} ${+y - BAND[0]}`);
  const box = (l, t, w, h) => `left:${l}px;top:${t}px;width:${w}px;height:${h}px`;
  const beamBox = `viewBox="${X0} ${BAND[0]} ${X1 - X0} ${BAND[1] - BAND[0]}" style="${box(X0, BAND[0], X1 - X0, BAND[1] - BAND[0])}`;

  const EMPL = ['Feel seen and valued', 'Stay motivated to contribute', 'Participate, nominate and share', 'Learn from colleagues'];
  const ORG = [
    { k: '02A', cls: 'wy-a', y: CARD_A, icon: 'users-connected', label: 'Org: Culture &amp; values', items: ['Stronger recognition culture', 'Tahakom’s values shown in action'], d: .9, sh: '-1.6s' },
    { k: '02B', cls: 'wy-b', y: CARD_B, icon: 'handshake', label: 'Org: Engagement &amp; experience', items: ['Higher engagement and collaboration', 'Stronger employee experience'], d: .98, sh: '-3.3s' },
  ];

  const VALUES = ['Commitment', 'Collaboration', 'Innovation', 'Impact', 'Learning', 'Excellence'];
  const PILLARS = ['Purpose connected to work', 'Values become visible', 'Learning moves across teams'];
  // city lights that shimmer over the photo (stage px, on its bright districts)
  const GLINTS = [[1560, 575, 1], [1742, 338, .8], [1640, 282, .7], [1402, 500, .8], [1286, 222, .6], [1208, 655, .7], [1812, 842, .9], [1700, 470, .9], [1480, 350, .6], [1860, 610, .8],
    [1590, 640, 1.4], [1740, 700, 1.5], [1450, 625, 1.2], [1325, 752, 1.1], [1680, 800, 1.3], [1850, 735, 1.2], [1530, 715, 1.1], [1395, 680, 1], [1060, 845, .8], [800, 868, .7], [1150, 560, .6], [1500, 240, .7]];

  Deck.scene({
    id: 'why',
    title: 'Why it matters',
    act: 1,
    bg: 'night',
    transition: 'push',
    cues: ['Becomes organisational value when the story is shared · the flow · retention caveat', 'Aligned by design · our purpose · the six values · three outcomes, over Riyadh'],
    holds: [11, 11],
    notes: [
      'Why does this matter to Tahakom? Recognition happens to one person. Value happens when the story is shared: people feel seen, the behaviour spreads, and the culture gets stronger. Retention may follow over time, but it is not a promise of the pilot.',
      'And it is aligned by design. We are not inventing new values. Every story shows how daily work serves our purpose, Urban Intelligence for a Better Life, and makes one of our six values visible in action.',
    ],
    field: [
      { dim: .3, lit: 0, travel: .3, offset: [170, -80], warm: .1, links: .5, wave: .5, streaks: .12, sparkle: 1.1,
        calm: [[100, 120, 1800, 410, .85], [110, 480, 640, 860, .75], [1190, 420, 1810, 920, .75]] },
      { dim: .16, warm: .35, travel: .2, links: .3, wave: .35, streaks: .1, sparkle: .8, offset: [110, -260],
        calm: [[100, 120, 1300, 700, .9], [100, 740, 1820, 920, .85]] },
    ],
    html: `
      <!-- stop 1: Riyadh from above rises in behind a plum veil -->
      <div class="wy-city" data-in="1" style="--d:.18s">
        <div class="wy-plate amb-ken-strong">
          <div class="photo wy-photo" style="background-image:url('assets/photos/riyadh-aerial.jpg')"></div>
          <div class="wy-glints">${GLINTS.map(([x, y, s], i) => `<i style="left:${x}px;top:${y}px;--s:${s};animation-delay:${(-i * 1.37).toFixed(2)}s;animation-duration:${(3.6 + (i % 4) * .9).toFixed(1)}s"></i>`).join('')}</div>
        </div>
        <div class="amb-leak wy-leak"></div>
      </div>
      <div class="fill wy-veil a-fade" data-in="1" style="--dur:.8s"></div>

      <!-- stop 0: the header and the flow; at stop 1 they drift up and away -->
      <div class="wy-rise">
        <div class="pad wy-head">
          <div class="kicker a-wipe" data-in="0" style="--d:.1s">Why it matters</div>
          <h2 class="h2 wy-st" data-in="0" data-split style="--d:.12s;--wstep:.045s">Employee recognition becomes organisational value <em class="hl">when the story is shared.</em></h2>
          <p class="wy-cav" data-in="0" style="--d:.62s">Retention remains a possible long-term effect — not a direct outcome of the pilot.</p>
        </div>

        <div class="wy-flow">
          <!-- the shared story's glow pool, and the individual's halo -->
          <i class="wy-pool a-fade" data-in="0" style="--d:.5s;--dur:1.2s;left:${PRISM.x - 420}px;top:${FY - 380}px"></i>
          <div class="wy-halo a-fade" data-in="0" style="--d:.45s;--dur:1.2s;left:${LIGHT_X - 230}px;top:${FY - 230}px"><i></i><b></b></div>

          <!-- node → prism: the connector draws behind the story light -->
          <svg class="wy-wire a-wipe" data-in="0" viewBox="${NODE.x + NODE.r} ${FY - 10} ${PRISM.x - PRISM.r - NODE.x - NODE.r} 20" style="--d:.66s;--dur:.35s;${box(NODE.x + NODE.r, FY - 10, PRISM.x - PRISM.r - NODE.x - NODE.r, 20)}" aria-hidden="true">
            <defs><linearGradient id="wyWire" gradientUnits="userSpaceOnUse" x1="${NODE.x + NODE.r}" y1="0" x2="${PRISM.x - PRISM.r}" y2="0"><stop offset="0" stop-color="#25C7BC" stop-opacity=".45"/><stop offset="1" stop-color="#25C7BC"/></linearGradient></defs>
            <path d="M${NODE.x + NODE.r} ${FY} L${PRISM.x - PRISM.r} ${FY}"/>
          </svg>
          <div class="wy-wflow a-wipe" data-in="0" style="--d:.66s;--dur:.35s;${box(NODE.x + NODE.r, FY - 10, PRISM.x - PRISM.r - NODE.x - NODE.r, 20)}" aria-hidden="true"><i></i></div>

          <!-- two broad beams (teal → queen blue: the organisation benefits, never a gap) -->
          <svg class="wy-beams a-wipe" data-in="0" ${beamBox};--d:.86s;--dur:.6s" aria-hidden="true">
            <defs>
              <linearGradient id="wyBeamFill" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X1}" y2="0">
                <stop offset="0" stop-color="#25C7BC" stop-opacity=".66"/><stop offset=".5" stop-color="#25C7BC" stop-opacity=".28"/><stop offset="1" stop-color="#8FC2DC" stop-opacity=".16"/>
              </linearGradient>
              <linearGradient id="wyBeamLine" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X1}" y2="0">
                <stop offset="0" stop-color="#25C7BC"/><stop offset="1" stop-color="#8FC2DC"/>
              </linearGradient>
            </defs>
            <path class="w" d="${wedgeA}"/><path class="w" d="${wedgeB}"/>
            <path class="e" d="${edgeA}"/><path class="e" d="${innerA}"/>
            <path class="e" d="${edgeB}"/><path class="e" d="${innerB}"/>
            <path class="c" d="${coreA}"/><path class="c" d="${coreB}"/>
          </svg>
          <!-- living light along the beam cores -->
          <div class="wy-bflow a-wipe" data-in="0" style="${box(X0, BAND[0], X1 - X0, BAND[1] - BAND[0])};--d:.86s;--dur:.6s" aria-hidden="true">${flow(coreA, X0, BAND[0], 28, 28 / 1.5)}${flow(coreB, X0, BAND[0], 28, 28 / 1.5).replace(/animation-delay:(-?[\d.]+)s/g, (m, d) => `animation-delay:${(+d - .7).toFixed(3)}s`)}</div>

          <!-- ambient: light washes out through both beams, stories ride them -->
          <div class="wy-glint a-fade" data-in="0" style="${box(X0, BAND[0], X1 - X0, BAND[1] - BAND[0])};--d:1.35s;--dur:.5s;clip-path:path('${local(wedgeA)} ${local(wedgeB)}')" aria-hidden="true"><i></i></div>
          <div class="wy-dots a-fade" data-in="0" style="--d:1.3s;--dur:.5s">
            ${dots(feed, 2, 2.2, 'in')}
            ${dots(coreA, 4, 4.4)}
            ${dots(coreB, 4, 4.4, '', .5)}
            ${dots(mid(-16, (LAND_A[0] + midA) / 2 - 8), 2, 5.6, 'sm', .3)}
            ${dots(mid(16, (LAND_B[1] + midB) / 2 + 8), 2, 5.6, 'sm', .8)}
          </div>

          <!-- 01 · the individual -->
          <div class="glass wy-card wy-emp a-unfold amb-sheen" data-in="0" style="--d:.3s;--dur:.9s;${box(EMP.x, EMP.top, EMP.w, EMP.h)};--sh:-.4s">
            <div class="wy-card-h"><span class="wy-num">01</span></div>
            <h3 class="wy-card-t">Employee level</h3>
            <ul class="wy-list" data-stagger style="--stagger:.06s;--d:.46s">${EMPL.map((t) => `<li data-in="0">${t}</li>`).join('')}</ul>
          </div>

          <div class="wy-node a-materialize" data-in="0" style="--d:.42s;--dur:.9s;${box(NODE.x - NODE.r, FY - NODE.r, NODE.r * 2, NODE.r * 2)}">
            <span class="wy-rips"><b></b><b></b></span>
            <span class="wy-node-sq">${Deck.icon('employee-male', 'wy-node-ic')}</span>
          </div>

          <div class="wy-prism a-materialize" data-in="0" style="--d:.6s;--dur:.9s;${box(PRISM.x - PRISM.r, FY - PRISM.r, PRISM.r * 2, PRISM.r * 2)}">
            <span class="wy-prism-ring"><i></i></span>
            <span class="wy-prism-glow"></span>
            <span class="wy-prism-t">Shared<br>story</span>
          </div>
          <!-- the spark lands above the shared story as the story light passes through it -->
          <i class="wy-prism-mark" data-spark="0" data-spark-xy="${PRISM.x},${FY - PRISM.r - 40}" data-spark-delay=".82"></i>

          <!-- the build light: one light in, two lights out (live clicks only) -->
          <i class="light wy-run" style="offset-path:path('${run(midA, -6)}')"></i>
          <i class="light wy-run" style="offset-path:path('${run(midB, 6)}')"></i>

          <!-- 02 · the organisation -->
          ${ORG.map((o) => `
          <div class="glass wy-card wy-org ${o.cls} a-unfold amb-sheen" data-in="0" style="--d:${o.d}s;--dur:.75s;${box(X1, o.y[0], 1776 - X1, o.y[1] - o.y[0])};--sh:${o.sh}">
            <div class="wy-card-h"><span class="wy-num">${o.k}</span></div>
            <h3 class="wy-card-t">${o.label}</h3>
            <ul class="wy-list">${o.items.map((t) => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="wy-port a-materialize" data-in="0" style="--d:${o.d + .12}s;--dur:.7s;${box(X1 - 38, (o.y[0] + o.y[1]) / 2 - 38, 76, 76)}">${Deck.icon(o.icon, 'wy-port-ic')}</div>`).join('')}
        </div>
      </div>

      <!-- stop 1: strategic value. Key: the statement; then the purpose line (the spark
           lands after it); the six values and the three outcomes are supporting context -->
      <div class="pad wy-sv">
        <div class="kicker a-wipe" data-in="1" style="--d:.45s">Strategic value</div>
        <h2 class="h2 wy-sv-st" data-in="1" data-split style="--d:.45s;--wstep:.035s">The initiative does not create new <span class="wy-nw">values —</span> it helps employees recognise and apply <em class="hl">the values Tahakom already has.</em></h2>
        <p class="wy-purp" data-in="1" style="--d:.85s">Every story shows how daily work serves Tahakom’s purpose: <em class="wy-pp" data-spark="1" data-spark-at="r" data-spark-delay="1.25"><span class="amb-shimmer">Urban Intelligence for a Better Life.</span></em></p>
      </div>
      <div class="wy-chips" data-stagger style="--stagger:.06s;--d:1s">
        ${VALUES.map((v, i) => `<span class="wy-chip glass a-flip" data-in="1" style="--k:${i}"><i></i>${v}</span>`).join('')}
      </div>
      <div class="wy-pillars" data-stagger style="--stagger:.1s;--d:1.12s">
        ${PILLARS.map((p, i) => `<div class="wy-p glass plum a-unfold" data-in="1" style="--dur:.8s"><div class="wy-p-h"><span class="num">${String(i + 1).padStart(2, '0')}</span><span class="wy-p-r"><i></i><b></b></span></div><div class="wy-p-t">${p}</div></div>`).join('')}
      </div>

      <!-- the lights' sampled paths (generated above, as the flow's markup was built) -->
      <style>${KF.join('\n')}</style>
    `,
    step(n, prev, ctx) {
      // the travelling lights are one-shot builds on live clicks: the story's run
      // through the flow as the scene arrives (stop 0), the leading lights on the
      // outcome rules (stop 1). Their resting state is invisible, so any stop reached
      // another way (a jump, or back) looks the same.
      const el = ctx.el, live = !ctx.instant;
      el.classList.remove('wy-run-in', 'wy-sv-live');
      void el.offsetWidth;
      if (live && n === 0 && prev === -1) {
        el.classList.add('wy-run-in');
        // a ripple leaves the shared story as the light passes through it
        ctx.after(1560, () => window.Field && Field.burst(PRISM.x, FY, { radius: 760, dur: 1.8 }));
      }
      // stop 1 is a camera rise: the world streaks up past the lens
      if (live && n === 1 && prev === 0) {
        el.classList.add('wy-sv-live');   // the outcome rules draw behind a leading light
        if (window.Field) { Field.warp('up', 1.3, .9); Field.kick(0, -200, 1.9); }
      }
    },
  });

  // arc-length sampler for an absolute M/L/C path: point and heading (deg) at a distance along
  // it; past either end it carries on along the end's tangent
  function sampler(d) {
    const tk = d.match(/[MLC]|-?[\d.]+/g), pts = [];
    let cmd = 'M', cur = [0, 0];
    for (let i = 0; i < tk.length;) {
      if (/[MLC]/.test(tk[i])) { cmd = tk[i++]; continue; }
      const n = (k) => +tk[i + k];
      if (cmd === 'M') { cur = [n(0), n(1)]; pts.push(cur); i += 2; }
      else if (cmd === 'L') { const p = [n(0), n(1)], a = cur; for (let k = 1; k <= 24; k++) pts.push([a[0] + (p[0] - a[0]) * k / 24, a[1] + (p[1] - a[1]) * k / 24]); cur = p; i += 2; }
      else { const a = cur, b = [n(0), n(1)], c = [n(2), n(3)], e = [n(4), n(5)];
        for (let k = 1; k <= 120; k++) { const u = k / 120, w = 1 - u; pts.push([0, 1].map((j) => w * w * w * a[j] + 3 * w * w * u * b[j] + 3 * w * u * u * c[j] + u * u * u * e[j])); }
        cur = e; i += 6; }
    }
    const acc = [0];
    for (let k = 1; k < pts.length; k++) acc.push(acc[k - 1] + Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]));
    const L = acc[acc.length - 1], last = pts.length - 1;
    const dir = (k0, k1) => Math.atan2(pts[k1][1] - pts[k0][1], pts[k1][0] - pts[k0][0]);
    const at = (s) => {
      if (s <= 0) { const t = dir(0, 1); return { x: pts[0][0] + s * Math.cos(t), y: pts[0][1] + s * Math.sin(t), a: t * 180 / Math.PI }; }
      if (s >= L) { const t = dir(last - 1, last); return { x: pts[last][0] + (s - L) * Math.cos(t), y: pts[last][1] + (s - L) * Math.sin(t), a: t * 180 / Math.PI }; }
      let lo = 0, hi = last;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (acc[m] < s) lo = m; else hi = m; }
      const f = (s - acc[lo]) / (acc[hi] - acc[lo] || 1);
      return { x: pts[lo][0] + (pts[hi][0] - pts[lo][0]) * f, y: pts[lo][1] + (pts[hi][1] - pts[lo][1]) * f, a: dir(lo, hi) * 180 / Math.PI };
    };
    return { L, at };
  }
  // a CSS cubic-bezier() as a function of time
  function bezier(x1, y1, x2, y2) {
    const B = (a, b, t) => 3 * a * (1 - t) * (1 - t) * t + 3 * b * (1 - t) * t * t + t * t * t;
    return (x) => {
      let lo = 0, hi = 1;
      for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (B(x1, x2, m) < x) lo = m; else hi = m; }
      return B(y1, y2, (lo + hi) / 2);
    };
  }
})();
