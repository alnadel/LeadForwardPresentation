/* 11 · Close (v2) — the finale and the lockup.
   Stop 0 is one click in three beats, paying off the opening story (Sara, "Two people know."):
     1 · the callback: the two lit colleagues of 02's pull-back, at exactly the same place,
         and "Two people knew." under them;
     2 · the story is told: it passes colleague to colleague (the field's nomination chain)
         until the whole field is lit, and the line becomes "Now everyone can learn from it.";
     3 · the lit colleagues rise: every light in the frame leaves its square (outermost
         first, the field darkening in the chain's own order) and gathers into the deck's
         name, "Impact Makers", as a word made of lights. The two who knew leave last and
         complete it; a light runs through the name. It forms in the exact place and size of
         stop 1's title, so the next click resolves it into the lockup.
   The flight is ONE canvas: full stage while the lights fly, the wordmark's band once formed.
   The lights start exactly on the field's squares: the field's colleagues are rebuilt here
   from its deterministic layout (field-v2.js build + chain rerank), and its camera is read
   back from the two pinned colleagues each frame (Field.pinned()).
   Stop 1: the lights resolve into the solid title (a wipe with a light running through the
   dots), and the brand frame rises over the dusk skyline with the team and the
   business-case strip beneath it; it holds for Q&A while stories keep travelling above the
   city and its traffic keeps moving. */
(function () {
  const t = Deck.t;
  const PAIR = Deck.NIGHT_PAIR, OFFSET = Deck.NIGHT_OFFSET;
  const REST = Field.restOf(PAIR, OFFSET);                   // where 02 left them
  const MID = [(REST[0][0] + REST[1][0]) / 2, (REST[0][1] + REST[1][1]) / 2];
  // the words sit exactly where 02 put "Two people know." (same formula as v1 03-night.js)
  const KNOW = { x: Math.round(Math.min(Math.max(144, MID[0] - 380), 1776 - 760)), y: Math.round(Math.max(REST[0][1], REST[1][1]) + 84) };

  /* ── the finale's clock: seconds after the click that builds stop 0 ── */
  const B = {
    chain: 2.6, chainDur: 3.2,   // beat 2: the story passes colleague to colleague until everyone has it
    out1: 3.0, in2: 3.5,         // "Two people knew." lifts away; "Now everyone can learn from it." lands
    out2: 6.3,                   // beat 3: the line lifts away…
    rise: 6.6, spread: 1.7,      // …and the lights leave the field, outermost first, over 1.7 s
    pair: .3,                    // the two who knew leave after everyone else
  };
  const TRAVEL = 1.1;            // stories hopping once the chain has reached everyone
  // calm behind the lines (beats 1–2) and behind the name (beat 3 on): the field's own
  // calm, replicated below for the lights' starting brightness
  const CALM = [[KNOW.x + 20, KNOW.y, KNOW.x + 740, KNOW.y + 190, .85], [470, 170, 1450, 392, .8]];
  const FORMED = { pins: [], travel: .3, links: .38, wave: .5, sparkle: .8, streaks: .06, drift: .6 };

  const W = 1920, H = 1080;
  const rnd = (s) => { s = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (a, b, v) => { const u = clamp((v - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  const inOut = (u) => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
  // CSS cubic-bezier (x1, y1, x2, y2): progress at time u, and the time at which progress is p
  const cbz = (p1, p2, s) => 3 * (1 - s) * (1 - s) * s * p1 + 3 * (1 - s) * s * s * p2 + s * s * s;
  const WIPE = [.45, 0, .55, 1], WIPE_D = .1, WIPE_T = 1, WIPE_M = 70;   // keep in step with .cl-title in 11-close.css
  const wipeAt = (p) => { let lo = 0, hi = 1; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (cbz(WIPE[1], WIPE[3], m) < p) lo = m; else hi = m; } return cbz(WIPE[0], WIPE[2], (lo + hi) / 2); };

  /* ── the field's colleagues, rebuilt (field-v2.js: build(), rerank() with chain, resolvePins()).
     Deterministic, so every light can start on its own square and leave in the chain's order. */
  let FN = null;
  function replica() {
    if (FN) return FN;
    const nodes = [], gap = 46;
    let i = 0;
    for (let y = -gap; y < H + gap * 2; y += gap) {
      for (let x = -gap * 2; x < W + gap * 3; x += gap) {
        i++;
        const r1 = rnd(i), r2 = rnd(i + 91.7), r3 = rnd(i + 17.3), r4 = rnd(i + 53.1), r5 = rnd(i + 7.77);
        if (r5 < .18) continue;
        const d = r3 < .55 ? 0 : r3 < .88 ? 1 : 2;
        nodes.push({ i: nodes.length, bx: x + (r1 - .5) * gap * .9, by: y + (r2 - .5) * gap * .9, d, s: [3, 4.5, 6.5][d] * (.8 + r4 * .5),
          ax: 3 + r2 * 7, ay: 3 + r4 * 6, px: r1 * 6.28, py: r3 * 6.28, fx: .03 + r4 * .05, fy: .025 + r1 * .05, tw: .6 + r2 * 1.4, tp: r4 * 6.28 });
      }
    }
    for (const n of nodes) {
      n.nb = [];
      for (const m of nodes) {
        if (m === n) continue;
        const dx = m.bx - n.bx, dy = m.by - n.by, dd = dx * dx + dy * dy;
        if (dd < 150 * 150 && dd > 30 * 30) n.nb.push(m);
      }
    }
    const nearest = (x, y) => { let best = null, bd = 1e18; for (const n of nodes) { const d = (n.bx - x) * (n.bx - x) + (n.by - y) * (n.by - y); if (d < bd) { bd = d; best = n; } } return best; };
    // the chain's ranks from the first colleague who knew (Dijkstra with the field's edge costs)
    const src = nearest(PAIR[0][0], PAIR[0][1]);
    for (const n of nodes) n.dist = Infinity;
    src.dist = 0;
    const open = [src];
    while (open.length) {
      let bi = 0;
      for (let k = 1; k < open.length; k++) if (open[k].dist < open[bi].dist) bi = k;
      const a = open[bi]; open[bi] = open[open.length - 1]; open.pop();
      if (a.done) continue;
      a.done = true;
      for (const b of a.nb) {
        if (b.done) continue;
        const w = Math.hypot(b.bx - a.bx, b.by - a.by) * (.6 + 2.4 * rnd(a.bx * 7.1 + b.by * 3.3));
        if (a.dist + w < b.dist) { b.dist = a.dist + w; open.push(b); }
      }
    }
    let max = 1;
    for (const n of nodes) if (n.dist < Infinity && n.dist > max) max = n.dist;
    for (const n of nodes) n.rr = n.dist < Infinity ? clamp(n.dist / max, 0, .999) : .999;
    const pins = [nearest(PAIR[0][0], PAIR[0][1]), nearest(PAIR[1][0], PAIR[1][1])].sort((a, b) => a.i - b.i);
    pins.forEach((n) => { n.pin = true; });
    // the rebuild must match the field square for square (else the lights fade in from nowhere)
    const probe = [PAIR[0], PAIR[1], [300, 260], [1600, 900], [960, 540]];
    const ref = Field.restOf(probe, [0, 0]);
    const ok = probe.every((p, k) => { const n = nearest(p[0], p[1]); return Math.abs(n.bx - ref[k][0]) < .01 && Math.abs(n.by - ref[k][1]) < .01; });
    return (FN = { nodes, pins, ok });
  }
  // the field's clock starts on its first frame; init() catches the same frame
  let FT0 = null;
  const fieldT = () => ((document.timeline && document.timeline.currentTime) || performance.now()) / 1000 - (FT0 || 0) / 1000;
  const wob = (n, tf) => [Math.sin(tf * n.fx * 6.28 + n.px) * n.ax, Math.cos(tf * n.fy * 6.28 + n.py) * n.ay];
  // the camera (pan + drift), read back from the two pinned colleagues
  let lastG = [OFFSET[0], OFFSET[1]];
  function camera(tf) {
    const lp = Field.pinned(), R = replica();
    if (lp.length !== 2) return lastG;
    let gx = 0, gy = 0;
    R.pins.forEach((n, k) => { const w = wob(n, tf), par = .45 + n.d * .35; gx += (lp[k][0] - n.bx - w[0]) / par; gy += (lp[k][1] - n.by - w[1]) / par; });
    return (lastG = [gx / 2, gy / 2]);
  }
  const livePos = (n, tf, G) => { const w = wob(n, tf), par = .45 + n.d * .35; return [n.bx + w[0] + G[0] * par, n.by + w[1] + G[1] * par]; };
  function calmAt(x, y) {
    let m = 1;
    for (const [x0, y0, x1, y1, amt] of CALM) {
      const f = 90, inside = smooth(x0 - f, x0 + f, x) * (1 - smooth(x1 - f, x1 + f, x)) * smooth(y0 - f, y0 + f, y) * (1 - smooth(y1 - f, y1 + f, y));
      m *= 1 - inside * amt;
    }
    return m;
  }

  /* ── the name, as dots: sampled from stop 1's title (same font, size, spacing and place) ── */
  const PITCH = 7, MOTE = 5;
  let WM = null;
  function wordmark(el) {
    if (WM) return WM;
    const h = el.querySelector('.cl-title'), sp = el.querySelector('.cl-tt');
    const pos = (n) => { let x = 0, y = 0; while (n && n !== el) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; } return [x, y]; };
    const [sx, sy] = pos(sp), [hx, hy] = pos(h);
    const cs = getComputedStyle(sp), size = parseFloat(cs.fontSize), ls = parseFloat(cs.letterSpacing) || 0;
    const pad = 48, bw = Math.ceil(sp.offsetWidth + pad * 2), bh = Math.ceil(sp.offsetHeight + pad * 2);
    const c = document.createElement('canvas'); c.width = bw; c.height = bh;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.font = '700 ' + size + 'px Somar';
    if ('letterSpacing' in g) g.letterSpacing = ls + 'px';
    g.textBaseline = 'alphabetic'; g.fillStyle = '#fff';
    const text = sp.textContent, base = pad + g.measureText(text).fontBoundingBoxAscent;   // an inline box's top is the font's ascent above its baseline
    g.fillText(text, pad, base);
    // rows sit on the baseline (the lowest a half pitch above it), so round bottoms overshooting it leave no stray dots
    const oy = (base - PITCH / 2) % PITCH;
    const px = g.getImageData(0, 0, bw, bh).data, all = [], grid = new Set();
    const cx = sx + sp.offsetWidth / 2, nx = Math.floor(bw / PITCH), ny = Math.floor((bh - oy) / PITCH);
    const ink = (i, j) => px[((oy + j * PITCH | 0) * bw + (i * PITCH + PITCH / 2 | 0)) * 4 + 3] >= 150;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) if (ink(i, j)) grid.add(j * nx + i);
    for (let j = 0; j < ny; j++) {
      for (let i = 0; i < nx; i++) {
        if (!grid.has(j * nx + i)) continue;
        // a dot alone in its row is a curve's overshoot at a stroke's top or bottom and reads as an accent (ċ, ṡ): drop it
        if (!grid.has(j * nx + i - 1) && !grid.has(j * nx + i + 1)) continue;
        const X = sx - pad + i * PITCH + PITCH / 2;
        all.push({ x: Deck.rtl ? 2 * cx - X : X, y: sy - pad + oy + j * PITCH });
      }
    }
    all.forEach((m, i) => { m.w = 1.1 + rnd(i * 3.1 + .7) * 1.5; m.ph = rnd(i * 7.7 + .3) * 6.28; });
    // the two who knew land last, at the top of the first letter
    const x0 = Math.min(...all.map((m) => m.x));
    const pairPts = all.filter((m) => m.x < x0 + 1).sort((a, b) => a.y - b.y).slice(0, 2);
    const pts = all.filter((m) => !pairPts.includes(m));
    let bx0 = 1e9, by0 = 1e9, bx1 = -1e9, by1 = -1e9;
    all.forEach((m) => { bx0 = Math.min(bx0, m.x); by0 = Math.min(by0, m.y); bx1 = Math.max(bx1, m.x); by1 = Math.max(by1, m.y); });
    const M = 40, box = { x: Math.floor(bx0 - M), y: Math.floor(by0 - M), w: Math.ceil(bx1 - bx0 + 2 * M), h: Math.ceil(by1 - by0 + 2 * M) };
    return (WM = { all, pts, pairPts, box, tl: hx, tw: h.offsetWidth, ty: hy });
  }

  /* ── one canvas for every light ── */
  const MC = { el: null, g: null, k: 1, box: null };
  let SPR = null;
  function sprite() {
    if (SPR) return SPR;
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(210,255,246,1)'); gr.addColorStop(.08, 'rgba(3,255,203,.55)'); gr.addColorStop(.45, 'rgba(37,199,188,.16)'); gr.addColorStop(1, 'rgba(37,199,188,0)');
    g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
    return (SPR = c);
  }
  function canvasBox(box) {                     // a stage rectangle, or null to take the canvas away
    const el = MC.el;
    if (!box) { if (MC.box) { el.classList.remove('on'); el.width = el.height = 1; MC.box = null; } return; }
    const st = document.getElementById('stage'), sc = st ? st.getBoundingClientRect().width / 1920 : 1;
    const k = clamp((sc || 1) * (window.devicePixelRatio || 1), .5, 1.25);
    if (MC.box && MC.k === k && MC.box.x === box.x && MC.box.y === box.y && MC.box.w === box.w && MC.box.h === box.h) return;
    el.style.left = box.x + 'px'; el.style.top = box.y + 'px'; el.style.width = box.w + 'px'; el.style.height = box.h + 'px';
    el.width = Math.round(box.w * k); el.height = Math.round(box.h * k);
    MC.k = k; MC.box = box; el.classList.add('on');
  }
  function clear() {
    const g = MC.g, b = MC.box;
    g.setTransform(MC.k, 0, 0, MC.k, -b.x * MC.k, -b.y * MC.k);
    g.globalAlpha = 1; g.clearRect(b.x, b.y, b.w, b.h);
    return g;
  }
  const FULL = { x: 0, y: 0, w: W, h: H };
  const C_FLY = 'rgb(170,255,236)', C_DOT = 'rgb(118,252,226)', C_TEAL = 'rgb(37,199,188)';

  let LITE = false;                              // #stage.lite (the L key), read at each stop
  /* the state of the finale */
  const st = { t0: null, parts: null, pairUp: false, formedAt: null, clock0: 0, lock: null, lockAmb: 0, lockFrom: 0, relit: false };

  // a dot of the name: its landing flash, then a slow twinkle and a light that runs through the name
  function drawDots(g, T, amb0, list, gone) {
    const spr = sprite(), b = WM.box, A = .3 * smooth(0, 2.5, T - amb0);
    const sp = (T - amb0 - .15) % 7.5, sx = sp >= 0 && sp < 2.3 ? b.x - 180 + (b.w + 360) * inOut(sp / 2.3) : -1e4;
    const dots = [];
    for (const m of list) {
      if (!m.on) continue;
      let a = 1 - A * (.5 + .5 * Math.sin(T * m.w + m.ph));
      let bb = Math.exp(-((m.x - sx) / 64) * ((m.x - sx) / 64));
      const fl = m.hit != null ? Math.exp(-(T - m.hit) * 3.2) : 0;
      let s = MOTE * (1 + .32 * bb + .7 * fl);
      if (gone) {                               // resolving into the solid title as the wipe passes
        const u = gone(m);
        if (u >= 1) continue;
        if (u > 0) { bb = Math.max(bb, 1 - u); a *= 1 - u * u; s *= 1 + .6 * u; }
      }
      dots.push([m, a, bb, fl, s]);
    }
    for (const [m, a, bb, fl] of dots) {
      const gs = 17 + 12 * bb + 16 * fl;
      g.globalAlpha = Math.min(1, .46 * a + .35 * bb + .5 * fl);
      g.drawImage(spr, m.x - gs / 2, m.y - gs / 2, gs, gs);
    }
    g.fillStyle = C_DOT;
    for (const [m, a, , , s] of dots) { g.globalAlpha = a; g.fillRect(m.x - s / 2, m.y - s / 2, s, s); }
    g.fillStyle = '#fff';
    for (const [m, a, bb, fl, s] of dots) {
      const w = Math.max(bb, fl);
      if (w < .04) continue;
      g.globalAlpha = .9 * w * Math.max(a, .5); g.fillRect(m.x - s / 2, m.y - s / 2, s, s);
    }
    return dots.length;
  }

  // beat 3 begins: every lit colleague in the frame gets a light and a dot of the name
  function plan(el) {
    const R = replica(), wm = wordmark(el), tf = fieldT(), G = camera(tf);
    const vis = R.nodes.filter((n) => { if (n.pin) return false; const p = livePos(n, tf, G); return p[0] > -6 && p[0] < W + 6 && p[1] > -6 && p[1] < H + 6; });
    const em = vis.slice();
    // every dot gets at least one light: if the frame holds fewer lights than dots, some colleagues send two
    for (let k = 0; em.length < wm.pts.length && vis.length; k++) em.push(vis[k % vis.length]);
    em.sort((a, b) => b.rr - a.rr || a.i - b.i);          // outermost in the chain leave first
    const N = em.length;
    const parts = em.map((n, i) => ({ n, rr: n.rr, tL: B.rise + B.spread * i / Math.max(1, N - 1), seed: i + 1 }));
    // dots matched by x, so the lights rise side by side instead of crossing
    const byX = parts.slice().sort((a, b) => livePos(a.n, tf, G)[0] - livePos(b.n, tf, G)[0] || a.seed - b.seed);
    const tg = wm.pts.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    byX.forEach((p, i) => { p.tg = tg[Math.floor(i * tg.length / N)]; });
    const pair = R.pins.map((n, k) => ({ n, pin: k, tL: B.rise + B.spread + B.pair + k * .14, tg: wm.pairPts[k], seed: 9001 + k }));
    wm.all.forEach((m) => { m.on = false; m.hit = null; });
    return { parts, pair, all: parts.concat(pair), N, ok: R.ok, landAt: 0 };
  }
  function lift(p, tf, G, lp, ok) {
    const [x, y] = p.pin != null && lp.length === 2 ? lp[p.pin] : livePos(p.n, tf, G);
    const tx = p.tg.x, ty = p.tg.y, dx = tx - x, dy = ty - y, dist = Math.hypot(dx, dy);
    const up = Math.max(70, Math.abs(dy) * .45), sw = (rnd(p.seed * 2.3 + 1) - .5) * 180;
    p.x0 = x; p.y0 = y;
    p.c1 = [x + dx * .1 + sw, y - (dy < 0 ? up : up * .5)];
    p.c2 = [tx - dx * .12 - sw * .3, ty + (dy < 0 ? up * .55 : -up * .6)];
    if (p.pin != null) {
      p.dur = 1.9; p.a0 = 1; p.s0 = 18; p.g0 = 110;
    } else {
      p.dur = 1.25 + .45 * dist / 1000 + .35 * rnd(p.seed * 1.37 + 3);
      // it starts as the field drew that colleague: its square, its glow, its brightness
      const tw = .62 + .38 * Math.sin(tf * p.n.tw + p.n.tp);
      p.a0 = ok ? Math.min(1, (.55 + .45 * tw) * .8 * (.1 + .9 * calmAt(x, y))) : 0;
      p.s0 = p.n.s + 1.5; p.g0 = 26 + p.n.d * 10;
    }
    p.up = true;
  }
  const bez = (p, e) => { const m = 1 - e, a = m * m * m, b = 3 * m * m * e, c = 3 * m * e * e, d = e * e * e; return [a * p.x0 + b * p.c1[0] + c * p.c2[0] + d * p.tg.x, a * p.y0 + b * p.c1[1] + c * p.c2[1] + d * p.tg.y]; };

  // one frame of beat 3 (tt: seconds since the click); returns true once the name has formed
  function rise(ctx, tt, fade) {
    const P = st.parts, tf = fieldT(), G = camera(tf);
    const lp = Field.pinned();
    let k = 0;
    for (const p of P.all) {
      if (!p.up && !fade && tt >= p.tL) {
        lift(p, tf, G, lp, P.ok);
        if (p.pin != null && !st.pairUp) {         // the two who knew leave: their lamps go out, the field lets go of them
          st.pairUp = true;
          ctx.el.classList.add('cl-pl');
          Field.set({ pins: [] });
        }
      }
      if (p.up && !p.done && tt >= p.tL + p.dur) {
        p.done = true; p.tg.on = true; p.tg.hit = Math.max(p.tg.hit || -1e9, p.tL + p.dur);
        if (p.pin != null) { P.landAt = Math.max(P.landAt, p.tL + p.dur); if (!fade) ctx.el.classList.add('cl-p4'); }   // the name is complete: it blooms
      }
    }
    // the field lets its lights go in exactly the order they leave
    for (; k < P.N && P.parts[k].up; k++);
    if (!fade) Field.setLit(k < P.N ? P.parts[k].rr + 1e-7 : 0);
    const g = clear(), spr = sprite(), fly = [];
    const fa = fade ? 1 - smooth(0, .5, fade) : 1;
    for (const p of P.all) {
      if (!p.up || p.done) continue;
      const u = clamp((tt - p.tL) / p.dur, 0, 1), e = inOut(u), [x, y] = bez(p, e);
      const a = (p.a0 + (1 - p.a0) * smooth(0, .3, u)) * fa;
      // (the two who knew stay large and bright until they are nearly home)
      const ks = p.pin != null ? smooth(.55, 1, u) : smooth(0, .8, u), kg = p.pin != null ? smooth(.4, 1, u) : smooth(0, .9, u);
      fly.push([p, u, e, x, y, a, p.s0 + (MOTE - p.s0) * ks, p.g0 + (17 - p.g0) * kg]);
    }
    if (!LITE) {                                 // (lite mode, for a weak laptop: the lights fly without glows or trails)
      for (const [, u, , x, y, a, , gs] of fly) { g.globalAlpha = a * (.9 - .48 * smooth(.6, 1, u)); g.drawImage(spr, x - gs / 2, y - gs / 2, gs, gs); }
      g.beginPath();
      for (const [p, u, e, x, y] of fly) { if (u < .08 || u > .97) continue; const q = bez(p, Math.max(0, e - .07)); g.moveTo(q[0], q[1]); g.lineTo(x, y); }
      g.globalAlpha = .3 * fa; g.strokeStyle = 'rgb(3,255,203)'; g.lineWidth = 1.3; g.stroke();
    }
    for (const [p, u, , x, y, a, s] of fly) {
      g.globalAlpha = a; g.fillStyle = u < .2 && p.pin == null ? C_TEAL : C_FLY;
      if (s > 9) { g.beginPath(); g.roundRect(x - s / 2, y - s / 2, s, s, s * .28); g.fill(); } else g.fillRect(x - s / 2, y - s / 2, s, s);
    }
    const amb0 = P.landAt || 1e9;
    if (fade) {
      const T0 = st.lockFrom;
      g.globalAlpha = 1;
      drawDots(g, tt, amb0, WM.all, (m) => dissolveU(m, tt - T0));
      return false;
    }
    drawDots(g, tt, amb0, WM.all);
    return P.all.every((p) => p.done) && tt > amb0 + 1.1;
  }
  // stop 1: each dot flashes and goes as the title's wipe passes it
  function dissolveU(m, dt) {
    if (m.dT == null) {
      const p = clamp((m.x - (WM.tl - WIPE_M)) / (WM.tw + 2 * WIPE_M), 0, 1);
      m.dT = WIPE_D + WIPE_T * wipeAt(p);
    }
    return clamp((dt - m.dT) / .45, 0, 1);
  }

  /* the dusk skyline: traffic keeps moving on the two roads (box px: stage y − 440) */
  const ROADS = [
    // headlights coming towards us on the frontage road
    { d: 'M1796 331 Q1320 424 420 640', k: 'w', t: 5.6, n: 3 },
    { d: 'M1796 339 Q1260 452 660 640', k: 'w', t: 6.4, n: 3 },
    // tail lights heading away on the highway
    { d: 'M1470 640 Q1650 470 1808 327', k: 'r', t: 5.2, n: 2 },
    { d: 'M1650 640 Q1762 470 1818 327', k: 'r', t: 4.6, n: 2 },
    { d: 'M1800 640 Q1832 470 1826 327', k: 'r', t: 5.8, n: 2 },
  ];
  // each car is a short bar of light (the old 34/1000 dash of its road, round-capped) driven along
  // the road with transforms: its keyframes sample the road (a quadratic curve) by arc length on
  // the old dash's clock (cubic-bezier(.4, 0, .9, .6) across the lap), with the bar turned to the
  // road's heading. Nothing repaints while it drives.
  const CAR_EASE = [.4, 0, .9, .6], CAR_N = 32;
  const cb = (p1, p2, s) => 3 * (1 - s) * (1 - s) * s * p1 + 3 * (1 - s) * s * s * p2 + s * s * s;   // one axis, from 0 to 1
  const ease = (u) => {                                   // CSS cubic-bezier: progress at time u
    let lo = 0, hi = 1;
    for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; if (cb(CAR_EASE[0], CAR_EASE[2], m) < u) lo = m; else hi = m; }
    return cb(CAR_EASE[1], CAR_EASE[3], (lo + hi) / 2);
  };
  const carKeys = ROADS.map((r, i) => {
    const [x0, y0, cx, cy, x1, y1] = r.d.match(/-?[\d.]+/g).map(Number);
    const at = (t) => [(1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1, (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1];
    const tan = (t) => Math.atan2(2 * (1 - t) * (cy - y0) + 2 * t * (y1 - cy), 2 * (1 - t) * (cx - x0) + 2 * t * (x1 - cx)) * 180 / Math.PI;
    const M = 600, len = [0];                               // arc-length table
    for (let k = 1, p = at(0); k <= M; k++) { const q = at(k / M); len.push(len[k - 1] + Math.hypot(q[0] - p[0], q[1] - p[1])); p = q; }
    const L = len[M], dash = L * .034;
    const tAt = (sl) => {                                   // curve parameter at arc length sl (clamped)
      if (sl <= 0) return 0; if (sl >= L) return 1;
      let k = 1; while (len[k] < sl) k++;
      return (k - 1 + (sl - len[k - 1]) / (len[k] - len[k - 1])) / M;
    };
    let prev = null, out = '';
    for (let k = 0; k <= CAR_N; k++) {
      const u = k / CAR_N, sc = ease(u) * L + dash / 2;    // the bar's centre
      const t = tAt(sc), [px, py] = at(t);
      const over = Math.max(0, sc - L);                     // past the end: carry on along the last heading
      let a = tan(t);
      if (prev != null) { while (a - prev > 180) a -= 360; while (a - prev < -180) a += 360; }
      prev = a;
      const ex = px + over * Math.cos(a * Math.PI / 180), ey = py + over * Math.sin(a * Math.PI / 180);
      out += `${+(u * 100).toFixed(3)}% { transform: translate(${ex.toFixed(1)}px, ${ey.toFixed(1)}px) rotate(${a.toFixed(2)}deg); } `;
    }
    return { css: `@keyframes clCar${i} { ${out}}`, w: +(dash + 3).toFixed(1) };
  });
  const carCss = carKeys.map((c) => c.css).join('\n') + '\n' + ROADS.map((r, i) =>
    `#s-close.st-1 .cl-car.k${i} { animation: clCar${i} ${r.t}s linear var(--dl) infinite, clCarO ${r.t}s cubic-bezier(.4, 0, .9, .6) var(--dl) infinite; }`).join('\n');
  const trails = ROADS.map((r, i) => Array.from({ length: r.n }, (_, j) =>
    `<i class="cl-car ${r.k} k${i}" style="left:${-carKeys[i].w / 2}px;width:${carKeys[i].w}px;--dl:${(-(j / r.n) * r.t - i * .7).toFixed(2)}s"></i>`).join('')).join('');

  /* stories travelling across the lit field, in the band between the brand block and the team line */
  const STORIES = [
    { d: 'M-80 626 C 360 598, 700 656, 1000 628 S 1640 608, 2000 642', t: 11, dl: -1.5 },
    { d: 'M2000 612 C 1600 648, 1260 600, 940 640 S 320 620, -80 648', t: 13, dl: -7.5 },
    { d: 'M-80 650 C 420 634, 820 614, 1180 644 S 1700 656, 2000 626', t: 15, dl: -11 },
  ];
  const TEAM = ['Buthainah Alhejazi', 'Abdulaziz Almalaq', 'Hassan Alzahrani', 'Fadi Alkhayrat', 'Rayan Alghamdi'];
  const stories = STORIES.map((s) => `<i class="cl-story" style="offset-path:path('${s.d}');--t:${s.t}s;--dl:${s.dl}s"><b></b><i class="light sm"></i></i>`).join('');

  // phase classes on the section, set without transitions (a settled landing, or a fresh run)
  function snapPhase(el, on) {
    el.classList.add('cl-snap');
    ['cl-p2', 'cl-p3', 'cl-pl', 'cl-p4'].forEach((c) => el.classList.toggle(c, on));
    el.querySelector('.cl-now').classList.remove('is-in');
    void el.offsetWidth;
    requestAnimationFrame(() => el.classList.remove('cl-snap'));
  }
  function settle(ctx) {                        // stop 0's last frame: the name formed, the field dark
    st.t0 = null; st.parts = null; st.pairUp = true; st.lock = null;
    snapPhase(ctx.el, true);
    const wm = wordmark(ctx.el);
    wm.all.forEach((m) => { m.on = true; m.hit = null; m.dT = null; });
    st.formedAt = performance.now(); st.clock0 = -5.4;    // twinkling already; the next light through the name in ~2 s
    canvasBox(wm.box);
    const instant = ctx.instant;
    ctx.after(0, () => { if (!window.Field) return; Field.set(FORMED); Field.setLit(0); if (instant) Field.snap(); });
  }

  Deck.scene({
    id: 'close',
    title: t('Close', 'الختام'),
    act: 4,
    bg: 'deep',
    transition: 'iris',
    spark: false,
    irisBurst: 0,   // no flash: the callback is two lights in a dark field, as in 02
    chrome: { mark: false, progress: false },
    cues: ['Two people knew → everyone can learn → the lights form Impact Makers', 'Impact Makers · thank you · hold for questions'],
    holds: [16, 30],
    notes: [
      'Remember Sara: two people knew. Sara, and the supervisor who signed off the change. Now her story is told, and it passes colleague to colleague, team to team, until everyone can learn from it. Let the lights rise and gather; say nothing until the name has formed. Then, quietly: every colleague who carries a story forward is part of this. These are our Impact Makers.',
      'Impact Makers. Make the contribution visible. Make the learning travel. Light the way. Thank you, from the five of us. Hold here for questions: the business case stays on screen. For detail, type a slide number and press Enter; End returns here.',
    ],
    field: [
      // beat 1 is 02's pull-back: the pair is the only light (no lines, flares or shooting lights); the
      // sequence raises the field's life as the chain spreads, and settles it once the name has formed
      { dim: .8, travel: 0, offset: OFFSET, pins: PAIR, litFrom: PAIR[0], chain: true, warm: 0, drift: .35, links: 0, wave: .5, streaks: 0, sparkle: 0, calm: CALM },
      // the lit field frames the brand block: calm (nearly dark) behind the lockup, the title
      // block and the business-case card, alive at the sides and in the band where the stories travel
      { dim: .9, lit: 1, travel: 2.2, warm: .15, drift: .6, pins: [], links: .42, wave: .5, streaks: .16, sparkle: 1.4,
        calm: [[720, 10, 1200, 196, 1], [200, 150, 1720, 470, 1], [280, 440, 1640, 596, .95], [360, 668, 1560, 728, .9], [100, 720, 1820, 980, .9]] },
    ],
    html: `
      <style>${carCss}</style>
      <div class="cl-sky a-fade" data-in="1" style="--dur:2.6s">
        <div class="cl-cam amb-ken-strong">
          <div class="photo cl-photo" style="background-image:url('assets/photos/riyadh-dusk.jpg')"></div>
          <div class="cl-shade"></div>
          <div class="cl-trails" aria-hidden="true">${trails}</div>
        </div>
        <div class="amb-leak cl-leak"></div>
      </div>
      <!-- a soft dark pool keeps the lit field and the city lights off the words -->
      <div class="cl-hush a-fade" data-in="1" style="--d:.1s;--dur:1.6s"></div>
      <div class="cl-stories a-fade" data-in="1" style="--d:1s;--dur:1.2s">${stories}</div>

      <!-- beat 1: the same image as 02's pull-back, a soft halo between two lights, one on each colleague -->
      <div class="cl-pair a-fade" data-in="0" data-out="1" style="--dur:1.2s"><div class="cl-pair-i">
        <b class="cl-mid"><i class="cl-halo"></i></b>
        <b class="cl-p"><i class="light"></i></b><b class="cl-p"><i class="light"></i></b>
      </div></div>
      <div class="cl-knew" data-out="1" style="left:${KNOW.x}px;top:${KNOW.y}px">
        <div class="cl-l1">
          <div class="h1 cl-kglow" data-split aria-hidden="true">${t('Two people knew.', 'شخصان فقط كانا يعلمان.')}</div>
          <h2 class="h1" data-in="0" data-split style="--d:.15s">${t('Two people knew.', 'شخصان فقط كانا يعلمان.')}</h2>
        </div>
        <!-- beat 2: the line the story's spread turns it into -->
        <h2 class="h1 cl-now" data-split>Now <em>everyone</em><br>can learn from it.</h2>
      </div>

      <!-- beat 3: every light in the frame, flying into the name (one canvas), and the name's soft bloom -->
      <div class="cl-bloom" aria-hidden="true"></div>
      <canvas class="cl-motes" aria-hidden="true"></canvas>

      <div class="cl-logo a-materialize" data-in="1" style="--d:.2s;--dur:1.3s">${Deck.logo()}</div>
      <div class="cl-main">
        <h1 class="display cl-title" data-in="1"><span class="cl-tt">Impact Makers</span></h1>
        <div class="cl-ar ar a-blur" data-in="1" lang="ar" dir="rtl" style="--d:.6s">صنّاع الأثر</div>
        <p class="cl-make" data-in="1" style="--d:.75s">${t('Make the contribution visible. Make the learning travel.', 'اجعلوا الإسهام مرئيًا، واجعلوا التعلّم ينتشر.')}</p>
        <p class="cl-way" data-in="1" style="--d:.85s"><i class="light sm"></i><span class="amb-shimmer">${t('Light the way.', 'أنيروا الطريق.')}</span></p>
        <div class="cl-thanks a-fade" data-in="1" style="--d:.95s">${t('Thank you', 'شكرًا لكم')}</div>
      </div>

      <!-- the team (support): a small credit line just above the business case -->
      <p class="cl-team a-fade" data-in="1" style="--d:1.1s;--dur:.9s"><span class="cl-team-k">${t('Group 1', 'المجموعة 1')}</span> <i>·</i> ${TEAM.join(' <i>·</i> ')}</p>

      <div class="cl-ask glass live a-unfold" data-in="1" style="--d:.85s">
        <div class="cl-ask-l">
          <div class="kicker">${t('The business case', 'مبرّرات المبادرة')}</div>
          <div class="cl-ask-h">${t('Inspiration, made visible.', 'إلهامٌ يُرى.')}</div>
        </div>
        <i class="cl-ask-div"></i>
        <div class="cl-ask-r" data-stagger style="--stagger:.1s">
          <i class="cl-rail"><b></b></i>
          <span class="cl-step a-left" data-in="1" style="--d:1.05s"><b>01</b>${t('A clear need', 'حاجة واضحة')}</span>
          <span class="cl-step a-left" data-in="1" style="--d:1.05s"><b>02</b>${t('A simple design', 'تصميم بسيط')}</span>
          <span class="cl-step a-left" data-in="1" style="--d:1.05s"><b>03</b>${t('Measurable impact', 'أثر قابل للقياس')}</span>
        </div>
      </div>
    `,
    init(ctx) {
      // the field started its clock on the frame after it mounted, just before this: catch the same frame
      requestAnimationFrame((now) => { FT0 = now; });
      MC.el = ctx.$('.cl-motes'); MC.g = MC.el.getContext('2d');
      const midEl = ctx.$('.cl-mid'), lightEls = ctx.$$('.cl-p');
      // follow the pinned colleagues as the camera settles (fallback: where 02 left them)
      ctx.placePair = () => {
        const lp = window.Field ? Field.pinned() : [];
        const p = lp.length === 2 ? lp : REST;
        midEl.style.transform = 'translate(' + ((p[0][0] + p[1][0]) / 2).toFixed(1) + 'px,' + ((p[0][1] + p[1][1]) / 2).toFixed(1) + 'px)';
        lightEls.forEach((el, i) => { el.style.transform = 'translate(' + p[i][0].toFixed(1) + 'px,' + p[i][1].toFixed(1) + 'px)'; });
      };
      midEl.style.transform = 'translate(' + MID[0].toFixed(1) + 'px,' + MID[1].toFixed(1) + 'px)';
      lightEls.forEach((el, i) => { el.style.transform = 'translate(' + REST[i][0].toFixed(1) + 'px,' + REST[i][1].toFixed(1) + 'px)'; });
    },
    enter(ctx) {
      ctx.loop(() => {
        if (!window.Field) return;
        const now = performance.now();
        if (ctx.step < 0) { Field.setLit(0); return; }
        if (ctx.step === 0) {
          if (st.t0 == null) {                   // settled: the name, twinkling, with a light through it now and then
            Field.setLit(0);
            if (MC.box) drawDots(clear(), (now - st.formedAt) / 1000, st.clock0, WM.all);
            return;
          }
          const tt = (now - st.t0) / 1000;
          if (!st.pairUp) ctx.placePair();
          if (tt < B.rise) {                     // beats 1–2: the chain, eased in (a slow first hop from the pair)
            const u = (tt - B.chain) / B.chainDur;
            Field.setLit(u <= 0 ? 0 : u >= 1 ? 1 : u * u * (1.6 - .6 * u));
            return;
          }
          if (!st.parts) { st.parts = plan(ctx.el); canvasBox(FULL); Field.set({ travel: 0 }); }
          if (rise(ctx, tt, 0)) {                // formed: the canvas shrinks to the name's band
            const land = st.parts.landAt;
            st.t0 = null; st.parts = null;
            st.formedAt = now; st.clock0 = land - tt;
            WM.all.forEach((m) => { m.hit = null; });   // (their flashes have died away; the clock changes here)
            canvasBox(WM.box);
            Field.set(FORMED, 2.4);
            drawDots(clear(), 0, st.clock0, WM.all);
          }
          return;
        }
        // stop 1: the field relights from the pair as the city comes up, and the dots resolve into the title
        if (st.lock == null) { Field.setLit(1); return; }
        const ts = (now - st.lock) / 1000;
        if (!st.relit) { const u = clamp(ts / 1.9, 0, 1); Field.setLit(Math.max(st.litFrom, 1 - Math.pow(1 - u, 2.2))); if (u >= 1) st.relit = true; } else Field.setLit(1);
        if (!MC.box) return;
        let live = 0;
        if (st.parts) { rise(ctx, st.lockFrom + ts, ts); live = st.parts.all.some((p) => p.up && !p.done) && ts < .6 ? 1 : 0; }
        else live = drawDots(clear(), st.lockAmb + ts, st.clock0, WM.all, (m) => dissolveU(m, ts));
        if (!live && ts > WIPE_D + WIPE_T + .5) { canvasBox(null); st.parts = null; }
      });
    },
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // what the stop has taken away leaves the compositor
      const el = ctx.el, stg = document.getElementById('stage');
      LITE = !!(stg && stg.classList.contains('lite'));
      if (n < 0) { st.t0 = null; st.parts = null; st.lock = null; canvasBox(null); return; }
      if (n === 0) {
        if (ctx.instant || prev > 0) { settle(ctx); return; }
        // the live finale
        snapPhase(el, false);
        canvasBox(null);
        st.t0 = performance.now(); st.parts = null; st.pairUp = false; st.lock = null;
        // arriving from the pilot the camera pans to the night offset: settle it quickly
        // (after the engine applies this stop's field) so the pair is in 02's place by the time the words land
        ctx.after(0, () => window.Field && Field.set({}, 1.35));
        ctx.after(B.chain * 1000, () => window.Field && Field.set({ links: .5, sparkle: .9, streaks: .05 }, 2.4));
        ctx.after(B.out1 * 1000, () => el.classList.add('cl-p2'));
        ctx.after(B.in2 * 1000, () => el.querySelector('.cl-now').classList.add('is-in'));
        ctx.after((B.chain + B.chainDur) * 1000, () => window.Field && Field.set({ travel: TRAVEL }));
        ctx.after(B.out2 * 1000, () => el.classList.add('cl-p3'));
        return;
      }
      // stop 1: the lockup
      st.relit = !!ctx.instant; st.litFrom = window.Field ? Field.params.lit : 0;
      if (ctx.instant) { st.t0 = null; st.parts = null; st.lock = null; canvasBox(null); return; }
      const now = performance.now();
      st.lock = now;
      if (!MC.box) { st.t0 = null; st.parts = null; return; }   // clicked before the lights rose
      if (st.t0 != null && st.parts) {          // clicked while the lights were still flying: they fade on their way
        st.lockFrom = (now - st.t0) / 1000;
        WM.all.forEach((m) => { m.dT = null; });
        canvasBox(FULL);
      } else {
        st.parts = null;
        st.lockAmb = (now - st.formedAt) / 1000;
        WM.all.forEach((m) => { m.dT = null; });
      }
      st.t0 = null;
    },
    leave(ctx) { st.t0 = null; st.parts = null; st.lock = null; canvasBox(null); window.LFLeave && LFLeave(ctx); },
  });
})();
