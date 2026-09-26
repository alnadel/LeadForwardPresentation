/* 05 · Reading the numbers (v3) — two plinths, one reading.
   Stop 0: "Willingness is strong; the mechanism is weak." A pseudo-3D data model on two
   plinths. Front faces are true, so every column stands on one baseline at one exact scale
   (100% = 360 px). Tahakom is the solid column, the benchmark its dashed glass ghost.
   Left, in teal: THE WILLINGNESS. Peer recognition rises to 89%, far past the benchmark's
   41% (a glass collar marks that level on it). A dimension bracket spans the difference, and
   the hero +48 lands beside it with the spark. Right, in plum: THE MECHANISM. Tahakom's columns
   stop short of their benchmarks; the shortfall is drawn as a dashed, hatched void up to the
   benchmark level, with −14 and −15 above. The exact pairs are engraved on each plinth's front.
   Stop 1: "Behind on the mechanism, ahead on the willingness — build the channel, then test it."
   The columns sink back into the plinths. The willingness becomes a glass reservoir of light,
   filled to scale (89%, with the benchmark's 41% ringed). The organisation (an illustrative
   building) rises on the mechanism plinth, reached only by a thin, broken plum line. Then a bridge
   of light is built across the gap, a test gate stands on it before the building, the
   building's windows light, and story lights keep flowing through the gate. The numbers
   are now small evidence cards.
   Ambient: stop 0, light pools breathe on both plinths, a light climbs the surplus of the hero
   column, motes rise over the willingness, the shortfall voids pulse. Stop 1: story lights ride
   the bridge, the gate pings as each passes, the reservoir's surface shimmers and motes rise in it.
   Numbers never change while parked. All state keys off .st-n and .is-in, so back navigation lands
   on the same frame; the one-shot lights play only on a live click. */
(function () {
  /* ── geometry (stage px) ── */
  const K = 3.6;                               // stop 0: px per percentage point (100% = 360 px)
  const YP = 806, PH = 40, PDX = 78, PDY = 52; // plinths: top front edge, front face height, depth (up-right)
  const YB = YP - 13;                          // bases of everything standing on a plinth (13 px into its depth)
  const CW = 84, DX = 26, DY = 17, GAP = 34;   // a column: front width, depth; the gap inside a pair
  const PLW = 668, PL = { will: 144, mech: 1030 };
  const r1 = (v) => Math.round(v * 10) / 10;
  const P = (a, ox = 0, oy = 0) => a.map(([x, y]) => `${r1(x + ox)},${r1(y + oy)}`).join(' ');
  // an oblique box: the front face (w × h) has its top-left at (ox, oy + dy); depth (dx, dy) recedes up-right
  const faces = (w, h, dx, dy, ox = 0, oy = 0) => ({
    f: P([[0, dy], [w, dy], [w, dy + h], [0, dy + h]], ox, oy),
    t: P([[0, dy], [dx, 0], [w + dx, 0], [w, dy]], ox, oy),
    s: P([[w, dy], [w + dx, 0], [w + dx, h], [w, dy + h]], ox, oy),
  });
  // an svg drawn in stage coordinates (its viewBox starts where the box sits)
  const stageSvg = (cls, x, y, w, h, body, attrs = '', style = '') =>
    `<svg class="${cls}" style="left:${r1(x)}px;top:${r1(y)}px;${style}" width="${r1(w)}" height="${r1(h)}" viewBox="${r1(x)} ${r1(y)} ${r1(w)} ${r1(h)}" aria-hidden="true"${attrs}>${body}</svg>`;
  // rises out of its plinth: the wrapper clips along the base outline (the front edge, then the
  // side's receding bottom edge) and the body slides up from below it; it sinks the same way
  const riser = ({ x, w, h, dx, dy, cls = '', d, dur, inn, out, body }) => {
    const W = r1(w + dx), H = r1(h + dy);
    const clip = `polygon(-70px -90px, ${W + 70}px -90px, ${W + 70}px ${r1(h)}px, ${W}px ${r1(h)}px, ${r1(w)}px ${H}px, -70px ${H}px)`;
    return `<div class="bm-rw ${cls}" style="left:${r1(x)}px;top:${r1(YB - H)}px;width:${W}px;height:${H}px;clip-path:${clip}">` +
      `<div class="bm-rise" data-in="${inn}"${out != null ? ` data-out="${out}"` : ''} style="--h:${H}px;--d:${d}s;--dur:${dur}s">${body}</div></div>`;
  };
  const col = (w, h, cls, extra = '') => {
    const f = faces(w, h, DX, DY);
    return `<svg class="bm-cs ${cls}" width="${r1(w + DX)}" height="${r1(h + DY)}" aria-hidden="true">` +
      `<polygon class="s" points="${f.s}"/><polygon class="f" points="${f.f}"/>${extra}<polygon class="t" points="${f.t}"/></svg>`;
  };
  const words = (s, cls) => s.split(' ').map((w) => `<em class="${cls}">${w}</em>`).join(' ');

  /* ── the data (Tahakom vs benchmark, percentage points) ── */
  const HERO = { name: 'Peer recognition', t: 89, b: 41, x: 190 };
  const MECH = [
    { name: 'Org-wide recognition', t: 8, b: 22, x: 1085 },
    { name: 'Choice in recognition', t: 49, b: 64, x: 1420 },
  ];
  const AUX = { name: 'Connection / loyalty', t: 80, b: 77 };
  const hgt = (v) => r1(v * K);
  const gx = (x) => x + CW + GAP;              // the benchmark ghost stands right of Tahakom's column

  /* ── stop 0 · the plinths ── */
  const plinth = (k, x) => {
    const f = faces(PLW, PH, PDX, PDY);
    // the floor grid on the top face: two lines parallel to the front, depth lines every 56 px
    let grid = '';
    for (const u of [1 / 3, 2 / 3]) grid += `<path d="M${r1(PDX * u)} ${r1(PDY * (1 - u))}H${r1(PLW + PDX * u)}"/>`;
    for (let gxp = 56; gxp < PLW; gxp += 56) grid += `<path d="M${gxp} ${PDY}l${PDX} ${-PDY}"/>`;
    return `
      <div class="bm-plinth ${k}" data-in="0" style="left:${x}px;top:${YP - PDY}px;--d:.18s;--dur:.9s">
        <svg width="${PLW + PDX}" height="${PDY + PH}" aria-hidden="true">
          <polygon class="t" points="${f.t}"/><g class="grid">${grid}</g>
          <polygon class="f" points="${f.f}"/><polygon class="s" points="${f.s}"/>
          <path class="edge-glow" d="M0 ${PDY}H${PLW}"/><path class="edge" d="M0 ${PDY}H${PLW}"/>
        </svg>
        <i class="bm-plinth-sweep"></i>
      </div>`;
  };
  // the exact pair, engraved on the plinth front under each column
  const eng = (x, v, cls, d) => `<span class="bm-eng ${cls}" data-in="0" data-out="1" style="left:${r1(x + CW / 2 - 10)}px;--d:${d}s">${v}%</span>`;

  /* the willingness: the hero pair */
  const hT = hgt(HERO.t), hB = hgt(HERO.b);
  const yT = r1(YB - hT), yL = r1(YB - hB);
  const hs = r1(hT - hB);                      // the surplus: the part of the column above the benchmark
  const heroCol = riser({ x: HERO.x, w: CW, h: hT, dx: DX, dy: DY, cls: 'tk will hero', d: .62, dur: 1.25, inn: 0, out: 1,
    body: col(CW, hT, 'tw', `<polygon class="uf" points="${P([[0, DY], [CW, DY], [CW, DY + hs], [0, DY + hs]])}"/><polygon class="us" points="${P([[CW, DY], [CW + DX, 0], [CW + DX, hs], [CW, DY + hs]])}"/>`) +
      `<i class="bm-climb" style="width:${CW}px;height:${hs}px;top:${DY}px;--hs:${hs}px"><b></b></i>` });
  const heroGhost = riser({ x: gx(HERO.x), w: CW, h: hB, dx: DX, dy: DY, cls: 'gh', d: .46, dur: .8, inn: 0, out: 1, body: col(CW, hB, 'gg') });
  const BX = gx(HERO.x) + CW + DX + 24;        // the dimension bracket
  const heroDim = stageSvg('bm-dim a-fade', HERO.x - 14, yT - DY - 10, BX - HERO.x + 30, hs + DY + 22, `
        <polygon class="collar" points="${P([[HERO.x - 9, yL], [HERO.x + CW + 9, yL], [HERO.x + CW + DX + 15, yL - DY - 5], [HERO.x + DX + 6, yL - DY - 5]])}"/>
        <path class="lvl b" d="M${HERO.x + CW + 9} ${yL}H${gx(HERO.x)}M${gx(HERO.x) + CW} ${yL}H${BX + 7}"/>
        <path class="lvl t" d="M${HERO.x + CW} ${yT}H${BX + 7}"/>
        <path class="br-glow" d="M${BX} ${yT}V${yL}"/>
        <path class="br" d="M${BX - 8} ${yT}H${BX + 8}M${BX} ${yT}V${yL}M${BX - 8} ${yL}H${BX + 8}"/>`, ` data-in="0" data-out="1"`, `--d:1.35s;--dur:.7s`);
  const heroNum = `
      <div class="bm-hero" data-in="0" data-out="1" style="left:${BX + 34}px;top:${r1((yT + yL) / 2 - 112)}px;--d:.62s">
        <i class="bm-hglow"></i>
        <div class="bm-hn" data-spark="0" data-spark-at="tr" data-spark-delay="1.1"><span class="bm-sg">+</span><span class="bm-dg"><span class="bm-gh" aria-hidden="true">48</span><span class="bm-ct" data-count="48" data-dur="1.25" data-delay=".62">0</span></span><b>pts</b></div>
        <div class="bm-hname">${HERO.name}</div>
      </div>
      <p class="bm-aux" data-in="0" data-out="1" style="left:${BX + 40}px;top:${r1(yL + 58)}px;--d:1.5s"><b>+${AUX.t - AUX.b}<small> pts</small></b><span>${AUX.name} · broadly aligned</span><em>${AUX.t}% vs ${AUX.b}%</em></p>`;

  /* the mechanism: two pairs, each short of its benchmark */
  const mech = MECH.map((m, i) => {
    const t = hgt(m.t), b = hgt(m.b), g = gx(m.x), v = m.b - m.t;
    const d = .7 + i * .1;
    const miss = faces(CW, r1(b - t), DX, DY);
    const cx = r1((m.x + g + CW + DX) / 2);
    return `
      ${riser({ x: g, w: CW, h: b, dx: DX, dy: DY, cls: 'gh', d: r1(.5 + i * .08), dur: .8, inn: 0, out: 1, body: col(CW, b, 'gg') })}
      ${riser({ x: m.x, w: CW, h: t, dx: DX, dy: DY, cls: 'tk mech', d, dur: .95, inn: 0, out: 1, body: col(CW, t, 'tp') })}
      <div class="bm-miss" data-in="0" data-out="1" style="left:${m.x}px;top:${r1(YB - b - DY)}px;--d:${r1(1.3 + i * .1)}s;--dur:.7s">
        <svg width="${CW + DX}" height="${r1(b - t + DY)}" aria-hidden="true"><polygon class="s" points="${miss.s}"/><polygon class="f" points="${miss.f}"/><polygon class="t" points="${miss.t}"/></svg>
        <i class="bm-miss-pulse" style="--pd:${-i * 1.6}s"></i>
      </div>
      <div class="bm-mn" data-in="0" data-out="1" style="left:${cx}px;top:${r1(YB - b - DY - 176)}px;--d:${r1(d + .02)}s">
        <div class="bm-mv"><span class="bm-sg">\u2212</span><span class="bm-dg"><span class="bm-gh" aria-hidden="true">${v}</span><span class="bm-ct" data-count="${v}" data-dur=".95" data-delay="${d}">0</span></span><b>pts</b></div>
        <div class="bm-mname">${m.name}</div>
      </div>
      ${eng(m.x, m.t, 'tp', 1.1 + i * .08)}${eng(g, m.b, 'gg', 1.14 + i * .08)}`;
  }).join('');

  // light pools on the plinth tops (drawn at half size, scaled ×2 in the keyframes)
  const pool = (k, cx, cy, w, h, dl) => `<i class="bm-pool ${k}" style="left:${r1(cx - w / 4)}px;top:${r1(cy - h / 4)}px;width:${w / 2}px;height:${h / 2}px;--pd:${dl}s"></i>`;
  const motes = Array.from({ length: 9 }, (_, i) => `<i style="left:${40 + (i * 53) % 280}px;top:${260 - (i * 37) % 90}px;--t:${7 + (i % 4) * 1.6}s;--dl:${-r1(i * 1.13)}s;--dx:${((i % 3) - 1) * 26}px;--dy:${-150 - (i * 29) % 120}px"></i>`).join('');

  /* ── stop 1 · the reading, shown ── */
  const K1 = 2.8;                              // the reservoir: 100% = 280 px
  const TX = 206, TW = 236, TDX = 40, TDY = 26, TH = 100 * K1;
  const hF = r1(HERO.t * K1), hR = r1(HERO.b * K1);
  const TWW = TW + TDX, THH = TH + TDY;
  const liq = faces(TW - 8, hF, TDX - 6, TDY - 4, 4, THH - 3 - (TDY - 4) - hF);
  const hPort = r1(THH - hF + 8 + 8);         // the port on the tank's side, just under the surface (the arc starts there)
  const glass = faces(TW, TH, TDX, TDY);
  const tank = riser({ x: TX, w: TW, h: TH, dx: TDX, dy: TDY, cls: 'tank', d: .34, dur: 1.15, inn: 1, body: `
        <svg class="bm-tk" width="${TWW}" height="${THH}" aria-hidden="true">
          <polygon class="gb" points="${P([[TDX, 0], [TW + TDX, 0], [TW + TDX, TH], [TDX, TH]])}"/>
          <polygon class="gl" points="${P([[0, TDY], [TDX, 0], [TDX, TH], [0, TH + TDY]])}"/>
          <polygon class="ls" points="${liq.s}"/><polygon class="lf" points="${liq.f}"/><polygon class="lt" points="${liq.t}"/>
          <path class="ring" d="M0 ${r1(THH - hR)}H${TW}L${TW + TDX} ${r1(THH - hR - TDY)}H${TDX}Z"/>
          <polygon class="gs" points="${glass.s}"/><polygon class="gf" points="${glass.f}"/><polygon class="gt" points="${glass.t}"/>
          <path class="hi" d="M16 ${TDY + 14}V${THH - 16}"/>
          <path class="port" d="M${TW + 13} ${r1(hPort + 4)}l${TDX - 26} ${-(TDY - 17)}v-15l${-(TDX - 26)} ${TDY - 17}z"/>
        </svg>
        <span class="bm-tk-ic" style="left:${r1(TW / 2 - 46)}px;top:${r1(THH - hF / 2 - 50)}px">${Deck.icon('users-connected')}</span>
        <div class="bm-bub" style="left:6px;top:${r1(THH - 3 - hF)}px;width:${TW - 12}px;height:${hF}px">${Array.from({ length: 7 }, (_, i) => `<i style="left:${14 + (i * 67) % 200}px;top:${r1(hF - 8)}px;--t:${4.4 + (i % 3) * 1.3}s;--dl:${-r1(i * .97)}s;--dx:${((i % 3) - 1) * 10}px;--dy:${-r1(hF * (.55 + (i % 4) * .1))}px"></i>`).join('')}</div>` });
  const surf = `<div class="bm-surfw a-fade" data-in="1" style="--d:1.5s;--dur:.8s">${stageSvg('bm-surf', TX, YB - THH, TWW, THH, `<polygon points="${P(liq.t.split(' ').map((q) => q.split(',').map(Number)), TX, YB - THH)}"/>`)}</div>`;
  const tankTicks = `
      <span class="bm-tick t" data-in="1" style="left:${TX - 78}px;top:${r1(YB - hF)}px;--d:1.1s">${HERO.t}%</span>
      <span class="bm-tick b" data-in="1" style="left:${TX - 78}px;top:${r1(YB - hR)}px;--d:1.16s">${HERO.b}%</span>`;

  // the organisation (illustrative): a tower between two wings, rising on the mechanism plinth
  const BD = { dx: 36, dy: 24 };
  const BLOCKS = [{ x: 1262, w: 92, h: 132 }, { x: 1354, w: 128, h: 262 }, { x: 1482, w: 150, h: 178 }];
  const B0 = BLOCKS[0].x, BH = 262, BWW = BLOCKS[2].x + BLOCKS[2].w + BD.dx - B0, BHH = BH + BD.dy;
  const BTOP = YB - BHH;                       // the building box's top (stage)
  const SKY = { x: 1362, y: 598, w: 20, h: 34 };   // the skybridge door, high on the tower's front
  const win = [];                              // window rects (local), with a light level each
  const blocks = BLOCKS.map((b, bi) => {
    const ox = b.x - B0, oy = BHH - b.h - BD.dy, f = faces(b.w, b.h, BD.dx, BD.dy, ox, oy);
    const cols = Math.floor((b.w - 26 + 12) / 22), rows = Math.floor((b.h - 34) / 26);
    const mx = ox + (b.w - (cols * 22 - 12)) / 2;
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
      const x = r1(mx + c * 22), y = r1(oy + BD.dy + 18 + r * 26);
      if (bi === 0 && c === 0 && r >= rows - 2) continue;                   // the street door
      if (x < SKY.x - B0 + SKY.w + 4 && x + 10 > SKY.x - B0 - 4 && y < SKY.y - BTOP + SKY.h + 4 && y + 14 > SKY.y - BTOP - 4) continue;   // the skybridge door
      win.push({ x, y, o: r1(.3 + ((c * 7 + r * 5 + bi * 3) % 9) / 13) });
    }
    return `<g class="bk b${bi}"><polygon class="s" points="${f.s}"/><polygon class="f" points="${f.f}"/><polygon class="t" points="${f.t}"/></g>`;
  }).join('');
  const street = `<rect class="door" x="10" y="${BHH - 46}" width="24" height="44" rx="2"/>`;
  const sky = `<rect class="sky" x="${SKY.x - B0}" y="${SKY.y - BTOP}" width="${SKY.w}" height="${SKY.h}" rx="2"/>`;
  const building = riser({ x: B0, w: BWW - BD.dx, h: BH, dx: BD.dx, dy: BD.dy, cls: 'bld', d: .48, dur: 1.15, inn: 1, body: `
        <svg class="bm-bd" width="${BWW}" height="${BHH}" aria-hidden="true">${blocks}<g class="wn">${win.map((w) => `<rect x="${w.x}" y="${w.y}" width="10" height="14" rx="1.5"/>`).join('')}</g>${street}${sky}</svg>
        <svg class="bm-lit" width="${BWW}" height="${BHH}" style="--cx:${SKY.x - B0 + SKY.w / 2}px;--cy:${r1(SKY.y - BTOP + SKY.h / 2)}px" aria-hidden="true">${win.map((w) => `<rect x="${w.x}" y="${w.y}" width="10" height="14" rx="1.5" fill-opacity="${w.o}"/>`).join('')}<rect class="sky-lit" x="${SKY.x - B0}" y="${SKY.y - BTOP}" width="${SKY.w}" height="${SKY.h}" rx="2"/></svg>` });

  // today's channel: a thin plum line along the ground, broken between the plinths
  const GY = YB - 16, G0 = TX + TW + 16, G1 = B0 + 12;
  const GAPX = [PL.will + PLW + 30, PL.mech - 10];
  const broken = stageSvg('bm-broken', G0 - 10, GY - 10, G1 - G0 + 20, 20, `
        <path class="gl" d="M${G0} ${GY}H${GAPX[0]}M${GAPX[1]} ${GY}H${G1}"/><path d="M${G0} ${GY}H${GAPX[0]}M${GAPX[1]} ${GY}H${G1}"/>
        <circle cx="${GAPX[0]}" cy="${GY}" r="3.5"/><circle cx="${GAPX[1]}" cy="${GY}" r="3.5"/>`, ` data-in="1"`, `--d:.82s;--dur:.6s`);
  const trickle = `<i class="bm-trick" style="left:${G0}px;top:${GY}px;--run:${GAPX[0] - G0 - 6}px"></i>`;

  // the channel to build: an arc of light from the reservoir's port into the tower's skybridge door
  const ARC = [[TX + TW + TDX / 2 + 2, YB - hF + 8], [730, 492], [1110, 480], [SKY.x, SKY.y + SKY.h / 2]];
  const bez = (t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * ARC[0][k] + 3 * u * u * t * ARC[1][k] + 3 * u * t * t * ARC[2][k] + t * t * t * ARC[3][k]); };
  const LUT = [0]; for (let i = 1, q = bez(0); i <= 200; i++) { const n = bez(i / 200); LUT.push(LUT[i - 1] + Math.hypot(n[0] - q[0], n[1] - q[1])); q = n; }
  const atFrac = (f) => { const L = f * LUT[200]; let i = 1; while (i < 200 && LUT[i] < L) i++; return (i - 1 + (L - LUT[i - 1]) / (LUT[i] - LUT[i - 1])) / 200; };
  const D = `M${ARC[0].join(' ')}C${ARC[1].join(' ')} ${ARC[2].join(' ')} ${ARC[3].join(' ')}`;
  const arc = stageSvg('bm-arc', ARC[0][0] - 30, 420, ARC[3][0] - ARC[0][0] + 60, 240, `
        <path class="glow" d="${D}" pathLength="1"/><path class="tube" d="${D}" pathLength="1"/><path class="core" d="${D}" pathLength="1"/>`, ` data-in="1"`, `--d:1.3s;--dur:1.05s`);
  // story lights: three ride the arc on one lap, a third of a lap apart; the gate pings and the
  // door glows as each passes (keep in step with bmCar: the ride takes 80% of the lap)
  const LAP = 5.4, CAR0 = 2.6, RIDE = .8, GF = .84;   // GF: where the gate stands (share of the arc's length)
  const cars = [0, 1, 2].map((k) => `<i class="bm-car" style="--cd:${r1(CAR0 + k * LAP / 3)}s"><b class="light sm"></b></i>`).join('');
  const PING = r1(CAR0 + RIDE * GF * LAP), DOOR = r1(CAR0 + RIDE * LAP);
  // the test gate: a hoop on the arc before the door, a gauge above it
  const gt = atFrac(GF), gp = bez(gt), gq = bez(gt + .01);
  const gang = r1(Math.atan2(gq[1] - gp[1], gq[0] - gp[0]) * 180 / Math.PI);
  const gate = `
      <div class="bm-gate a-materialize" data-in="1" style="left:${r1(gp[0])}px;top:${r1(gp[1])}px;--d:2s;--dur:.7s;--ping:${PING}s">
        <i class="bm-hoop" style="--a:${gang}deg"><b></b></i>
        <i class="bm-hoop-ping" style="--a:${gang}deg"></i>
        <span class="bm-gauge"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 16.5a8.5 8.5 0 0 1 17 0"/><path d="M12 16.5l4.2-5.2"/><circle cx="12" cy="16.5" r="1.3"/><path d="M5.6 11.2l1.3.9M12 7.2v1.5M18.4 11.2l-1.3.9"/></svg></span>
      </div>`;

  // the evidence, now small cards
  const ev = (cls, x, d, delta, name, vals) => `
      <div class="bm-ev ${cls}" data-in="1" style="left:${x}px;--d:${d}s">
        <b class="bm-ev-d">${delta}<small> pts</small></b><span class="bm-ev-n">${name}</span><span class="bm-ev-v">${vals}</span>
      </div>`;
  const cards =
    ev('will', 144, .72, `+${HERO.t - HERO.b}`, HERO.name, `${HERO.t}% vs ${HERO.b}%`) +
    ev('will aux', 486, .8, `+${AUX.t - AUX.b}`, AUX.name, `${AUX.t}% vs ${AUX.b}% · broadly aligned`) +
    ev('mech', 1030, .88, `−${MECH[0].b - MECH[0].t}`, MECH[0].name, `${MECH[0].t}% vs ${MECH[0].b}%`) +
    ev('mech', 1386, .96, `−${MECH[1].b - MECH[1].t}`, MECH[1].name, `${MECH[1].t}% vs ${MECH[1].b}%`);

  Deck.scene({
    id: 'benchmark',
    title: 'Reading the numbers',
    act: 1,
    bg: 'deep',
    transition: 'push',
    cues: ['Willingness is strong; the mechanism is weak · the numbers build', 'Reading · build the channel, then test it'],
    holds: [12, 8],
    notes: [
      'Against benchmarks, the mechanism is behind: org-wide recognition 8% against 22%; choice 49% against 64%. The willingness is ahead: peer recognition 89% against 41%, plus 48. Connection is aligned, 80% against 77%. Directional only, not Saudi norms.',
      'So: behind on the mechanism, ahead on the willingness. People are ready; the channel is missing. Build the channel, then test it — that is the pilot we are asking you to approve.',
    ],
    field: [
      { dim: .3, lit: 0, travel: .25, warm: .15, offset: [-190, 110], links: .45, wave: .6, streaks: .1, sparkle: 1.1, drift: 1,
        calm: [[100, 120, 1640, 290, .7], [100, 300, 1800, 860, .4], [100, 860, 1500, 950, .75]] },
      { dim: .32, wave: .8, sparkle: 1.4, calm: [[100, 120, 1760, 470, .75], [100, 470, 1800, 860, .35], [100, 860, 1500, 950, .75]] },
    ],
    html: `
      <svg class="bm-defs" width="0" height="0" aria-hidden="true"><defs>
        <linearGradient id="bm-tf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FE6D8"/><stop offset=".45" stop-color="#1CAAA2"/><stop offset="1" stop-color="#0A5359"/></linearGradient>
        <linearGradient id="bm-ts" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#138584"/><stop offset="1" stop-color="#05343A"/></linearGradient>
        <linearGradient id="bm-uf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FFFEE"/><stop offset=".35" stop-color="#3FEFD9"/><stop offset="1" stop-color="#1FC2B6"/></linearGradient>
        <linearGradient id="bm-us" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FC9BD"/><stop offset="1" stop-color="#138584"/></linearGradient>
        <linearGradient id="bm-pf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C898D2"/><stop offset=".5" stop-color="#8E5A9B"/><stop offset="1" stop-color="#4A2047"/></linearGradient>
        <linearGradient id="bm-ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5F2D59"/><stop offset="1" stop-color="#2A0E27"/></linearGradient>
        <linearGradient id="bm-gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity=".02"/></linearGradient>
        <linearGradient id="bm-lw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25C7BC" stop-opacity=".2"/><stop offset="1" stop-color="#0A2A3C" stop-opacity=".5"/></linearGradient>
        <linearGradient id="bm-lm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9D67AA" stop-opacity=".22"/><stop offset="1" stop-color="#2A1030" stop-opacity=".5"/></linearGradient>
        <linearGradient id="bm-lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16263A" stop-opacity=".95"/><stop offset="1" stop-color="#060C18" stop-opacity=".96"/></linearGradient>
        <linearGradient id="bm-qf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9FFFF0"/><stop offset=".25" stop-color="#34E2D2"/><stop offset="1" stop-color="#0B6F72"/></linearGradient>
        <linearGradient id="bm-bf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1B2C44"/><stop offset="1" stop-color="#0B1426"/></linearGradient>
        <pattern id="bm-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="3" height="9" fill="#C9A6D3" fill-opacity=".26"/></pattern>
      </defs></svg>

      <div class="pad bm-head">
        <div class="bm-kick">
          <div class="kicker a-wipe" data-in="0" data-out="1">Benchmark · secondary data</div>
          <div class="kicker a-wipe" data-in="1" style="--d:.06s">Reading</div>
        </div>
        <h2 class="h2 bm-h" data-in="0" data-out="1" data-split style="--d:.1s">${words('Willingness', 't')} is strong; the ${words('mechanism', 'p')} is weak.</h2>
        <h2 class="h2 bm-read" data-in="1" data-split style="--d:.12s;--wstep:.045s">${words('Behind on the mechanism,', 'p')} ${words('ahead on the willingness', 't')}</h2>
        <p class="bm-take" data-in="1" data-split data-spark="1" data-spark-delay=".62" style="--d:.42s;--wstep:.05s">— build the channel, then test it.</p>
      </div>

      <!-- a plum and a teal wash drift behind the two halves (half size, scaled ×2) -->
      <i class="bm-wash will"></i><i class="bm-wash mech"></i>

      <!-- the two plinths carry both stops -->
      ${pool('will', PL.will + 330, YP - 30, 700, 150, 0)}${pool('mech', PL.mech + 360, YP - 30, 720, 150, -4.5)}
      ${plinth('will', PL.will)}${plinth('mech', PL.mech)}
      <div class="bm-lab will a-wipe" data-in="0" data-out="1" style="left:${PL.will}px;--d:.3s"><i></i>The willingness</div>
      <div class="bm-lab mech a-wipe" data-in="0" data-out="1" style="left:${PL.mech}px;--d:.4s"><i></i>The mechanism</div>

      <!-- stop 0 · the data model -->
      <i class="bm-beam" style="left:${r1(HERO.x + (CW + DX) / 2 - 45)}px;top:${r1(yT - DY - 70)}px"></i>
      <div class="bm-motes a-fade" data-in="0" data-out="1" style="left:${HERO.x - 60}px;top:${r1(yT - 40)}px;--d:1.4s;--dur:1.2s">${motes}</div>
      ${heroGhost}${heroCol}${heroDim}${heroNum}
      ${eng(HERO.x, HERO.t, 'tw', 1.1)}${eng(gx(HERO.x), HERO.b, 'gg', 1.14)}
      ${mech}

      <!-- stop 1 · the reading, shown: reservoir → bridge → organisation -->
      ${broken}${trickle}
      <i class="bm-halo" style="left:${r1(TX + TWW / 2 - 140)}px;top:${r1(YB - THH / 2 - 130)}px"></i>
      ${tank}${surf}${tankTicks}
      ${building}
      <i class="bm-doorglow" style="left:${SKY.x - 30}px;top:${r1(SKY.y + SKY.h / 2 - 30)}px;--dd:${DOOR}s"></i>
      ${stageSvg('bm-arcglow', ARC[0][0] - 60, 400, ARC[3][0] - ARC[0][0] + 120, 280, `<path d="${D}"/>`)}
      ${arc}
      <div class="bm-path" style="--path:path('${D}');--lap:${LAP}s">
        <i class="bm-lead"><b class="light"></b></i>
        ${cars}
      </div>
      ${gate}
      <span class="bm-plq will" data-in="1" style="left:${PL.will + 26}px;--d:1s">The willingness</span>
      <span class="bm-plq mech" data-in="1" style="left:${PL.mech + 26}px;--d:1.06s">The mechanism</span>
      ${cards}

      <!-- supporting: legend, caveat, sources (small and dim, on both stops) -->
      <div class="bm-foot a-fade" data-in="0" style="--d:1.05s;--dur:.8s">
        <p class="bm-cav"><span class="bm-key"><i class="k-t"></i>Tahakom</span><span class="bm-key"><i class="k-b"></i>Benchmark</span><span class="bm-sep"></span>Directional comparison only: measures and populations are not identical.</p>
        <p class="bm-src"><b>Sources:</b> Tahakom internal survey (158 responses); Gallup &amp; Workhuman 2024, Achievers Workforce Institute, Globoforce/Workhuman. Benchmarks are directional and are not Saudi norms.</p>
      </div>
    `,
    leave(ctx) { window.LFLeave && LFLeave(ctx); },   // once faded out, it leaves the compositor
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // what the stop has taken away leaves the compositor
      // one-shot lights (the plinth sweeps, the bloom on +48, the bridge's leading light) play only
      // on a live click; each rests invisible, so a stop reached by a jump or by going back shows
      // the same settled frame
      const el = ctx.el;
      el.classList.remove('bm-live', 'bm-read-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('bm-live');
      if (!ctx.instant && n === 1 && prev === 0) el.classList.add('bm-read-live');
    },
  });
})();
