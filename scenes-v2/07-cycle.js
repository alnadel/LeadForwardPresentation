/* 07 · The cycle (v2) — two lanes become a ring, and the ring keeps turning.
   Stop 0: the two lanes race. The award light (purple) runs into its wall and
   flashes out; the story light (teal) trails a comet tail and loops back to its
   start. Stop 1: the ring draws behind a leading light, the four nodes
   materialise as it passes them, and the light keeps orbiting with a comet tail.
   Chevrons flow round the ring, each node's halo flares as the light passes, and
   a faint outer ring turns slowly. Stop 2: the cycle repeats; every lap sends a
   pulse out from the ring, and each stage shows its principle. */
(function () {
  // ring geometry (stage px)
  const CX = 960, CY = 610, R = 220, ROUT = 262;
  const BX = 302;               // the stage blocks keep this far from the centre line
  // lane geometry
  const Y1 = 516, Y2 = 742, BOT = Y2 + 116, CAPX = 77;
  const TX = [300, 615, 930, 1245, 1560];
  const TW = ['Experience', 'Story', 'Behaviour', 'Inspiration', 'More stories'];
  const PX = [300, 615], PW = ['Achievement', 'Recognition'], WALL = 800;
  const LOOP = `M${TX[0]} ${Y2} L${TX[4]} ${Y2} C${TX[4] + CAPX} ${Y2} ${TX[4] + CAPX} ${BOT} ${TX[4]} ${BOT} L${TX[0]} ${BOT} C${TX[0] - CAPX} ${BOT} ${TX[0] - CAPX} ${Y2} ${TX[0]} ${Y2}`;
  const RETURN = `M${TX[4]} ${Y2} C${TX[4] + CAPX} ${Y2} ${TX[4] + CAPX} ${BOT} ${TX[4]} ${BOT} L${TX[0]} ${BOT} C${TX[0] - CAPX} ${BOT} ${TX[0] - CAPX} ${Y2} ${TX[0]} ${Y2}`;
  const TOP = TX[4] - TX[0];
  const PERIOD = 6;             // one lap of the story lane, seconds (racing)
  const LIGHTS_AT = 1.3;        // the lane lights appear this long after the scene enters
  const DRAW = 1.0, DRAW_AT = .15;   // the ring draws in 1 s, .15 s after the click
  const LAP = 7.5;              // one orbit of the ring, seconds
  const CIRCLE = `M${CX + R} ${CY} A${R} ${R} 0 1 1 ${CX - R} ${CY} A${R} ${R} 0 1 1 ${CX + R} ${CY}`;

  const STAGES = [
    { n: '01', t: 'Capture', s: 'Peer or leader nomination through a short, clear form.', p: 'Employee voice', a: -45 },
    { n: '02', t: 'Curate', s: 'Verify facts, secure consent and link the story to one value.', p: 'Fair selection', a: 45 },
    { n: '03', t: 'Feature', s: 'Publish a short, authentic story across relevant channels.', p: 'Visible recognition', a: 135 },
    { n: '04', t: 'Reinforce', s: 'Recognise the contribution, share the takeaway and track response.', p: 'Organisational learning', a: 225 },
  ];
  const rad = (a) => a * Math.PI / 180;
  const at = (a, r) => [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))];
  const ease = (u) => (1 - Math.cos(Math.PI * u)) / 2;            // the ring's draw (ease in-out)
  const drawTime = (f) => Math.acos(1 - 2 * f) / Math.PI * DRAW;  // when the draw reaches fraction f
  const chev = (x, y, deg, cls, extra) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg})"><path class="${cls}" ${extra || ''} d="M-6 -9 L4 0 L-6 9"/></g>`;
  const mod = (v, m) => ((v % m) + m) % m;

  // each node materialises as the drawing light passes it
  const SWEEP = STAGES.map((s, i) => Math.max(.08, DRAW_AT + drawTime(i / 4) - .08));

  const nodes = STAGES.map((s, i) => {
    const [x, y] = at(s.a, R);
    return `<div class="cy-nw a-materialize" data-in="1" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;--d:${SWEEP[i].toFixed(2)}s;--dur:.75s">
        <b class="cy-halo"></b><b class="cy-rip"></b><b class="cy-rip r2"></b><div class="cy-nd">${s.n}</div>
      </div>`;
  }).join('');

  const blocks = STAGES.map((s, i) => {
    const [, y] = at(s.a, R);
    const right = i < 2;
    const pos = right ? `left:${CX + BX}px` : `right:${1920 - CX + BX}px`;
    return `<div class="cy-blk ${right ? 'r' : 'l'}" data-in="1" style="${pos};top:${(y - 22).toFixed(0)}px;--d:${(SWEEP[i] + 0.06).toFixed(2)}s;--dur:.7s">
        <div class="cy-t">${s.t}</div>
        <p class="cy-s">${s.s}</p>
        <div class="cy-p a-fade" data-in="2" style="--d:${(0.4 + i * 0.14).toFixed(2)}s"><i></i>${s.p}</div>
      </div>`;
  }).join('');

  // chevrons flow round the ring (slower than the light), dipping out as they pass under a node
  const chevrons = Array.from({ length: 12 }, (_, k) => `<i class="cy-cv" style="offset-path:path('${CIRCLE}');animation-delay:${(-k * 16 / 12).toFixed(2)}s"><svg viewBox="-9 -11 18 22" aria-hidden="true"><path d="M-5 -8 L4 0 L-5 8"/></svg></i>`).join('');

  // the award light shatters against the wall: a few shards fly back
  const shards = [[-70, -34], [-96, -8], [-64, 26], [-40, -52], [-110, 30], [-50, 48]].map(([dx, dy], i) => `<b style="--dx:${dx}px;--dy:${dy}px;--r:${(i * 67) % 180}deg"></b>`).join('');

  Deck.scene({
    id: 'cycle',
    title: 'The cycle',
    act: 3,
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
      { dim: .3, lit: .02, travel: .22, offset: [150, -70], litFrom: null, links: .5, wave: .5, streaks: .14, sparkle: 1, calm: [[100, 120, 1500, 380, .85], [140, 420, 1720, 900, .5]] },
      { dim: .4, lit: .05, litFrom: [CX, CY], travel: .35, links: .7, wave: .6, sparkle: 1.9, calm: [[100, 120, 1300, 300, .85], [120, 400, 680, 940, .72], [1240, 400, 1800, 940, .72]] },
      { lit: .08, travel: .5, wave: .7, sparkle: 1.9, calm: [[100, 120, 1300, 300, .85], [120, 400, 680, 950, .72], [1240, 400, 1800, 950, .72], [820, 540, 1100, 700, .8]] },
    ],
    html: `
      <!-- stop 0 · two lanes -->
      <div class="pad cy-head">
        <div class="kicker" data-in="0" data-out="1">What is new</div>
        <h2 class="h2 cy-h" data-in="0" data-out="1" data-split style="--d:.15s">Most recognition stops at the award.<br><em class="hl cy-keep" data-spark="0" data-spark-at="r">This keeps going.</em></h2>
      </div>

      <div class="cy-lanes" data-out="1">
        <div class="cy-lane cy-lane-p a-wipe" data-in="0" style="--d:.5s;--dur:1.1s">
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            <line class="cy-track-p" x1="${PX[0]}" y1="${Y1}" x2="${WALL - 8}" y2="${Y1}"/>
            ${chev((PX[0] + PX[1]) / 2, Y1, 0, 'cy-chev-p')}
          </svg>
          ${PX.map((x, i) => `<div class="cy-st p" style="left:${x}px;top:${Y1 - 70}px">${PW[i]}</div><i class="cy-dot p" style="left:${x}px;top:${Y1}px"></i>`).join('')}
          <i class="cy-wall" style="left:${WALL}px;top:${Y1}px"></i>
          <div class="cy-end" style="left:${WALL + 30}px;top:${Y1}px">it ends here</div>
        </div>

        <div class="cy-lane cy-lane-t a-wipe" data-in="0" style="--d:.7s;--dur:1.3s">
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            <path class="cy-ret" d="${RETURN}"/>
            <line class="cy-track-t" x1="${TX[0]}" y1="${Y2}" x2="${TX[4]}" y2="${Y2}"/>
            ${TX.slice(0, 4).map((x, i) => chev((x + TX[i + 1]) / 2, Y2, 0, 'cy-chev-t', `style="--k:${i}"`)).join('')}
            ${chev((TX[0] + TX[4]) / 2, BOT, 180, 'cy-chev-r')}
            <path class="cy-geo" d="${LOOP}"/>
          </svg>
          ${TX.map((x, i) => `<div class="cy-st t" style="left:${x}px;top:${Y2 - 70}px">${TW[i]}</div><i class="cy-dot t" style="left:${x}px;top:${Y2}px"></i>`).join('')}
        </div>

        <div class="cy-lanelights a-fade" data-in="0" style="--d:${LIGHTS_AT}s;--dur:.5s">
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            ${[210, 140, 80, 34].map((len, i) => `<path class="cy-ttr t${i}" d="${LOOP}" data-len="${len}"/>`).join('')}
          </svg>
          <i class="cy-ptrail"></i>
          <i class="cy-plight"></i>
          <i class="cy-tglow"></i>
          <i class="light cy-tlight"></i>
          <div class="cy-flash" style="left:${WALL}px;top:${Y1}px"><b class="cy-burst"></b><b class="cy-ring1"></b><span class="cy-shards">${shards}</span></div>
        </div>
      </div>

      <!-- stop 1 · the ring -->
      <div class="pad cy-head">
        <div class="kicker" data-in="1" style="--d:.2s">The solution</div>
        <h2 class="h2 cy-h" data-in="1" data-split style="--d:.28s">A simple story-to-impact cycle.</h2>
      </div>

      <div class="cy-ring a-fade" data-in="1" style="--d:.05s;--dur:.5s">
        <div class="cy-glow" style="left:${CX - 300}px;top:${CY - 300}px"></div>
        <div class="cy-outer" style="left:${CX - ROUT - 6}px;top:${CY - ROUT - 6}px;width:${2 * ROUT + 12}px;height:${2 * ROUT + 12}px">
          <svg viewBox="0 0 ${2 * ROUT + 12} ${2 * ROUT + 12}" aria-hidden="true">
            <circle class="cy-o1" cx="${ROUT + 6}" cy="${ROUT + 6}" r="${ROUT}"/>
            <circle class="cy-o2" cx="${ROUT + 6}" cy="${ROUT + 6}" r="${ROUT}" pathLength="360"/>
          </svg>
        </div>
        <svg class="cy-svg cy-rsvg" viewBox="0 0 1920 1080" aria-hidden="true" data-spark="1" data-spark-xy="${CX},${CY}">
          <circle class="cy-rtrack" cx="${CX}" cy="${CY}" r="${R}"/>
          <circle class="cy-rdraw" cx="${CX}" cy="${CY}" r="${R}" pathLength="100" transform="rotate(-45 ${CX} ${CY})"/>
        </svg>
        <div class="cy-chevs a-fade" data-in="1" style="--d:${(DRAW_AT + DRAW - .1).toFixed(2)}s;--dur:.8s">${chevrons}</div>
        <i class="cy-lap" style="left:${CX - R}px;top:${CY - R}px;width:${2 * R}px;height:${2 * R}px"></i>
        <i class="cy-comet" style="left:${CX - R - 20}px;top:${CY - R - 20}px;width:${2 * R + 40}px;height:${2 * R + 40}px"></i>
        <i class="cy-comet c2" style="left:${CX - R - 20}px;top:${CY - R - 20}px;width:${2 * R + 40}px;height:${2 * R + 40}px"></i>
      </div>
      <div class="cy-orbit"><i class="cy-flare"></i><i class="light cy-olight"></i><i class="light cy-olight c2"></i></div>
      ${nodes}
      ${blocks}

      <!-- stop 2 · it repeats -->
      <div class="cy-rep a-scale" data-in="2" data-spark="2" data-spark-at="t" style="left:${CX - 200}px;top:${CY - 32}px;--d:.1s"><span>The cycle<br>repeats</span></div>
    `,
    init(ctx) {
      ctx.geo = ctx.$('.cy-geo');
      ctx.tl = ctx.$('.cy-tlight');
      ctx.tg = ctx.$('.cy-tglow');
      ctx.pl = ctx.$('.cy-plight');
      ctx.pt = ctx.$('.cy-ptrail');
      ctx.ttr = ctx.$$('.cy-ttr').map((c) => ({ c, len: +c.dataset.len }));
      ctx.tDots = ctx.$$('.cy-dot.t');
      ctx.pDots = ctx.$$('.cy-dot.p');
      ctx.wall = ctx.$('.cy-wall');
      ctx.flash = ctx.$('.cy-flash');
      ctx.ol = ctx.$('.cy-olight');
      ctx.ol2 = ctx.$('.cy-olight.c2');
      ctx.comet2 = ctx.$('.cy-comet.c2');
      ctx.flare = ctx.$('.cy-flare');
      ctx.comet = ctx.$('.cy-comet');
      ctx.rdraw = ctx.$('.cy-rdraw');
      ctx.lapEl = ctx.$('.cy-lap');
      ctx.nws = ctx.$$('.cy-nw');
      ctx.draw0 = 0;
      ctx.len = 0;
      ctx.hitWall = false;
      ctx.lap = -1;
    },
    enter(ctx) {
      ctx.loop((t) => {
        if (ctx.step <= 0) lanes(ctx, t);
        if (ctx.step >= 1) ring(ctx, performance.now());
      });
    },
    step(n, prev, ctx) {
      // the ring draws when stop 1 is reached going forward; walking back from
      // stop 2 keeps it drawn and the light orbiting where it is
      if (n >= 1 && (prev < 1 || !ctx.draw0)) {
        ctx.draw0 = performance.now() + (ctx.instant ? -DRAW * 1000 : DRAW_AT * 1000);
      }
      if (n < 1) ctx.draw0 = 0;
      ctx.lap = -1;
      ring(ctx, performance.now());
      if (n <= 0) { ctx.hitWall = false; ctx.flash.classList.remove('go'); ctx.wall.classList.remove('go'); }
      // the cycle repeats: a ripple from the centre that stays inside the ring
      if (n === 2 && !ctx.instant) {
        ctx.after(300, () => { restart(ctx.lapEl, 'go'); if (window.Field) Field.burst(CX, CY, { radius: 250, dur: 1.4 }); });
      }
    },
  });

  function place(el, x, y) { el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`; }
  function restart(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); }

  function lanes(ctx, t) {
    if (!ctx.len) ctx.len = ctx.geo.getTotalLength();
    const L = ctx.len, v = L / PERIOD;
    // both lights leave their start together when they appear, then every half lap
    const tt = mod(t - LIGHTS_AT, PERIOD);
    const s = tt * v;
    const p = ctx.geo.getPointAtLength(s);
    place(ctx.tl, p.x, p.y); place(ctx.tg, p.x, p.y);
    // the comet tail: stacked segments that end at the light (the dash pattern wraps with the lap)
    ctx.ttr.forEach(({ c, len }) => {
      c.style.strokeDasharray = len + ' ' + (L - len).toFixed(1);
      c.style.strokeDashoffset = (len - s).toFixed(1);
    });
    ctx.tDots.forEach((d, i) => {
      const at0 = TX[i] - TX[0];
      d.classList.toggle('hit', (s < TOP + 30 && Math.abs(s - at0) < 40) || (i === 0 && s > L - 30));
    });
    // the award light: same pace, but it runs into the wall and flashes out
    const tp = mod(t - LIGHTS_AT, PERIOD / 2);
    const run = WALL - 16 - PX[0];
    const sp = tp * v;
    let x, o, k = -1, tail;
    if (sp < run) {
      x = PX[0] + sp; o = Math.min(1, tp / .2); tail = Math.min(190, sp);
    } else {
      k = tp - run / v;
      x = WALL - 16; o = Math.max(0, 1 - k / .35); tail = Math.max(0, 190 - k * 900);
    }
    ctx.pl.style.transform = `translate(${x.toFixed(1)}px,${Y1}px) scale(${k < 0 ? 1 : Math.max(.3, 1 - k * 2.2).toFixed(3)},${k < 0 ? 1 : (1 + Math.min(k, .3) * 1.4).toFixed(3)})`;
    ctx.pl.style.opacity = o.toFixed(3);
    ctx.pt.style.transform = `translate(${(x - tail).toFixed(1)}px,${Y1}px) scaleX(${(tail / 190).toFixed(3)})`;
    ctx.pt.style.opacity = (k < 0 ? o : o * .8).toFixed(3);
    ctx.pDots.forEach((d, i) => d.classList.toggle('hit', k < 0 && o > .5 && Math.abs(x - PX[i]) < 40));
    // the moment of impact: flash, shards and a small ripple in the field
    const hit = k >= 0 && k < .5;
    if (hit && !ctx.hitWall && ctx.active) {
      restart(ctx.flash, 'go'); restart(ctx.wall, 'go');
      if (window.Field) Field.burst(WALL, Y1, { radius: 200, dur: 1 });
    }
    ctx.hitWall = hit;
  }

  function ring(ctx, now) {
    const el = ctx.draw0 ? (now - ctx.draw0) / 1000 : -1;
    let p, a, head;
    if (el < 0) { p = 0; a = -45; head = 0; }
    else if (el < DRAW) { p = ease(el / DRAW); a = -45 + 360 * p; head = 1; }
    else { p = 1; a = -45 + 360 * ((el - DRAW) / LAP); head = Math.max(0, 1 - (el - DRAW) / .7); }
    ctx.rdraw.style.strokeDashoffset = (100 - 100 * p).toFixed(2);
    const [x, y] = at(a, R);
    place(ctx.ol, x, y); place(ctx.flare, x, y);
    ctx.ol.style.opacity = el < 0 ? 0 : 1;
    ctx.flare.style.opacity = head.toFixed(3);
    // the comet tail follows the light; while the ring draws it grows with the stroke
    ctx.comet.style.transform = `rotate(${(a + 90).toFixed(2)}deg)`;
    ctx.comet.style.opacity = el < 0 ? 0 : Math.min(1, (360 * p) / 110).toFixed(3);
    // stop 2: a second story joins the cycle, half a lap behind the first
    const a2 = a + 180, two = ctx.step >= 2 && el >= DRAW;
    const [x2, y2] = at(a2, R);
    place(ctx.ol2, x2, y2);
    ctx.comet2.style.transform = `rotate(${(a2 + 90).toFixed(2)}deg)`;
    ctx.ol2.classList.toggle('on', two); ctx.comet2.classList.toggle('on', two);
    // each node's halo flares as a light passes through it
    const near = (ang, i) => Math.abs(mod(mod(ang, 360) - STAGES[i].a + 180, 360) - 180) < 11;
    ctx.nws.forEach((nw, i) => {
      const hit = ctx.step >= 1 && el >= DRAW - .05 && (near(a, i) || (two && near(a2, i)));
      if (hit && !nw.classList.contains('hit')) restart(nw, 'pass');
      nw.classList.toggle('hit', hit);
    });
    // stop 2: every lap sends a pulse out from the ring as the light passes Capture
    const lap = el >= DRAW ? Math.floor((el - DRAW) / LAP) : -1;
    if (ctx.step >= 2 && lap >= 1 && lap !== ctx.lap && ctx.lap !== -1) restart(ctx.lapEl, 'go');
    ctx.lap = lap;
  }
})();
