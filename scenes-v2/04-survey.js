/* 04 · Survey (v2) — 158 respondents, one square each; each figure relights the
   waffle to its share. Four stops: 158 · 56% · 8% · 80% (+49%).
   One continuous instrument: the big figure is an odometer whose reels roll from
   the previous figure to the next during each build (never while parked); the
   label and line beneath it cross-fade, the waffle relights column by column and a
   tinted glow pool slides to the lit share. The figure is lit from above in the
   finding's colour, and each finding carries its picture (a survey, an unseen eye,
   a megaphone, two colleagues joined). At stop 3 the headline turns into the
   punchline, drawn as a contrast: a lit line under the work, and under the channel
   a broken track that a light sets out along and cannot cross. Every piece of state
   is keyed off the stop, so back lands on the same frame as forward.
   The waffle is drawn on one canvas (one layer, instead of 158 squares that each
   animated on their own layer): the squares pop in, relight column by column, twinkle,
   breathe and carry the wave exactly as their CSS did; the ambient loops read a CSS
   clock, so they pause with the scene (and with a frozen deck). For depth the tiles
   have a thickness and a lit top, the grid is projected as a panel turned a little
   away in perspective, and the bottom row is mirrored in a glossy floor under a pool
   of the figure's colour: all in the same canvas, so depth costs no layer. */
(function () {
  const ROWS = 10, N = 158; // 16 columns × 10 rows, filled column by column
  const METRICS = [
    { v: 158, tone: 'base', icon: 'survey', label: 'Colleagues responded', text: 'An anonymous, eight-question survey.' },
    { v: 56, tone: 'gap', icon: 'unseen', label: 'Visibility gap', text: 'Rarely or never hear about another department’s achievement.' },
    { v: 8, tone: 'hero', icon: 'reach', label: 'Recognition reach', text: 'Say praise for a colleague reaches the whole organisation.' },
    { v: 80, tone: 'go', icon: 'link', label: 'Connection', text: 'Say colleagues’ stories would strengthen connection to Tahakom.' },
  ];
  // each finding's picture: line icons on a 24 grid (outline, round caps)
  const ico = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    // an anonymous survey: a clipboard of ticked questions
    survey: '<rect x="4.8" y="4.4" width="14.4" height="17" rx="2.4"/><path d="M9.2 4.4V2.9h5.6v1.5"/><path d="m8 10.2 1.5 1.5 2.7-2.7"/><path d="M14.4 10.6h2.2"/><path d="m8 15.6 1.5 1.5 2.7-2.7"/><path d="M14.4 16h2.2"/>',
    // unseen: an eye, struck through
    unseen: '<path d="M2.6 12s3.5-6.2 9.4-6.2S21.4 12 21.4 12s-3.5 6.2-9.4 6.2S2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.9"/><path d="M4.2 19.8 19.8 4.2"/>',
    // reach: praise from a megaphone, carrying outward
    reach: '<path d="M3.2 10.2v3.6c0 .6.4 1 1 1h2.2l6.4 4V5.2l-6.4 4H4.2c-.6 0-1 .4-1 1z"/><path d="m6.4 14.8 1.2 4.4"/><path d="M16 9.4a3.6 3.6 0 0 1 0 5.2"/><path d="M18.6 6.8a7.4 7.4 0 0 1 0 10.4"/>',
    // connection: two colleagues, joined
    link: '<circle cx="7.4" cy="8" r="2.6"/><path d="M2.8 18.6c.4-3 2.2-4.8 4.6-4.8s4.2 1.8 4.6 4.8"/><circle cx="16.6" cy="8" r="2.6"/><path d="M12 18.6c.4-3 2.2-4.8 4.6-4.8s4.2 1.8 4.6 4.8"/><path d="M10.4 8h3.2"/>',
    // practical learning: a lightbulb
    bulb: '<path d="M9.4 17.6h5.2"/><path d="M10.2 20.6h3.6"/><path d="M12 3.2a6 6 0 0 0-3.7 10.7c.7.6 1.1 1.4 1.1 2.3v1.4h5.2v-1.4c0-.9.4-1.7 1.1-2.3A6 6 0 0 0 12 3.2z"/><path d="M12 6.4a3 3 0 0 1 2.8 2"/>',
  };
  const lit = (k) => (k >= 1 ? Math.round(N * METRICS[k].v / 100) : 0); // 88 · 13 · 126
  const CYCLES = 2;                         // reel cycles: every roll crosses from one to the other (see step)
  const SPARK = '110,356';                  // the story light rests at the figure's top-left

  /* ── the waffle, on a canvas ─────────────────────────────────────────── */
  const CS = 47, PITCH = 59;                // square and pitch (px): 16 × 10 on 932 × 578
  const WW = 932, WH = 578, WX = 844, WY = 330;   // the grid's size and its place on the stage
  const PAD = { l: 112, t: 112, r: 40, b: 112 };   // room for the glows (the hero's fades out ~100 px from its square)
  const CELLS = Array.from({ length: N }, (_, i) => ({ c: Math.floor(i / ROWS), r: i % ROWS, rd: ((i * 53) % 97) / 97 }));
  // depth: the grid stands as a panel turned a little away (8° about its upright, 4° back), seen in
  // perspective, so the lit share (filled from the left) is nearest. Every tile is placed and sized by
  // that projection here, in the canvas: no 3D layer. mir: a tile's reflection in the floor below.
  const TURN = { y: 8 * Math.PI / 180, x: 4 * Math.PI / 180, p: 2000, ox: .4 * WW, oy: .6 * WH };
  const proj = (x, y) => {
    const X = x - TURN.ox, Y = y - TURN.oy, y1 = Y * Math.cos(TURN.x), z1 = Y * Math.sin(TURN.x);
    const x2 = X * Math.cos(TURN.y) + z1 * Math.sin(TURN.y), z2 = -X * Math.sin(TURN.y) + z1 * Math.cos(TURN.y), s = TURN.p / (TURN.p - z2);
    return { x: TURN.ox + x2 * s, y: TURN.oy + y1 * s, s };
  };
  // the looks a square can take (background, border; glow: none | purple | teal)
  const LOOK = {
    off: { bg: [255, 255, 255, .1], bd: [255, 255, 255, .09], gp: 0, gt: 0 },
    gap: { bg: [157, 103, 170, 1], bd: [201, 166, 211, 1], gp: 1, gt: 0 },
    go: { bg: [37, 199, 188, 1], bd: [127, 237, 228, 1], gp: 0, gt: 1 },
    hero: { bg: [3, 255, 203, 1], bd: [184, 255, 240, 1], gp: 0, gt: 0 },
    dim: { bg: [255, 255, 255, .02], bd: [201, 166, 211, .16], gp: 0, gt: 0 },
  };
  const bez = (x1, y1, x2, y2) => (u) => {           // a CSS cubic-bezier() timing function
    if (u <= 0) return 0; if (u >= 1) return 1;
    let lo = 0, hi = 1, t = u;
    for (let k = 0; k < 24; k++) { t = (lo + hi) / 2; const x = 3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t; if (x < u) lo = t; else hi = t; }
    return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  };
  const E = { soft: bez(.4, 0, .2, 1), back: bez(.34, 1.36, .64, 1), io: bez(.42, 0, .58, 1), out: bez(.16, 1, .3, 1) };
  const mixv = (a, b, t) => a.map((v, k) => v + (b[k] - v) * t);
  const rgba = (c) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${c[3].toFixed(3)})`;
  // a keyframed loop (ease-in-out between keys, as the CSS keyframes were): keys [[at, value], …]
  const loopAt = (keys, u) => { for (let k = 1; k < keys.length; k++) if (u <= keys[k][0]) { const [a, va] = keys[k - 1], [b, vb] = keys[k]; return va + (vb - va) * E.io((u - a) / (b - a)); } return keys[keys.length - 1][1]; };
  const TWO = [[0, .8], [.5, 1], [1, .8]], TWS = [[0, 1], [.5, 1.06], [1, 1]];                 // the twinkle (was svTwinkle)
  const HS = [[0, 1.04], [.5, 1.14], [1, 1.04]], HR = [[0, 1], [.5, 0], [1, 1]];               // the hero breath · its resting glow (was svHero)
  const WAVE = [[0, 0], [.18, 1], [.4, 0], [1, 0]];                                           // the wave (was svWave)
  // a glow as a sprite (the CSS box-shadows, drawn once): blur px, colour, strength
  function glowSprite(blur, col, spread) {
    const pad = Math.ceil(blur * 1.6 + (spread || 0)), sz = CS + 2 * pad;
    const cv = document.createElement('canvas'); cv.width = cv.height = sz;
    const g = cv.getContext('2d');
    g.shadowColor = col; g.shadowBlur = blur; g.shadowOffsetX = sz * 2;
    g.fillStyle = '#000';
    g.beginPath(); g.roundRect(pad - sz * 2 - (spread || 0), pad - (spread || 0), CS + 2 * (spread || 0), CS + 2 * (spread || 0), CS * .26 + (spread || 0)); g.fill();
    return { cv, pad };
  }

  // the floor light under the waffle, per figure (its colour eases from stop to stop)
  const TONE = { base: [143, 194, 220, .14], gap: [157, 103, 170, .3], hero: [3, 255, 203, .15], go: [37, 199, 188, .26] };
  const mixAt = (tv, t) => { const u = t <= tv.t0 ? 0 : Math.min(1, (t - tv.t0) / tv.d); return mixv(tv.a, tv.b, E.soft(u)); };
  const DEP = 5, RAD = CS * .26;   // a tile's thickness, its corner radius (px)
  const FLOOR = WH + DEP / 2 + 3;   // the floor line under the grid (grid px): the bottom row is mirrored in it,
  const MSQ = .6;                   // foreshortened (a glossy floor seen from above), and faded out below
  CELLS.forEach((cl) => {
    const x = cl.c * PITCH + CS / 2, y = cl.r * PITCH + CS / 2;
    cl.p = proj(x, y);
    if (cl.r === 9) cl.m = proj(x, FLOOR + (FLOOR - y) * MSQ);
  });
  // the strip between a tile's face and its bottom edge (its visible thickness), centred on the tile
  function sidePath() {
    const h = CS / 2, R = RAD, P = new Path2D();
    P.moveTo(-h, h - R); P.lineTo(-h, h - R + DEP);
    P.arc(-h + R, h - R + DEP, R, Math.PI, Math.PI / 2, true); P.lineTo(h - R, h + DEP);
    P.arc(h - R, h - R + DEP, R, Math.PI / 2, 0, true); P.lineTo(h, h - R);
    P.arc(h - R, h - R, R, 0, Math.PI / 2, false); P.lineTo(-h + R, h);
    P.arc(-h + R, h - R, R, Math.PI / 2, Math.PI, false); P.closePath();
    return P;
  }
  // a tile's lit top: a white wash fading down the face (drawn once)
  function hiSprite() {
    const cv = document.createElement('canvas'), k = 2; cv.width = cv.height = CS * k;
    const g = cv.getContext('2d'); g.scale(k, k);
    const gr = g.createLinearGradient(0, 0, 0, CS); gr.addColorStop(0, 'rgba(255,255,255,.55)'); gr.addColorStop(.5, 'rgba(255,255,255,0)');
    g.beginPath(); g.roundRect(1, 1, CS - 2, CS - 2, RAD - 1); g.fillStyle = gr; g.fill();
    return cv;
  }

  let reel = '';
  for (let k = 0; k < CYCLES * 10; k++) reel += `<b>${k % 10}</b>`;
  const slot = (k) => `<span class="sv-slot" style="--k:${k}"><span class="sv-reel">${reel}</span></span>`;

  Deck.scene({
    id: 'survey',
    title: 'What colleagues told us',
    act: 1,
    bg: 'navy',
    transition: 'push',
    cues: ['158 colleagues responded', '56% · visibility gap', '8% · recognition reach', '80% connection · 49% learning · the punchline'],
    notes: [
      'We asked before we designed: 158 colleagues answered an anonymous eight-question survey. Each square is one of them.',
      'More than half rarely or never hear about another department’s achievement.',
      'The number to remember: only 8% say praise for a colleague reaches the whole organisation — thirteen people out of 158.',
      'Yet the appetite is there: 80% say these stories would strengthen their connection to Tahakom, and 49% say a colleague’s story gives them an approach they can use. The work exists. The visibility channel does not. Their channel preferences shape our communication plan.',
    ],
    field: [
      { dim: .3, lit: 0, travel: .4, offset: [-140, 60], links: .5, wave: .7, streaks: .1, sparkle: 1.1,
        calm: [[90, 120, 1500, 300, .85], [90, 320, 830, 960, .8], [830, 310, 1800, 930, .7]] },
      { wave: .6 },
      { dim: .2, wave: .3, sparkle: .5, links: .35, streaks: .06 },
      { dim: .32, wave: .8, travel: .8, sparkle: 1.4, links: .55, streaks: .12 },
    ],
    html: `
      <!-- the waffle first, under everything else (at ${WX}, ${WY}): one canvas, no wrapper. Painted first, it
           needs no second layer while the headline and the figure animate over its margins -->
      <i class="sv-wpool"></i>
      <canvas class="sv-wcan" width="${WW + PAD.l + PAD.r}" height="${WH + PAD.t + PAD.b}" style="left:${WX - PAD.l}px;top:${WY - PAD.t}px;width:${WW + PAD.l + PAD.r}px;height:${WH + PAD.t + PAD.b}px"></canvas>

      <div class="pad sv-head">
        <div class="kicker" data-in="0">Current state · primary data</div>
        <div class="sv-swap">
          <h2 class="h2 sv-h" data-in="0" data-out="3" data-split style="--d:.1s">Employee feedback validates the opportunity.</h2>
          <h2 class="h2 sv-punch" data-in="3" data-split style="--d:.45s;--wstep:.05s">The work exists. <em class="hl">The visibility channel does not.</em></h2>
          <!-- the contrast, drawn: a lit line under the work; under the channel, a broken track a light cannot cross -->
          <div class="sv-pu" data-in="3" style="--d:1.25s"><i class="sv-pu1"></i><i class="sv-pu2"><b></b></i></div>
        </div>
      </div>

      <!-- the instrument: one figure that rolls from stop to stop -->
      <div class="sv-inst" data-in="0" style="--d:.2s">
        <i class="sv-inst-glow"></i>
        <div class="sv-odo">${slot(0)}${slot(1)}${slot(2)}<span class="sv-pct">%</span></div>
        <div class="sv-reads">
          ${METRICS.map((m, k) => `
          <div class="sv-say ${m.tone}" data-in="${k}" ${k < 3 ? `data-out="${k + 1}"` : ''} style="--d:${k ? .32 : .5}s">
            <div class="sv-labr"><span class="sv-ico">${ico(IC[m.icon])}</span><div class="label sv-lab">${m.label}</div></div>
            <p class="body sv-txt">${m.text}</p>
          </div>`).join('')}
        </div>
      </div>
      ${[0, 1, 2, 3].map((k) => `<i class="sv-mark" data-spark="${k}" data-spark-xy="${SPARK}"${k ? '' : ' data-spark-delay=".3"'}></i>`).join('')}

      <!-- the key (stops 1–2), then the second figure (stop 3), in one slot -->
      <!-- support: a small caption-weight key (the figure and its label lead) -->
      <div class="sv-legend sv-leg0" data-in="0" data-out="1" style="--d:.9s">
        <span class="sv-key"><i class="k-one"></i>Each square is one colleague</span>
      </div>
      <div class="sv-legend" data-in="1" data-out="3" style="--d:.55s">
        <span class="sv-key"><i class="k-lit"></i><span class="sv-kt">${[1, 2].map((k) => `<b data-at="${k}">${lit(k)} of 158 · ${METRICS[k].label.toLowerCase()}</b>`).join('')}</span></span>
        <span class="sv-key"><i class="k-off"></i>Other respondents</span>
      </div>
      <!-- the second figure: secondary to the 80% (smaller, quieter) -->
      <div class="sv-second glass amb-sheen" data-in="3" style="--d:.7s">
        <b class="num sv-49"><span data-count="49" data-dur=".9" data-delay=".75">0</span><small>%</small></b>
        <div class="sv-49t">
          <div class="label teal sv-49l"><span class="sv-ico sm">${ico(IC.bulb)}</span>Practical learning</div>
          <p>A colleague’s story gives them an approach they can use.</p>
        </div>
      </div>

      <div class="sv-sweep" style="left:${WX}px;top:${WY - 40}px;height:${WH + 80}px"></div>
      <i class="sv-clock"></i>
    `,
    init(ctx) {
      ctx.slots = ctx.$$('.sv-slot');
      ctx.reels = ctx.$$('.sv-reel');
      ctx.dg = [0, 0, 0];
      ctx.can = ctx.$('.sv-wcan');
      ctx.g = ctx.can.getContext('2d');
      ctx.k = 1;
      ctx.clk = ctx.$('.sv-clock');
      // each square's state: pop (transform), op (opacity), look (colours); each is a tween
      // { a: from, b: to, t0: start (ms), d: duration (ms) } that runs as its CSS transition did
      // the waffle's own entrance (the fade its container had: .9 s, --d .25 s after the scene enters)
      ctx.fade = { a: 0, b: 0, t0: 0, d: 900 };
      ctx.sq = CELLS.map(() => ({ pop: { a: 0, b: 0, t0: 0, d: 1 }, op: { a: 0, b: 0, t0: 0, d: 1 }, look: { a: LOOK.off, b: LOOK.off, t0: 0, d: 1 }, mode: '' }));
      // depth: each square is a tile with a thickness (a strip under its face) and a lit top
      ctx.side = sidePath();
      ctx.hi = hiSprite();
      ctx.floor = { a: TONE.base, b: TONE.base, t0: 0, d: 1 };
      ctx.spr = { p: glowSprite(20, 'rgba(157, 103, 170, .5)'), t: glowSprite(20, 'rgba(37, 199, 188, .5)'),
        hr: glowSprite(16, 'rgba(3, 255, 203, .75)', 1), h1: glowSprite(44, 'rgba(3, 255, 203, 1)', 1), h2: glowSprite(90, 'rgba(3, 255, 203, .3)', 1) };
    },
    enter(ctx) {
      // the canvas's backing store follows the screen: the stage's fit scale × the pixel ratio
      const st = document.getElementById('stage'), fit = st ? st.getBoundingClientRect().width / 1920 : 1;
      const k = Math.min(2, Math.max(1, Math.round((window.devicePixelRatio || 1) * fit * 4) / 4));
      if (k !== ctx.k) { ctx.k = k; ctx.can.width = Math.round((WW + PAD.l + PAD.r) * k); ctx.can.height = Math.round((WH + PAD.t + PAD.b) * k); }
      ctx.loop(() => draw(ctx));
    },
    leave(ctx) { window.LFLeave && LFLeave(ctx); },   // once faded out, it leaves the compositor
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // what the stop has taken away leaves the compositor
      const el = ctx.el, m = n >= 0 ? METRICS[n] : null;
      const w = ctx.$('.sv-sweep');
      el.dataset.tone = m ? m.tone : '';
      { const to = TONE[m ? m.tone : 'base'], t = performance.now();
        ctx.floor = ctx.instant ? { a: to, b: to, t0: 0, d: 1 } : { a: mixAt(ctx.floor, t), b: to, t0: t, d: 1000 }; }
      const k = lit(Math.max(n, 0)), tone = m ? m.tone : '';
      // the squares: every change starts from where the square is now, on its CSS timing
      const now = performance.now();
      const tw = (tv, to, dl, d) => { if (ctx.instant) { tv.a = tv.b = to; tv.t0 = 0; tv.d = 1; return; } const cur = val(tv, now); if (cur === to && tv.b === to) return; tv.a = cur; tv.b = to; tv.t0 = now + dl; tv.d = d; };
      const enter = parseFloat(getComputedStyle(el).getPropertyValue('--enter')) || 0;
      if (n < 0 || ctx.instant) ctx.fade = { a: n < 0 ? 0 : 1, b: n < 0 ? 0 : 1, t0: 0, d: 900 };
      else if (ctx.fade.b !== 1) ctx.fade = { a: val(ctx.fade, now, E.out), b: 1, t0: now + (enter + .25) * 1000, d: 900 };
      CELLS.forEach((cl, i) => {
        const q = ctx.sq[i], on = i < k, hd = tone === 'hero' && !on;
        tw(q.pop, n >= 0 ? 1 : 0, (cl.rd * 1.1 + .15) * 1000, 800);
        tw(q.op, n >= 0 ? (hd ? .5 : 1) : 0, (cl.rd * .9 + .1) * 1000, 500);
        const look = on ? LOOK[tone] || LOOK.off : hd ? LOOK.dim : LOOK.off;
        if (ctx.instant) { q.look = { a: look, b: look, t0: 0, d: 1 }; }
        else if (q.look.b !== look) q.look = { a: lookAt(q.look, now), b: look, t0: now + cl.c * 34, d: 600 };
        q.mode = on && (tone === 'gap' || tone === 'go') ? 'tw' : on && tone === 'hero' ? 'hero' : '';
        q.hd = hd;
      });
      draw(ctx);

      // the odometer: every reel lands on its digit in the state's own cycle, so a
      // forward build rolls down, a step back rolls up, and both settle identically
      // (Somar's figures are proportional: each slot takes its digit's own width)
      if (!ctx.dw) {
        const s = document.createElement('span');
        s.className = 'sv-probe'; ctx.$('.sv-odo').appendChild(s);
        const dw = Array.from({ length: 10 }, (_, d) => { s.textContent = String(d); return s.offsetWidth; });
        s.remove();
        if (!document.fonts || document.fonts.status === 'loaded') ctx.dw = dw; else ctx.dwTmp = dw;
      }
      const dw = ctx.dw || ctx.dwTmp;
      const v = m ? m.v : 0;
      const dg = [Math.floor(v / 100) % 10, Math.floor(v / 10) % 10, v % 10];
      const show = [v >= 100, v >= 10, true];
      // each roll crosses from one cycle of the reel to the other: forward it rolls down from the
      // first cycle into the second, back it rolls up from the second into the first. First the reel
      // is set (without a transition) on its current digit in the cycle it rolls from; the digits
      // repeat, so nothing on screen moves. Two cycles keep the reel a short layer.
      const fwd = n >= prev;
      ctx.slots.forEach((s, i) => {
        if (!ctx.instant) {
          const r = ctx.reels[i];
          r.style.transition = 'none';
          s.style.setProperty('--ix', (fwd ? 0 : 10) + ctx.dg[i]);
          void r.offsetWidth;
          r.style.transition = '';
        }
        s.style.setProperty('--ix', (ctx.instant || fwd ? 10 : 0) + dg[i]);
        s.style.setProperty('--w', show[i] ? dw[dg[i]].toFixed(1) + 'px' : '0px');
        s.classList.toggle('off', !show[i]);
      });
      ctx.dg = dg;
      el.classList.toggle('sv-pct-on', n >= 1);
      // the punchline's two lines of light sit under its two halves (measured: the words are laid out by the font)
      if (n === 3) {
        const ws = ctx.$$('.sv-punch .w'), em = ctx.$('.sv-punch em');
        const w2 = em && em.closest('.w'), w1 = ws.filter((w) => w !== w2 && !w.contains(em));
        if (w1.length && w2) {
          const a = w1[0], z = w1[w1.length - 1], pu = ctx.$('.sv-pu');
          pu.style.setProperty('--x1', a.offsetLeft + 'px'); pu.style.setProperty('--w1', (z.offsetLeft + z.offsetWidth - a.offsetLeft - 14) + 'px');
          pu.style.setProperty('--x2', w2.offsetLeft + 'px'); pu.style.setProperty('--w2', (w2.offsetWidth - 14) + 'px');
        }
      }

      // one-shot lights play on live clicks only; their resting state is invisible
      el.classList.remove('sv-live'); void el.offsetWidth;
      if (!ctx.instant && n >= 0) el.classList.add('sv-live');
      w.classList.remove('roll');
      if (n >= 1 && !ctx.instant) { void w.offsetWidth; w.classList.add('roll'); ctx.after(1500, () => w.classList.remove('roll')); }
    },
  });

  // a tween's value at time t (ms): eased on the curve its CSS transition used
  function val(tv, t, ease) { if (t <= tv.t0) return tv.a; const u = Math.min(1, (t - tv.t0) / tv.d); return u >= 1 ? tv.b : tv.a + (tv.b - tv.a) * (ease || E.soft)(u); }
  function lookAt(lk, t) {
    const u = t <= lk.t0 ? 0 : Math.min(1, (t - lk.t0) / lk.d), e = E.soft(u);
    if (e <= 0) return lk.a; if (e >= 1) return lk.b;
    return { bg: mixv(lk.a.bg, lk.b.bg, e), bd: mixv(lk.a.bd, lk.b.bd, e), gp: lk.a.gp + (lk.b.gp - lk.a.gp) * e, gt: lk.a.gt + (lk.b.gt - lk.a.gt) * e };
  }
  // the scene's clock (s): a CSS animation, so the loops pause whenever the deck's animations do
  function clock(ctx) {
    let a = ctx.clkA;
    if (!a || a.currentTime == null) a = ctx.clkA = (ctx.clk.getAnimations ? ctx.clk.getAnimations()[0] : null);
    return a && a.currentTime != null ? a.currentTime / 1000 : 0;
  }
  function draw(ctx) {
    const g = ctx.g, now = performance.now(), T = clock(ctx), heroTone = ctx.el.dataset.tone === 'hero';
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, ctx.can.width, ctx.can.height);
    const fade = val(ctx.fade, now, E.out);
    if (fade <= .002) return;
    g.setTransform(ctx.k, 0, 0, ctx.k, PAD.l * ctx.k, PAD.t * ctx.k);
    const heroes = [];
    const one = (cl, q, mir) => {
      const pop = val(q.pop, now, E.back), p = Math.max(0, pop);
      let op = val(q.op, now), sc = p, rot = 45 * (1 - pop);
      const lk = lookAt(q.look, now);
      if (q.mode === 'tw') { const u = ((T + cl.rd * 3.6) % 3.6) / 3.6; op = loopAt(TWO, u); sc = loopAt(TWS, u); rot = 0; }
      if (q.mode === 'hero') { const u = ((T + cl.r * .14) % 2.8) / 2.8; sc = loopAt(HS, u); rot = 0; q.hu = u; }
      if (op <= .003 || sc <= .003) return;
      g.save();
      const at = mir ? cl.m : cl.p;
      g.translate(at.x, at.y);
      if (rot) g.rotate((mir ? -rot : rot) * Math.PI / 180);
      g.scale(sc * at.s, sc * at.s * (mir ? -MSQ : 1));
      op *= fade * (mir ? .3 : 1);
      g.globalAlpha = op;
      const glow = (s, a) => { if (a > .003) { g.globalAlpha = op * a; g.drawImage(s.cv, -CS / 2 - s.pad, -CS / 2 - s.pad); g.globalAlpha = op; } };
      if (!mir) { glow(ctx.spr.p, lk.gp); glow(ctx.spr.t, lk.gt); }
      if (q.mode === 'hero' && !mir) { const rest = loopAt(HR, q.hu); glow(ctx.spr.hr, rest); glow(ctx.spr.h1, 1 - rest); glow(ctx.spr.h2, 1 - rest); }
      // the tile's thickness (a darker strip under its face), then its face and its lit top
      g.fillStyle = rgba([lk.bg[0] * .42, lk.bg[1] * .42, lk.bg[2] * .5, Math.min(1, lk.bg[3] * 1.3)]); g.fill(ctx.side);
      g.beginPath(); g.roundRect(-CS / 2, -CS / 2, CS, CS, CS * .26);
      g.fillStyle = rgba(lk.bg); g.fill();
      g.globalAlpha = op * (.1 + .3 * lk.bg[3]); g.drawImage(ctx.hi, -CS / 2, -CS / 2, CS, CS); g.globalAlpha = op;
      g.beginPath(); g.roundRect(-CS / 2 + .5, -CS / 2 + .5, CS - 1, CS - 1, CS * .26 - .5);
      g.lineWidth = 1; g.strokeStyle = rgba(lk.bd); g.stroke();
      // the wave of light drifting across the other respondents (their ::after)
      if (!q.mode && !mir) {
        const wa = loopAt(WAVE, ((T + 5.2 * 4 - cl.c * .26 - cl.r * .05) % 5.2) / 5.2);
        if (wa > .003) {
          g.globalAlpha = op * wa;
          g.beginPath(); g.roundRect(-CS / 2 - 1, -CS / 2 - 1, CS + 2, CS + 2, CS * .26 + 1);
          g.fillStyle = heroTone ? 'rgba(201,166,211,.16)' : 'rgba(255,255,255,.22)'; g.fill();
        }
      }
      g.restore();
    };
    // the reflection first (under everything), then the tiles
    CELLS.forEach((cl, i) => { if (cl.m) one(cl, ctx.sq[i], true); });
    g.save(); g.globalCompositeOperation = 'destination-out'; g.globalAlpha = 1;
    const rf = g.createLinearGradient(0, FLOOR + 4, 0, FLOOR + 34); rf.addColorStop(0, 'rgba(0,0,0,0)'); rf.addColorStop(1, 'rgba(0,0,0,1)');
    g.fillStyle = rf; g.fillRect(-PAD.l, FLOOR, WW + PAD.l + PAD.r, PAD.b); g.restore();
    CELLS.forEach((cl, i) => { const q = ctx.sq[i]; if (q.mode === 'hero') heroes.push(i); else one(cl, q); });
    heroes.forEach((i) => one(CELLS[i], ctx.sq[i]));   // the thirteen sit above the rest (their z-index)
    // the floor: a pool of the figure's colour under everything
    const k = ctx.k, fp = proj(WW / 2, WH + 24);
    const fc = mixAt(ctx.floor, now);
    g.globalCompositeOperation = 'destination-over';
    g.setTransform(k * WW * .6, 0, 0, k * 64, (PAD.l + fp.x) * k, (PAD.t + fp.y) * k);
    const pg = g.createRadialGradient(0, 0, 0, 0, 0, 1);
    pg.addColorStop(0, rgba([fc[0], fc[1], fc[2], fc[3] * fade])); pg.addColorStop(1, rgba([fc[0], fc[1], fc[2], 0]));
    g.fillStyle = pg; g.beginPath(); g.arc(0, 0, 1, 0, Math.PI * 2); g.fill();
    g.globalCompositeOperation = 'source-over'; g.setTransform(1, 0, 0, 1, 0, 0);
  }
})();
