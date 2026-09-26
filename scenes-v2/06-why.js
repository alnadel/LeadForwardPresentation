/* 06 · Why it matters (v2) — one scene, three stops. Enters through the act III
   chapter card: the line of light splits open from the centre, so stop 0 builds
   from the middle outwards — the shared story first, then the individual and the
   organisation, the headline as the opening reaches the top.
   0  The prism flow at full scale: the employee's glass card and node, the story
      light travels into the glowing "shared story" squircle and leaves as two teal
      beams that reach the organisation's two glass cards (02A, 02B).
   1  The link statement and the retention caveat; the story passes through again
      and the shared story brightens while the cards step back.
   2  An in-scene camera rise: the flow drifts up and away, Riyadh from above rises
      in behind a plum veil, with the STRATEGIC VALUE statement, the six values as
      glass tiles lighting in turn and the three outcomes as glass cards.
   Ambient: light washes and flows along the beams, stories ride them, ripples
   leave the employee node, the shared story breathes in its glow pool and a light
   runs round its rim; at stop 2 the city drifts and shimmers under a light leak. */
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
  const EMP = { x: 144, w: 470, top: FY - 170, h: 340 };
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

  const dots = (path, n, dur, cls, off) => Array.from({ length: n }, (_, i) =>
    `<i class="wy-dot ${cls || ''}" style="offset-path:path('${path}');animation-duration:${dur}s;animation-delay:${(-(i + (off || 0)) * dur / n).toFixed(2)}s"></i>`).join('');
  const box = (l, t, w, h) => `left:${l}px;top:${t}px;width:${w}px;height:${h}px`;
  const beamBox = `viewBox="${X0} ${BAND[0]} ${X1 - X0} ${BAND[1] - BAND[0]}" style="${box(X0, BAND[0], X1 - X0, BAND[1] - BAND[0])}`;

  const EMPL = ['Feel seen and valued', 'Stay motivated to contribute', 'Participate, nominate and share', 'Learn from colleagues'];
  const ORG = [
    { k: '02A', cls: 'wy-a', y: CARD_A, icon: 'users-connected', label: 'Org: Culture &amp; values', items: ['Stronger recognition culture', 'Tahakom’s values shown in action'], d: .72, sh: '-1.6s' },
    { k: '02B', cls: 'wy-b', y: CARD_B, icon: 'handshake', label: 'Org: Engagement &amp; experience', items: ['Higher engagement and collaboration', 'Stronger employee experience'], d: .82, sh: '-3.3s' },
  ];

  const VALUES = ['Commitment', 'Collaboration', 'Innovation', 'Impact', 'Learning', 'Excellence'];
  const PILLARS = ['Purpose connected to work', 'Values become visible', 'Learning moves across teams'];
  // city lights that shimmer over the photo (stage px, on its bright districts)
  const GLINTS = [[1560, 575, 1], [1742, 338, .8], [1640, 282, .7], [1402, 500, .8], [1286, 222, .6], [1208, 655, .7], [1812, 842, .9], [1700, 470, .9], [1480, 350, .6], [1860, 610, .8],
    [1590, 640, 1.4], [1740, 700, 1.5], [1450, 625, 1.2], [1325, 752, 1.1], [1680, 800, 1.3], [1850, 735, 1.2], [1530, 715, 1.1], [1395, 680, 1], [1060, 845, .8], [800, 868, .7], [1150, 560, .6], [1500, 240, .7]];

  Deck.scene({
    id: 'why',
    title: 'Why it matters',
    act: 2,
    bg: 'night',
    transition: 'chapter',
    cues: ['Recognition creates value at two connected levels · the prism flow', 'Becomes organisational value when the story is shared · retention caveat', 'Strategic value · over Riyadh · the values Tahakom already has'],
    holds: [10, 8, 10],
    notes: [
      'Why does this matter to Tahakom, not only to the person recognised? Recognition creates value at two connected levels: the employee feels seen and motivated; once the story is shared, the organisation gains culture and engagement.',
      'So employee recognition becomes organisational value when the story is shared. One honest caveat: retention may follow in the long term, but it is not a direct outcome of the pilot, and we will not claim it.',
      'The key point: we are not inventing new values. The initiative helps employees recognise and apply the values Tahakom already has, so the culture behind the strategy is easier to see in everyday work.',
    ],
    field: [
      { dim: .28, lit: 0, travel: .3, offset: [170, -80], warm: .1, links: .5, wave: .5, streaks: .12, sparkle: 1.1,
        calm: [[100, 120, 1800, 300, .8], [110, 480, 640, 860, .75], [1190, 420, 1810, 920, .75]] },
      { dim: .3, calm: [[100, 120, 1800, 410, .85], [110, 480, 640, 860, .75], [1190, 420, 1810, 920, .75]] },
      { dim: .16, warm: .35, travel: .2, links: .3, wave: .35, streaks: .1, sparkle: .8, offset: [110, -260],
        calm: [[100, 120, 1300, 680, .9], [100, 740, 1820, 920, .85]] },
    ],
    html: `
      <!-- stop 2: Riyadh from above rises in behind a plum veil -->
      <div class="wy-city" data-in="2" style="--d:.18s">
        <div class="wy-plate amb-ken-strong">
          <div class="photo wy-photo" style="background-image:url('assets/photos/riyadh-aerial.jpg')"></div>
          <div class="wy-glints">${GLINTS.map(([x, y, s], i) => `<i style="left:${x}px;top:${y}px;--s:${s};animation-delay:${(-i * 1.37).toFixed(2)}s;animation-duration:${(3.6 + (i % 4) * .9).toFixed(1)}s"></i>`).join('')}</div>
        </div>
        <div class="amb-leak wy-leak"></div>
      </div>
      <div class="fill wy-veil a-fade" data-in="2" style="--dur:.8s"></div>

      <!-- stops 0–1: the header and the flow; at stop 2 they drift up and away -->
      <div class="wy-rise">
        <div class="pad wy-head">
          <div class="kicker a-wipe" data-in="0" style="--d:.28s">Why it matters</div>
          <div class="wy-swap">
            <h2 class="h2 wy-h" data-in="0" data-out="1" data-split style="--d:.32s">Recognition creates value at two connected levels.</h2>
            <div class="wy-final">
              <h2 class="h2 wy-st" data-in="1" data-split style="--d:.2s">Employee recognition becomes organisational value <em class="hl">when the story is shared.</em></h2>
              <p class="wy-cav" data-in="1" style="--d:.75s">Retention remains a possible long-term effect — not a direct outcome of the pilot.</p>
            </div>
          </div>
        </div>

        <div class="wy-flow">
          <!-- the shared story's glow pool, and the individual's halo -->
          <i class="wy-pool a-fade" data-in="0" style="--d:.05s;--dur:1s;left:${PRISM.x - 420}px;top:${FY - 380}px"></i>
          <div class="wy-halo a-fade" data-in="0" style="--d:.35s;--dur:1.2s;left:${LIGHT_X - 230}px;top:${FY - 230}px"><i></i><b></b></div>

          <!-- node → prism: the connector draws behind the story light -->
          <svg class="wy-wire a-wipe" data-in="0" viewBox="${NODE.x + NODE.r} ${FY - 10} ${PRISM.x - PRISM.r - NODE.x - NODE.r} 20" style="--d:.55s;--dur:.35s;${box(NODE.x + NODE.r, FY - 10, PRISM.x - PRISM.r - NODE.x - NODE.r, 20)}" aria-hidden="true">
            <defs><linearGradient id="wyWire" gradientUnits="userSpaceOnUse" x1="${NODE.x + NODE.r}" y1="0" x2="${PRISM.x - PRISM.r}" y2="0"><stop offset="0" stop-color="#25C7BC" stop-opacity=".45"/><stop offset="1" stop-color="#25C7BC"/></linearGradient></defs>
            <path d="M${NODE.x + NODE.r} ${FY} L${PRISM.x - PRISM.r} ${FY}"/>
            <path class="f" d="M${NODE.x + NODE.r} ${FY} L${PRISM.x - PRISM.r} ${FY}"/>
          </svg>

          <!-- two broad beams (teal → queen blue: the organisation benefits, never a gap) -->
          <svg class="wy-beams a-wipe" data-in="0" ${beamBox};--d:.72s;--dur:.6s" aria-hidden="true">
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
            <path class="f" d="${coreA}"/><path class="f f2" d="${coreB}"/>
          </svg>

          <!-- ambient: light washes out through both beams, stories ride them -->
          <svg class="wy-glint a-fade" data-in="0" ${beamBox};--d:1.05s;--dur:.5s" aria-hidden="true">
            <defs><linearGradient id="wyGlint" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X1}" y2="0"><stop offset="0" stop-color="#03FFCB" stop-opacity=".6"/><stop offset="1" stop-color="#25C7BC" stop-opacity=".38"/></linearGradient></defs>
            <path d="${wedgeA}"/><path d="${wedgeB}"/>
          </svg>
          <div class="wy-dots a-fade" data-in="0" style="--d:1s;--dur:.5s">
            ${dots(feed, 2, 2.2, 'in')}
            ${dots(coreA, 4, 4.4)}
            ${dots(coreB, 4, 4.4, '', .5)}
            ${dots(mid(-16, (LAND_A[0] + midA) / 2 - 8), 2, 5.6, 'sm', .3)}
            ${dots(mid(16, (LAND_B[1] + midB) / 2 + 8), 2, 5.6, 'sm', .8)}
          </div>

          <!-- 01 · the individual -->
          <div class="glass wy-card wy-emp a-unfold amb-sheen" data-in="0" style="--d:.2s;--dur:.9s;${box(EMP.x, EMP.top, EMP.w, EMP.h)};--sh:-.4s">
            <div class="wy-card-h"><span class="wy-num">01</span><span class="label">Employee level</span></div>
            <ul class="wy-list" data-stagger style="--stagger:.07s;--d:.36s">${EMPL.map((t) => `<li data-in="0">${t}</li>`).join('')}</ul>
          </div>

          <div class="wy-node a-materialize" data-in="0" style="--d:.3s;--dur:.9s;${box(NODE.x - NODE.r, FY - NODE.r, NODE.r * 2, NODE.r * 2)}">
            <span class="wy-rips"><b></b><b></b></span>
            <span class="wy-node-sq">${Deck.icon('employee-male', 'wy-node-ic')}</span>
          </div>
          <i class="wy-home" data-spark="0" data-spark-xy="${LIGHT_X},${FY}" data-spark-delay=".4"></i>

          <div class="wy-prism a-materialize" data-in="0" style="--d:.08s;--dur:.9s;${box(PRISM.x - PRISM.r, FY - PRISM.r, PRISM.r * 2, PRISM.r * 2)}">
            <span class="wy-prism-ring"></span>
            <span class="wy-prism-glow"></span>
            <span class="wy-prism-t">Shared<br>story</span>
          </div>
          <i class="wy-prism-mark" data-spark="1" data-spark-xy="${PRISM.x},${FY - PRISM.r - 38}"></i>

          <!-- the build light: one light in, two lights out (live clicks only) -->
          <i class="light wy-run" style="offset-path:path('${run(midA, -6)}')"></i>
          <i class="light wy-run" style="offset-path:path('${run(midB, 6)}')"></i>

          <!-- 02 · the organisation -->
          ${ORG.map((o) => `
          <div class="glass wy-card wy-org ${o.cls} a-unfold amb-sheen" data-in="0" style="--d:${o.d}s;--dur:.75s;${box(X1, o.y[0], 1776 - X1, o.y[1] - o.y[0])};--sh:${o.sh}">
            <div class="wy-card-h"><span class="wy-num">${o.k}</span><span class="label">${o.label}</span></div>
            <ul class="wy-list">${o.items.map((t) => `<li>${t}</li>`).join('')}</ul>
          </div>
          <div class="wy-port a-materialize" data-in="0" style="--d:${o.d + .12}s;--dur:.7s;${box(X1 - 38, (o.y[0] + o.y[1]) / 2 - 38, 76, 76)}">${Deck.icon(o.icon, 'wy-port-ic')}</div>`).join('')}
        </div>
      </div>

      <!-- stop 2: strategic value -->
      <div class="pad wy-sv">
        <div class="kicker a-wipe" data-in="2" style="--d:.5s">Strategic value</div>
        <h2 class="h2 wy-sv-st" data-in="2" data-split style="--d:.55s;--wstep:.04s">The initiative does not create new <span class="wy-nw">values —</span> it helps employees recognise and apply <em class="hl">the values Tahakom already has.</em></h2>
      </div>
      <div class="wy-chips" data-stagger style="--stagger:.07s;--d:.8s">
        ${VALUES.map((v, i) => `<span class="wy-chip glass a-flip" data-in="2" style="--k:${i}"${i === 0 ? ' data-spark="2" data-spark-delay=".75"' : ''}><i></i>${v}</span>`).join('')}
      </div>
      <div class="wy-pillars" data-stagger style="--stagger:.1s;--d:1.02s">
        ${PILLARS.map((p, i) => `<div class="wy-p glass plum a-unfold" data-in="2" style="--dur:.8s"><div class="wy-p-h"><span class="num">${String(i + 1).padStart(2, '0')}</span><i></i></div><div class="wy-p-t">${p}</div></div>`).join('')}
      </div>
    `,
    step(n, prev, ctx) {
      // the travelling lights are one-shot builds on live clicks: into stop 0 (the
      // whole flow builds) and into stop 1 (the story passes through again). Their
      // resting state is invisible, so any stop reached another way looks the same.
      const el = ctx.el, live = !ctx.instant;
      el.classList.remove('wy-run-in', 'wy-pulse');
      void el.offsetWidth;
      if (live && n === 0 && prev === -1) {
        el.classList.add('wy-run-in');
        ctx.after(520, () => window.Field && Field.burst(PRISM.x, FY, { radius: 760, dur: 1.8 }));
      }
      if (live && n === 1 && prev === 0) el.classList.add('wy-pulse');
      // stop 2 is a camera rise: the world streaks up past the lens
      if (live && n === 2 && prev === 1 && window.Field) { Field.warp('up', 1.3, .9); Field.kick(0, -200, 1.9); }
    },
  });
})();
