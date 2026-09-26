/* 09b · Leaders go first (v4) — leadership involvement, act IV opens.
   Stop 0 builds while the chapter card's line opens the frame: the headline, then
   the three roles as a cascade. Left: the role names are the heroes (Executive
   sponsor · Department leaders · Managers), their actions small and dim beneath.
   Right: the same tiers as a tree of light, drawn as people — one sponsor, their
   department leaders, the managers, and every colleague at the foot. The spark lands
   just after "Executive sponsor"; a level line carries its light to the tree's root
   and the links draw down, tier by tier, to the colleagues.
   Ambient (stop 0): stories keep flowing down the cascade (sponsor → a leader →
   a manager → a colleague; each node flares as a light arrives, each colleague
   lights), a light runs the sponsor's level line into the root, the root's halo
   breathes, and two washes drift.
   Stop 1: the headline swaps to "Leaders spotlight others, never themselves.";
   the role texts step out and two lists take their place, each line with its own
   drawn icon (what leaders do ↔ what they don't: nominate ↔ self-nominate, a story
   ↔ a podium, consent ↔ a broadcast). The tree folds away; its root, now dark,
   slides onto a photo window of a team and casts a slow spotlight across them.
   GPU: every layer is sized to what it draws (the tree has its own box; washes and
   glows are drawn small and scaled up); the story lights ride 4 carriers (2 routes
   each) instead of 24 lights and 24 flares; each stop's content is hidden
   (visibility) once it has faded, so its layers go away.
   All state keys off .st-n / data-step, so back navigation lands on the same frame;
   the one-shot lights of the build play only on a live click. */
(function () {
  /* ── geometry (stage px) ── */
  const TX = 1400;                              // the tree's centre line
  const Y = [420, 590, 760, 890];               // tiers: sponsor · department leaders · managers · colleagues
  const X2 = [-285, -95, 95, 285].map((d) => TX + d);
  const X3 = X2.flatMap((x) => [x - 48, x + 48]);
  const X4 = X3.flatMap((x) => [x - 30, x, x + 30]);
  const HALF = [32, 20, 13, 8];                 // node half-sizes per tier (a colleague is a 16px bust)
  // the tree's own box: the links, lights and nodes live in it, so no layer spans the stage
  const OX = 960, OY = 300, TW = 860, TH = 640;
  const lx = (x) => x - OX, ly = (y) => y - OY;
  // the links' drawing box (tree-local): from the root's foot to the colleagues' heads, leaf to leaf
  const LK = { x: 70, y: 148, w: 740, h: 438 };
  const r1 = (v) => Math.round(v * 10) / 10;
  // stop 1: the photo window and where the (now dark) root comes to rest on its top edge
  const WIN = { x: 1290, y: 462, w: 486, h: 418 };
  const ROOT1 = [WIN.x + WIN.w / 2 - TX, WIN.y - Y[0]];

  const ROLES = [
    { t: 'Executive sponsor', i: 'person-message', a: 'Opens the campaign with the story of a colleague who inspired them.<br>Chairs the quarterly review and decides: scale, adjust or stop.' },
    { t: 'Department leaders', i: 'handshake', a: 'Nominate at least one colleague every quarter.<br>Acknowledge each featured colleague in person, within a week.' },
    { t: 'Managers', i: 'team', a: 'Hold a five-minute story moment in every monthly team meeting.' },
  ];

  /* a person, as a bust (24-unit box) */
  const BUST = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4.3"/><path d="M3.6 22.4c.7-5.2 4-8.3 8.4-8.3s7.7 3.1 8.4 8.3z"/></svg>';

  /* ── the cascade's links (tree-local px): an S-curve from the foot of a parent to the head of a child ── */
  const tx = lx(TX), ty = Y.map(ly), x2 = X2.map(lx), x3 = X3.map(lx), x4 = X4.map(lx);
  const seg = (px, py, pr, cx, cy, cr) => {
    const y0 = py + pr, y1 = cy - cr, h = y1 - y0;
    return [px, y0, px, r1(y0 + h * .55), cx, r1(y1 - h * .55), cx, y1];
  };
  const pathD = (s) => `M${s[0]} ${s[1]} C${s[2]} ${s[3]} ${s[4]} ${s[5]} ${s[6]} ${s[7]}`;
  const S1 = x2.map((x) => seg(tx, ty[0], HALF[0], x, ty[1], HALF[1]));
  const S2 = x3.map((x, j) => seg(x2[j >> 1], ty[1], HALF[1], x, ty[2], HALF[2]));
  const S3 = x4.map((x, j) => seg(x3[Math.floor(j / 3)], ty[2], HALF[2], x, ty[3], HALF[3]));
  const [L1, L2, L3] = [S1, S2, S3].map((a) => a.map(pathD));

  /* ── sampling a link: arc-length tracer and CSS cubic-bezier easing ── */
  const bez = (s, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * s[k] + 3 * u * u * t * s[2 + k] + 3 * u * t * t * s[4 + k] + t * t * t * s[6 + k]); };
  function tracer(s) {             // f (share of the length) → [x, y]
    const P = [bez(s, 0)], L = [0];
    for (let i = 1; i <= 160; i++) { const p = bez(s, i / 160), q = P[i - 1]; P.push(p); L.push(L[i - 1] + Math.hypot(p[0] - q[0], p[1] - q[1])); }
    const tot = L[L.length - 1];
    return (f) => {
      const d = Math.min(1, Math.max(0, f)) * tot; let lo = 0, hi = L.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] < d) lo = m; else hi = m; }
      const r = (d - L[lo]) / ((L[hi] - L[lo]) || 1);
      return [P[lo][0] + (P[hi][0] - P[lo][0]) * r, P[lo][1] + (P[hi][1] - P[lo][1]) * r];
    };
  }
  const cubic = (x1, y1, x2_, y2) => (u) => {   // a CSS cubic-bezier() easing
    if (u <= 0 || u >= 1) return u <= 0 ? 0 : 1;
    let lo = 0, hi = 1, t = u;
    for (let i = 0; i < 40; i++) { t = (lo + hi) / 2; if (3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2_ + t * t * t < u) lo = t; else hi = t; }
    return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  };
  const HOPEASE = cubic(.4, 0, .6, 1);
  const RISE = 'animation-timing-function:cubic-bezier(.4,0,.6,1)';

  // build timing (s after the build starts): the links draw down behind the spark's light
  const T0 = .3, T1 = .38, T2 = .64, T3 = .9;
  const LVL1 = .74;                             // the sponsor's level line draws as the spark lands
  const paths = [
    ...L1.map((d, j) => ({ d, k: 1, dl: T1 + Math.abs(j - 1.5) * .02, dr: .3, lead: true })),
    ...L2.map((d, j) => ({ d, k: 2, dl: T2 + Math.abs(j - 3.5) * .012, dr: .28, lead: true })),
    // the colleagues' links: only the middle link of each manager carries a leading light
    ...L3.map((d, j) => ({ d, k: 3, dl: T3 + Math.abs(j - 11.5) * .006, dr: .24, lead: j % 3 === 1 })),
  ];
  const svgLinks = paths.map((p) => `<path class="ld-lk k${p.k}" d="${p.d}" pathLength="100" style="--d:${p.dl.toFixed(2)}s;--dr:${p.dr}s"/>`).join('');
  // one-shot leading lights while the links draw (live build only)
  const leads = paths.filter((p) => p.lead).map((p) => `<i class="ld-lead k${p.k}" style="offset-path:path('${p.d}');--d:${p.dl.toFixed(2)}s;--dr:${p.dr}s"></i>`).join('');

  /* ── nodes: department leaders and managers, each a person in an outlined squircle ── */
  const node = (cls, x, y, d) => `<i class="ld-n ${cls}" style="left:${x}px;top:${y}px;--d:${d.toFixed(2)}s">${BUST}</i>`;
  const nodes2 = x2.map((x, j) => node('t2', x, ty[1], T1 + .2 + Math.abs(j - 1.5) * .02)).join('');
  const nodes3 = x3.map((x, j) => node('t3', x, ty[2], T2 + .2 + Math.abs(j - 3.5) * .012)).join('');
  // every colleague: one static drawing (a row of busts), revealed from the centre outwards
  const TM = { x: 60, y: ty[3] - 16, w: 760, h: 34 };
  const bustAt = (x, y) => `<circle cx="${x}" cy="${r1(y - 4.2)}" r="3.4"/><path d="M${r1(x - 6.9)} ${y + 8}c.6-4.1 3.2-6.6 6.9-6.6s6.3 2.5 6.9 6.6z"/>`;
  const team = `<svg class="ld-team" viewBox="${TM.x} ${TM.y} ${TM.w} ${TM.h}" style="left:${TM.x}px;top:${TM.y}px;width:${TM.w}px;height:${TM.h}px">${x4.map((x) => bustAt(x, ty[3])).join('')}</svg>`;

  /* ── stories flowing down: sponsor → a leader → a manager → a colleague ──
     8 routes on an 8 s cycle, one leaving the sponsor every second, ridden by 4 carriers
     (route c at c s, route c+4 half a cycle later). Each carrier is one light on one sampled
     keyframe track (hop .8 s, a .14 s pause through each node, then it fades on the colleague);
     each carrier's three flares (leader, manager, colleague) move to the next route's nodes
     while unseen. 16 small layers instead of 48. */
  const D = 8, HOP = .8, PAUSE = .14, HALFLAP = 4;
  const ROUTES = [[0, 1, 4], [2, 4, 13], [1, 2, 7], [3, 7, 22], [0, 0, 1], [2, 5, 16], [1, 3, 10], [3, 6, 19]];
  const dl = (t) => ((((t % D) + D) % D) - D).toFixed(2) + 's';
  const pct = (t) => (t / D * 100).toFixed(3) + '%';
  const KF = [];
  const org = [tx, ty[0] + HALF[0]];            // every carrier sits at the sponsor's foot
  const routeSamples = (t0, [a, b, c]) => {
    const out = [];
    const hops = [[tracer(S1[a]), t0], [tracer(S2[b]), t0 + HOP + PAUSE], [tracer(S3[c]), t0 + 2 * (HOP + PAUSE)]];
    hops.forEach(([at, ts], k) => {
      const N = 16;
      for (let i = 0; i <= N; i++) {
        const u = i / N, t = ts + HOP * u, p = at(HOPEASE(u));
        out.push({ t, x: p[0] - org[0], y: p[1] - org[1], s: k === 2 ? 1 - .23 * u : 1, o: Math.min(1, (t - t0) / .22) });
      }
    });
    const end = out[out.length - 1];
    out.push({ t: end.t + .22, x: end.x, y: end.y, s: end.s, o: 0 });
    return out;
  };
  const kfTrack = (name, samples) => {
    let k = '';
    for (const p of samples) k += `${pct(p.t)}{transform:translate(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px) scale(${p.s.toFixed(3)});opacity:${p.o.toFixed(2)}${p.e ? ';' + p.e : ''}}`;
    KF.push(`@keyframes ${name}{${k}}`);
    return name;
  };
  // a flare's cycle starts at the rise for its first route; the second route's rise is 4 s later
  const flareSamples = (tier, xa, xb) => {
    const f = (x, t0) => tier === 'tm'
      ? [{ t: t0, x, s: 1.2, o: 0, e: RISE }, { t: t0 + .22, x, s: 1.35, o: 1 }, { t: t0 + .54, x, s: 1, o: 1 }, { t: t0 + 1.98, x, s: 1, o: .85 }, { t: t0 + 3.42, x, s: 1, o: 0 }]
      : [{ t: t0, x, s: .9, o: 0, e: RISE }, { t: t0 + .22, x, s: 1, o: 1 }, { t: t0 + .94, x, s: 1.9, o: 0 }];
    const a = f(xa, 0), b = f(xb, HALFLAP);
    return [...a, ...b, { t: D, x: xa, s: a[0].s, o: 0 }].map((p) => ({ ...p, y: 0 }));
  };
  const LIT = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7.6" r="4.3"/><path d="M3.6 22.4c.7-5.2 4-8.3 8.4-8.3s7.7 3.1 8.4 8.3z"/></svg>`;
  const flows = [0, 1, 2, 3].map((c) => {
    const A = ROUTES[c], B = ROUTES[c + 4];
    const light = routeSamples(0, A), lightB = routeSamples(HALFLAP, B);
    const track = [...light, { ...lightB[0], t: HALFLAP - .05 }, ...lightB, { ...light[0], t: D }];
    const carrier = `<i class="ld-f" style="left:${org[0] - 6.5}px;top:${org[1] - 6.5}px;animation-name:${kfTrack('ldC' + c, track)};animation-delay:${dl(c)}"><b></b></i>`;
    const arrive = (k) => c + HOP + k * (HOP + PAUSE) - .22;      // each flare rises .22 s before its light arrives
    const hits = [['t2', x2[A[0]], x2[B[0]], ty[1]], ['t3', x3[A[1]], x3[B[1]], ty[2]], ['tm', x4[A[2]], x4[B[2]], ty[3]]]
      .map(([tier, xa, xb, y], k) => `<i class="ld-hit ${tier}" style="left:0;top:${y}px;animation-name:${kfTrack('ldH' + c + tier, flareSamples(tier, xa, xb))};animation-delay:${dl(arrive(k))}">${tier === 'tm' ? LIT : ''}</i>`).join('');
    return carrier + hits;
  }).join('');

  /* ── the role rows (left) ── */
  const rows = ROLES.map((x, k) => `
    <div class="ld-row r${k + 1}" data-out="1" style="top:${Y[k] - 30}px">
      <span class="ld-chip a-materialize" data-in="0" style="--d:${(.3 + k * .16).toFixed(2)}s">${Deck.icon(x.i)}</span>
      <h3 class="ld-role" data-in="0" style="--d:${(.34 + k * .16).toFixed(2)}s"${k === 0 ? ' data-spark="0" data-spark-at="r" data-spark-delay=".2"' : ''}>${x.t}</h3>
      <p class="ld-act a-fade" data-in="0" style="--d:${(.52 + k * .16).toFixed(2)}s;--dur:.8s">${x.a}</p>
    </div>`).join('');

  /* ── stop 1: what leaders do ↔ what they don't, each with a drawn icon (32-unit line icons) ── */
  const ic = (body) => `<svg viewBox="0 0 32 32" aria-hidden="true">${body}</svg>`;
  const ICONS = {
    // nominate: an arrow puts a colleague forward (a spark above them)
    nominate: ic('<circle cx="19.5" cy="11.2" r="4"/><path d="M12 26.5c.6-4.6 3.7-7.3 7.5-7.3s6.9 2.7 7.5 7.3"/><path d="M3.5 17.8h6.8M7.6 14.8l3 3-3 3"/><path d="M27 3.2v4.4M24.8 5.4h4.4"/>'),
    // a story bubble about someone else
    story: ic('<path d="M6.2 6h19.6a2.7 2.7 0 0 1 2.7 2.7v11a2.7 2.7 0 0 1-2.7 2.7H14.5l-5.6 4.4v-4.4H6.2a2.7 2.7 0 0 1-2.7-2.7v-11A2.7 2.7 0 0 1 6.2 6z"/><circle cx="16" cy="11.6" r="2.6"/><path d="M11.4 18.6c.5-2.3 2.3-3.7 4.6-3.7s4.1 1.4 4.6 3.7"/>'),
    // consent and fairness: a shield with a tick
    consent: ic('<path d="M16 3.5l10 3.8v7.1c0 6.3-4.2 10.6-10 13.1-5.8-2.5-10-6.8-10-13.1V7.3z"/><path d="M11.2 15.6l3.4 3.4 6.3-6.8"/>'),
    // self-nomination: the arrow turns back on the nominator
    self: ic('<circle cx="11.5" cy="11.2" r="4"/><path d="M4 26.5c.6-4.6 3.7-7.3 7.5-7.3s6.9 2.7 7.5 7.3"/><path d="M19.6 21.4c4.6-.3 7.6-3.4 7.6-7.4s-3-7-7.6-7.2"/><path d="M22.2 4.2l-2.6 2.6 2.6 2.6"/>'),
    // ranking: a podium with a star over first place
    podium: ic('<path d="M3.5 27.5h25M12 27.5V15.5h8v12M4.5 27.5v-7.5H12M20 22h7.5v5.5"/><path d="M16 5.2l1.3 2.6 2.9.4-2.1 2 .5 2.9-2.6-1.4-2.6 1.4.5-2.9-2.1-2 2.9-.4z"/>'),
    // a broadcast: a megaphone
    broadcast: ic('<path d="M5.5 13.2v5.6c0 .8.7 1.5 1.5 1.5h2.4l9.1 5.2V6.5l-9.1 5.2H7c-.8 0-1.5.7-1.5 1.5z"/><path d="M10 20.4l1.6 5.6h3"/><path d="M22.5 12.4a5 5 0 0 1 0 7.2M25.6 9.3a9.3 9.3 0 0 1 0 13.4"/>'),
  };
  const DO = [['nominate', 'Nominate colleagues.'], ['story', 'Tell other people’s stories.'], ['consent', 'Protect consent and fairness.']];
  const DONT = [['self', 'Nominate themselves.'], ['podium', 'Rank people or pick winners.'], ['broadcast', 'Turn it into a broadcast.']];
  // a small badge on each tile: a tick (do) or a cross (don't)
  const TICK = '<svg class="ld-bdg" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.5 12.4l3.6 3.6 7.4-7.9"/></svg>';
  const CROSS = '<svg class="ld-bdg" viewBox="0 0 24 24" aria-hidden="true"><path d="M8 8l8 8M16 8l-8 8"/></svg>';
  const list = (items, d0, badge) => items.map(([i, t], k) => `<li class="ld-li" data-in="1" style="--d:${(d0 + k * .1).toFixed(2)}s"><span class="ld-mk">${ICONS[i]}${badge}</span>${t}</li>`).join('');

  Deck.scene({
    id: 'leaders',
    title: 'Leaders go first',
    act: 3,
    bg: 'navy',
    transition: 'chapter',
    cues: ['Leaders go first · sponsor, leaders, managers', 'Leaders spotlight others, never themselves'],
    holds: [22, 16],
    notes: [
      'Inspiration is role-modelled, not announced. So leaders go first. Our sponsor opens the campaign with the story of a colleague who inspired them. Every department leader nominates at least one colleague a quarter and thanks featured colleagues in person. Managers give stories five minutes in every monthly meeting. [Team: confirm the commitments.]',
      'And one rule keeps it honest: leaders spotlight others, never themselves. No self-nomination, no rankings, no broadcast. Consent and fairness come first. That is the leadership behaviour we want the campaign to model.',
    ],
    field: [
      { dim: .32, lit: .04, litFrom: [1400, 900], travel: .3, warm: .1, offset: [70, 160], links: .5, wave: .5, streaks: .1, sparkle: 1.1, drift: 1,
        calm: [[100, 120, 1100, 350, .8], [100, 360, 1010, 940, .85], [1010, 360, 1800, 940, .3]] },
      { lit: .07, warm: .3, offset: [20, 190], travel: .22,
        calm: [[100, 120, 1760, 290, .8], [100, 380, 1300, 800, .88], [1300, 380, 1800, 940, .5]] },
    ],
    html: `
      <i class="ld-wash w1"><b></b></i><i class="ld-wash w2"><b></b></i>

      <div class="pad ld-head">
        <div class="kicker a-wipe" data-in="0" style="--d:.1s">Leadership involvement</div>
        <div class="ld-hbox">
          <h1 class="ld-h ld-h0" data-in="0" data-out="1" data-split style="--d:.16s;--wstep:.07s">Leaders go first.</h1>
          <h2 class="ld-h ld-h1" data-in="1" data-split data-spark="1" data-spark-at="r" data-spark-delay=".7" style="--d:.2s;--wstep:.045s">Leaders <em class="hl">spotlight</em> <em class="hl">others,</em> never themselves.</h2>
        </div>
        <p class="ld-sub" data-in="0" data-out="1" style="--d:.44s">Inspiration is role-modelled, not announced.</p>
      </div>

      <!-- the cascade (right): one sponsor, their leaders, the managers, every colleague -->
      <div class="ld-tree" aria-hidden="true" style="left:${OX}px;top:${OY}px">
        <svg class="ld-links" viewBox="${LK.x} ${LK.y} ${LK.w} ${LK.h}" style="left:${LK.x}px;top:${LK.y}px;width:${LK.w}px;height:${LK.h}px">${svgLinks}</svg>
        <div class="ld-leads">${leads}</div>
        <div class="ld-flows">${flows}</div>
        <style>${KF.join('\n')}</style>
        ${nodes3}${nodes2}${team}
      </div>

      <!-- stop 1: a team, and the light a leader casts on them -->
      <div class="ld-win" aria-hidden="true" style="left:${WIN.x}px;top:${WIN.y}px;width:${WIN.w}px;height:${WIN.h}px">
        <div class="ld-ph" style="background-image:linear-gradient(180deg, rgba(3, 8, 16, .5), rgba(3, 8, 16, .06) 46%, rgba(3, 12, 22, .3)), url('assets/photos/team-ops.jpg')"></div>
        <i class="ld-veil"></i>
        <i class="ld-beam"></i>
      </div>

      <!-- the sponsor: the source of the cascade; at stop 1 it goes dark and becomes the lamp -->
      <div class="ld-root" aria-hidden="true" style="left:${TX}px;top:${Y[0]}px;--rx:${ROOT1[0]}px;--ry:${ROOT1[1]}px">
        <i class="ld-halo"><b></b><b class="h2"></b></i>
        <i class="ld-bloom"></i>
        <i class="ld-n t1" style="--d:${T0}s">${BUST}<b class="ld-rings"><b class="ld-ring"></b><b class="ld-ring r2"></b></b><i class="ld-dk">${BUST}</i></i>
      </div>

      <!-- the roles (left): the names are the heroes, the actions support -->
      <i class="ld-lvl l1" style="top:${Y[0]}px;--d:${LVL1}s"><b></b></i>
      <i class="ld-lvl l2" style="top:${Y[1]}px;--d:.72s"></i>
      <i class="ld-lvl l3" style="top:${Y[2]}px;--d:.9s"></i>
      <i class="ld-lvl l4" style="top:${Y[3]}px;--d:1.04s"></i>
      ${rows}
      <div class="ld-row r4" data-out="1" style="top:${Y[3] - 30}px">
        <span class="ld-chip sm a-materialize" data-in="0" style="--d:.78s">${Deck.icon('users-connected')}</span>
        <span class="ld-tlab a-fade" data-in="0" style="--d:.82s">Teams</span>
      </div>

      <!-- stop 1: leaders spotlight others, never themselves -->
      <div class="ld-lists">
        <div class="ld-list do">
          <div class="ld-lh a-wipe" data-in="1" style="--d:.42s"><i></i>Leaders do</div>
          <ul>${list(DO, .5, TICK)}</ul>
        </div>
        <i class="ld-div a-wipe-down" data-in="1" style="--d:.5s;--dur:1s"><b></b></i>
        <div class="ld-list dont">
          <div class="ld-lh a-wipe" data-in="1" style="--d:.62s"><i></i>Leaders don’t</div>
          <ul>${list(DONT, .7, CROSS)}</ul>
        </div>
      </div>
    `,
    step(n, prev, ctx) {
      const el = ctx.el;
      // level lines: from just after each role name to the first node of its tier
      const first = [TX, X2[0], X3[0], X4[0]];
      ctx.$$('.ld-row').forEach((row, k) => {
        const nm = row.querySelector('.ld-role, .ld-tlab'), lv = ctx.$('.ld-lvl.l' + (k + 1));
        if (!nm || !lv || !nm.offsetWidth) return;
        const x0 = row.offsetLeft + nm.offsetLeft + nm.offsetWidth + (k === 0 ? 76 : 34);
        const x1 = first[k] - HALF[k] - 16;
        lv.style.left = x0 + 'px';
        lv.style.width = Math.max(0, x1 - x0) + 'px';
        lv.style.setProperty('--lw', Math.max(0, x1 - x0) + 'px');   // the running lights travel it on transforms
      });
      // one-shot lights (the links' leading lights, the root's flare) play only on a live
      // click; their resting state is invisible, so a jump or a step back shows the same frame
      el.classList.remove('ld-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) {
        el.classList.add('ld-live');
        const enter = parseFloat(getComputedStyle(el).getPropertyValue('--enter')) || 0;
        ctx.after((enter + LVL1 + .5) * 1000, () => window.Field && Field.burst(TX, Y[0], { radius: 520, dur: 1.4 }));
        ctx.after((enter + T3 + .4) * 1000, () => window.Field && Field.burst(TX, Y[3], { radius: 700, dur: 1.6 }));
        // the one-shot lights have all ended (at opacity 0) by then; dropping the class releases their layers
        ctx.after((enter + 2.8) * 1000, () => el.classList.remove('ld-live'));
      }
    },
  });
})();
