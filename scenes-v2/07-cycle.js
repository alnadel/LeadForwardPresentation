/* 07 · The cycle (v2) — two lanes become a ring, and the ring keeps turning.
   Stop 0: two full-width lanes. The award lane (purple) draws to a wall; its light
   runs into the wall and shatters. The story lane (teal) draws behind a leading
   light, its nodes materialise as the light passes, and the story light loops back
   to its start with a comet tail, lighting every node it passes.
   Stop 1: the award lane falls away, the story loop contracts into the ring, and
   the ring draws behind a leading light; each node materialises as the light
   passes it and a connector carries it out to its glass card. The light keeps
   orbiting; every pass flares the node and lights its card.
   Stop 2: the cycle repeats. The ring brightens, a second story joins the orbit,
   an inner ring turns, every lap sends a pulse out, stories leave the ring into
   the field, and each card unfolds its principle. */
(function () {
  const mod = (v, m) => ((v % m) + m) % m;
  // the lane draws run on an ease-in-out sine (CSS cubic-bezier(.37,0,.63,1)); tAt is
  // its inverse: when a draw that starts at dl and lasts dd reaches fraction f
  const tAt = (f, dl, dd) => dl + Math.acos(1 - 2 * Math.min(1, Math.max(0, f))) / Math.PI * dd;

  /* ── stop 0 · lanes (stage px) ─────────────────────────────────────── */
  const Y1 = 514, Y2 = 744, BOT = 896, CAPX = 112;
  const TX = [282, 612, 942, 1272, 1602];
  const TW = ['Experience', 'Story', 'Behaviour', 'Inspiration', 'More stories'];
  const TI = ['hands-teamwork', 'person-message', 'gear-clock', 'eye-lightbulb', 'users-connected'];
  const PX = [282, 612], PW = ['Achievement', 'Recognition'], PI = ['chart-growth', 'document-certified'];
  const WALL = 942, PEND = WALL - 20;       // the award lane stops where the story lane reaches Behaviour
  const LOOP = `M${TX[0]} ${Y2} L${TX[4]} ${Y2} C${TX[4] + CAPX} ${Y2} ${TX[4] + CAPX} ${BOT} ${TX[4]} ${BOT} L${TX[0]} ${BOT} C${TX[0] - CAPX} ${BOT} ${TX[0] - CAPX} ${Y2} ${TX[0]} ${Y2}`;
  const RETURN = `M${TX[4]} ${Y2} C${TX[4] + CAPX} ${Y2} ${TX[4] + CAPX} ${BOT} ${TX[4]} ${BOT} L${TX[0]} ${BOT} C${TX[0] - CAPX} ${BOT} ${TX[0] - CAPX} ${Y2} ${TX[0]} ${Y2}`;
  const PLINE = `M${PX[0]} ${Y1} L${PEND} ${Y1}`, TLINE = `M${TX[0]} ${Y2} L${TX[4]} ${Y2}`;
  const TOP = TX[4] - TX[0];
  // the build (s after the click; CSS adds the entrance delay itself)
  const PD = { dl: .3, dd: .56 };      // the award lane draws
  const TD = { dl: .42, dd: .62 };     // the story lane draws
  const RD = { dl: 1.02, dd: .6 };     // the return loop draws
  const pT = PX.map((x) => tAt((x - PX[0]) / (PEND - PX[0]), PD.dl, PD.dd) - .06);
  const tT = TX.map((x) => tAt((x - TX[0]) / TOP, TD.dl, TD.dd) - .06);
  const PERIOD = 6.4;           // one lap of the story lane, seconds
  const LIGHTS_AT = 1.9;        // loop time (from the click) when the lane lights start

  /* ── stops 1–2 · the ring ──────────────────────────────────────────── */
  const CX = 960, CY = 640, R = 276, ROUT = 316, RIN = 184;
  const DRAW = 1.0, DRAW_AT = .15;   // the ring draws in 1 s, .15 s after the click
  const LAP = 7.2;                    // one orbit, seconds
  const CIRCLE = `M${CX + R} ${CY} A${R} ${R} 0 1 1 ${CX - R} ${CY} A${R} ${R} 0 1 1 ${CX + R} ${CY}`;
  const STAGES = [
    { n: '01', t: 'Capture', s: 'Peer or leader nomination through a short, clear form.', p: 'Employee voice', a: -45, ic: 'person-message' },
    { n: '02', t: 'Curate', s: 'Verify facts, secure consent and link the story to one value.', p: 'Fair selection', a: 45, ic: 'document-certified' },
    { n: '03', t: 'Feature', s: 'Publish a short, authentic story across relevant channels.', p: 'Visible recognition', a: 135, ic: 'content-layout' },
    { n: '04', t: 'Reinforce', s: 'Recognise the contribution, share the takeaway and track response.', p: 'Organisational learning', a: 225, ic: 'handshake' },
  ];
  const CARD = { w: 492, l: 144, r: 1284, topEnd: 590, botTop: 688 };   // top cards grow upward, bottom cards downward
  const rad = (a) => a * Math.PI / 180;
  const at = (a, r) => [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))];
  const ease = (u) => (1 - Math.cos(Math.PI * u)) / 2;            // the ring's draw (ease in-out)
  const drawTime = (f) => Math.acos(1 - 2 * f) / Math.PI * DRAW;  // when the draw reaches fraction f
  const chev = (x, y, deg, cls, extra) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg})"><path class="${cls}" ${extra || ''} d="M-8 -12 L6 0 L-8 12"/></g>`;
  // each node materialises as the drawing light passes it
  const SWEEP = STAGES.map((s, i) => Math.max(.08, DRAW_AT + drawTime(i / 4) - .08));
  const NH = 50;                // node half-size

  const nodes = STAGES.map((s, i) => {
    const [x, y] = at(s.a, R);
    return `<div class="cy-nw a-materialize" data-in="1" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;--d:${SWEEP[i].toFixed(2)}s;--dur:.75s">
        <b class="cy-halo"></b><b class="cy-rip"></b><b class="cy-rip r2"></b><div class="cy-nd">${s.n}</div>
      </div>`;
  }).join('');

  // connectors: node → card, drawn as the ring's light passes the node
  const conns = STAGES.map((s, i) => {
    const [x, y] = at(s.a, R);
    const right = i < 2;
    const x0 = right ? x + NH + 10 : x - NH - 10, x1 = right ? CARD.r - 6 : CARD.l + CARD.w + 6;
    return { d: `M${x0.toFixed(0)} ${y.toFixed(0)} L${x1} ${y.toFixed(0)}`, x1, y, right };
  });
  const connSvg = conns.map((c, i) => `<path class="cy-cn" d="${c.d}" pathLength="1" style="--dl:${(SWEEP[i] + .1).toFixed(2)}s"/>`).join('');
  const connEnds = conns.map((c, i) => `<i class="cy-cend" style="left:${c.x1}px;top:${c.y.toFixed(0)}px;--dl:${(SWEEP[i] + .38).toFixed(2)}s"></i>
      <i class="cy-cpulse" style="offset-path:path('${c.d}')"></i>`).join('');

  const cards = STAGES.map((s, i) => {
    const right = i < 2, top = i === 0 || i === 3;
    const pos = `${right ? `left:${CARD.r}px` : `left:${CARD.l}px`};${top ? `bottom:${1080 - CARD.topEnd}px` : `top:${CARD.botTop}px`}`;
    return `<div class="cy-cw a-unfold" data-in="1" style="${pos};--d:${(SWEEP[i] + .16).toFixed(2)}s;--dur:.72s">
        <div class="cy-card glass ${top ? 'tp' : 'bt'}" style="--k:${i}">
          <div class="cy-ch">${Deck.icon(s.ic, 'cy-ic')}<span class="cy-t">${s.t}</span></div>
          <p class="cy-s">${s.s}</p>
          <div class="cy-pf"><div class="cy-p"><i></i>${s.p}</div></div>
        </div>
      </div>`;
  }).join('');

  // chevrons flow round the ring (slower than the light), dipping out as they pass under a node
  const chevrons = Array.from({ length: 12 }, (_, k) => `<i class="cy-cv" style="offset-path:path('${CIRCLE}');animation-delay:${(-k * 16 / 12).toFixed(2)}s"><svg viewBox="-10 -13 20 26" aria-hidden="true"><path d="M-6 -10 L5 0 L-6 10"/></svg></i>`).join('');

  // the award light shatters against the wall: shards fly back
  const shards = [[-80, -40], [-110, -10], [-74, 30], [-46, -62], [-126, 34], [-58, 56], [-140, -30], [-30, 70]].map(([dx, dy], i) => `<b style="--dx:${dx}px;--dy:${dy}px;--r:${(i * 67) % 180}deg"></b>`).join('');
  // dust motes rising off the story lane
  const dust = [[330, 800, 15, -2, 30, -170], [520, 870, 18, -9, -20, -210], [760, 760, 14, -5, 40, -160], [1000, 860, 17, -12, -30, -200], [1180, 790, 15, -7, 24, -180],
    [1400, 880, 19, -3, -36, -220], [1560, 770, 16, -10, 30, -170], [880, 900, 18, -14, 20, -230], [640, 780, 16, -6, -26, -190], [1320, 760, 14, -11, 18, -160]]
    .map(([x, y, t, dl, dx, dy]) => `<i style="left:${x}px;top:${y}px;--t:${t}s;--dl:${dl}s;--dx:${dx}px;--dy:${dy}px"></i>`).join('');

  const laneNode = (x, y, ic, cls, d) => `<div class="cy-ln ${cls}" style="left:${x}px;top:${y}px"><b class="cy-lrip"></b><div class="cy-lnd a-materialize" data-in="0" style="--d:${d.toFixed(2)}s;--dur:.6s"><div class="cy-lnf">${Deck.icon(ic)}</div></div></div>`;
  const laneLabel = (x, y, w, cls, d) => `<div class="cy-st ${cls}" data-in="0" style="left:${x}px;top:${y - 50}px;--d:${d.toFixed(2)}s;--dur:.6s">${w}</div>`;

  Deck.scene({
    id: 'cycle',
    title: 'The cycle',
    act: 2,
    bg: 'teal',
    transition: 'iris',
    cues: ['What is new · two lanes', 'The cycle · four stages', 'The cycle repeats'],
    holds: [9, 12, 9],
    notes: [
      'Most recognition runs the top lane: an achievement earns recognition, and it ends there. The bottom lane keeps going: an experience becomes a story, the story shows a behaviour, it inspires someone, and more stories follow.',
      'That loop is the solution, in four steps. Capture: a peer or leader nominates through a short form. Curate: check facts, secure consent, link one value. Feature: a short story on existing channels. Reinforce: recognise, share the takeaway.',
      'Then it repeats. Each step protects a principle: employee voice, fair selection, visible recognition, organisational learning. Next, one illustrative story all the way round.',
    ],
    field: [
      { dim: .3, lit: .02, travel: .22, offset: [150, -70], litFrom: null, links: .5, wave: .5, streaks: .14, sparkle: 1, calm: [[100, 120, 1500, 380, .85], [120, 400, 1760, 950, .55]] },
      { dim: .44, lit: .06, litFrom: [CX, CY], travel: .45, links: .8, wave: .7, streaks: .22, sparkle: 2.2, calm: [[100, 120, 1300, 300, .85], [120, 320, 660, 960, .8], [1260, 320, 1800, 960, .8]] },
      { dim: .5, lit: .1, travel: .7, wave: .9, sparkle: 3, streaks: .28, calm: [[100, 120, 1300, 300, .85], [120, 320, 660, 960, .8], [1260, 320, 1800, 960, .8], [800, 540, 1120, 740, .8]] },
    ],
    html: `
      <!-- stop 0 · two lanes -->
      <div class="pad cy-head">
        <div class="kicker" data-in="0" data-out="1">What is new</div>
        <h2 class="h2 cy-h" data-in="0" data-out="1" data-split style="--d:.15s">Most recognition <em class="cy-stop">stops</em> at the award.<br><em class="hl cy-keep" data-spark="0" data-spark-at="r">This keeps going.</em></h2>
      </div>

      <div class="cy-lanes" data-out="1">
        <!-- the award lane: it ends at the wall -->
        <div class="cy-grp cy-gp">
          <i class="cy-haze" style="left:${PX[0] - 200}px;top:${Y1 - 150}px"></i>
          <i class="cy-wglow" style="left:${WALL}px;top:${Y1}px"></i>
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            <path class="cy-road p" d="${PLINE}"/>
            <path class="cy-track p cy-draw" d="${PLINE}" pathLength="1" style="--dl:${PD.dl}s;--dd:${PD.dd}s"/>
            <g class="cy-chevs0 p">${chev((PX[0] + PX[1]) / 2, Y1, 0, 'cy-chev-p')}${chev((PX[1] + PEND) / 2 + 6, Y1, 0, 'cy-chev-p')}</g>
          </svg>
          <i class="cy-lead p" style="offset-path:path('${PLINE}');--dl:${PD.dl}s;--dd:${PD.dd}s"></i>
          <div class="cy-lanelights a-fade" data-in="0" style="--d:${(LIGHTS_AT - .3).toFixed(2)}s;--dur:.4s">
            <i class="cy-ptrail"></i><i class="cy-plight"></i>
          </div>
          ${PX.map((x, i) => laneNode(x, Y1, PI[i], 'p', pT[i]) + laneLabel(x, Y1, PW[i], 'p', pT[i])).join('')}
          <div class="cy-wallw a-materialize" data-in="0" style="left:${WALL}px;top:${Y1}px;--d:${(PD.dl + PD.dd - .05).toFixed(2)}s;--dur:.6s"><i class="cy-wall"></i></div>
          <div class="cy-end a-right" data-in="0" style="left:${WALL + 44}px;top:${Y1}px;--d:${(PD.dl + PD.dd).toFixed(2)}s;--dur:.7s">it ends here</div>
          <div class="cy-flash" style="left:${WALL}px;top:${Y1}px"><b class="cy-burst"></b><b class="cy-ring1"></b><b class="cy-ring1 r2"></b><span class="cy-shards">${shards}</span></div>
        </div>

        <!-- the story lane: it loops back and keeps going -->
        <div class="cy-grp cy-gt">
          <i class="cy-pool" style="left:${(TX[0] + TX[4]) / 2 - 900}px;top:${(Y2 + BOT) / 2 - 260}px"></i>
          <div class="amb-dust cy-dust a-fade" data-in="0" style="--d:1.4s">${dust}</div>
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            <defs><mask id="cyRetMask" maskUnits="userSpaceOnUse" x="0" y="0" width="1920" height="1080"><path class="cy-draw cy-retm" d="${RETURN}" pathLength="1" style="--dl:${RD.dl}s;--dd:${RD.dd}s"/></mask></defs>
            <path class="cy-road t" d="${LOOP}"/>
            <path class="cy-ret" d="${RETURN}" mask="url(#cyRetMask)"/>
            <path class="cy-track t cy-draw" d="${TLINE}" pathLength="1" style="--dl:${TD.dl}s;--dd:${TD.dd}s"/>
            <g class="cy-chevs0 t">
              ${TX.slice(0, 4).map((x, i) => chev((x + TX[i + 1]) / 2, Y2, 0, 'cy-chev-t', `style="--k:${i}"`)).join('')}
              ${TX.slice(0, 4).map((x, i) => chev((x + TX[i + 1]) / 2, BOT, 180, 'cy-chev-r', `style="--k:${3 - i}"`)).join('')}
            </g>
          </svg>
          <i class="cy-lead t" style="offset-path:path('${TLINE}');--dl:${TD.dl}s;--dd:${TD.dd}s"></i>
          <i class="cy-lead r" style="offset-path:path('${RETURN}');--dl:${RD.dl}s;--dd:${RD.dd}s"></i>
          <div class="cy-lanelights a-fade" data-in="0" style="--d:${(LIGHTS_AT - .3).toFixed(2)}s;--dur:.4s">
            <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
              ${[320, 210, 120, 48].map((len, i) => `<path class="cy-ttr t${i}" d="${LOOP}" data-len="${len}"/>`).join('')}
            </svg>
            <i class="cy-tglow"></i>
            <i class="light cy-tlight"></i>
          </div>
          ${TX.map((x, i) => laneNode(x, Y2, TI[i], 't', tT[i]) + laneLabel(x, Y2, TW[i], 't', tT[i])).join('')}
        </div>
      </div>

      <!-- stop 1 · the ring -->
      <div class="pad cy-head">
        <div class="kicker" data-in="1" style="--d:.2s">The solution</div>
        <h2 class="h2 cy-h" data-in="1" data-split style="--d:.28s">A simple story-to-impact cycle.</h2>
      </div>

      <div class="cy-ring a-fade" data-in="1" style="--d:.05s;--dur:.5s">
        <div class="cy-glow" style="left:${CX - 380}px;top:${CY - 380}px"></div>
        <div class="cy-outer" style="left:${CX - ROUT - 6}px;top:${CY - ROUT - 6}px;width:${2 * ROUT + 12}px;height:${2 * ROUT + 12}px">
          <svg viewBox="0 0 ${2 * ROUT + 12} ${2 * ROUT + 12}" aria-hidden="true">
            <circle class="cy-o1" cx="${ROUT + 6}" cy="${ROUT + 6}" r="${ROUT}"/>
            <circle class="cy-o2" cx="${ROUT + 6}" cy="${ROUT + 6}" r="${ROUT}" pathLength="360"/>
          </svg>
        </div>
        <div class="cy-inner" style="left:${CX - RIN - 14}px;top:${CY - RIN - 14}px;width:${2 * RIN + 28}px;height:${2 * RIN + 28}px">
          <svg viewBox="0 0 ${2 * RIN + 28} ${2 * RIN + 28}" aria-hidden="true">
            <circle class="cy-i1" cx="${RIN + 14}" cy="${RIN + 14}" r="${RIN}" pathLength="360"/>
            ${[140, 320].map((a) => { const x = RIN + 14 + RIN * Math.cos(rad(a)), y = RIN + 14 + RIN * Math.sin(rad(a)); return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a + 90})"><path class="cy-i2" d="M-4 -10 L12 0 L-4 10 Z"/></g>`; }).join('')}
          </svg>
        </div>
        <svg class="cy-svg cy-rsvg" viewBox="0 0 1920 1080" aria-hidden="true" data-spark="1" data-spark-xy="${CX},${CY}">
          <circle class="cy-rtrack" cx="${CX}" cy="${CY}" r="${R}"/>
          <circle class="cy-rwide" cx="${CX}" cy="${CY}" r="${R}"/>
          <circle class="cy-rdraw" cx="${CX}" cy="${CY}" r="${R}" pathLength="100" transform="rotate(-45 ${CX} ${CY})"/>
          ${connSvg}
        </svg>
        <div class="cy-chevs a-fade" data-in="1" style="--d:${(DRAW_AT + DRAW - .1).toFixed(2)}s;--dur:.8s">${chevrons}</div>
        <i class="cy-lap" style="left:${CX - R}px;top:${CY - R}px;width:${2 * R}px;height:${2 * R}px"></i>
        <i class="cy-lap l2" style="left:${CX - R}px;top:${CY - R}px;width:${2 * R}px;height:${2 * R}px"></i>
        <i class="cy-comet" style="left:${CX - R - 22}px;top:${CY - R - 22}px;width:${2 * R + 44}px;height:${2 * R + 44}px"></i>
        <i class="cy-comet c2" style="left:${CX - R - 22}px;top:${CY - R - 22}px;width:${2 * R + 44}px;height:${2 * R + 44}px"></i>
        ${connEnds}
      </div>
      <div class="cy-orbit"><i class="cy-flare"></i><i class="light cy-olight"></i><i class="light cy-olight c2"></i></div>
      ${nodes}
      ${cards}

      <!-- the clocks of the JS-driven lights: CSS animations the loop reads, so those lights
           keep the same timeline as every CSS loop (and pause with them) -->
      <i class="cy-clock lane"></i><i class="cy-clock orbit"></i>

      <!-- stop 2 · it repeats -->
      <div class="cy-core" style="left:${CX}px;top:${CY}px"></div>
      <div class="cy-rep a-scale" data-in="2" data-spark="2" data-spark-at="t" style="left:${CX - 200}px;top:${CY - 54}px;--d:.12s"><span>The cycle<br>repeats</span></div>
    `,
    init(ctx) {
      ctx.geo = ctx.$('.cy-ttr');
      ctx.tl = ctx.$('.cy-tlight');
      ctx.tg = ctx.$('.cy-tglow');
      ctx.pl = ctx.$('.cy-plight');
      ctx.pt = ctx.$('.cy-ptrail');
      ctx.ttr = ctx.$$('.cy-ttr').map((c) => ({ c, len: +c.dataset.len }));
      ctx.tNodes = ctx.$$('.cy-ln.t');
      ctx.pNodes = ctx.$$('.cy-ln.p');
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
      ctx.cards = ctx.$$('.cy-card');
      ctx.pulses = ctx.$$('.cy-cpulse');
      ctx.lclock = ctx.$('.cy-clock.lane');
      ctx.oclock = ctx.$('.cy-clock.orbit');
      ctx.draw0 = 0;
      ctx.len = 0;
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
    step(n, prev, ctx) {
      const forward = !ctx.instant && prev < n;
      // one-shot flourishes (leading lights, the surge) play only on a forward build
      ctx.el.dataset.play = forward ? String(n) : '';
      // the ring draws when stop 1 is reached going forward; walking back from
      // stop 2 keeps it drawn and the light orbiting where it is
      if (n >= 1 && (prev < 1 || !ctx.draw0)) {
        ctx.draw0 = performance.now() + (ctx.instant ? -DRAW * 1000 : DRAW_AT * 1000);
        // landing on the ring: it is already drawn, so the orbit clock skips the draw
        const a = anim(ctx.oclock);
        if (ctx.instant && a) a.currentTime = (DRAW_AT + DRAW) * 1000;
      }
      if (n < 1) ctx.draw0 = 0;
      ring(ctx, performance.now());
      if (n <= 0) { ctx.hitWall = false; ctx.flash.classList.remove('go'); ctx.wall.classList.remove('go'); ctx.wglow.classList.remove('go'); }
      // the cycle repeats: a ripple from the centre that stays inside the ring
      if (n === 2 && forward) {
        ctx.after(300, () => { restart(ctx.laps[0], 'go'); if (window.Field) Field.burst(CX, CY, { radius: 320, dur: 1.4 }); });
      }
    },
  });

  // a clock's animation and its time in seconds (null when its stop is not reached)
  function anim(el) { const a = el.getAnimations ? el.getAnimations()[0] : null; return a || null; }
  function clock(el) { const a = anim(el); return a && a.currentTime != null ? a.currentTime / 1000 : null; }
  function place(el, x, y) { el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; }
  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function lanes(ctx) {
    const t = clock(ctx.lclock);
    if (t == null) return;
    if (!ctx.len) ctx.len = ctx.geo.getTotalLength();
    const L = ctx.len, v = L / PERIOD;
    // both lights leave their start together, then the award light every half lap
    const tt = mod(t - LIGHTS_AT, PERIOD);
    const s = tt * v;
    const p = ctx.geo.getPointAtLength(s);
    place(ctx.tl, p.x, p.y); place(ctx.tg, p.x, p.y);
    // the comet tail: stacked segments that end at the light (the dash pattern wraps with the lap)
    ctx.ttr.forEach(({ c, len }) => {
      c.style.strokeDasharray = len + ' ' + (L - len).toFixed(1);
      c.style.strokeDashoffset = (len - s).toFixed(1);
    });
    ctx.tNodes.forEach((d, i) => {
      const at0 = TX[i] - TX[0];
      const hit = (s < TOP + 30 && Math.abs(s - at0) < 46) || (i === 0 && s > L - 34);
      if (hit && !d.classList.contains('hit')) restart(d, 'pass');
      d.classList.toggle('hit', hit);
    });
    // the award light: same pace, but it runs into the wall and shatters
    const tp = mod(t - LIGHTS_AT, PERIOD / 2);
    const run = PEND - PX[0];
    const sp = tp * v;
    let x, o, k = -1, tail;
    if (sp < run) {
      x = PX[0] + sp; o = Math.min(1, tp / .2); tail = Math.min(230, sp);
    } else {
      k = tp - run / v;
      x = PEND; o = Math.max(0, 1 - k / .35); tail = Math.max(0, 230 - k * 1000);
    }
    ctx.pl.style.transform = `translate(${x.toFixed(1)}px,${Y1}px) scale(${k < 0 ? 1 : Math.max(.3, 1 - k * 2.2).toFixed(3)},${k < 0 ? 1 : (1 + Math.min(k, .3) * 1.4).toFixed(3)})`;
    ctx.pl.style.opacity = o.toFixed(3);
    ctx.pt.style.transform = `translate(${(x - tail).toFixed(1)}px,${Y1}px) scaleX(${(tail / 230).toFixed(3)})`;
    ctx.pt.style.opacity = (k < 0 ? o : o * .8).toFixed(3);
    ctx.pNodes.forEach((d, i) => {
      const hit = k < 0 && o > .5 && Math.abs(x - PX[i]) < 46;
      if (hit && !d.classList.contains('hit')) restart(d, 'pass');
      d.classList.toggle('hit', hit);
    });
    // the moment of impact: flash, shards and a ripple in the field
    const hit = k >= 0 && k < .5;
    if (hit && !ctx.hitWall && ctx.active) {
      restart(ctx.flash, 'go'); restart(ctx.wall, 'go'); restart(ctx.wglow, 'go');
      if (window.Field) Field.burst(WALL, Y1, { radius: 240, dur: 1 });
    }
    ctx.hitWall = hit;
  }

  function ring(ctx, now) {
    // the draw runs in real time; the orbit after it runs on the orbit clock
    const el = ctx.draw0 ? (now - ctx.draw0) / 1000 : -1;
    const ct = clock(ctx.oclock);
    const orbit = ct == null ? 0 : Math.max(0, ct - DRAW_AT - DRAW);
    let p, a, head;
    if (el < 0) { p = 0; a = -45; head = 0; }
    else if (el < DRAW) { p = ease(el / DRAW); a = -45 + 360 * p; head = 1; }
    else { p = 1; a = -45 + 360 * (orbit / LAP); head = Math.max(0, 1 - (el - DRAW) / .7); }
    ctx.rdraw.style.strokeDashoffset = (100 - 100 * p).toFixed(2);
    const [x, y] = at(a, R);
    place(ctx.ol, x, y); place(ctx.flare, x, y);
    ctx.ol.style.opacity = el < 0 ? 0 : 1;
    ctx.flare.style.opacity = head.toFixed(3);
    // the comet tail follows the light; while the ring draws it grows with the stroke
    ctx.comet.style.transform = `rotate(${(a + 90).toFixed(2)}deg)`;
    ctx.comet.style.opacity = el < 0 ? 0 : Math.min(1, (360 * p) / 110).toFixed(3);
    // stop 2: a second story joins the cycle half a lap behind the first
    const a2 = a - 180, two = ctx.step >= 2 && el >= DRAW;
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
        restart(nw, 'pass'); restart(ctx.pulses[i], 'go'); restart(ctx.cards[i], 'pass');
        // stop 2: each pass sends a story out of the ring into the field
        if (ctx.step >= 2 && ctx.active && window.Field && now - ctx.sent > 600) {
          ctx.sent = now;
          const [nx, ny] = at(STAGES[i].a, R + 60), [fx, fy] = at(STAGES[i].a + (i % 2 ? -18 : 18), R + 420);
          Field.send(nx, ny, fx, fy, 1.8);
        }
        // stop 2: every time a story comes back round to Capture, a pulse leaves the ring
        if (i === 0 && ctx.step >= 2) restart(ctx.laps[(ctx.lapK++) % 2], 'go');
      }
      nw.classList.toggle('hit', hit);
    });
  }
})();
