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
   Field.lite(on) / Field.boost(k)     weak-laptop mode / projector brightness */
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
  const P = { dim: .55, lit: 0, travel: 0, warm: 0, ox: 0, oy: 0, lx: -1, ly: -1 };
  const T = { dim: .55, lit: 0, travel: 0, warm: 0, ox: 0, oy: 0 };
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
    for (const key of ['dim', 'lit', 'travel', 'warm', 'ox', 'oy']) P[key] += (T[key] - P[key]) * e;

    ctx.setTransform(k, 0, 0, k, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (document.hidden) return;
    const dim = Math.min(1, P.dim * boost);
    if (dim < .003 && !pulses.length && !bursts.length) return;

    const autoX = Math.sin(t * .021) * 26, autoY = Math.cos(t * .017) * 14;
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
      if (lite && (li++ & 1)) continue;
      const par = .45 + n.d * .35;
      n.x = n.bx + Math.sin(t * n.fx * 6.28 + n.px) * n.ax + (P.ox + autoX) * par;
      n.y = n.by + Math.cos(t * n.fy * 6.28 + n.py) * n.ay + (P.oy + autoY) * par;
      if (n.x < -20 || n.x > W + 20 || n.y < -20 || n.y > H + 20) continue;
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
      const tw = .62 + .38 * Math.sin(t * n.tw + n.tp);
      const cm = calmAt(n.x, n.y);
      const a = n.a * tw * dim * cm;
      const L = Math.max(n.lit, n.flash);
      if (a > .004) {
        ctx.globalAlpha = a * (1 - L * .6);
        const s = n.s;
        ctx.fillRect(n.x - s / 2, n.y - s / 2, s, s);
      }
      if (L > .02) {
        const la = L * (.55 + .45 * tw) * Math.max(dim, .35) * (.35 + .65 * cm);
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
      build();
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
    lite(on) { lite = !!on; },
    boost(k2) { boost = k2 || 1; },
    get params() { return Object.assign({}, T); },
  };
  window.Field = Field;
})();
