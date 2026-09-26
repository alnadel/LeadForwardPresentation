/* The colleague field — the ambient layer behind every scene.
   About a thousand small rounded squares, one for each colleague, drifting and
   twinkling on three depth layers. Lit squares are colleagues a story has reached;
   travelling pulses are stories moving between people. Every scene sets a few
   parameters; the field eases towards them, so the world stays continuous across
   scene changes and never stops moving while the presenter talks.

   Field.set({ dim, lit, litFrom, travel, offset, calm, warm }, seconds)
     dim      0…1   overall visibility of the field
     lit      0…1   share of colleagues lit
     litFrom  [x,y] light spreads outwards from this stage point (else scattered)
     travel   0…n   stories launched per second between neighbours
     offset   [x,y] camera pan in stage px (parallax by depth)
     calm     [[x0,y0,x1,y1,amount], …] regions kept quiet behind copy
     warm     0…1   tint the unlit field towards plum
     chain    true  with litFrom: light spreads colleague to colleague along a
                    branching path (a nomination chain) instead of a plain wave
     pins     [[x,y],…] the colleagues nearest these points stay lit and larger
   Field.burst(x, y, {radius, dur})   a ripple of light from one point
   Field.send(x0, y0, x1, y1, dur)     one story travelling between two points
   Field.setLit(v)                     set the lit share directly (per-frame drives)
   Field.restOf(points, offset)        rest positions of the colleagues nearest points
   Field.pinned()                      live positions of pinned colleagues
   Field.lite(on) / Field.boost(k)     weak-laptop mode / projector brightness

   v2 adds a livelier world:
     links    0…1   constellation lines that fade in and out between neighbours
     wave     0…1   bands of brightness sweeping diagonally across the field
     streaks  0…n   shooting lights crossing the frame per second
     sparkle  0…n   colleagues flaring up per second
     drift    0…2   how far the camera wanders on its own
   Field.warp(kind, dur, strength, [cx,cy])  camera fly-through ('zoom') or pan ('left'|'right'|'up'|'down')
   Field.kick(dx, dy, dur)             a camera jolt that settles back */
(function () {
  const W = 1920, H = 1080;
  const TEAL = [37, 199, 188], SEA = [3, 255, 203], WHITE = [226, 234, 245], PLUM = [201, 150, 196];
  const rnd = (s) => { s = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };

  let canvas, ctx, k = 1, raf = 0, last = 0, t0 = 0;
  const nodes = [];
  const pulses = [];
  const bursts = [];
  const P = { dim: .55, lit: 0, travel: 0, warm: 0, ox: 0, oy: 0, links: .6, wave: .5, streaks: .12, sparkle: 1.2, drift: 1 };
  const T = { dim: .55, lit: 0, travel: 0, warm: 0, ox: 0, oy: 0, links: .6, wave: .5, streaks: .12, sparkle: 1.2, drift: 1 };
  const KEYS = ['dim', 'lit', 'travel', 'warm', 'ox', 'oy', 'links', 'wave', 'streaks', 'sparkle', 'drift'];
  const pairs = [];
  let warpS = null;            // { kind, t0, dur, amt, cx, cy }
  let kickS = null;            // { dx, dy, t0, dur }
  let streakAcc = 0, sparkAcc = 0;
  let rate = 1.2;           // seconds-ish time constant for easing
  let calm = [];
  let litFrom = null, chain = false, pins = [], pinKey = '';
  let spawnAcc = 0, lite = false, boost = 1;
  let sprite, spriteSm;

  function makeSprite(size, core) {
    const c = document.createElement('canvas');
    c.width = c.height = size;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gr.addColorStop(0, 'rgba(210,255,246,1)');
    gr.addColorStop(core, 'rgba(3,255,203,.55)');
    gr.addColorStop(.45, 'rgba(37,199,188,.16)');
    gr.addColorStop(1, 'rgba(37,199,188,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, size, size);
    return c;
  }

  let built = false;
  function ensure() { if (!built) { build(); built = true; } }

  function build() {
    nodes.length = 0;
    const gap = 46;
    let i = 0;
    for (let y = -gap; y < H + gap * 2; y += gap) {
      for (let x = -gap * 2; x < W + gap * 3; x += gap) {
        i++;
        const r1 = rnd(i), r2 = rnd(i + 91.7), r3 = rnd(i + 17.3), r4 = rnd(i + 53.1), r5 = rnd(i + 7.77);
        if (r5 < .18) continue;                       // sparse, not a grid
        const d = r3 < .55 ? 0 : r3 < .88 ? 1 : 2;     // depth layer
        nodes.push({
          bx: x + (r1 - .5) * gap * .9, by: y + (r2 - .5) * gap * .9, d,
          s: [3, 4.5, 6.5][d] * (.8 + r4 * .5),
          a: [.13, .2, .3][d] * (.7 + r1 * .6),
          ax: 3 + r2 * 7, ay: 3 + r4 * 6, px: r1 * 6.28, py: r3 * 6.28,
          fx: .03 + r4 * .05, fy: .025 + r1 * .05,
          tw: .6 + r2 * 1.4, tp: r4 * 6.28,
          rank: r4 * .999, rr: 0,
          lit: 0, litT: 0, flash: 0, x: 0, y: 0,
        });
      }
    }
    // neighbour lists for travelling stories
    for (const n of nodes) {
      n.nb = [];
      for (const m of nodes) {
        if (m === n) continue;
        const dx = m.bx - n.bx, dy = m.by - n.by, dd = dx * dx + dy * dy;
        if (dd < 150 * 150 && dd > 30 * 30) n.nb.push(m);
      }
    }
    pairs.length = 0;
    nodes.forEach((n, i) => {
      if (rnd(i * 3.7 + 1.3) > .5) return;
      const close = n.nb.filter((m) => Math.hypot(m.bx - n.bx, m.by - n.by) < 105);
      if (!close.length) return;
      const m = close[(rnd(i * 5.1) * close.length) | 0];
      pairs.push({ a: n, b: m, ph: rnd(i * 9.3) * 6.28, w: .35 + rnd(i * 2.9) * .7 });
    });
    rerank();
  }

  function nearest(x, y) {
    let best = null, bd = 1e18;
    for (const n of nodes) { const d = (n.bx - x) * (n.bx - x) + (n.by - y) * (n.by - y); if (d < bd) { bd = d; best = n; } }
    return best;
  }
  function rerank() {
    for (const n of nodes) n.parent = null;
    if (!litFrom) { for (const n of nodes) n.rr = n.rank; return; }
    if (chain) {
      // Dijkstra over the neighbour graph with irregular edge costs: the light
      // reaches colleagues through colleagues, so it branches instead of rippling.
      const src = nearest(litFrom[0], litFrom[1]);
      for (const n of nodes) n.dist = Infinity;
      src.dist = 0;
      const open = [src];
      while (open.length) {
        let bi = 0;
        for (let i = 1; i < open.length; i++) if (open[i].dist < open[bi].dist) bi = i;
        const a = open[bi]; open[bi] = open[open.length - 1]; open.pop();
        if (a.done) continue;
        a.done = true;
        for (const b of a.nb) {
          if (b.done) continue;
          const w = Math.hypot(b.bx - a.bx, b.by - a.by) * (.6 + 2.4 * rnd(a.bx * 7.1 + b.by * 3.3));
          if (a.dist + w < b.dist) { b.dist = a.dist + w; b.parent = a; open.push(b); }
        }
      }
      let max = 1;
      for (const n of nodes) { n.done = false; if (n.dist < Infinity && n.dist > max) max = n.dist; }
      for (const n of nodes) n.rr = n.dist < Infinity ? clamp(n.dist / max, 0, .999) : .999;
      return;
    }
    const [fx, fy] = litFrom;
    let max = 1;
    for (const n of nodes) { n.rr = Math.hypot(n.bx - fx, n.by - fy); if (n.rr > max) max = n.rr; }
    for (const n of nodes) n.rr = clamp(n.rr / max * .92 + n.rank * .08, 0, .999);
  }

  function resolvePins() {
    for (const n of nodes) n.pin = false;
    for (const p of pins) { const n = nearest(p[0], p[1]); if (n) n.pin = true; }
  }

  function resize(scale) {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    k = clamp(scale * dpr, .5, 1.5);
    canvas.width = Math.round(W * k);
    canvas.height = Math.round(H * k);
  }

  function calmAt(x, y) {
    let m = 1;
    for (const c of calm) {
      const [x0, y0, x1, y1, amt] = c;
      const f = 90;
      const inside = smooth(x0 - f, x0 + f, x) * (1 - smooth(x1 - f, x1 + f, x)) * smooth(y0 - f, y0 + f, y) * (1 - smooth(y1 - f, y1 + f, y));
      m *= 1 - inside * (amt == null ? .8 : amt);
    }
    return m;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    if (!last) { last = now; t0 = now; }
    const dt = Math.min(.05, (now - last) / 1000);
    last = now;
    const t = (now - t0) / 1000;
    const e = 1 - Math.exp(-dt / rate);
    for (const key of KEYS) P[key] += (T[key] - P[key]) * e;

    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (document.hidden) return;
    const dim = Math.min(1, P.dim * boost);
    if (dim < .003 && !pulses.length && !bursts.length) return;

    const dr = P.drift;
    let autoX = (Math.sin(t * .031) * 60 + Math.sin(t * .077 + 1.3) * 18) * dr, autoY = (Math.cos(t * .023) * 34 + Math.sin(t * .061) * 10) * dr;
    // camera jolt (settles back with a soft spring)
    if (kickS) {
      const u = (now - kickS.t0) / 1000 / kickS.dur;
      if (u >= 1) kickS = null;
      else { const env = Math.sin(Math.PI * Math.min(1, u * 1.15)) * Math.exp(-u * 1.2); autoX += kickS.dx * env; autoY += kickS.dy * env; }
    }
    // warp: 0 → 1 → 0 envelope while the camera flies
    let wa = 0;
    if (warpS) {
      const u = (now - warpS.t0) / 1000 / warpS.dur;
      if (u >= 1) warpS = null;
      else wa = Math.sin(Math.PI * u) * warpS.amt;
    }
    const wave = P.wave;
    const warm = P.warm;
    const baseR = WHITE[0] + (PLUM[0] - WHITE[0]) * warm, baseG = WHITE[1] + (PLUM[1] - WHITE[1]) * warm, baseB = WHITE[2] + (PLUM[2] - WHITE[2]) * warm;
    const base = 'rgb(' + (baseR | 0) + ',' + (baseG | 0) + ',' + (baseB | 0) + ')';
    const litCut = P.lit;
    const le = 1 - Math.exp(-dt / .55);

    // bursts light nodes inside their growing radius
    for (let b = bursts.length - 1; b >= 0; b--) {
      const B = bursts[b];
      B.age += dt;
      if (B.age > B.dur + 1.5) bursts.splice(b, 1);
    }

    ctx.fillStyle = base;
    let li = 0;
    for (const n of nodes) {
      if (lite && !n.pin && (li++ & 1)) continue;
      const par = .45 + n.d * .35;
      n.x = n.bx + Math.sin(t * n.fx * 6.28 + n.px) * n.ax + (P.ox + autoX) * par;
      n.y = n.by + Math.cos(t * n.fy * 6.28 + n.py) * n.ay + (P.oy + autoY) * par;
      let vx = 0, vy = 0;
      if (wa > .002) {
        if (warpS.kind === 'zoom') { vx = (n.x - warpS.cx) * .5 * par; vy = (n.y - warpS.cy) * .5 * par; }
        else { const d = warpS.kind === 'left' ? [-1, 0] : warpS.kind === 'right' ? [1, 0] : warpS.kind === 'up' ? [0, -1] : [0, 1]; vx = d[0] * 260 * par; vy = d[1] * 260 * par; }
        n.x += vx * wa; n.y += vy * wa;
      }
      if (n.x < -40 || n.x > W + 40 || n.y < -40 || n.y > H + 40) continue;
      const was = n.lit;
      n.litT = n.pin || n.rr < litCut ? 1 : 0;
      for (const B of bursts) {
        const r = B.radius * clamp(B.age / B.dur, 0, 1);
        const dd = Math.hypot(n.x - B.x, n.y - B.y);
        if (dd < r && dd > r - 90 && B.age < B.dur + .2) n.flash = Math.max(n.flash, 1);
      }
      n.lit += (n.litT - n.lit) * le;
      if (chain && n.parent && was < .5 && n.lit >= .5 && pulses.length < 60) pulses.push({ a: n.parent, b: n, t: 0, dur: .45, free: false, quiet: true });
      n.flash = Math.max(0, n.flash - dt * .7);
      let tw = .62 + .38 * Math.sin(t * n.tw + n.tp);
      if (wave > .01) { const b = Math.sin((n.x * .8 + n.y * .6) * .0055 - t * .85); tw *= 1 + wave * 1.6 * Math.pow(Math.max(0, b), 8); }
      const cm = calmAt(n.x, n.y);
      const a = n.a * tw * dim * cm;
      if (wa > .02) {
        // fly-through: every colleague streaks along the camera's motion
        ctx.globalAlpha = Math.min(1, a * 1.6 + .05 * wa);
        ctx.strokeStyle = base; ctx.lineWidth = Math.max(1, n.s * .55);
        ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(n.x - vx * wa * .55, n.y - vy * wa * .55); ctx.stroke();
      }
      const L = Math.max(n.lit, n.flash);
      if (a > .004) {
        ctx.globalAlpha = a * (1 - L * .6);
        const s = n.s;
        ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
      }
      if (L > .02) {
        const la = L * (.55 + .45 * tw) * Math.max(dim, .35) * (.1 + .9 * cm);
        const gs = (26 + n.d * 10) * (n.pin ? 2.1 : 1);
        ctx.globalAlpha = la * .9;
        ctx.drawImage(spriteSm, n.x - gs / 2, n.y - gs / 2, gs, gs);
        ctx.globalAlpha = la;
        ctx.fillStyle = 'rgb(' + TEAL[0] + ',' + TEAL[1] + ',' + TEAL[2] + ')';
        const s = (n.s + 1.5) * (n.pin ? 1.7 : 1);
        ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
        ctx.fillStyle = base;
      }
    }

    // constellation: lines that fade in and out between neighbours
    const lk = P.links * dim;
    if (lk > .01 && !lite) {
      ctx.lineWidth = 1;
      for (const pr of pairs) {
        const v = Math.sin(t * pr.w * .5 + pr.ph);
        if (v <= .35) continue;
        const A = pr.a, B = pr.b;
        if (A.x < 0 || A.x > W || A.y < 0 || A.y > H) continue;
        const cm2 = calmAt((A.x + B.x) / 2, (A.y + B.y) / 2);
        const al = lk * Math.pow((v - .35) / .65, 2) * .32 * cm2;
        if (al < .01) continue;
        ctx.globalAlpha = al;
        ctx.strokeStyle = (A.lit > .5 || B.lit > .5) ? 'rgb(37,199,188)' : base;
        ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke();
      }
    }
    // sparkle: a colleague flares up now and then
    sparkAcc += P.sparkle * dt * Math.min(1, dim * 2);
    while (sparkAcc >= 1) {
      sparkAcc -= 1;
      const n = nodes[(Math.random() * nodes.length) | 0];
      if (n && calmAt(n.x, n.y) > .6) n.flash = Math.max(n.flash, .9);
    }
    // shooting lights across the frame
    streakAcc += P.streaks * dt;
    while (streakAcc >= 1) {
      streakAcc -= 1;
      const y0 = Math.random() * H * .8, x0 = -60, ang = (Math.random() * .5 - .25);
      pulses.push({ free: true, streak: true, x0, y0, x1: W + 60, y1: y0 + Math.tan(ang) * (W + 120), t: 0, dur: 2.2 + Math.random() * 1.6 });
    }

    // travelling stories between neighbours
    spawnAcc += P.travel * dt;
    while (spawnAcc >= 1) {
      spawnAcc -= 1;
      const lit = nodes.filter((n) => n.lit > .6 && n.x > 0 && n.x < W && n.y > 0 && n.y < H);
      const pool = lit.length > 3 ? lit : nodes;
      const a = pool[(Math.random() * pool.length) | 0];
      if (a && a.nb.length) {
        const b = a.nb[(Math.random() * a.nb.length) | 0];
        pulses.push({ a, b, t: 0, dur: .9 + Math.random() * .8, free: false });
      }
    }
    for (let p = pulses.length - 1; p >= 0; p--) {
      const Q = pulses[p];
      Q.t += dt / Q.dur;
      const u = clamp(Q.t, 0, 1);
      const ease = u * u * (3 - 2 * u);
      const ax = Q.free ? Q.x0 : Q.a.x, ay = Q.free ? Q.y0 : Q.a.y, bx = Q.free ? Q.x1 : Q.b.x, by = Q.free ? Q.y1 : Q.b.y;
      const x = ax + (bx - ax) * ease, y = ay + (by - ay) * ease;
      const fade = u < .15 ? u / .15 : u > .85 ? (1 - u) / .15 : 1;
      if (Q.streak) {
        const tl = 260, dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
        const tx = x - dx / L * tl, ty = y - dy / L * tl;
        const g = ctx.createLinearGradient(tx, ty, x, y);
        g.addColorStop(0, 'rgba(3,255,203,0)'); g.addColorStop(1, 'rgba(160,255,236,.55)');
        ctx.globalAlpha = fade * Math.max(dim, .4) * (lite ? 0 : 1);
        ctx.strokeStyle = g; ctx.lineWidth = 1.6;
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
        ctx.drawImage(sprite, x - 14, y - 14, 28, 28);
        if (Q.t >= 1) pulses.splice(p, 1);
        continue;
      }
      const vis = Q.free ? 1 : Math.max(dim, .3);
      ctx.globalAlpha = (Q.quiet ? .35 : .22) * fade * vis;
      ctx.strokeStyle = 'rgb(' + SEA[0] + ',' + SEA[1] + ',' + SEA[2] + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(x, y); ctx.stroke();
      ctx.globalAlpha = fade * vis;
      const gs = Q.free ? 54 : Q.quiet ? 22 : 34;
      ctx.drawImage(sprite, x - gs / 2, y - gs / 2, gs, gs);
      if (Q.t >= 1) {
        if (!Q.free) Q.b.flash = 1;
        pulses.splice(p, 1);
      }
    }
    ctx.globalAlpha = 1;
  }

  const Field = {
    mount(el) {
      canvas = el;
      ctx = canvas.getContext('2d');
      sprite = makeSprite(64, .08);
      spriteSm = makeSprite(48, .05);
      ensure();
      resize(1);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(frame);
    },
    resize,
    set(p, seconds) {
      if (!p) return;
      if (seconds != null) rate = Math.max(.05, seconds / 3);
      if (p.dim != null) T.dim = p.dim;
      if (p.lit != null) T.lit = p.lit;
      if (p.travel != null) T.travel = p.travel;
      if (p.warm != null) T.warm = p.warm;
      for (const key of ['links', 'wave', 'streaks', 'sparkle', 'drift']) if (p[key] != null) T[key] = p[key];
      if (p.offset) { T.ox = p.offset[0]; T.oy = p.offset[1]; }
      if (p.calm !== undefined) calm = p.calm || [];
      const nc = p.chain !== undefined ? !!p.chain : chain;
      if (p.litFrom !== undefined || nc !== chain) {
        const lf = p.litFrom !== undefined ? p.litFrom : litFrom;
        const same = ((lf && litFrom && lf[0] === litFrom[0] && lf[1] === litFrom[1]) || (!lf && !litFrom)) && nc === chain;
        litFrom = lf; chain = nc;
        if (!same) rerank();
      }
      if (p.pins !== undefined) {
        const k2 = JSON.stringify(p.pins || []);
        if (k2 !== pinKey) { pinKey = k2; pins = p.pins || []; resolvePins(); }
      }
    },
    snap() { Object.assign(P, T); for (const n of nodes) { n.litT = n.pin || n.rr < T.lit ? 1 : 0; n.lit = n.litT; } },
    burst(x, y, o) { o = o || {}; bursts.push({ x, y, radius: o.radius || 900, dur: o.dur || 2.4, age: 0 }); },
    send(x0, y0, x1, y1, dur) { pulses.push({ free: true, x0, y0, x1, y1, t: 0, dur: dur || 1.6 }); },
    setLit(v) { T.lit = P.lit = clamp(v, 0, 1); },      // direct, un-eased control (driven per frame)
    // where the colleagues nearest these points sit at rest for a camera offset
    restOf(points, offset) {
      ensure();
      const o = offset || [0, 0];
      return points.map((p) => { const n = nearest(p[0], p[1]); const par = .45 + n.d * .35; return [n.bx + o[0] * par, n.by + o[1] * par]; });
    },
    // live on-screen positions of the pinned colleagues (drift included)
    pinned() { return nodes.filter((n) => n.pin).map((n) => [n.x, n.y]); },
    warp(kind, dur, amt, c) { warpS = { kind: kind || 'zoom', t0: performance.now(), dur: dur || 1, amt: amt == null ? 1 : amt, cx: (c || [960, 540])[0], cy: (c || [960, 540])[1] }; },
    kick(dx, dy, dur) { kickS = { dx: dx || 0, dy: dy || 0, t0: performance.now(), dur: dur || 1.4 }; },
    lite(on) { lite = !!on; },
    boost(k2) { boost = k2 || 1; },
    get params() { return Object.assign({}, T); },
  };
  window.Field = Field;
})();
