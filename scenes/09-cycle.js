/* 09 · The cycle — two lanes become a ring.
   Stop 0: most recognition runs one lane and ends at the award (purple); the story
   lane (teal) loops back to its start. Stop 1: the loop becomes the cycle, and the
   four stages land in one sweep as the ring draws. Stop 2: the cycle repeats, and
   each stage shows its design principle. Ambient: a story light runs the lanes,
   then orbits the ring; each node pulses as the light passes through it. */
(function () {
  // ring geometry (stage px)
  const CX = 960, CY = 604, R = 224;
  const BX = 1236;            // the stage blocks keep this far from the centre line
  // lane geometry
  const Y1 = 516, Y2 = 742, BOT = Y2 + 116, CAPX = 77;
  const TX = [300, 615, 930, 1245, 1560];
  const TW = ['Experience', 'Story', 'Behaviour', 'Inspiration', 'More stories'];
  const PX = [300, 615], PW = ['Achievement', 'Recognition'], WALL = 800;
  const LOOP = `M${TX[0]} ${Y2} L${TX[4]} ${Y2} C${TX[4] + CAPX} ${Y2} ${TX[4] + CAPX} ${BOT} ${TX[4]} ${BOT} L${TX[0]} ${BOT} C${TX[0] - CAPX} ${BOT} ${TX[0] - CAPX} ${Y2} ${TX[0]} ${Y2}`;
  const RETURN = `M${TX[4]} ${Y2} C${TX[4] + CAPX} ${Y2} ${TX[4] + CAPX} ${BOT} ${TX[4]} ${BOT} L${TX[0]} ${BOT} C${TX[0] - CAPX} ${BOT} ${TX[0] - CAPX} ${Y2} ${TX[0]} ${Y2}`;
  const TOP = TX[4] - TX[0];
  const PERIOD = 10;          // one lap of the story lane, seconds
  const LAP = 9;              // one orbit of the ring, seconds
  const SWEEP = [0.15, 0.3, 0.45, 0.6]; // the four nodes land as the ring draws past them

  const STAGES = [
    { n: '01', t: 'Capture', s: 'Peer or leader nomination through a short, clear form.', p: 'Employee voice', a: -45 },
    { n: '02', t: 'Curate', s: 'Verify facts, secure consent and link the story to one value.', p: 'Fair selection', a: 45 },
    { n: '03', t: 'Feature', s: 'Publish a short, authentic story across relevant channels.', p: 'Visible recognition', a: 135 },
    { n: '04', t: 'Reinforce', s: 'Recognise the contribution, share the takeaway and track response.', p: 'Organisational learning', a: 225 },
  ];
  const rad = (a) => a * Math.PI / 180;
  const at = (a, r) => [CX + r * Math.cos(rad(a)), CY + r * Math.sin(rad(a))];
  const chev = (x, y, deg, cls, extra) => `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg})"><path class="${cls}" ${extra || ''} d="M-6 -9 L4 0 L-6 9"/></g>`;

  // the ring's direction chevrons sit mid-arc between the nodes
  const ringChevs = [0, 90, 180, 270].map((a, i) => {
    const [x, y] = at(a, R);
    // the ring draws from node 01 (-45°) in .7s after a .1s beat: each chevron lands as the stroke passes it
    return chev(x, y, a + 90, 'cy-chev a-fade', `data-in="1" style="--d:${(0.19 + i * 0.175).toFixed(2)}s;--dur:.5s"`);
  }).join('');

  const nodes = STAGES.map((s, i) => {
    const [x, y] = at(s.a, R);
    return `<div class="cy-nw a-pop" data-in="1" style="left:${x.toFixed(0)}px;top:${y.toFixed(0)}px;--d:${SWEEP[i]}s;--dur:.7s"><b class="cy-rip"></b><div class="cy-nd">${s.n}</div></div>`;
  }).join('');

  const blocks = STAGES.map((s, i) => {
    const [, y] = at(s.a, R);
    const right = i < 2;
    const pos = right ? `left:${BX}px` : `right:${BX}px`;
    return `<div class="cy-blk ${right ? 'r' : 'l'}" data-in="1" style="${pos};top:${(y - 22).toFixed(0)}px;--d:${(SWEEP[i] + 0.05).toFixed(2)}s;--dur:.6s">
        <div class="cy-t">${s.t}</div>
        <p class="cy-s">${s.s}</p>
        <div class="cy-p a-fade" data-in="2" style="--d:${(0.35 + i * 0.14).toFixed(2)}s"><i></i>${s.p}</div>
      </div>`;
  }).join('');

  Deck.scene({
    id: 'cycle',
    title: 'The cycle',
    act: 3,
    bg: 'teal',
    cues: ['What is new · two lanes', 'The cycle · four stages', 'The cycle repeats'],
    holds: [9, 12, 9],
    notes: [
      'Most recognition runs the top lane: an achievement earns recognition, and we keep that. But it ends there; the behaviour stays where it happened. The bottom lane keeps going: an experience becomes a story, the story shows a behaviour, that inspires someone, and more stories follow.',
      'That loop is the solution, in four steps. Capture: a peer or leader nominates through a short form. Curate: we check facts, secure consent and link one value. Feature: a short story on channels we already have. Reinforce: we recognise the person and share the takeaway.',
      'Then it repeats. Each step protects a principle: employee voice, fair selection, visible recognition, organisational learning. Next, one story all the way round.',
    ],
    field: [
      { dim: .26, lit: .02, travel: .1, offset: [150, -70], litFrom: null, calm: [[100, 120, 1500, 380, .85], [140, 420, 1720, 900, .55]] },
      { dim: .3, lit: .04, litFrom: [CX, CY], travel: .18, calm: [[100, 120, 1300, 300, .85], [120, 400, 740, 920, .75], [1180, 400, 1800, 920, .75]] },
      { lit: .04, travel: .3, calm: [[100, 120, 1300, 300, .85], [120, 400, 740, 940, .75], [1180, 400, 1800, 940, .75], [800, 530, 1120, 680, .8]] },
    ],
    html: `
      <!-- stop 0 · two lanes -->
      <div class="pad cy-head">
        <div class="kicker" data-in="0" data-out="1">What is new</div>
        <h2 class="h2 cy-h" data-in="0" data-out="1" data-split style="--d:.15s">Most recognition stops at the award.<br><em class="hl">This keeps going.</em></h2>
      </div>

      <div class="cy-lanes a-fade" data-out="1">
        <div class="cy-lane cy-lane-p a-wipe" data-in="0" style="--d:.5s;--dur:1.2s">
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            <line class="cy-track-p" x1="${PX[0]}" y1="${Y1}" x2="${WALL - 8}" y2="${Y1}"/>
            ${chev((PX[0] + PX[1]) / 2, Y1, 0, 'cy-chev-p')}
          </svg>
          ${PX.map((x, i) => `<div class="cy-st p" style="left:${x}px;top:${Y1 - 70}px">${PW[i]}</div><i class="cy-dot p" style="left:${x}px;top:${Y1}px"></i>`).join('')}
          <i class="cy-wall" style="left:${WALL}px;top:${Y1}px"></i>
          <div class="cy-end" style="left:${WALL + 30}px;top:${Y1}px">it ends here</div>
        </div>

        <div class="cy-lane cy-lane-t a-wipe" data-in="0" style="--d:.75s;--dur:1.5s">
          <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
            <path class="cy-ret" d="${RETURN}"/>
            <line class="cy-track-t" x1="${TX[0]}" y1="${Y2}" x2="${TX[4]}" y2="${Y2}"/>
            ${TX.slice(0, 4).map((x, i) => chev((x + TX[i + 1]) / 2, Y2, 0, 'cy-chev-t')).join('')}
            ${chev((TX[0] + TX[4]) / 2, BOT, 180, 'cy-chev-r')}
            <path class="cy-geo" d="${LOOP}"/>
          </svg>
          ${TX.map((x, i) => `<div class="cy-st t" style="left:${x}px;top:${Y2 - 70}px">${TW[i]}</div><i class="cy-dot t" style="left:${x}px;top:${Y2}px"></i>`).join('')}
        </div>

        <div class="cy-lanelights a-fade" data-in="0" style="--d:1.5s;--dur:.6s">
          <i class="cy-plight"></i>
          <i class="cy-tglow"></i>
          <i class="light cy-tlight"></i>
        </div>
      </div>

      <!-- stop 1 · the ring -->
      <div class="pad cy-head">
        <div class="kicker" data-in="1" style="--d:.2s">The solution</div>
        <h2 class="h2 cy-h" data-in="1" data-split style="--d:.28s">A simple story-to-impact cycle.</h2>
      </div>

      <div class="cy-ring a-fade" data-in="1" style="--d:.1s;--dur:.6s">
        <div class="cy-glow" style="left:${CX - 300}px;top:${CY - 300}px"></div>
        <svg class="cy-svg" viewBox="0 0 1920 1080" aria-hidden="true">
          <circle class="cy-rtrack" cx="${CX}" cy="${CY}" r="${R}"/>
          <circle class="cy-rdraw" cx="${CX}" cy="${CY}" r="${R}" pathLength="100" transform="rotate(-45 ${CX} ${CY})"/>
          ${ringChevs}
          ${[56, 38, 24, 12].map((sp, i) => `<circle class="cy-trail t${i}" cx="${CX}" cy="${CY}" r="${R}" pathLength="100" data-span="${sp}"/>`).join('')}
        </svg>
      </div>
      <div class="cy-orbit a-fade" data-in="1" style="--d:1s;--dur:.6s"><i class="light cy-olight"></i></div>
      ${nodes}
      ${blocks}

      <!-- stop 2 · it repeats -->
      <div class="cy-rep a-scale" data-in="2" style="left:${CX - 200}px;top:${CY - 50}px;--d:.1s">The cycle<br>repeats</div>
    `,
    init(ctx) {
      ctx.geo = ctx.$('.cy-geo');
      ctx.tl = ctx.$('.cy-tlight');
      ctx.tg = ctx.$('.cy-tglow');
      ctx.pl = ctx.$('.cy-plight');
      ctx.ol = ctx.$('.cy-olight');
      ctx.tDots = ctx.$$('.cy-dot.t');
      ctx.pDots = ctx.$$('.cy-dot.p');
      ctx.wall = ctx.$('.cy-wall');
      ctx.nds = ctx.$$('.cy-nd');
      ctx.rips = ctx.$$('.cy-rip');
      ctx.trail = ctx.$$('.cy-trail').map((c) => ({ c, span: +c.dataset.span }));
      ctx.orbit0 = 0;
      ctx.len = 0;
    },
    enter(ctx) {
      ctx.loop((t) => {
        if (ctx.step <= 0) lanes(ctx, t);
        else orbit(ctx);
      });
    },
    step(n, prev, ctx) {
      // the orbit starts at node 01 once the ring has drawn; walking back from
      // stop 2 to stop 1 keeps it running where it is
      if (n >= 1 && (prev < 1 || !ctx.orbit0)) ctx.orbit0 = performance.now() + (ctx.instant ? 0 : 1000);
      if (n < 1) ctx.orbit0 = 0;
      if (n >= 1) orbit(ctx);
      // the cycle repeats: one small ripple from the centre that stays inside the ring
      if (n === 2 && !ctx.instant) ctx.after(300, () => window.Field && Field.burst(CX, CY, { radius: 250, dur: 1.4 }));
    },
  });

  function lanes(ctx, t) {
    if (!ctx.len) ctx.len = ctx.geo.getTotalLength();
    const L = ctx.len, v = L / PERIOD;
    const tt = t % PERIOD;
    // the story light: along the lane, round the return arc, back to its start
    const s = tt * v;
    const p = ctx.geo.getPointAtLength(s);
    ctx.tl.style.transform = ctx.tg.style.transform = `translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px)`;
    ctx.tDots.forEach((d, i) => {
      const at0 = TX[i] - TX[0];
      d.classList.toggle('hit', (s < TOP + 30 && Math.abs(s - at0) < 34) || (i === 0 && s > L - 24));
    });
    // the award light: same pace, but it stops at the wall and fades
    const run = WALL - 20 - PX[0];
    let x, o, k = -1;
    if (s < run) {
      x = PX[0] + s;
      o = Math.min(1, tt / .35);
    } else {
      k = tt - run / v;
      x = WALL - 20 - Math.sin(Math.min(k, .45) / .45 * Math.PI) * 7;
      o = Math.max(0, 1 - Math.max(0, k - .7) / 1.1);
    }
    ctx.pl.style.transform = `translate(${x.toFixed(1)}px,${Y1}px)`;
    ctx.pl.style.opacity = o.toFixed(3);
    ctx.pDots.forEach((d, i) => d.classList.toggle('hit', o > .5 && Math.abs(x - PX[i]) < 34));
    ctx.wall.classList.toggle('hit', k >= 0 && k < 1.4);
  }

  function orbit(ctx) {
    const el = ctx.orbit0 ? Math.max(0, (performance.now() - ctx.orbit0) / 1000) : 0;
    const a = -45 + (el / LAP) * 360;
    const [x, y] = at(a, R);
    ctx.ol.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    // a short fading tail behind the light
    ctx.trail.forEach(({ c, span }) => {
      const len = el > 0 ? Math.min(span, (el / LAP) * 360) : 0;
      c.style.strokeDasharray = (len / 3.6).toFixed(3) + ' 100';
      c.style.strokeDashoffset = (-(a - len) / 3.6).toFixed(3);
    });
    const am = ((a % 360) + 360) % 360;
    ctx.nds.forEach((nd, i) => {
      const d = Math.abs(((am - STAGES[i].a) % 360 + 540) % 360 - 180);
      const hit = ctx.step >= 1 && d < 12;
      if (hit && !nd.classList.contains('hit')) {
        // the light enters the node: a single soft ripple
        const rp = ctx.rips[i];
        rp.classList.remove('go'); void rp.offsetWidth; rp.classList.add('go');
      }
      nd.classList.toggle('hit', hit);
    });
  }
})();
