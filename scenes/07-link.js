/* 07 · The link — a prism flow, left to right. One small node (the individual)
   passes its story through a "shared story" squircle, and it leaves as two broad
   beams that reach the organisation. The growing scale carries the idea:
   76px person → 140px shared story → beams 470px broad. */
(function () {
  // Geometry in stage px. The flow runs along y = FY.
  const FY = 685;
  const NODE = { x: 680, r: 38 };          // the individual: 76px squircle
  const PRISM = { x: 870, r: 70 };         // shared story: 140px squircle
  const X0 = PRISM.x + PRISM.r;            // beams leave the prism's right face (940)
  const X1 = 1210;                         // …and land on the org cards' left edge
  const CARD_A = [450, 664], CARD_B = [706, 920];
  const LIGHT_X = NODE.x + NODE.r + 22;    // where the story light waits (740)
  const BAND = [440, 930];                 // the diagram's vertical band

  const cx1 = X0 + 118, cx2 = X1 - 116;
  const midA = (CARD_A[0] + CARD_A[1]) / 2, midB = (CARD_B[0] + CARD_B[1]) / 2;
  const curve = (y0, y1) => `M${X0} ${y0} C${cx1} ${y0} ${cx2} ${y1} ${X1} ${y1}`;
  // each beam is a wedge: narrow at the prism, as tall as its card at the far end
  const edgeA = curve(FY - 24, CARD_A[0]), innerA = curve(FY, CARD_A[1]);
  const edgeB = curve(FY + 24, CARD_B[1]), innerB = curve(FY, CARD_B[0]);
  const coreA = curve(FY, midA), coreB = curve(FY, midB);
  const wedge = (y0a, y1a, y1b, y0b) => `M${X0} ${y0a} C${cx1} ${y0a} ${cx2} ${y1a} ${X1} ${y1a} L${X1} ${y1b} C${cx2} ${y1b} ${cx1} ${y0b} ${X0} ${y0b} Z`;
  const wedgeA = wedge(FY - 24, CARD_A[0], CARD_A[1], FY);
  const wedgeB = wedge(FY, CARD_B[0], CARD_B[1], FY + 24);
  // the build light: node → through the prism → out along one beam (two copies split)
  const run = (mid) => `M${LIGHT_X} ${FY} L${X0} ${FY} C${cx1} ${FY} ${cx2} ${mid} ${X1} ${mid}`;
  // ambient: a story enters the prism; stories ride each beam
  const feed = `M${LIGHT_X} ${FY} L${PRISM.x - 16} ${FY}`;

  const dots = (path, n, dur, cls) => Array.from({ length: n }, (_, i) =>
    `<i class="lk-dot ${cls || ''}" style="offset-path:path('${path}');animation-duration:${dur}s;animation-delay:${(-i * dur / n).toFixed(2)}s"></i>`).join('');
  const box = (l, t, w, h) => `left:${l}px;top:${t}px;width:${w}px;height:${h}px`;
  const beamBox = `viewBox="${X0} ${BAND[0]} ${X1 - X0} ${BAND[1] - BAND[0]}" style="${box(X0, BAND[0], X1 - X0, BAND[1] - BAND[0])}`;

  const EMP = ['Feel seen and valued', 'Stay motivated to contribute', 'Participate, nominate and share', 'Learn from colleagues'];
  const ORG = [
    { k: '02A', cls: 'lk-a', y: CARD_A, icon: 'users-connected', label: 'Org: Culture &amp; values', items: ['Stronger recognition culture', 'Tahakom’s values shown in action'], d: .62 },
    { k: '02B', cls: 'lk-b', y: CARD_B, icon: 'hands-teamwork', label: 'Org: Engagement &amp; experience', items: ['Higher engagement and collaboration', 'Stronger employee experience'], d: .76 },
  ];

  Deck.scene({
    id: 'link',
    title: 'The link',
    act: 2,
    bg: 'night',
    cues: ['Recognition creates value at two levels', '01 · Employee level', 'Shared story · two beams to the organisation', 'Recognition becomes organisational value'],
    notes: [
      'Why does this matter to Tahakom, and not only to the person being recognised? Because recognition creates value at two connected levels. The employee experiences it. Tahakom benefits when the behaviour becomes visible and can be repeated.',
      'Start with the individual. When a colleague is recognised, they feel seen and valued, and they stay motivated to contribute. They are more likely to take part, to nominate and to share, and they learn from the people around them.',
      'The link is the shared story. When that one moment is shared, it reaches the organisation in two ways. First, culture and values: a stronger recognition culture, with Tahakom’s values shown in action. Second, engagement and experience: more engagement and collaboration, and a stronger employee experience.',
      'So this is the link: employee recognition becomes organisational value when the story is shared. One honest caveat. Retention may follow in the long term, but it is not a direct outcome of the pilot, and we will not claim it as one.',
    ],
    field: [
      { dim: .26, lit: 0, travel: 0, offset: [170, -80], warm: .1,
        calm: [[100, 120, 1800, 420, .85], [110, 480, 640, 880, .75], [1180, 430, 1810, 940, .75]] },
      {},
      { dim: .3 },
      { dim: .32 },
    ],
    html: `
      <div class="pad lk-head">
        <div class="kicker" data-in="0">The link</div>
        <div class="lk-swap">
          <div class="lk-intro" data-out="3">
            <h2 class="h2 lk-h" data-in="0" data-split style="--d:.15s">Recognition creates value at two connected levels.</h2>
            <p class="lk-sub" data-in="0" style="--d:.7s">The employee experiences the recognition; Tahakom benefits when the behaviour becomes visible and repeatable.</p>
          </div>
          <div class="lk-final">
            <h2 class="h2 lk-st" data-in="3" data-split style="--d:.3s">Employee recognition becomes organisational value <em class="hl">when the story is shared.</em></h2>
            <p class="lk-cav" data-in="3" style="--d:.95s">Retention remains a possible long-term effect — not a direct outcome of the pilot.</p>
          </div>
        </div>
      </div>

      <!-- the individual's light breathes in a soft halo -->
      <div class="lk-halo a-fade" data-in="0" style="--d:1s;--dur:1.6s;left:${LIGHT_X - 190}px;top:${FY - 190}px"><i></i><b></b></div>

      <!-- the flow skeleton, faint until the story passes through it -->
      <svg class="lk-ghost a-fade" data-in="0" data-out="2" style="--d:.9s;--dur:1.2s" viewBox="0 0 1920 1080" aria-hidden="true">
        <path d="M${NODE.x + NODE.r} ${FY} L${PRISM.x - PRISM.r} ${FY}"/>
        <path d="${edgeA}"/><path d="${edgeB}"/>
        <path class="c" d="${coreA}"/><path class="c" d="${coreB}"/>
      </svg>

      <!-- the lit connector: node → prism -->
      <svg class="lk-wire a-wipe" data-in="2" viewBox="${NODE.x + NODE.r} ${FY - 10} ${PRISM.x - PRISM.r - NODE.x - NODE.r} 20" style="--dur:.45s;${box(NODE.x + NODE.r, FY - 10, PRISM.x - PRISM.r - NODE.x - NODE.r, 20)}" aria-hidden="true">
        <defs><linearGradient id="lkWire" gradientUnits="userSpaceOnUse" x1="${NODE.x + NODE.r}" y1="0" x2="${PRISM.x - PRISM.r}" y2="0"><stop offset="0" stop-color="#25C7BC" stop-opacity=".45"/><stop offset="1" stop-color="#25C7BC"/></linearGradient></defs>
        <path d="M${NODE.x + NODE.r} ${FY} L${PRISM.x - PRISM.r} ${FY}"/>
      </svg>

      <!-- two broad beams (teal → purple) -->
      <svg class="lk-beams a-wipe" data-in="2" ${beamBox};--d:.4s;--dur:1s" aria-hidden="true">
        <defs>
          <linearGradient id="lkBeamFill" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X1}" y2="0">
            <stop offset="0" stop-color="#25C7BC" stop-opacity=".6"/><stop offset=".5" stop-color="#5FB9C2" stop-opacity=".22"/><stop offset="1" stop-color="#C9A6D3" stop-opacity=".16"/>
          </linearGradient>
          <linearGradient id="lkBeamLine" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X1}" y2="0">
            <stop offset="0" stop-color="#25C7BC"/><stop offset="1" stop-color="#C9A6D3"/>
          </linearGradient>
        </defs>
        <path class="w" d="${wedgeA}"/><path class="w" d="${wedgeB}"/>
        <path class="e" d="${edgeA}"/><path class="e" d="${innerA}"/>
        <path class="e" d="${edgeB}"/><path class="e" d="${innerB}"/>
        <path class="c" d="${coreA}"/><path class="c" d="${coreB}"/>
      </svg>

      <!-- ambient: a slow glint travels out through both beams, stories ride them -->
      <svg class="lk-glint a-fade" data-in="2" ${beamBox};--d:1.4s;--dur:1s" aria-hidden="true">
        <defs><linearGradient id="lkGlint" gradientUnits="userSpaceOnUse" x1="${X0}" y1="0" x2="${X1}" y2="0"><stop offset="0" stop-color="#03FFCB" stop-opacity=".5"/><stop offset="1" stop-color="#C9A6D3" stop-opacity=".35"/></linearGradient></defs>
        <path d="${wedgeA}"/><path d="${wedgeB}"/>
      </svg>
      <div class="lk-flow a-fade" data-in="2" style="--d:1.3s;--dur:1s">
        ${dots(feed, 1, 2.6, 'in')}
        ${dots(coreA, 3, 5.1)}
        ${dots(coreB, 3, 5.1)}
      </div>

      <!-- 01 · the individual -->
      <div class="lk-emp-wrap" style="${box(144, BAND[0], NODE.x - NODE.r - 24 - 144, BAND[1] - BAND[0])}">
        <div class="card lk-card lk-emp a-left" data-in="1" style="--d:.1s">
          <div class="lk-num teal">01</div>
          <div class="label lk-lab">Employee level</div>
          <ul class="lk-list" data-stagger style="--stagger:.09s;--d:.35s">${EMP.map((t) => `<li data-in="1">${t}</li>`).join('')}</ul>
        </div>
      </div>

      <div class="lk-node a-pop" data-in="0" style="--d:.8s;${box(NODE.x - NODE.r, FY - NODE.r, NODE.r * 2, NODE.r * 2)}">
        <span class="lk-node-sq">${Deck.icon('employee-male', 'lk-node-ic')}</span>
      </div>
      <span class="lk-home a-fade" data-in="0" style="--d:1.1s;${box(LIGHT_X - 15, FY - 15, 30, 30)}"><span class="lk-rips"><b></b><b></b></span><i class="light"></i></span>

      <div class="lk-prism a-scale" data-in="0" style="--d:1s;${box(PRISM.x - PRISM.r, FY - PRISM.r, PRISM.r * 2, PRISM.r * 2)}">
        <span class="lk-prism-glow"></span>
        <span class="lk-prism-t">Shared<br>story</span>
      </div>

      <!-- the build light: one light in, two lights out (plays on the live click into stop 2) -->
      <i class="light lk-run" style="offset-path:path('${run(midA)}')"></i>
      <i class="light lk-run" style="offset-path:path('${run(midB)}')"></i>

      <!-- 02 · the organisation -->
      ${ORG.map((o) => `
      <div class="card lk-card lk-org ${o.cls} a-right" data-in="2" style="--d:${o.d}s;${box(X1, o.y[0], 1776 - X1, o.y[1] - o.y[0])}">
        <div class="lk-num purple">${o.k}</div>
        <div class="label lk-lab">${o.label}</div>
        <ul class="lk-list">${o.items.map((t) => `<li>${t}</li>`).join('')}</ul>
      </div>
      <div class="lk-port a-pop" data-in="2" style="--d:${o.d + .15}s;${box(X1 - 32, (o.y[0] + o.y[1]) / 2 - 32, 64, 64)}">${Deck.icon(o.icon, 'lk-port-ic')}</div>`).join('')}
    `,
    step(n, prev, ctx) {
      // the travelling light is a one-shot build, only on a live forward click into stop 2
      const el = ctx.el;
      el.classList.remove('lk-running');
      if (n === 2 && prev === 1 && !ctx.instant) {
        void el.offsetWidth;
        el.classList.add('lk-running');
        ctx.after(1800, () => el.classList.remove('lk-running'));
      }
    },
  });
})();
