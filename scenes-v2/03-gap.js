/* 03 · The gap (v2) — a district map, condensed from v1's five stops to three.
   Stop 0: good work lights up inside every team (the lights keep pulsing).
   Stop 1: the light stays walled in — ripples hit a wall every 3.4 s, district by
   district, and stories keep setting out across the bridges and failing halfway.
   Stop 2: the map tilts back and recedes behind the conclusion and today's ask.
   Every state is a pure function of the stop (.st-n classes in the CSS); the
   ambient loops are CSS animations, so there are no timers to keep in step. */
(function () {
  const rnd = (s) => { s = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

  // Three team districts, in stage px. Lights are relative to their district;
  // the first light is where the ripples start.
  const Y = 616, H = 276;
  const DISTRICTS = [
    { x: 144, y: Y, w: 410, h: H, lights: [[132, 150], [236, 84], [352, 128], [262, 218]] },
    { x: 755, y: Y, w: 410, h: H, lights: [[206, 154], [108, 80], [360, 126], [128, 218]] },
    { x: 1366, y: Y, w: 410, h: H, lights: [[212, 150], [318, 80], [98, 196], [330, 222]] },
  ];
  const R = 76; // wall corner radius

  // Bridges run wall to wall across the gaps. A story sets out from the left end
  // and fades at the middle, where a small purple mark shows it failing; the
  // bridge itself gives out past the middle, so a parked frame reads as broken.
  const BRIDGES = [
    { p0: [554, Y + 126], c: [655, Y - 8], p1: [755, Y + 120] },
    { p0: [1165, Y + 124], c: [1266, Y - 8], p1: [1366, Y + 134] },
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
        const tw = r < .7 ? ` tw" style="--tt:${3.2 + r * 5}s;--td:${-r * 23}s;` : '" style="';
        out += `<i class="gp-sq${tw}left:${jx.toFixed(1)}px;top:${jy.toFixed(1)}px;--s:${sz.toFixed(1)}px;--a:${a.toFixed(3)};--rd:${r.toFixed(3)}"></i>`;
      }
    }
    return out;
  }

  const district = (d, di) => {
    const [sx, sy] = d.lights[0];
    return `
      <div class="gp-d a-scale" data-in="0" style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;--di:${di};--sx:${sx}px;--sy:${sy}px;--d:${.3 + di * .14}s;--dur:1.2s">
        <i class="gp-wall"></i>
        <div class="gp-in">
          ${cluster(d, di)}
          ${d.lights.map(([x, y], k) => `<i class="gp-sq gp-L" style="left:${x}px;top:${y}px;--s:18px;--a:.2;--rd:.5;--k:${k};--bd:${-(di * 1.3 + k * .9)}s;--pd:${(((di * 5 + k * 3) % 12) * .55).toFixed(2)}s"><b></b></i>`).join('')}
        </div>
        <i class="gp-rip b"></i>
        <i class="gp-rip a"></i>
        <i class="gp-flash b"></i>
        <i class="gp-flash a"></i>
      </div>`;
  };

  const points = [
    { n: '01', tone: 'go', t: 'Good work happens', s: 'Employees help, solve problems and go the extra mile in their daily work.', at: 0, d: .6 },
    { n: '02', tone: 'gap', t: 'Visibility stays local', s: 'These contributions are often noticed only by the immediate team or manager.', at: 1, d: .05 },
    { n: '03', tone: 'gap', t: 'Learning does not travel', s: 'Useful behaviours are not consistently shared across departments or repeated.', at: 1, d: .3 },
  ];

  Deck.scene({
    id: 'gap',
    title: 'The gap',
    act: 1,
    bg: 'night',
    transition: 'chapter',
    cues: ['Inspiration is not always visible · good work happens', 'Visibility stays local · learning does not travel', 'We close the gap · today’s ask'],
    holds: [8, 10, 9],
    notes: [
      'Inspiration is happening at Tahakom every day, but it is not always visible. Each shape is one team, and each light is good work: colleagues who help, solve problems and go the extra mile.',
      'But visibility stays local: the team or manager notices, and it stops at the wall. And learning does not travel: useful behaviours are not shared across departments, so the story fades halfway.',
      'The contributions exist; the gap is making them visible, recognised and shared. Behind a Better Life closes that gap through real employee stories. So, from the start, today’s ask: approve a one-quarter pilot.',
    ],
    field: [
      { dim: .36, lit: 0, travel: .12, warm: 0, offset: [150, -80], links: .45, wave: .45, streaks: .1, sparkle: .9, calm: [[100, 120, 1820, 300, .7], [100, 310, 1820, 570, .55]] },
      { wave: .6, sparkle: 1.1 },
      { dim: .4, travel: .3, calm: [[100, 120, 1820, 620, .65]] },
    ],
    html: `
      <div class="pad gp-head">
        <div class="kicker" data-in="0">The gap</div>
        <h2 class="h2 gp-h" data-in="0" data-dim="2" data-split style="--d:.15s">Inspiration is happening — but it is not always visible.</h2>
      </div>

      ${points.map((p, k) => `
        <div class="gp-pt p${k + 1} ${p.tone}" data-in="${p.at}" data-out="2" style="left:${DISTRICTS[k].x}px;--d:${p.d}s">
          <div class="gp-n">${p.n}</div>
          <h3 class="h4 gp-pt-h" ${k === 0 ? 'data-spark="0" data-spark-delay=".9"' : k === 2 ? 'data-spark="1" data-spark-delay=".55"' : ''}>${p.t}</h3>
          <p class="gp-pt-s">${p.s}</p>
        </div>`).join('')}

      <div class="gp-map">
        <div class="gp-drift">
          ${DISTRICTS.map(district).join('')}
          <svg class="gp-bridges a-wipe" data-in="1" viewBox="0 0 1920 1080" aria-hidden="true" style="--d:.45s;--dur:1.1s">
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
              <i class="light sm gp-bl p${k + 1}" style="offset-path:path('${qd(b)}')"></i>
              <i class="gp-x m p${k + 1}" style="left:${mid(b)[0]}px;top:${mid(b)[1]}px"></i>
              <i class="gp-x a p${k + 1}" style="left:${mid(b)[0]}px;top:${mid(b)[1]}px"></i>`).join('')}
          </div>
        </div>
      </div>

      <div class="gp-close">
        <p class="gp-c1" data-in="2" style="--d:.3s">Meaningful contributions exist — the gap is making them visible, recognised and shared across Tahakom.</p>
        <p class="gp-c2" data-in="2" data-split style="--d:.5s">Behind a Better Life closes that gap through <em class="hl">real employee stories.</em></p>
        <div class="gp-ask a-scale" data-in="2" style="--d:.85s;--dur:.9s">
          <span class="gp-ask-lt" data-spark="2" data-spark-at="c" data-spark-delay="1.15"></span>
          <span class="kicker">Today’s ask</span><span class="gp-ask-sep">·</span><span class="gp-ask-t">Approve a one-quarter pilot</span>
        </div>
      </div>
    `,
  });
})();
