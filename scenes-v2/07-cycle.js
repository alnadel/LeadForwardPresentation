/* 07 · The cycle (v4: two stops) — a road that stops, a loop that keeps going, then the cycle.
   Stop 0, one ground seen in perspective. Upper left, the award road: a short purple road
   runs from Achievement to Recognition, raised on an award podium, and dead-ends at a wall
   ("it ends here"). Its light runs into the wall and shatters, and the road goes dim. In
   front, the hero: a glowing racetrack. The story lane draws behind a leading light along
   its front straight, its five stations (raised keys with pictured icons) materialise as the
   light passes, the return draws round the far side, and then the story light laps the
   track for ever, lighting each station as it passes. Every lap both lights set out
   together: the award light dies at the wall, the story light keeps going.
   Stop 1, one choreographed step: the award road falls away, the racetrack contracts into
   the ring, and the ring (tilted, on a glass disc) draws behind a leading light; each node
   materialises as the light passes it and a connector carries it out to its glass card. As
   the draw closes, the cycle repeats: the ring surges, "The cycle repeats" lands over the
   disc with the spark, a pulse spreads across the disc, an inner ring turns in, each card
   unfolds its principle and a second story joins the orbit half a lap behind. While parked:
   both lights orbit, every pass flares the node and lights its card, every lap sends a pulse
   across the disc, stories leave the ring into the field.
   All state keys off .st-n / data-step and the CSS clocks, so back navigation lands on the
   same frame; the leading lights, the first hit, the surge and the first pulse play on a live
   click only. */
(function () {
  const mod = (v, m) => ((v % m) + m) % m;
  const r1 = (v) => Math.round(v * 10) / 10;
  // the draws run on an ease-in-out sine (CSS cubic-bezier(.37,0,.63,1)); tAt is its inverse:
  // when a draw that starts at dl and lasts dd reaches fraction f
  const tAt = (f, dl, dd) => dl + Math.acos(1 - 2 * Math.min(1, Math.max(0, f))) / Math.PI * dd;

  /* ── stop 0 · one ground in perspective (stage px) ─────────────────────
     A point x along the ground, d into it (away from us) and h above it lands at proj(x, d, h);
     yg is where d = 0 meets the screen. Lines stay lines, so the straights stay straight. */
  const VX = 960, PF = 2200, COMP = .46;
  const proj = (x, d, h, yg) => { const f = PF / (PF + d); return [VX + (x - VX) * f, yg - COMP * PF + (COMP * PF - (h || 0)) * f]; };
  const pts = (arr) => arr.map((p) => r1(p[0]) + ',' + r1(p[1])).join(' ');

  /* the story loop: a racetrack; its centreline runs the front straight left to right (d = 0),
     round the far cap, back along the far straight and round the near cap */
  const LYG = 862, LD = 360, LRC = LD / 2, LX0 = 296, LX1 = 1624, LW = 46, LT = 16;
  const LS = LX1 - LX0, LCAP = Math.PI * LRC, LL = 2 * LS + 2 * LCAP;
  const TX = [350, 655, 960, 1265, 1570];
  const TW = ['Experience', 'Story', 'Behaviour', 'Inspiration', 'More stories'];
  const TI = ['hands-teamwork', 'person-message', 'gear-clock', 'eye-lightbulb', 'users-connected'];
  // a point on the loop (plane) at distance s along it, with its outward normal
  function planeAt(s) {
    s = mod(s, LL);
    if (s < LS) return { x: LX0 + s, d: 0, nx: 0, nd: -1 };
    s -= LS;
    if (s < LCAP) { const a = -Math.PI / 2 + s / LRC; return { x: LX1 + LRC * Math.cos(a), d: LRC + LRC * Math.sin(a), nx: Math.cos(a), nd: Math.sin(a) }; }
    s -= LCAP;
    if (s < LS) return { x: LX1 - s, d: LD, nx: 0, nd: 1 };
    s -= LS;
    const a = Math.PI / 2 + s / LRC;
    return { x: LX0 + LRC * Math.cos(a), d: LRC + LRC * Math.sin(a), nx: Math.cos(a), nd: Math.sin(a) };
  }
  const lp = (s, off, h) => { const p = planeAt(s); return proj(p.x + p.nx * (off || 0), p.d + p.nd * (off || 0), h, LYG); };
  // the loop (or a stretch of it) as screen points
  const run = (s0, s1, off, h, step) => { const out = []; step = step || 6; for (let s = s0; s < s1; s += step) out.push(lp(s, off, h)); out.push(lp(s1, off, h)); return out; };
  const poly = (p, close) => 'M' + p.map((q) => r1(q[0]) + ' ' + r1(q[1])).join('L') + (close ? 'Z' : '');
  const RING = (h) => poly(run(0, LL, LW / 2, h), true) + poly(run(0, LL, -LW / 2, h), true);
  const FRONT = poly([lp(0), lp(LS)]);           // the story lane (the front straight)
  const RETURN = poly(run(LS, LL, 0, 0, 8));    // the return: far cap, far straight, near cap
  const ST = TX.map((x) => x - LX0);            // each station's distance along the loop

  /* the award road: a short straight in the same ground, higher up the stage */
  const AYG = 594, AX0 = 186, AHW = 30, AT = 14;
  const PX = [340, 700], PW = ['Achievement', 'Recognition'], PI = ['chart-growth', 'document-certified'];
  const WALL = 1010, WT = 34, WD = 74, WH = 172;       // the wall: its face, thickness, half-depth, height
  const PEND = WALL - 12;                             // where the award light dies
  const POD = 58;                                     // the podium's height (Recognition stands on it)
  const AP = (x, d, h) => proj(x, d, h, AYG);
  // an axis-aligned block in the award road's ground: the faces the camera sees
  const block = (x0, x1, d0, d1, h0, h1, cls) => {
    const f = (a) => `points="${pts(a.map((q) => AP(...q)))}"`;
    let s = `<g class="${cls}">`;
    if (x1 < VX) s += `<polygon class="fs" ${f([[x1, d0, h0], [x1, d1, h0], [x1, d1, h1], [x1, d0, h1]])}/>`;
    if (x0 > VX) s += `<polygon class="fs" ${f([[x0, d0, h0], [x0, d1, h0], [x0, d1, h1], [x0, d0, h1]])}/>`;
    s += `<polygon class="ff" ${f([[x0, d0, h0], [x1, d0, h0], [x1, d0, h1], [x0, d0, h1]])}/>`;
    s += `<polygon class="ft" ${f([[x0, d0, h1], [x1, d0, h1], [x1, d1, h1], [x0, d1, h1]])}/>`;
    return s + '</g>';
  };
  const ROAD = `M${pts([AP(AX0, -AHW, 0), AP(WALL, -AHW, 0), AP(WALL, AHW, 0), AP(AX0, AHW, 0)]).replace(/ /g, 'L')}Z`;
  const ROADF = `M${pts([AP(AX0, -AHW, 0), AP(WALL, -AHW, 0), AP(WALL, -AHW, -AT), AP(AX0, -AHW, -AT)]).replace(/ /g, 'L')}Z`;
  const PLINE = `M${AX0} ${AYG} L${PEND} ${AYG}`;

  // the build (s after the click; CSS adds the entrance delay itself)
  const PD = { dl: .3, dd: .56 };      // the award road draws
  const TD = { dl: .42, dd: .62 };     // the story lane draws
  const RD = { dl: 1.02, dd: .6 };     // the return draws
  const pT = PX.map((x) => tAt((x - AX0) / (PEND - AX0), PD.dl, PD.dd) - .06);
  const tT = TX.map((x) => tAt((x - LX0) / LS, TD.dl, TD.dd) - .06);
  const PERIOD = 7.2;           // one lap of the loop, seconds (the award light sets out with it every lap)
  const V = LL / PERIOD;        // both lights' speed, px/s along the ground
  const LIGHTS_AT = 1.9;        // loop time (from the click) when the lights start
  const TAIL = [320, 210, 120, 48], TSTEP = 4;   // the comet tail's stacked lengths (ground px) and its sample step

  // chevrons on the track (flat on it, in perspective): the lane's point on along it, the return's back
  const chevPts = (x, d, dir) => [proj(x - 7 * dir, d - 10, 0, LYG), proj(x + 6 * dir, d, 0, LYG), proj(x - 7 * dir, d + 10, 0, LYG)];
  const CHEVS = [
    ...TX.slice(0, 4).map((x, i) => ({ p: chevPts((x + TX[i + 1]) / 2, 0, 1), k: i, cls: 't' })),
    ...TX.slice(0, 4).map((x, i) => ({ p: chevPts((x + TX[i + 1]) / 2, LD, -1), k: 3 - i, cls: 'r' })),
  ];
  const chevBase = CHEVS.map((c) => `<polyline class="cy-chev ${c.cls}" points="${pts(c.p)}"/>`).join('');
  // each lit copy is its own small svg (an opacity loop there repaints only itself)
  const chevLit = CHEVS.map((c) => {
    const xs = c.p.map((q) => q[0]), ys = c.p.map((q) => q[1]);
    const b = [Math.floor(Math.min(...xs)) - 12, Math.floor(Math.min(...ys)) - 12];
    b.push(Math.ceil(Math.max(...xs)) + 12 - b[0], Math.ceil(Math.max(...ys)) + 12 - b[1]);
    return `<svg class="cy-chl ${c.cls}" viewBox="${b.join(' ')}" style="left:${b[0]}px;top:${b[1]}px;width:${b[2]}px;height:${b[3]}px;--k:${c.k}" aria-hidden="true"><polyline points="${pts(c.p)}"/></svg>`;
  }).join('');

  /* ── stop 1 · the ring, tilted on a glass disc ─────────────────────────
     The disc and everything flat on it live in one group squashed by K (a circle of radius r
     reads as an ellipse r × Kr); the nodes, the lights and the words stand up out of it. */
  const CX = 960, CY = 668, K = .62, R = 290, ROUT = 336, RIN = 206, RDISC = 376, EDGE = 18;
  const DRAW = .9, DRAW_AT = .12;    // the ring draws in .9 s, .12 s after the click
  const REP = DRAW_AT + DRAW;         // s after the click: the draw closes and the cycle repeats
  const JOIN = DRAW + .45;            // s into the draw: the second story joins the orbit
  const LAP = 7.2;                    // one orbit, seconds
  const STAGES = [
    { n: '01', t: 'Capture', s: 'Peer or leader nomination through a short, clear form.', p: 'Employee voice', a: -45, ic: 'person-message' },
    { n: '02', t: 'Curate', s: 'Verify facts, secure consent and link the story to one value.', p: 'Fair selection', a: 45, ic: 'document-certified' },
    { n: '03', t: 'Feature', s: 'Publish a short, authentic story across relevant channels.', p: 'Visible recognition', a: 135, ic: 'content-layout' },
    { n: '04', t: 'Reinforce', s: 'Recognise the contribution, share the takeaway and track response.', p: 'Organisational learning', a: 225, ic: 'handshake' },
  ];
  const CARD = { w: 492, l: 144, r: 1284, topEnd: 626, botTop: 700 };   // top cards grow upward, bottom cards downward
  const rad = (a) => a * Math.PI / 180;
  const at = (a, r) => [CX + r * Math.cos(rad(a)), CY + K * r * Math.sin(rad(a))];      // on the disc, as seen
  const flat = (a, r) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];                  // on the disc, in its own plane
  const ease = (u) => (1 - Math.cos(Math.PI * u)) / 2;            // the ring's draw (ease in-out)
  const drawTime = (f) => Math.acos(1 - 2 * f) / Math.PI * DRAW;  // when the draw reaches fraction f
  // each node materialises as the drawing light passes it
  const SWEEP = STAGES.map((s, i) => Math.max(.08, DRAW_AT + drawTime(i / 4) - .08));
  const NH = 52;                // node half-size

  const nodes = STAGES.map((s, i) => {
    const [x, y] = at(s.a, R);
    return `<div class="cy-nw a-materialize" data-in="1" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;--d:${SWEEP[i].toFixed(2)}s;--dur:.75s">
        <b class="cy-halo"></b><div class="cy-nd">${Deck.icon(s.ic)}</div><div class="cy-nd lit" aria-hidden="true">${Deck.icon(s.ic)}</div><b class="cy-nn">${s.n}</b>
      </div>`;
  }).join('');
  // each node's ripples spread flat across the disc
  const nodeRips = STAGES.map((s) => { const [x, y] = flat(s.a, R); return `<i class="cy-rip" style="left:${r1(x)}px;top:${r1(y)}px"></i><i class="cy-rip r2" style="left:${r1(x)}px;top:${r1(y)}px"></i>`; }).join('');

  // connectors: node → card, drawn as the ring's light passes the node
  const conns = STAGES.map((s, i) => {
    const [x, y] = at(s.a, R);
    const right = i < 2;
    const x0 = right ? x + NH + 12 : x - NH - 12, x1 = right ? CARD.r - 6 : CARD.l + CARD.w + 6;
    return { d: `M${x0.toFixed(0)} ${y.toFixed(0)} L${x1} ${y.toFixed(0)}`, x0: +x0.toFixed(0), x1, y, right };
  });
  const CBOX = [CARD.l + CARD.w - 6, Math.floor(Math.min(...conns.map((c) => c.y))) - 10, CARD.r + 6 - (CARD.l + CARD.w - 6), 0];
  CBOX[3] = Math.ceil(Math.max(...conns.map((c) => c.y))) + 10 - CBOX[1];
  const connSvg = conns.map((c, i) => `<path class="cy-cn" d="${c.d}" pathLength="1" style="--dl:${(SWEEP[i] + .1).toFixed(2)}s"/>`).join('');
  const connEnds = conns.map((c, i) => `<i class="cy-cend" style="left:${c.x1}px;top:${c.y.toFixed(0)}px;--dl:${(SWEEP[i] + .38).toFixed(2)}s"></i>
      <i class="cy-cpulse" style="left:${c.x0}px;top:${c.y.toFixed(0)}px;--run:${c.x1 - c.x0}px"></i>`).join('');

  const cards = STAGES.map((s, i) => {
    const right = i < 2, top = i === 0 || i === 3;
    const pos = `${right ? `left:${CARD.r}px` : `left:${CARD.l}px`};${top ? `bottom:${1080 - CARD.topEnd}px` : `top:${CARD.botTop}px`}`;
    return `<div class="cy-cw a-unfold" data-in="1" style="${pos};--d:${(SWEEP[i] + .16).toFixed(2)}s;--dur:.72s">
        <div class="cy-card glass ${top ? 'tp' : 'bt'}" style="--k:${i}">
          <div class="cy-ch"><b class="cy-no">${s.n}</b><span class="cy-t" data-t="${s.t}">${s.t}</span></div>
          <p class="cy-s">${s.s}</p>
          <div class="cy-pf"><div class="cy-p"><i></i>${s.p}</div></div>
        </div>
      </div>`;
  }).join('');

  // chevrons flow round the ring, flat on the disc (slower than the light), dipping out as they pass under a node
  const chevrons = Array.from({ length: 12 }, (_, k) => `<i class="cy-cv" style="animation-delay:${(-k * 16 / 12).toFixed(2)}s"><svg viewBox="-10 -13 20 26" aria-hidden="true"><path d="M-6 -10 L5 0 L-6 10"/></svg></i>`).join('');
  // the disc's engraved rings (flat on it)
  const discRings = [RDISC - 22, 250, 150, 96].map((r, i) => `<circle class="dr${i}" r="${r}"/>`).join('');

  // the award light shatters against the wall: shards fly back
  const shards = [[-80, -40], [-110, -10], [-74, 30], [-46, -62], [-126, 34], [-58, 56], [-140, -30], [-30, 70]].map(([dx, dy], i) => `<b style="--dx:${dx}px;--dy:${dy}px;--r:${(i * 67) % 180}deg"></b>`).join('');
  // dust motes rising off the loop
  const dust = [[360, 850, 15, -2, 30, -170], [540, 900, 18, -9, -20, -210], [760, 780, 14, -5, 40, -160], [1000, 890, 17, -12, -30, -200], [1180, 800, 15, -7, 24, -180],
    [1400, 900, 19, -3, -36, -220], [1560, 790, 16, -10, 30, -170], [880, 910, 18, -14, 20, -230], [640, 800, 16, -6, -26, -190], [1320, 780, 14, -11, 18, -160]]
    .map(([x, y, t, dl, dx, dy]) => `<i style="left:${x}px;top:${y}px;--t:${t}s;--dl:${dl}s;--dx:${dx}px;--dy:${dy}px"></i>`).join('');

  // each drawing sits in an svg cut to its own box (a full-stage svg is a full-stage layer); the
  // paths keep stage coordinates through the viewBox
  const lx = run(0, LL, LW / 2, -LT).map((q) => q[0]), ly = run(0, LL, LW / 2, -LT).concat(run(0, LL, LW / 2, 0)).map((q) => q[1]);
  const BOX = {
    loop: [Math.floor(Math.min(...lx)) - 16, Math.floor(Math.min(...ly)) - 16, 0, 0],
    road: [AX0 - 10, Math.floor(AP(WALL, WD, WH)[1]) - 14, WALL + WT + 30 - (AX0 - 10), 0],
  };
  BOX.loop[2] = Math.ceil(Math.max(...lx)) + 16 - BOX.loop[0]; BOX.loop[3] = Math.ceil(Math.max(...ly)) + 16 - BOX.loop[1];
  BOX.road[3] = Math.ceil(AP(AX0, -60, -AT)[1]) + 12 - BOX.road[1];
  const wc = [WALL, WALL + WT].flatMap((x) => [-WD, WD].flatMap((d) => [0, WH].map((h) => AP(x, d, h))));
  BOX.wall = [Math.floor(Math.min(...wc.map((q) => q[0]))) - 6, Math.floor(Math.min(...wc.map((q) => q[1]))) - 6, 0, 0];
  BOX.wall[2] = Math.ceil(Math.max(...wc.map((q) => q[0]))) + 6 - BOX.wall[0]; BOX.wall[3] = Math.ceil(Math.max(...wc.map((q) => q[1]))) + 6 - BOX.wall[1];
  const svgAt = (b) => `viewBox="${b.join(' ')}" style="left:${b[0]}px;top:${b[1]}px;width:${b[2]}px;height:${b[3]}px"`;

  // stations: a raised key with its picture; the loop's stand on the track (it runs through them)
  const key = (x, y, ic, cls, d) => `<div class="cy-k ${cls}" style="left:${r1(x)}px;top:${r1(y)}px"><b class="cy-krip"></b><b class="cy-krip r2"></b><div class="cy-kd a-materialize" data-in="0" style="--d:${d.toFixed(2)}s;--dur:.6s"><div class="cy-kf">${Deck.icon(ic)}</div><div class="cy-kf lit" aria-hidden="true">${Deck.icon(ic)}</div></div></div>`;
  const label = (x, y, w, cls, d) => `<div class="cy-st ${cls}" data-in="0" style="left:${r1(x)}px;top:${r1(y)}px;--d:${d.toFixed(2)}s;--dur:.6s">${w}</div>`;
  const KH = { t: 54, p: 44 };   // key half-heights (the loop's, the award road's)
  const podTop = AP(PX[1], 0, POD)[1];
  const PKY = [AYG, podTop - KH.p - 6];   // the award keys: on the road, and on the podium

  Deck.scene({
    id: 'cycle',
    title: 'The cycle',
    act: 2,
    bg: 'teal',
    transition: 'iris',
    cues: ['What is new · the road that stops, the loop that keeps going', 'The cycle · four steps · it repeats'],
    holds: [9, 15],
    notes: [
      'Most recognition stops at the award. Ours keeps going: a story leads to behaviour, which inspires more stories.',
      'Four steps, one quarter. Capture: a peer or leader nominates. Curate: facts checked, consent given, one value linked. Feature: a short story on our channels. Reinforce: the contributor is recognised and the takeaway is shared. Then it repeats.',
    ],
    field: [
      { dim: .3, lit: .02, travel: .22, offset: [150, -70], litFrom: null, links: .5, wave: .5, streaks: .14, sparkle: 1, calm: [[100, 120, 1500, 380, .85], [120, 400, 1760, 960, .55]] },
      { dim: .48, lit: .09, litFrom: [CX, CY], travel: .65, links: .8, wave: .85, streaks: .26, sparkle: 2.8,
        calm: [[100, 120, 1300, 300, .85], [120, 360, 660, 960, .8], [1260, 360, 1800, 960, .8], [760, 560, 1160, 760, .8]] },
    ],
    html: `
      <!-- stop 0 · the road that stops, the loop that keeps going -->
      <div class="pad cy-head">
        <div class="kicker" data-in="0" data-out="1">What is new</div>
        <h2 class="h2 cy-h" data-in="0" data-out="1" data-split style="--d:.15s">Most recognition <em class="cy-stop">stops</em> at the award.<br><em class="hl cy-keep" data-spark="0" data-spark-at="r">This keeps going.</em></h2>
      </div>

      <div class="cy-lanes" data-out="1">
        <!-- the award road: it ends at the wall, and goes dim -->
        <div class="cy-grp cy-ga">
          <i class="cy-haze" style="left:${AX0 - 120}px;top:${AYG - 190}px"></i>
          <i class="cy-wglow" style="left:${WALL + WT / 2}px;top:${AYG - WH / 2}px"></i>
          <div class="cy-dimw">
            <svg class="cy-svg cy-road" ${svgAt(BOX.road)} aria-hidden="true">
              <defs><linearGradient id="cyRoadG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9D67AA" stop-opacity="0"/><stop offset=".22" stop-color="#9D67AA" stop-opacity=".34"/><stop offset="1" stop-color="#C9A6D3" stop-opacity=".46"/></linearGradient>
                <linearGradient id="cyRoadF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3A1631" stop-opacity="0"/><stop offset=".22" stop-color="#3A1631" stop-opacity=".9"/><stop offset="1" stop-color="#4A1E40"/></linearGradient></defs>
              <g class="cy-rd">
                <path class="cy-rf" d="${ROADF}"/><path class="cy-rt" d="${ROAD}"/><path class="cy-re" d="M${pts([AP(AX0 + 60, -AHW, 0), AP(WALL, -AHW, 0)]).replace(' ', 'L')}M${pts([AP(AX0 + 60, AHW, 0), AP(WALL, AHW, 0)]).replace(' ', 'L')}"/>
                ${block(PX[1] - 66, PX[1] + 66, -46, 46, 0, 20, 'cy-pod')}${block(PX[1] - 48, PX[1] + 48, -34, 34, 20, 40, 'cy-pod')}${block(PX[1] - 32, PX[1] + 32, -24, 24, 40, POD, 'cy-pod hi')}
              </g>
              <path class="cy-track p cy-draw" d="${PLINE}" pathLength="1" style="--dl:${PD.dl}s;--dd:${PD.dd}s"/>
              <g class="cy-chevs0 p">${[(PX[0] + PX[1]) / 2, (PX[1] + PEND) / 2 + 20].map((x) => `<polyline class="cy-chev p" points="${pts([AP(x - 8, -11, 0), AP(x + 7, 0, 0), AP(x - 8, 11, 0)])}"/>`).join('')}</g>
            </svg>
            ${PX.map((x, i) => key(x, PKY[i], PI[i], 'p', pT[i])).join('')}
          </div>
          ${PX.map((x, i) => label(x, PKY[i] - KH.p - 14, PW[i], 'p', pT[i])).join('')}
          <div class="cy-wallw a-materialize" data-in="0" style="--d:${(PD.dl + PD.dd - .05).toFixed(2)}s;--dur:.6s">
            <svg class="cy-svg" ${svgAt(BOX.wall)} aria-hidden="true">${block(WALL, WALL + WT, -WD, WD, 0, WH, 'cy-wall')}</svg>
            <svg class="cy-svg cy-wallf" ${svgAt(BOX.wall)} aria-hidden="true">${block(WALL, WALL + WT, -WD, WD, 0, WH, 'cy-wall f')}</svg>
          </div>
          <i class="cy-lead p" style="offset-path:path('${PLINE}');--dl:${PD.dl}s;--dd:${PD.dd}s"></i>
          <div class="cy-lanelights a-fade" data-in="0" style="--d:${(LIGHTS_AT - .3).toFixed(2)}s;--dur:.4s">
            <i class="cy-ptrail"></i><i class="cy-plight"></i>
          </div>
          <div class="cy-end a-right" data-in="0" style="left:${WALL + WT + 30}px;top:${r1(AP(WALL, 0, WH * .55)[1])}px;--d:${(PD.dl + PD.dd).toFixed(2)}s;--dur:.7s">it ends here</div>
          <div class="cy-flash" style="left:${PEND}px;top:${AYG - 30}px"><b class="cy-burst"></b><b class="cy-ring1"></b><b class="cy-ring1 r2"></b><span class="cy-shards">${shards}</span></div>
        </div>

        <!-- the story loop: it keeps going -->
        <div class="cy-grp cy-gl">
          <i class="cy-pool" style="left:${VX - 450}px;top:${LYG - 250}px"></i>
          <div class="amb-dust cy-dust a-fade" data-in="0" style="--d:1.4s">${dust}</div>
          <svg class="cy-svg cy-loop" ${svgAt(BOX.loop)} aria-hidden="true">
            <defs>
              <linearGradient id="cyTrackG" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#25C7BC" stop-opacity=".2"/><stop offset=".5" stop-color="#03FFCB" stop-opacity=".28"/><stop offset="1" stop-color="#25C7BC" stop-opacity=".2"/></linearGradient>
              <radialGradient id="cyInG" cx=".5" cy=".5" r=".6"><stop offset="0" stop-color="#25C7BC" stop-opacity=".16"/><stop offset="1" stop-color="#25C7BC" stop-opacity=".03"/></radialGradient>
            </defs>
            <g class="cy-lp">
              <path class="cy-in" d="${poly(run(0, LL, -LW / 2, 0), true)}"/>
              <path class="cy-sk" d="${RING(-LT)}" fill-rule="evenodd"/>
              <path class="cy-tp" d="${RING(0)}" fill-rule="evenodd"/>
              <path class="cy-ed o" d="${poly(run(0, LL, LW / 2, 0), true)}"/>
              <path class="cy-ed i" d="${poly(run(0, LL, -LW / 2, 0), true)}"/>
            </g>
            <path class="cy-ret" d="${RETURN}"/>
            <path class="cy-track t cy-draw" d="${FRONT}" pathLength="1" style="--dl:${TD.dl}s;--dd:${TD.dd}s"/>
            <path class="cy-track r cy-draw" d="${RETURN}" pathLength="1" style="--dl:${RD.dl}s;--dd:${RD.dd}s"/>
            <g class="cy-chevs0 t">${chevBase}</g>
          </svg>
          <div class="cy-chls">${chevLit}</div>
          <i class="cy-lead t" style="offset-path:path('${FRONT}');--dl:${TD.dl}s;--dd:${TD.dd}s"></i>
          <i class="cy-lead r" style="offset-path:path('${RETURN}');--dl:${RD.dl}s;--dd:${RD.dd}s"></i>
          <div class="cy-lanelights a-fade" data-in="0" style="--d:${(LIGHTS_AT - .3).toFixed(2)}s;--dur:.4s">
            <svg class="cy-tail" viewBox="-340 -200 680 400" aria-hidden="true">
              ${TAIL.map((len, i) => `<path class="cy-ttr t${i}" d="M0 0"/>`).join('')}
            </svg>
            <i class="cy-tglow"></i>
            <i class="light cy-tlight"></i>
          </div>
          ${TX.map((x, i) => key(x, LYG, TI[i], 't', tT[i]) + label(x, LYG - KH.t - 14, TW[i], 't', tT[i])).join('')}
        </div>
      </div>

      <!-- stop 1 · the ring on its disc -->
      <div class="pad cy-head">
        <div class="kicker" data-in="1" style="--d:.2s">The solution</div>
        <h2 class="h2 cy-h" data-in="1" data-split style="--d:.28s">A simple story-to-impact cycle.</h2>
      </div>

      <div class="cy-ring a-fade" data-in="1" style="--d:.05s;--dur:.5s">
        <div class="cy-tilt" style="left:${CX}px;top:${CY}px;--k:${K}">
          <i class="cy-disc e" style="left:${-RDISC}px;top:${-RDISC + EDGE / K}px;width:${2 * RDISC}px;height:${2 * RDISC}px"></i>
          <i class="cy-disc" style="left:${-RDISC}px;top:${-RDISC}px;width:${2 * RDISC}px;height:${2 * RDISC}px"></i>
          <i class="cy-glint" style="left:${-RDISC / 2}px;top:${-RDISC / 2}px;width:${RDISC}px;height:${RDISC}px"></i>
          <div class="cy-glow" style="left:-190px;top:-190px"></div>
          <svg class="cy-dsvg" viewBox="${-RDISC} ${-RDISC} ${2 * RDISC} ${2 * RDISC}" style="left:${-RDISC}px;top:${-RDISC}px;width:${2 * RDISC}px;height:${2 * RDISC}px" aria-hidden="true">${discRings}</svg>
          <div class="cy-outer" style="left:${-ROUT - 6}px;top:${-ROUT - 6}px;width:${2 * ROUT + 12}px;height:${2 * ROUT + 12}px">
            <svg viewBox="0 0 ${2 * ROUT + 12} ${2 * ROUT + 12}" aria-hidden="true">
              <circle class="cy-o1" cx="${ROUT + 6}" cy="${ROUT + 6}" r="${ROUT}"/>
              <circle class="cy-o2" cx="${ROUT + 6}" cy="${ROUT + 6}" r="${ROUT}" pathLength="360"/>
            </svg>
          </div>
          <div class="cy-inner" style="left:${-RIN - 14}px;top:${-RIN - 14}px;width:${2 * RIN + 28}px;height:${2 * RIN + 28}px">
            <svg viewBox="0 0 ${2 * RIN + 28} ${2 * RIN + 28}" aria-hidden="true">
              <circle class="cy-i1" cx="${RIN + 14}" cy="${RIN + 14}" r="${RIN}" pathLength="360"/>
              ${[140, 320].map((a) => { const x = RIN + 14 + RIN * Math.cos(rad(a)), y = RIN + 14 + RIN * Math.sin(rad(a)); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a + 90})"><path class="cy-i2" d="M-5 -12 L14 0 L-5 12 Z"/></g>`; }).join('')}
            </svg>
          </div>
          <svg class="cy-svg cy-rsvg" viewBox="${-R - 30} ${-R - 30} ${2 * R + 60} ${2 * R + 60}" style="left:${-R - 30}px;top:${-R - 30}px;width:${2 * R + 60}px;height:${2 * R + 60}px" aria-hidden="true">
            <circle class="cy-rtrack" r="${R}"/>
            <g class="cy-rwide"><circle class="w1" r="${R}"/><circle class="w2" r="${R}"/></g>
            <circle class="cy-rdraw" r="${R}" pathLength="100" transform="rotate(-45)"/>
          </svg>
          <div class="cy-chevs a-fade" data-in="1" style="--d:${(DRAW_AT + DRAW - .1).toFixed(2)}s;--dur:.8s">${chevrons}</div>
          <i class="cy-lap" style="left:${-R}px;top:${-R}px;width:${2 * R}px;height:${2 * R}px"></i>
          <i class="cy-lap l2" style="left:${-R}px;top:${-R}px;width:${2 * R}px;height:${2 * R}px"></i>
          <i class="cy-comet" style="left:${-R - 22}px;top:${-R - 22}px;width:${2 * R + 44}px;height:${2 * R + 44}px"></i>
          <i class="cy-comet c2" style="left:${-R - 22}px;top:${-R - 22}px;width:${2 * R + 44}px;height:${2 * R + 44}px"></i>
          ${nodeRips}
        </div>
        <svg class="cy-svg cy-csvg" ${svgAt(CBOX)} aria-hidden="true">${connSvg}</svg>
        ${connEnds}
      </div>
      <div class="cy-orbit"><i class="cy-flare"></i><i class="light cy-olight"></i><i class="light cy-olight c2"></i></div>
      ${nodes}
      ${cards}

      <!-- the clocks of the JS-driven lights: CSS animations the loop reads, so those lights
           keep the same timeline as every CSS loop (and pause with them) -->
      <i class="cy-clock lane"></i><i class="cy-clock orbit"></i>

      <!-- stop 1, as the draw closes · it repeats -->
      <div class="cy-core" style="left:${CX}px;top:${CY}px"></div>
      <div class="cy-rep a-scale" data-in="1" data-spark="1" data-spark-at="t" data-spark-delay="${(REP - .42).toFixed(2)}" style="left:${CX - 200}px;top:${CY - 54}px;--d:${(REP - .08).toFixed(2)}s;--dur:.8s"><span>The cycle<br>repeats</span></div>
    `,
    init(ctx) {
      ctx.tail = ctx.$('.cy-tail');
      ctx.tailP = ctx.$$('.cy-ttr');
      ctx.tailD = [];
      ctx.tl = ctx.$('.cy-tlight');
      ctx.tg = ctx.$('.cy-tglow');
      ctx.pl = ctx.$('.cy-plight');
      ctx.pt = ctx.$('.cy-ptrail');
      ctx.tNodes = ctx.$$('.cy-k.t');
      ctx.pNodes = ctx.$$('.cy-k.p');
      ctx.wall = ctx.$('.cy-wallw');
      ctx.wglow = ctx.$('.cy-wglow');
      ctx.flash = ctx.$('.cy-flash');
      ctx.ol = ctx.$('.cy-olight');
      ctx.ol2 = ctx.$('.cy-olight.c2');
      ctx.comet2 = ctx.$('.cy-comet.c2');
      ctx.flare = ctx.$('.cy-flare');
      ctx.comet = ctx.$('.cy-comet');
      ctx.rdraw = ctx.$('.cy-rdraw');
      ctx.laps = ctx.$$('.cy-lap');
      ctx.nws = ctx.$$('.cy-nw');
      ctx.rips = STAGES.map((s, i) => ctx.$$('.cy-rip').slice(2 * i, 2 * i + 2));
      ctx.cards = ctx.$$('.cy-card');
      ctx.pulses = ctx.$$('.cy-cpulse');
      ctx.lclock = ctx.$('.cy-clock.lane');
      ctx.oclock = ctx.$('.cy-clock.orbit');
      ctx.draw0 = 0;
      ctx.hitWall = false;
      ctx.lapK = 0;
      ctx.sent = 0;
    },
    enter(ctx) {
      ctx.loop(() => {
        if (ctx.step <= 0) lanes(ctx);
        if (ctx.step >= 1) ring(ctx, performance.now());
      });
    },
    leave(ctx) { window.LFLeave && LFLeave(ctx); },   // once faded out, it leaves the compositor
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // the lanes leave the compositor once they have fallen away (and the ring until it is drawn)
      const forward = !ctx.instant && prev < n;
      // one-shot flourishes (leading lights, the surge) play only on a forward build
      ctx.el.dataset.play = forward ? String(n) : '';
      // once the lanes have fallen away (stop 1), their ambient loops rest (no work while unseen)
      ctx.el.classList.toggle('cy-parked', n >= 1 && !!ctx.instant);
      if (n >= 1 && !ctx.instant) ctx.after(1300, () => ctx.el.classList.add('cy-parked'));
      // the ring draws when stop 1 is reached going forward; landing on it (a jump, or
      // back from the next scene) finds it drawn, the principles open and both lights orbiting
      if (n >= 1 && (prev < 1 || !ctx.draw0)) {
        ctx.draw0 = performance.now() + (ctx.instant ? -(JOIN + .5) * 1000 : DRAW_AT * 1000);
        // landing on the ring: it is already drawn, so the orbit clock skips the draw
        const a = anim(ctx.oclock);
        if (ctx.instant && a) a.currentTime = (DRAW_AT + DRAW) * 1000;
      }
      if (n < 1) ctx.draw0 = 0;
      ring(ctx, performance.now());
      if (n <= 0) { ctx.hitWall = false; ctx.flash.classList.remove('go'); ctx.wall.classList.remove('go'); ctx.wglow.classList.remove('go'); }
      // as the draw closes, the cycle repeats: the first pulse spreads across the disc and a ripple
      // spreads from the centre (the surge is CSS, keyed on data-play)
      if (n === 1 && forward) {
        ctx.after(REP * 1000, () => { restart(ctx.laps[0], 'go'); if (window.Field) Field.burst(CX, CY, { radius: 320, dur: 1.4 }); });
      }
    },
  });

  // a clock's animation and its time in seconds (null when its stop is not reached). The
  // animation is looked up once (getAnimations() flushes style) and kept while it lives.
  function anim(el) { const a = el.getAnimations ? el.getAnimations()[0] : null; return a || null; }
  function clock(ctx, key) {
    let a = ctx[key + 'A'];
    if (!a || a.currentTime == null) a = ctx[key + 'A'] = anim(ctx[key]);
    return a && a.currentTime != null ? a.currentTime / 1000 : null;
  }
  function place(el, x, y) { el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; }
  function fade(el, v) { if (el._o !== v) { el._o = v; el.style.opacity = v; } }
  // replay a one-shot class animation without forcing layout: drop the class now, add it back
  // two frames on (after a style pass has seen it gone)
  function restart(el, cls) { el.classList.remove(cls); requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add(cls))); }
  // the tail: the last TAIL[0] px of the loop behind the light, drawn in the light's own frame, so
  // on the straights its shape is constant and nothing is rewritten (or repainted)
  function drawTail(ctx, s, p) {
    const q = [];
    for (let d = 0; d <= TAIL[0]; d += TSTEP) {
      const [x, y] = lp(s - d);
      q.push(Math.round((x - p[0]) * 10) / 10 + ' ' + Math.round((y - p[1]) * 10) / 10);
    }
    TAIL.forEach((len, i) => {
      const d = 'M' + q.slice(0, len / TSTEP + 1).join('L');
      if (ctx.tailD[i] !== d) { ctx.tailD[i] = d; ctx.tailP[i].setAttribute('d', d); }
    });
  }

  function lanes(ctx) {
    const t = clock(ctx, 'lclock');
    if (t == null) return;
    // both lights leave their start together, every lap
    const tt = mod(t - LIGHTS_AT, PERIOD);
    const s = tt * V;
    const p = lp(s);
    place(ctx.tl, p[0], p[1]); place(ctx.tg, p[0], p[1]); place(ctx.tail, p[0], p[1]);
    // the comet tail: stacked segments that end at the light (they wrap with the lap)
    drawTail(ctx, s, p);
    ctx.tNodes.forEach((d, i) => {
      const hit = Math.abs(s - ST[i]) < 48 || (i === 0 && s > LL - 48 + ST[0]);
      if (hit && !d.classList.contains('hit')) restart(d, 'pass');
      d.classList.toggle('hit', hit);
    });
    // the award light: same pace, but it runs into the wall and shatters
    const runLen = PEND - AX0;
    const sp = tt * V;
    let x, o, k = -1, tail;
    if (sp < runLen) {
      x = AX0 + sp; o = ease(Math.min(1, tt / .26)); tail = Math.min(230, sp);   // it lights up (and goes, below) over ≥ 260 ms, eased
    } else {
      k = tt - runLen / V;
      x = PEND; o = ease(Math.max(0, 1 - k / .35)); tail = Math.max(0, 230 - k * 1000);
    }
    ctx.pl.style.transform = `translate(${x.toFixed(1)}px,${AYG}px) scale(${k < 0 ? 1 : Math.max(.3, 1 - k * 2.2).toFixed(3)},${k < 0 ? 1 : (1 + Math.min(k, .3) * 1.4).toFixed(3)})`;
    fade(ctx.pl, o.toFixed(3));
    ctx.pt.style.transform = `translate(${(x - tail).toFixed(1)}px,${AYG}px) scaleX(${(tail / 230).toFixed(3)})`;
    fade(ctx.pt, (k < 0 ? o : o * .8).toFixed(3));
    ctx.pNodes.forEach((d, i) => {
      const hit = k < 0 && o > .5 && Math.abs(x - PX[i]) < 46;
      if (hit && !d.classList.contains('hit')) restart(d, 'pass');
      d.classList.toggle('hit', hit);
    });
    // the moment of impact: flash, shards and a ripple in the field
    const hit = k >= 0 && k < .5;
    if (hit && !ctx.hitWall && ctx.active) {
      restart(ctx.flash, 'go'); restart(ctx.wall, 'go'); restart(ctx.wglow, 'go');
      if (window.Field) Field.burst(PEND, AYG - 40, { radius: 240, dur: 1 });
    }
    ctx.hitWall = hit;
  }

  function ring(ctx, now) {
    // the draw runs in real time; the orbit after it runs on the orbit clock
    const el = ctx.draw0 ? (now - ctx.draw0) / 1000 : -1;
    const ct = clock(ctx, 'oclock');
    const orbit = ct == null ? 0 : Math.max(0, ct - DRAW_AT - DRAW);
    let p, a, head;
    if (el < 0) { p = 0; a = -45; head = 0; }
    else if (el < DRAW) { p = ease(el / DRAW); a = -45 + 360 * p; head = 1; }
    else { p = 1; a = -45 + 360 * (orbit / LAP); head = Math.max(0, 1 - (el - DRAW) / .7); }
    const off = (100 - 100 * p).toFixed(2);
    if (ctx.rOff !== off) { ctx.rOff = off; ctx.rdraw.style.strokeDashoffset = off; }   // only while the ring draws
    const [x, y] = at(a, R);
    place(ctx.ol, x, y); place(ctx.flare, x, y);
    fade(ctx.ol, el < 0 ? '0' : '1');
    fade(ctx.flare, head.toFixed(3));
    // the comet tail follows the light (flat on the disc); while the ring draws it grows with the stroke
    ctx.comet.style.transform = `rotate(${(a + 90).toFixed(2)}deg)`;
    fade(ctx.comet, el < 0 ? '0' : Math.min(1, (360 * p) / 110).toFixed(3));
    // once the cycle repeats, a second story joins it half a lap behind the first
    const a2 = a - 180, two = ctx.step >= 1 && el >= JOIN;
    const [x2, y2] = at(a2, R);
    place(ctx.ol2, x2, y2);
    ctx.comet2.style.transform = `rotate(${(a2 + 90).toFixed(2)}deg)`;
    ctx.ol2.classList.toggle('on', two); ctx.comet2.classList.toggle('on', two);
    // each node's halo flares as a light passes through it; its connector carries
    // a pulse out to the card, and the card's edge lights
    const near = (ang, i) => Math.abs(mod(mod(ang, 360) - STAGES[i].a + 180, 360) - 180) < 11;
    ctx.nws.forEach((nw, i) => {
      const hit = ctx.step >= 1 && el >= DRAW - .05 && (near(a, i) || (two && near(a2, i)));
      if (hit && !nw.classList.contains('hit')) {
        restart(nw, 'pass'); ctx.rips[i].forEach((r) => restart(r, 'go')); restart(ctx.pulses[i], 'go'); restart(ctx.cards[i], 'pass');
        // after the repeat: each pass sends a story out of the ring into the field
        if (el >= DRAW + .2 && ctx.active && window.Field && now - ctx.sent > 600) {
          ctx.sent = now;
          const [nx, ny] = at(STAGES[i].a, R + 60), [fx, fy] = at(STAGES[i].a + (i % 2 ? -18 : 18), R + 520);
          Field.send(nx, ny, fx, fy, 1.8);
        }
        // every time a story comes back round to Capture, a pulse spreads across the disc
        // (the first one, as the draw closes, is the live build's)
        if (i === 0 && el >= DRAW + .5) restart(ctx.laps[(ctx.lapK++) % 2], 'go');
      }
      nw.classList.toggle('hit', hit);
    });
  }
})();
