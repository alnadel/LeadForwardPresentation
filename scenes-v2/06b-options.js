/* 06b · Three ways to close the gap (v4) — strategic options, then one recommendation.
   Each option has a pictured identity: a small isometric scene at the top of its glass card
   (A · a podium with one trophy in a spotlight and colleagues left in the shade; B · a laptop
   with a leaderboard, a floating badge and a stack of points coins; C · a story card on a
   plinth, broadcasting to a ring of colleagues). The table under the pictures stays scannable:
   five criteria rows with drawn Harvey-ball marks, and a watch-out row under each option.
   Stop 0: the kicker and the headline land while the act opens from the chapter card's centre
   line. The three option cards (glass) open from that same line (y 540) with a line of light
   at each edge, the criteria column opens with them, the pictures rise onto the cards, then
   the ratings pop in row by row, left to right. The spark settles above C.
   Stop 1: A and B dim and sink back into the shade; C lifts and grows, goes live (a light
   travels its edge), its picture gains its light (a glow blooms behind it, the colleagues
   light up one by one as the story reaches them), a tab drops onto its top edge with the
   honest tally (5 of 5 strong: the count of its column), a light runs down C's column
   lighting each mark, and the recommendation replaces the headline as the hero.
   Audience first: the option titles and the recommendation are the heroes; the one-line
   descriptions, criteria labels and watch-outs are small and dim; the marks are drawn shapes
   (full, half, empty), big enough to read at a glance.
   Ambient: stop 0, a reading band walks the five criteria rows (each row's strong marks glow
   as it passes), glow pools drift, a sheen crosses the cards, and each picture breathes (the
   spotlight, the badge bobbing, the broadcast rippling out); stop 1, C's edge light, the
   reading band on C's rows, C's broadcast and its colleagues lighting in turn, C's glow and
   the hero's glow breathing. Nothing moves inside text.
   All state keys off .st-n / .is-in; one-shot lights play only on a live click and rest
   invisible, so back navigation lands on the same frame. */
(function () {
  /* ── geometry (stage px) ── */
  const T = 326;                    // top of the table (stop 0; the table steps down DROP px at stop 1)
  const H = 556;                    // column height
  const DROP = 60;
  const LX = 144, LW = 250;         // the criteria column
  const X0 = 420, CW = 436, GAP = 24;
  const colX = (i) => X0 + i * (CW + GAP);   // 420 · 880 · 1340 (C ends at 1776)
  const ROW0 = 226, ROWH = 50;      // first rating row (column-relative) and row height
  const WO = ROW0 + 5 * ROWH;       // the watch-out row (column-relative)
  const SEAM = 540 - T;             // the chapter card's centre line, column-relative
  const WALK = 7.5;                 // s: one lap of the reading band over the five rows

  const OPTS = [
    { k: 'A', t: 'Awards', s: 'Employee of the month or year.', w: 'Rewards a few; popularity can decide.' },
    { k: 'B', t: 'A new<br>platform', s: 'Buy a digital recognition tool.', w: 'Cost and adoption risk; points don’t teach.' },
    { k: 'C', t: 'A story<br>campaign', s: 'Real stories on the channels we already have.', w: 'Needs curation time and leaders’ participation, <em>both built into the plan.</em>' },
  ];
  const CRIT = ['Reaches everyone', 'The learning travels', 'Fair and credible', 'Low cost', 'Fast to launch'];
  // 2 strong · 1 partial · 0 weak, per row: [A, B, C]
  const RATE = [
    [0, 1, 2],
    [0, 0, 2],
    [1, 1, 2],
    [1, 0, 2],
    [2, 0, 2],
  ];
  // the honest tally: how many of C's five marks are strong (a count of the table, nothing more)
  const C_STRONG = RATE.filter((row) => row[2] === 2).length;
  const COL_D = [.24, .34, .44];    // s: each column opens
  const ART_D = 1.02, ART_STEP = .1; // s: the pictures drop onto the cards once their tops have opened
  const MARK_AT = .95, ROW_STEP = .11, COL_STEP = .04;     // the ratings pop row by row, left to right
  const r2 = (v) => Math.round(v * 100) / 100;

  const mark = (v, cls, style) => `<span class="op-mk s${v} ${cls || ''}" ${style || ''}><i></i></span>`;

  /* ── the pictures: small isometric scenes (x runs right-down, y left-down, z up) ── */
  const CS = Math.cos(Math.PI / 6);
  const iso = (O, K) => {
    const ip = (x, y, z) => [O[0] + (x - y) * CS * K, O[1] + ((x + y) * .5 - z) * K];
    const P = (x, y, z) => ip(x, y, z).map((v) => v.toFixed(1)).join(',');
    const quad = (a, b, c, d, cls) => `<polygon class="${cls}" points="${P(...a)} ${P(...b)} ${P(...c)} ${P(...d)}"/>`;
    const box = (x, y, z, w, d, h, cls) => `<g class="${cls}">` +
      quad([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h], 'fl') +
      quad([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h], 'fr') +
      quad([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h], 'ft') + '</g>';
    const line = (pts, cls) => `<polyline class="${cls}" points="${pts.map((q) => P(...q)).join(' ')}"/>`;
    // a circle lying in a plane: 'z' (the ground), 'y' (a face toward the viewer's left)
    const circ = (c, r, plane, cls, n) => `<polygon class="${cls}" points="${Array.from({ length: n || 32 }, (_, k) => {
      const t = k / (n || 32) * 2 * Math.PI, a = r * Math.cos(t), b = r * Math.sin(t);
      return P(...(plane === 'z' ? [c[0] + a, c[1] + b, c[2]] : [c[0] + a, c[1], c[2] + b]));
    }).join(' ')}"/>`;
    const at = (x, y, z) => ip(x, y, z).map((v) => v.toFixed(1)).join(' ');
    return { ip, P, quad, box, line, circ, at };
  };
  // a colleague: head and shoulders, standing on a ground point
  const FIG = '<circle cx="0" cy="-19.5" r="4.8"/><path d="M-8 0C-8-7-5-11.5 0-11.5S8-7 8 0Z"/>';
  // (a lit copy rides over each of C's colleagues: it fades in as the story reaches them)
  const person = (xy, cls, k, lit, s) => `<g class="pp ${cls || ''}" transform="translate(${xy}) scale(${s || 1})">${FIG}${lit ? `<g class="lt" style="--k:${k || 0}">${FIG}</g>` : ''}</g>`;
  // (a star's place rides on its group, so a twinkle can scale the star in place)
  const star = (x, y, r, cls, k) => `<g transform="translate(${(+x).toFixed(1)} ${(+y).toFixed(1)})"><path class="${cls}" style="--k:${k || 0}" d="M0 ${-r}C${r * .16} ${-r * .16} ${r * .16} ${-r * .16} ${r} 0C${r * .16} ${r * .16} ${r * .16} ${r * .16} 0 ${r}C${-r * .16} ${r * .16} ${-r * .16} ${r * .16} ${-r} 0C${-r * .16} ${-r * .16} ${-r * .16} ${-r * .16} 0 ${-r}Z"/></g>`;
  const shadow = (g, x, y, rx, ry) => { const c = g.ip(x, y, 0); return `<ellipse class="sh" cx="${c[0].toFixed(1)}" cy="${(c[1] + 3).toFixed(1)}" rx="${rx}" ry="${ry}"/>`; };

  // A · Awards: a podium, one trophy in the spotlight, colleagues left in the shade
  const artA = (() => {
    const g = iso([108, 90], 1.65);
    const fig = (list) => list.map(([x, y]) => person(g.at(x, y, 0), 'dim', 0, false, 1.3)).join('');
    const tro = g.ip(30, 11, 26);
    return `
      <defs>
        <linearGradient id="opGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF1BF"/><stop offset=".45" stop-color="#F2C94C"/><stop offset="1" stop-color="#A9781C"/></linearGradient>
        <linearGradient id="opCone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1BF" stop-opacity="0"/><stop offset=".3" stop-color="#FFF1BF" stop-opacity=".16"/><stop offset="1" stop-color="#FFF1BF" stop-opacity=".05"/></linearGradient>
      </defs>
      ${shadow(g, 30, 14, 100, 26)}
      <polygon class="cone" points="${(tro[0] - 12).toFixed(1)},2 ${(tro[0] + 12).toFixed(1)},2 ${(tro[0] + 40).toFixed(1)},${(tro[1] + 8).toFixed(1)} ${(tro[0] - 40).toFixed(1)},${(tro[1] + 8).toFixed(1)}"/>
      ${fig([[-30, 18], [62, -18]])}
      ${g.box(0, 0, 0, 20, 22, 15, 'pd')}${g.box(20, 0, 0, 20, 22, 26, 'pd hi')}${g.box(40, 0, 0, 20, 22, 9, 'pd')}
      ${star(...g.ip(30, 22, 14), 6, 'pst')}
      <g class="tro" transform="translate(${tro[0].toFixed(1)} ${tro[1].toFixed(1)}) scale(1.3)">
        <path class="cup" d="M-8 -3h16l-2-4h-12Z M-2.5-7h5l-.6-8h-3.8Z M-12-36h24c0 12-5 20-12 21c-7-1-12-9-12-21Z"/>
        <path class="hdl" d="M-12-32c-7 0-8 9 0 11M12-32c7 0 8 9 0 11"/>
        <path class="gl" d="M-7-32c0 6 1.5 10 4 12"/>
      </g>
      ${fig([[-12, 42], [66, 8]])}
      ${star(tro[0] + 30, tro[1] - 44, 6.5, 'spk', 0)}${star(tro[0] - 27, tro[1] - 30, 5, 'spk', 1)}${star(tro[0] + 36, tro[1] - 12, 4, 'spk', 2)}`;
  })();

  // B · A new platform: a laptop with a leaderboard, a floating badge and a stack of points coins
  const artB = (() => {
    const g = iso([116, 80], 1.5);
    const rowZ = [31, 22.5, 14], rowL = [34, 25, 17];
    const board = rowZ.map((z, i) =>
      g.circ([9, 0, z], 2.8, 'y', 'av' + (i ? '' : ' hi'), 18) +
      g.quad([14, 0, z - 1.7], [14 + rowL[i], 0, z - 1.7], [14 + rowL[i], 0, z + 1.7], [14, 0, z + 1.7], 'bar' + (i ? '' : ' hi'))).join('');
    const coin = (z, cls) => `<g class="coin ${cls || ''}">${g.circ([80, 22, z], 8, 'z', 'cs', 28)}${g.circ([80, 22, z + 2.4], 8, 'z', 'ct', 28)}</g>`;
    const keys = Array.from({ length: 4 }, (_, r) => g.line([[6, 5 + r * 5, 3], [54, 5 + r * 5, 3]], 'key')).join('');
    return `
      ${shadow(g, 40, 20, 104, 26)}
      ${g.box(0, 0, 0, 60, 40, 3, 'lp')}${keys}
      ${g.quad([20, 27, 3], [40, 27, 3], [40, 37, 3], [20, 37, 3], 'pad')}
      ${g.box(0, -3, 3, 60, 3, 40, 'lp scr')}
      ${g.line([[6, 0, 38.5], [24, 0, 38.5]], 'ttl')}
      ${board}
      ${star(...g.ip(52, 0, 31), 3.8, 'bst')}
      ${coin(0)}${coin(4.8)}${coin(9.6, 'top')}
      ${star(...g.ip(80, 22, 14.4), 3.6, 'cst')}
      <g class="medal"><g transform="translate(234 42)">
        <path class="rb" d="M-7 9-11 27l6-3 4 5 3-15M7 9l4 18-6-3-4 5"/>
        <circle class="md" r="15"/><circle class="md2" r="10"/>
        ${star(0, 0, 6, 'mst')}
      </g></g>`;
  })();

  // C · A story campaign: a story card on a plinth, broadcasting to a ring of colleagues
  const artC = (() => {
    const g = iso([150, 50], 1.5);
    const C = [30, 30], R = 40;
    const ring = [-100, -55, -10, 35, 80, 125, 170, 215].map((a, k) => {
      const t = a * Math.PI / 180, x = C[0] + R * Math.cos(t), y = C[1] + R * Math.sin(t);
      return { x, y, d: x + y, k };
    });
    const back = ring.filter((p) => p.d < 58), front = ring.filter((p) => p.d >= 58);
    const pp = (list) => list.sort((a, b) => a.d - b.d).map((p) => person(g.at(p.x, p.y, 0), '', p.k, true, 1.3)).join('');
    const top = g.ip(30, 31, 30);
    const rays = ring.map((p) => { const q = g.ip(p.x, p.y, 0); return `<line x1="${top[0].toFixed(1)}" y1="${top[1].toFixed(1)}" x2="${q[0].toFixed(1)}" y2="${(q[1] - 16).toFixed(1)}"/>`; }).join('');
    return `
      ${shadow(g, 30, 30, 104, 34)}
      ${g.circ([30, 30, 0], R + 8, 'z', 'disk', 64)}${g.circ([30, 30, 0], R - 12, 'z', 'ring', 56)}
      <g class="rip">${g.circ([30, 30, 0], 15, 'z', 'rp', 40)}${g.circ([30, 30, 0], 15, 'z', 'rp', 40)}</g>
      <g class="rays">${rays}</g>
      ${pp(back)}
      ${g.box(20, 20, 0, 20, 20, 4, 'pl')}
      ${g.box(16, 29, 4, 28, 2.5, 36, 'sc')}
      ${g.quad([19, 31.5, 23], [41, 31.5, 23], [41, 31.5, 37], [19, 31.5, 37], 'img')}
      ${g.line([[19.5, 31.5, 18.5], [38, 31.5, 18.5]], 'ln lg')}${g.line([[19.5, 31.5, 13.5], [40.5, 31.5, 13.5]], 'ln')}${g.line([[19.5, 31.5, 9], [34, 31.5, 9]], 'ln')}
      <g class="cast" transform="translate(${g.at(45, 29, 36)})"><path d="M4-5a7 7 0 0 1 0 10"/><path d="M9-10a14 14 0 0 1 0 20"/><path d="M14-15a21 21 0 0 1 0 30"/></g>
      ${pp(front)}`;
  })();
  const ARTS = [artA, artB, artC];

  /* ── stop 1: a line of light from the recommendation ("C: a story campaign") to C's tally ── */
  const LK = [[1098, 226], [1240, 226], [1326, 288], [1396, 368]];   // cubic: start, c1, c2, end (stage px)
  const LBOX = [1090, 214, 318, 166];                                // its box: x, y, w, h
  const bz = (t, k) => { const u = 1 - t; return u * u * u * LK[0][k] + 3 * u * u * t * LK[1][k] + 3 * u * t * t * LK[2][k] + t * t * t * LK[3][k]; };
  const linkD = `M${LK[0].join(' ')} C${LK[1].join(' ')} ${LK[2].join(' ')} ${LK[3].join(' ')}`;
  // a light rides it on transforms (the compositor): the curve sampled into keyframes, eased in the sampling
  const ease = (t) => t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
  // (it runs in the first half of each lap, then rests unseen at the end)
  const beadKF = `@keyframes opBeadM {${Array.from({ length: 25 }, (_, i) => {
    const q = i / 24, t = ease(q);
    return ` ${(q * 50).toFixed(1)}% { transform: translate(${(bz(t, 0) - LBOX[0]).toFixed(1)}px, ${(bz(t, 1) - LBOX[1]).toFixed(1)}px); }`;
  }).join('')} 100% { transform: translate(${LK[3][0] - LBOX[0]}px, ${LK[3][1] - LBOX[1]}px); } }`;

  const cols = OPTS.map((o, c) => {
    const rows = RATE.map((row, r) => `
          <div class="op-row" style="top:${ROW0 + r * ROWH}px;--r:${r}">
            ${mark(row[c], '', `data-in="0" style="--d:${r2(MARK_AT + r * ROW_STEP + c * COL_STEP)}s;--r:${r}"`)}
          </div>`).join('');
    return `
      <div class="op-col ${o.k.toLowerCase()}" style="left:${colX(c)}px;top:${T}px;width:${CW}px;height:${H}px;--d:${COL_D[c]}s">
        ${c === 2 ? '<i class="op-slab"></i>' : ''}
        <div class="op-card glass" data-in="0">
          <i class="op-aglow"></i>
          <span class="op-bd">${o.k}</span>
          <h3 class="op-t">${o.t}</h3>
          <p class="op-s">${o.s}</p>
          ${rows}
          <div class="op-row op-worow" style="top:${WO}px"><p class="op-w">${o.w}</p></div>
          ${c === 2 ? '<i class="op-cband"></i><i class="op-run"></i>' : ''}
        </div>
        <svg class="op-art art-${o.k.toLowerCase()} a-drop" data-in="0" style="--d:${r2(ART_D + c * ART_STEP)}s;--dur:.9s" viewBox="0 0 270 170" aria-hidden="true">${ARTS[c]}</svg>
        ${c === 2 ? `<div class="op-tally a-drop" data-in="1" style="--d:.95s;--dur:.8s"><div>${Array.from({ length: 5 }, (_, k) => `<b style="--k:${k}"></b>`).join('')}<span>${C_STRONG} of 5 strong</span></div></div>` : ''}
        <i class="op-edge t"></i><i class="op-edge b"></i>
      </div>`;
  }).join('');

  const crit = CRIT.map((t, r) => `<div class="op-cl" style="top:${ROW0 + r * ROWH}px">${t}</div>`).join('');
  const warn = '<svg viewBox="0 0 20 18" aria-hidden="true"><path d="M10 1.6 18.4 16.4H1.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M10 6.8v4.4M10 13.5v.1" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';

  Deck.scene({
    id: 'options',
    title: 'Three ways to close the gap',
    act: 2,
    bg: 'navy',
    transition: 'chapter',
    cues: ['Three options · five criteria', 'We recommend C · the story campaign'],
    holds: [16, 11],
    notes: [
      'We did not start from the answer. We weighed three ways to close the gap: awards, a new recognition platform, and a story campaign. Awards reward a few. A platform costs money and teaches little. Doing nothing keeps reach at 8%.',
      'So we recommend the story campaign. It reaches everyone, the learning travels, it is fair by design, it costs little and it starts now, on the channels we already have. Awards and tools can plug into it later.',
    ],
    field: [
      { dim: .3, lit: .02, travel: .22, offset: [-110, 170], litFrom: null, warm: .12, links: .45, wave: .55, streaks: .1, sparkle: 1.1, drift: 1,
        calm: [[100, 120, 1560, 290, .75], [110, 300, 1810, 930, .85]] },
      { lit: .06, litFrom: [1565, 600], warm: 0, travel: .35, wave: .65, sparkle: 1.5,
        calm: [[100, 120, 1790, 330, .8], [110, 300, 1810, 950, .85]] },
    ],
    html: `
      <i class="op-pool ab"></i><i class="op-pool c"></i>

      <div class="op-head">
        <div class="kicker a-wipe" data-in="0" style="--d:.05s">Strategic options</div>
        <i class="op-hglow"></i>
        <h2 class="h2 op-h" data-in="0" data-out="1" data-split style="--d:.12s">We weighed three ways to close the gap.</h2>
        <h2 class="h2 op-h op-hero" data-in="1" data-split data-spark="1" data-spark-delay=".5" style="--d:.34s;--wstep:.045s">We recommend <em class="hl">C: a story campaign</em><br>on the channels we already have.</h2>
        <p class="op-sub a-fade" data-in="1" style="--d:.95s;--dur:.8s">Awards and tools can plug into it later.</p>
      </div>

      <!-- the table: it steps down at stop 1 to make room for the recommendation -->
      <div class="op-table" style="--seam:${SEAM}px;--rest:${H - SEAM}px;--drop:${DROP}px">
      <!-- the criteria: support, small and dim -->
      <div class="op-crit" data-in="0" style="left:${LX}px;top:${T}px;width:${LW}px;height:${H}px;--d:.2s">
        <div class="op-leg">
          <span>${mark(2, 'sm')}Strong</span>
          <span>${mark(1, 'sm')}Partial</span>
          <span>${mark(0, 'sm')}Weak</span>
        </div>
        ${crit}
        <div class="op-cl op-cwo" style="top:${WO}px"><span class="op-wi">${warn}</span>Watch-out</div>
      </div>

      <!-- C's lift: a soft shadow and a teal floor light under the card (stop 1) -->
      <i class="op-lift" style="left:${colX(2) - 40}px;top:${T + H - 70}px"></i>

      ${cols}

      <!-- stop 0 ambient: a reading band walks the five rows -->
      <div class="op-band" style="left:${LX - 12}px;top:${T + ROW0}px;width:${1776 - LX + 24}px;height:${ROWH}px;--walk:${WALK}s"><i></i></div>

      </div>

      <!-- stop 1: a light falls on C; a line of light ties the recommendation to it -->
      <i class="op-shaft" style="left:${colX(2) + CW / 2 - 200}px;top:${T + DROP - 16 - 230}px"></i>
      <div class="op-link" style="left:${LBOX[0]}px;top:${LBOX[1]}px;width:${LBOX[2]}px;height:${LBOX[3]}px">
        <svg class="a-wipe" data-in="1" style="--d:1.15s;--dur:.7s" viewBox="${LBOX.join(' ')}" aria-hidden="true">
          <defs><linearGradient id="opLinkG" gradientUnits="userSpaceOnUse" x1="${LK[0][0]}" y1="0" x2="${LK[3][0]}" y2="0"><stop offset="0" stop-color="#25C7BC" stop-opacity=".25"/><stop offset="1" stop-color="#03FFCB" stop-opacity=".95"/></linearGradient></defs>
          <path d="${linkD}"/>
          <circle cx="${LK[3][0]}" cy="${LK[3][1]}" r="4"/>
        </svg>
        <i class="op-bead"></i>
      </div>
      <style>${beadKF}</style>

      <i class="op-spk" data-spark="0" data-spark-xy="${colX(2) + CW / 2},${T - 34}" data-spark-delay=".62"></i>
    `,
    leave(ctx) { window.LFLeave && LFLeave(ctx); },   // once faded out, it leaves the compositor
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // what the stop has taken away leaves the compositor
      const el = ctx.el;
      // one-shot lights (the columns' opening edges, the ripples as marks land, the run down
      // C's column, the blooms) play only on a live click; their resting state is invisible
      el.classList.remove('op-live0', 'op-live1');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('op-live0');
      if (!ctx.instant && n === 1 && prev === 0) {
        el.classList.add('op-live1');
        ctx.after(420, () => window.Field && Field.burst(colX(2) + CW / 2, T + DROP + H / 2, { radius: 620, dur: 1.6 }));
      }
      // stop 1: C is the one card that goes live
      ctx.$('.op-col.c .op-card').classList.toggle('live', n >= 1);
    },
  });
})();
