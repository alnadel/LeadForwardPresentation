/* 04 · The gap — a district map. Good work lights up inside every team, but the
   light stays walled in: ripples stop hard at the district wall, and a story sent
   across a bridge fades halfway. The map then recedes behind the conclusion and
   the ask. Build states are driven by the section's .st-n classes (see the CSS),
   so every stop is a pure function of n; JS only schedules the ambient events. */
(function () {
  const rnd = (s) => { s = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

  // Three team districts, in stage px. Lights are relative to their district;
  // the first light is where the stop-2 ripple starts.
  const DISTRICTS = [
    { x: 144, y: 656, w: 410, h: 282, lights: [[132, 150], [236, 84], [352, 128], [262, 218]] },
    { x: 755, y: 656, w: 410, h: 282, lights: [[206, 154], [108, 80], [360, 126], [128, 218]] },
    { x: 1366, y: 656, w: 410, h: 282, lights: [[212, 150], [318, 80], [98, 196], [330, 224]] },
  ];
  const R = 76; // wall corner radius

  // Bridges run wall to wall across the gaps. A story sets out from the left end
  // and fades at the middle, where a small purple mark shows it failing; the
  // bridge itself gives out past the middle, so a parked frame reads as broken.
  const BRIDGES = [
    { p0: [554, 782], c: [655, 648], p1: [755, 776] },
    { p0: [1165, 780], c: [1266, 648], p1: [1366, 790] },
  ];
  const qd = (b) => `M${b.p0[0]} ${b.p0[1]} Q${b.c[0]} ${b.c[1]} ${b.p1[0]} ${b.p1[1]}`;
  const mid = (b) => [(b.p0[0] + 2 * b.c[0] + b.p1[0]) / 4, (b.p0[1] + 2 * b.c[1] + b.p1[1]) / 4];

  function inside(x, y, w, h, pad, r) {
    const x0 = pad, y0 = pad, x1 = w - pad, y1 = h - pad;
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
    return Math.hypot(x - cx, y - cy) <= r;
  }

  // a loose cluster of colleagues: a jittered grid, thinner towards the wall
  function cluster(d, di) {
    let out = '', s = di * 97 + 5;
    const cell = 36, pad = 26;
    for (let y = pad; y <= d.h - pad; y += cell) {
      for (let x = pad; x <= d.w - pad; x += cell) {
        s += 1;
        const jx = x + (rnd(s) - .5) * cell * .72, jy = y + (rnd(s + 31.3) - .5) * cell * .72;
        if (!inside(jx, jy, d.w, d.h, pad, R - pad)) continue;
        const ex = (jx - d.w / 2) / (d.w / 2), ey = (jy - d.h / 2) / (d.h / 2);
        if (rnd(s + 7.7) > 1.02 - Math.hypot(ex, ey) * .5) continue;
        if (d.lights.some(([lx, ly]) => Math.hypot(lx - jx, ly - jy) < 34)) continue;
        const sz = 11 + rnd(s + 3.1) * 7, a = .1 + rnd(s + 5.5) * .12, r = rnd(s + 9.9);
        const tw = r < .7 ? ` tw" style="--tt:${3.6 + r * 6}s;--td:${-r * 23}s;` : '" style="';
        out += `<i class="gp-sq${tw}left:${jx.toFixed(1)}px;top:${jy.toFixed(1)}px;--s:${sz.toFixed(1)}px;--a:${a.toFixed(3)};--rd:${r.toFixed(3)}"></i>`;
      }
    }
    return out;
  }

  const district = (d, di) => {
    const [sx, sy] = d.lights[0];
    return `
      <div class="gp-d a-scale" data-in="0" style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;--di:${di};--sx:${sx}px;--sy:${sy}px;--d:${.35 + di * .14}s;--dur:1.2s">
        <i class="gp-wall"></i>
        <div class="gp-in">
          ${cluster(d, di)}
          ${d.lights.map(([x, y], k) => `<i class="gp-sq gp-L" style="left:${x}px;top:${y}px;--s:18px;--a:.2;--rd:.5;--k:${k};--bd:${-(di * 1.3 + k * .9)}s"><b></b></i>`).join('')}
        </div>
        <i class="gp-rip b"></i>
        <i class="gp-rip a"></i>
        <i class="gp-flash b"></i>
        <i class="gp-flash a"></i>
      </div>`;
  };

  const points = [
    { n: '01', tone: 'go', t: 'Good work happens', s: 'Employees help, solve problems and go the extra mile in their daily work.' },
    { n: '02', tone: 'gap', t: 'Visibility stays local', s: 'These contributions are often noticed only by the immediate team or manager.' },
    { n: '03', tone: 'gap', t: 'Learning does not travel', s: 'Useful behaviours are not consistently shared across departments or repeated.' },
  ];

  const restart = (el, cls) => { el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls); };

  Deck.scene({
    id: 'gap',
    title: 'The gap',
    act: 1,
    bg: 'night',
    cues: ['Inspiration is not always visible', '01 · Good work happens', '02 · Visibility stays local', '03 · Learning does not travel', 'We close the gap · today’s ask'],
    holds: [7, 7, 8, 8, 9],
    notes: [
      'Inspiration is happening at Tahakom every day, but it is not always visible. Many positive behaviours are not consistently recognised or shared. Each shape is one team.',
      'First, good work happens. Colleagues help, solve problems and go the extra mile. Each light is one such moment.',
      'Second, visibility stays local. The immediate team or manager notices, and it stops at the edge of the team.',
      'Third, learning does not travel. Useful behaviours are not consistently shared across departments, so others never repeat them. The story fades halfway.',
      'The contributions exist; the gap is making them visible, recognised and shared. Behind a Better Life closes that gap through real employee stories. So, from the start, today’s ask: approve a one-quarter pilot.',
    ],
    field: [
      { dim: .34, lit: 0, travel: 0, warm: 0, offset: [150, -80], calm: [[100, 120, 1820, 360, .65], [100, 370, 1820, 620, .45]] },
      {}, {}, {},
      { dim: .36, travel: .22, calm: [[100, 120, 1820, 640, .6]] },
    ],
    html: `
      <div class="pad gp-head">
        <div class="kicker" data-in="0">The gap</div>
        <h2 class="h2 gp-h" data-in="0" data-dim="4" data-split style="--d:.15s">Inspiration is happening — but it is not always visible.</h2>
        <p class="gp-lead" data-in="0" data-out="4" style="--d:.6s">Positive behaviours happen every day, yet many are not consistently recognised or shared across Tahakom.</p>
      </div>

      ${points.map((p, k) => `
        <div class="gp-pt p${k + 1} ${p.tone}" data-in="${k + 1}" data-out="4" style="left:${DISTRICTS[k].x}px;--d:.05s">
          <div class="gp-n">${p.n}</div>
          <h3 class="h4 gp-pt-h">${p.t}</h3>
          <p class="gp-pt-s">${p.s}</p>
        </div>`).join('')}

      <div class="gp-map" data-dim="4">
        ${DISTRICTS.map(district).join('')}
        <svg class="gp-bridges a-wipe" data-in="3" viewBox="0 0 1920 1080" aria-hidden="true" style="--d:.1s;--dur:1.3s">
          <defs>
            <linearGradient id="gpBridgeInk" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stop-color="#25C7BC" stop-opacity=".9"/>
              <stop offset=".46" stop-color="#25C7BC" stop-opacity=".9"/>
              <stop offset=".5" stop-color="#9D67AA" stop-opacity=".5"/>
              <stop offset=".62" stop-color="#9D67AA" stop-opacity="0"/>
              <stop offset="1" stop-color="#9D67AA" stop-opacity="0"/>
            </linearGradient>
          </defs>
          ${BRIDGES.map((b) => `
            <path class="gp-br" d="${qd(b)}"/>
            <rect class="gp-gate" x="${b.p0[0] - 6}" y="${b.p0[1] - 6}" width="12" height="12" rx="3.4"/>`).join('')}
        </svg>
        <div class="gp-bls">
          ${BRIDGES.map((b, k) => `
            <i class="light sm gp-bl b p${k + 1}" style="offset-path:path('${qd(b)}')"></i>
            <i class="light sm gp-bl a p${k + 1}" style="offset-path:path('${qd(b)}')"></i>
            <i class="gp-x m p${k + 1}" style="left:${mid(b)[0]}px;top:${mid(b)[1]}px"></i>
            <i class="gp-x b p${k + 1}" style="left:${mid(b)[0]}px;top:${mid(b)[1]}px"></i>
            <i class="gp-x a p${k + 1}" style="left:${mid(b)[0]}px;top:${mid(b)[1]}px"></i>`).join('')}
        </div>
      </div>

      <div class="gp-close">
        <p class="gp-c1" data-in="4" style="--d:.3s">Meaningful contributions exist — the gap is making them visible, recognised and shared across Tahakom.</p>
        <p class="gp-c2" data-in="4" data-split style="--d:.55s">Behind a Better Life closes that gap through <em class="hl">real employee stories.</em></p>
        <div class="gp-ask a-fade" data-in="4" style="--d:1.15s;--dur:1s">
          <span class="kicker">Today’s ask</span><span class="gp-ask-sep">·</span><span class="gp-ask-t">Approve a one-quarter pilot</span>
        </div>
      </div>
    `,
    init(ctx) {
      ctx.dists = ctx.$$('.gp-d');
      ctx.map = ctx.$('.gp-map');
      ctx.lastStep = 0;
    },
    enter(ctx) {
      // Ambient: at most one quiet event every seven seconds, and never while a
      // build is still playing. Stop 2 on: a ripple hits a wall. Stop 3 on: that
      // alternates with a story failing halfway across a bridge.
      let k = 0;
      ctx.every(7000, () => {
        const n = ctx.step;
        if (n < 2 || performance.now() - ctx.lastStep < 4200) return;
        k += 1;
        if (n === 2 || k % 2) restart(ctx.dists[(k * 2) % 3], 'go');
        else {
          const f = (k >> 1) % 2 ? 'f2' : 'f1';
          ctx.map.classList.remove('f1', 'f2');
          restart(ctx.map, f);
        }
      });
    },
    step(n, prev, ctx) {
      ctx.lastStep = performance.now();
      // ambient events belong to stops 2+ (ripples) and 3+ (bridges)
      if (n < 2) ctx.dists.forEach((d) => d.classList.remove('go'));
      if (n < 3) ctx.map.classList.remove('f1', 'f2');
    },
    leave(ctx) {
      ctx.dists.forEach((d) => d.classList.remove('go'));
      ctx.map.classList.remove('f1', 'f2');
    },
  });
})();
