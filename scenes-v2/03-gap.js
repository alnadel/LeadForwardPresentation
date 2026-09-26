/* 03 · The gap (v2) — the organisation as a map of three team districts, seen in
   perspective on a lit floor.
   Stop 0: the map swings up out of the chapter line; colleagues appear and good
   work lights up in every team (the lights hover over the floor, pulse and ping).
   Stop 1: the walls rise and turn purple — ripples run out from the light and stop
   hard at the wall (the wall flashes as it is hit), and stories keep setting out
   over the bridges between teams and failing halfway (they break and fall).
   Stop 2: the map tilts back and recedes behind the conclusion; the walls sink and
   the bridges complete — the gap closed — while today's ask takes the stage.
   Every state is a pure function of the stop (.st-n classes in the CSS); the
   ambient loops are CSS animations, so there are no timers to keep in step. */
(function () {
  const rnd = (s) => { s = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

  // The floor plane is the full stage, tilted about the line y = OY (see the CSS:
  // perspective 1800px from 960px 540px, rotateX(44deg), origin 960px 940px).
  // Districts are authored in plane px; their near edge sits on the origin line.
  const OY = 940, DW = 504, DH = 480, R = 92;
  const COLS = [144, 708, 1272];
  // lights per district (district px); [0] is where the ripples start
  const LIGHTS = [
    [[196, 246], [330, 106], [104, 364], [372, 262], [304, 404]],
    [[262, 336], [140, 262], [380, 196], [184, 100], [398, 410]],
    [[286, 290], [140, 196], [392, 108], [150, 394], [428, 356]],
  ];
  const DISTRICTS = COLS.map((x, i) => ({ x, y: OY - DH, w: DW, h: DH, lights: LIGHTS[i] }));

  // Bridges stand up out of the floor (a vertical plane) and arc over the two walls
  // from a light in one team to a light in the next.
  const BH = 280, LIFT = 240;                  // plane height of a bridge box, height of the arc
  const BRIDGES = [
    { x0: COLS[0] + LIGHTS[0][3][0], x1: COLS[1] + LIGHTS[1][1][0], y: OY - DH + LIGHTS[0][3][1] },
    { x0: COLS[1] + LIGHTS[1][2][0], x1: COLS[2] + LIGHTS[2][1][0], y: OY - DH + LIGHTS[1][2][1] },
  ];
  const arc = (w) => `M0 ${BH} Q${w / 2} ${BH - 2 * LIFT} ${w} ${BH}`;

  function inside(x, y, w, h, pad, r) {
    const x0 = pad, y0 = pad, x1 = w - pad, y1 = h - pad;
    if (x < x0 || x > x1 || y < y0 || y > y1) return false;
    const cx = Math.min(Math.max(x, x0 + r), x1 - r), cy = Math.min(Math.max(y, y0 + r), y1 - r);
    return Math.hypot(x - cx, y - cy) <= r;
  }

  // a loose crowd of colleagues: a jittered grid, thinner towards the wall
  function cluster(d, di) {
    let out = '', s = di * 97 + 5;
    const cell = 31, pad = 24;
    for (let y = pad; y <= d.h - pad; y += cell) {
      for (let x = pad; x <= d.w - pad; x += cell) {
        s += 1;
        const jx = x + (rnd(s) - .5) * cell * .7, jy = y + (rnd(s + 31.3) - .5) * cell * .7;
        if (!inside(jx, jy, d.w, d.h, pad, R - pad)) continue;
        const ex = (jx - d.w / 2) / (d.w / 2), ey = (jy - d.h / 2) / (d.h / 2);
        if (rnd(s + 7.7) > 1.08 - Math.hypot(ex, ey) * .45) continue;
        if (d.lights.some(([lx, ly]) => Math.hypot(lx - jx, ly - jy) < 30)) continue;
        const sz = 11 + rnd(s + 3.1) * 8, a = .12 + rnd(s + 5.5) * .16, r = rnd(s + 9.9);
        const tw = r < .32 ? ` tw" style="--tt:${3.4 + r * 12}s;--td:${-r * 37}s;` : '" style="';
        out += `<i class="gp-sq${tw}left:${jx.toFixed(1)}px;top:${jy.toFixed(1)}px;--s:${sz.toFixed(1)}px;--a:${a.toFixed(3)};--rd:${r.toFixed(3)}"></i>`;
      }
    }
    return out;
  }

  const WALL_LAYERS = 10;
  const district = (d, di) => {
    const [sx, sy] = d.lights[0];
    const walls = Array.from({ length: WALL_LAYERS }, (_, k) => `<i class="gp-w${k === 0 ? ' base' : k === WALL_LAYERS - 1 ? ' rim' : ''}" style="--k:${k}"></i>`).join('');
    return `
      <div class="gp-d" style="left:${d.x}px;top:${d.y}px;width:${d.w}px;height:${d.h}px;--di:${di};--sx:${sx}px;--sy:${sy}px">
        <div class="gp-floor">
          <div class="gp-in">
            ${d.lights.map(([x, y], k) => `<i class="gp-pool" style="left:${x}px;top:${y}px;--k:${k}"></i>`).join('')}
            ${cluster(d, di)}
          </div>
        </div>
        <i class="gp-rip b"></i>
        <i class="gp-rip a"></i>
        ${walls}
        ${d.lights.map(([x, y], k) => `
          <i class="gp-stem" style="left:${x}px;top:${y}px;--k:${k}"></i>
          <i class="gp-L" style="left:${x}px;top:${y}px;--k:${k};--bd:${-(di * 1.3 + k * .9).toFixed(2)}s;--pd:${(((di * 5 + k * 3) % 12) * .55).toFixed(2)}s"><b></b></i>`).join('')}
      </div>`;
  };

  const bridge = (b, k) => {
    const w = b.x1 - b.x0;
    return `
      <div class="gp-br p${k + 1}" style="left:${b.x0}px;top:${b.y - BH}px;width:${w}px;height:${BH}px">
        <svg viewBox="0 0 ${w} ${BH}" aria-hidden="true">
          <path class="gp-br-glow" d="${arc(w)}" pathLength="100"/>
          <path class="gp-br-line" d="${arc(w)}" pathLength="100"/>
          <path class="gp-br-ok" d="${arc(w)}" pathLength="100"/>
        </svg>
        <i class="gp-bl" style="offset-path:path('${arc(w)}')"></i>
        <i class="gp-bl ok" style="offset-path:path('${arc(w)}')"></i>
        <i class="gp-x" style="left:${w / 2}px;top:${BH - LIFT}px"></i>
        ${[0, 1, 2, 3].map((f) => `<i class="gp-frag" style="left:${(w / 2 + (f - 1.5) * 9).toFixed(0)}px;top:${BH - LIFT}px;--f:${f};--fx:${((f - 1.5) * 16).toFixed(0)}px"></i>`).join('')}
      </div>`;
  };

  const points = [
    { n: '01', tone: 'go', t: 'Good work happens', s: 'Employees help, solve problems and go the extra mile in their daily work.', at: 0, d: .6 },
    { n: '02', tone: 'gap', t: 'Visibility stays local', s: 'These contributions are often noticed only by the immediate team or manager.', at: 1, d: .05 },
    { n: '03', tone: 'gap', t: 'Learning does not travel', s: 'Useful behaviours are not consistently shared across departments or repeated.', at: 1, d: .3 },
  ];

  // dust drifting up through the light above the map (foreground depth)
  const dust = Array.from({ length: 22 }, (_, i) => `<i style="left:${(i * 139 + 23) % 100}%;top:${56 + (i * 67) % 40}%;--t:${12 + (i % 5) * 2.6}s;--dl:${-i * 1.7}s;--dx:${(i % 2 ? 1 : -1) * (24 + (i * 17) % 60)}px;--dy:${-140 - (i * 37) % 180}px"></i>`).join('');

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
      { dim: .34, lit: 0, travel: .12, warm: 0, offset: [150, -80], links: .45, wave: .45, streaks: .1, sparkle: .9, calm: [[100, 120, 1820, 290, .7], [100, 300, 1820, 560, .6], [100, 560, 1820, 960, .35]] },
      { wave: .6, sparkle: 1.1 },
      { dim: .42, travel: .3, calm: [[100, 120, 1820, 760, .65]] },
    ],
    html: `
      <svg class="gp-defs" width="0" height="0" aria-hidden="true" style="position:absolute">
        <defs>
          <linearGradient id="gpBridgeInk" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#25C7BC" stop-opacity=".95"/>
            <stop offset=".44" stop-color="#03FFCB" stop-opacity=".95"/>
            <stop offset=".5" stop-color="#C9A6D3" stop-opacity=".8"/>
            <stop offset=".6" stop-color="#9D67AA" stop-opacity=".4"/>
            <stop offset="1" stop-color="#9D67AA" stop-opacity=".22"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="gp-ground"></div>

      <div class="gp-map">
        <div class="gp-plane">
          <div class="gp-drift">
            <div class="gp-grid"></div>
            ${DISTRICTS.map(district).join('')}
            ${BRIDGES.map(bridge).join('')}
          </div>
        </div>
      </div>
      <div class="amb-dust gp-dust">${dust}</div>

      <div class="pad gp-head">
        <div class="kicker" data-in="0">The gap</div>
        <h2 class="h2 gp-h" data-in="0" data-dim="2" data-split style="--d:.15s">Inspiration is happening — but it is not always visible.</h2>
      </div>

      ${points.map((p, k) => `
        <div class="gp-pt p${k + 1} ${p.tone}" data-in="${p.at}" data-out="2" style="left:${COLS[k]}px;--d:${p.d}s">
          <div class="gp-n" ${k === 0 ? 'data-spark="0" data-spark-at="r" data-spark-delay=".9"' : k === 2 ? 'data-spark="1" data-spark-at="r" data-spark-delay=".55"' : ''}>${p.n}</div>
          <h3 class="gp-pt-h">${p.t}</h3>
          <p class="gp-pt-s">${p.s}</p>
        </div>`).join('')}

      <div class="gp-close">
        <p class="gp-c1" data-in="2" style="--d:.3s">Meaningful contributions exist — the gap is making them visible, recognised and shared across Tahakom.</p>
        <p class="gp-c2" data-in="2" data-split style="--d:.5s">Behind a Better Life closes that gap through <em class="hl">real employee stories.</em></p>
        <div class="gp-ask-w a-unfold" data-in="2" style="--d:.7s;--dur:.9s">
          <div class="glass live gp-ask amb-sheen">
            <span class="gp-ask-lt" data-spark="2" data-spark-at="c" data-spark-delay="1.05"><b></b></span>
            <span class="gp-ask-k">Today’s ask</span>
            <span class="gp-ask-sep"></span>
            <span class="gp-ask-t">Approve a one-quarter pilot</span>
          </div>
        </div>
      </div>
    `,
  });
})();
