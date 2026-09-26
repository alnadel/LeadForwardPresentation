/* 10 · The pilot (v2) — act V opens on the ask in giant type, set in the dark
   ceiling band of the operations room while the video wall keeps working.
   Stop 1: the ask steps back to a heading and the plan rolls into one quarter: the
   ring draws behind a leading light and the three commitments land on it in glass
   (start, along the arc, where it closes).
   Stop 2 is how we'll judge it: a compact measurement lane whose four gantries
   read BASELINE as the story light drives through, the baseline (the figures count
   up to their exact values) and what we need, and the decision as the hero while
   everything before it recedes.
   Merges v1 16 (ask) and 14 (measure); v1 15 (risks) lives in the notes. All
   state is keyed off .st-n, so back navigation lands on the same frame. */
(function () {
  /* ── the quarter ring (stage px) ── */
  const CX = 952, CY = 650, R = 170, V = 200;   // V: half-size of the ring's SVG box
  // angles are measured clockwise from the start (9 o'clock)
  const pt = (deg, r) => {
    const a = (180 + deg) * Math.PI / 180;
    return [V + r * Math.cos(a), V + r * Math.sin(a)].map((v) => Math.round(v * 10) / 10);
  };
  const ticks = [0, 120, 240].map((d) => {
    const [x1, y1] = pt(d, R - 15), [x2, y2] = pt(d, R + 15);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join('');
  const months = [60, 180, 300].map((d, i) => {
    const [x, y] = pt(d, R - 48);
    return `<text x="${x}" y="${y}">M${i + 1}</text>`;
  }).join('');
  const C2X = 1170;   // the right-hand commitment's left edge

  /* ── the measurement lane (compact port of v1 14) ── */
  const LANE_Y = 440, LANE_H = 48, CAR_Y = LANE_Y + LANE_H / 2;
  const GANTRIES = [
    { x: 348, label: 'Participation' },
    { x: 756, label: 'Reach' },
    { x: 1164, label: 'Recognition' },
    { x: 1572, label: 'Repeatable behaviour' },
  ];
  // the light's path runs x -60 → 1980: one quick pass with the build, then
  // a slow lap every 10 s while the presenter talks, with a second story half a
  // lap behind, so each readout blinks twice a cycle (keep in step with .pl-car)
  const X0 = -60, X1 = 1980, FIRST_AT = 0.5, FIRST = 1, SLOW = 10;
  const frac = (x) => (x - X0) / (X1 - X0);
  const r2 = (v) => Math.round(v * 100) / 100;
  let truss = 'M8 20H252M8 40H252';
  for (let x = 8; x < 252; x += 16) truss += `M${x} 40L${x + 8} 20L${x + 16} 40`;
  // the readout cycle blinks at 0% and 50%, once for each light; the far gantries
  // start it half a lap early so they also catch the second light's first pass
  const cycleAt = (x) => {
    const tf = FIRST_AT + frac(x) * FIRST, ts = FIRST_AT + FIRST + frac(x) * SLOW;
    return r2(ts - SLOW / 2 >= tf + 1.05 ? ts - SLOW / 2 : ts);
  };
  const gantry = (g, i) => `
    <div class="pl-g" style="left:${g.x - 130}px;top:${LANE_Y - 144}px;--on:${r2(0.25 + i * 0.08)}s;--tf:${r2(FIRST_AT + frac(g.x) * FIRST)}s;--ts:${cycleAt(g.x)}s">
      <svg class="pl-frame" viewBox="0 0 260 144" aria-hidden="true">
        <rect x="14" y="40" width="7" height="100" rx="2"/><rect x="239" y="40" width="7" height="100" rx="2"/>
        <rect x="8" y="138" width="19" height="4" rx="1"/><rect x="233" y="138" width="19" height="4" rx="1"/>
        <path class="pl-truss" d="${truss}"/>
        <rect class="pl-head" x="117" y="58" width="26" height="14" rx="3"/>
      </svg>
      <i class="pl-lens"></i>
      <div class="pl-vms"><span>Baseline</span></div>
      <div class="pl-beam"></div>
      <div class="pl-foot"></div>
    </div>`;
  const glabel = (g) => `<div class="label pl-glab a-fade" data-in="2" style="left:${g.x - 200}px;top:${LANE_Y + LANE_H + 16}px;--d:${r2(FIRST_AT + frac(g.x) * FIRST - 0.08)}s;--dur:.6s">${g.label}</div>`;

  /* ── the room: the video wall keeps working ── */
  const blips = Array.from({ length: 24 }, (_, i) => `<b style="--x:${(i * 41) % 97}%;--y:${4 + (i * 59) % 32}%;--w:${16 + (i * 7) % 30}px;--t:${2.2 + (i % 5) * .8}s;--dl:${-i * .37}s"></b>`).join('');
  const dust = Array.from({ length: 18 }, (_, i) => `<i style="left:${4 + (i * 137) % 92}%;top:${58 + (i * 71) % 40}%;--t:${11 + (i % 6) * 2.2}s;--dl:${-i * 1.3}s;--dx:${(i % 2 ? 1 : -1) * (24 + (i * 13) % 50)}px;--dy:${-150 - (i * 29) % 180}px"></i>`).join('');

  const HERO_Y = 848;   // top of the decision's hero line
  // after "stop." the pilot's path forks three ways: one recommendation, three possible outcomes
  // (box: stage 960,830 · 820×140; every branch is drawn equal, so none is favoured)
  const FORK = ['M30 76 H300 C 430 76, 520 32, 760 32', 'M30 76 H760', 'M30 76 H300 C 430 76, 520 120, 760 120'];
  const fork = FORK.map((d, i) => `<path class="pl-fb" d="${d}" pathLength="100" style="--i:${i}"/>`).join('');
  const forkLights = FORK.map((d, i) => `<i class="pl-fl" style="offset-path:path('${d}');--i:${i}"><b class="light sm"></b></i>`).join('');
  const forkNodes = [32, 76, 120].map((y, i) => `<i class="pl-fn" style="left:760px;top:${y}px;--i:${i}"></i>`).join('');

  Deck.scene({
    id: 'pilot',
    title: 'The pilot',
    act: 4,
    bg: 'night',
    transition: 'chapter',
    cues: ['Approve the pilot.', 'One quarterly cycle · three commitments', 'How we’ll judge it · what we need · scale, adjust or stop'],
    holds: [6, 12, 12],
    notes: [
      'So here is the ask, in three words: approve the pilot. Pause, and let it sit. Everything that follows is what that approval buys, and how we will know whether it worked.',
      'We start with one quarterly cycle and measure what changes. One lap of this ring is one quarter: open nominations to peers and leaders, run one full cycle — capture, curate, feature, reinforce — and report what changed.',
      'Four gantries judge it: participation, reach, recognition, repeatable behaviour. Baseline: 8% reach, a 56% gap; the same eight questions at quarter end. We need a sponsor, curation time, our existing channels — no new platform. Then one recommendation: scale, adjust or stop. Risks if asked (v1 scene 15): a popularity contest — peers nominate, criteria published (curation panel); nominations dry up — always open, each featured colleague nominates the next (Internal Communications); a sensitive story — facts and consent checked first (HR, Legal on request); clustering — representation tracked from month one (HR / People Analytics); owners and the needs list are our proposal, team to confirm before presenting.',
    ],
    field: [
      { dim: .3, lit: .03, travel: .25, offset: [-60, -200], litFrom: [960, 300], links: .4, wave: .4, streaks: .14, sparkle: 1, calm: [[100, 110, 1500, 380, .85]] },
      { dim: .22, travel: .1, links: .3, calm: [[100, 110, 1800, 960, .88]] },
      { calm: [[80, 110, 1840, 960, .88]] },
    ],
    html: `
      <div class="pl-cam a-zoom" data-in="0" style="--dur:2.2s">
        <div class="pl-plate">
          <div class="photo pl-photo" style="background-image:url('assets/photos/team-ops.jpg')"></div>
          <div class="pl-wall"><i class="pl-wglow"></i>${blips}<em class="pl-wscan"></em><em class="pl-wsweep"></em></div>
          <div class="amb-leak pl-leak"></div>
        </div>
      </div>
      <div class="fill pl-veil"></div>
      <div class="pl-cove"></div>
      <div class="amb-dust pl-dust">${dust}</div>
      <div class="fill pl-shade-1 a-fade" data-in="1" style="--dur:1.2s"></div>
      <div class="fill pl-shade-2 a-fade" data-in="2" style="--dur:1s"></div>

      <!-- stop 0 · the ask -->
      <div class="kicker pl-kicker a-wipe" data-in="0" style="--d:.2s">The ask</div>
      <h1 class="display pl-title" data-in="0" data-split data-spark="0" data-spark-delay="1.05" style="--d:.35s;--wstep:.09s">Approve the pilot.</h1>

      <!-- stop 1 · one quarter, three commitments -->
      <p class="lead pl-sub" data-in="1" data-out="2" style="--d:.15s">Start with one quarterly cycle and measure what changes.</p>
      <div class="pl-plan" data-out="2">
        <i class="pl-rglow" style="left:${CX}px;top:${CY}px"></i>
        <i class="pl-conn a-wipe" data-in="1" style="top:${CY - 1}px;width:${CX - R - 144}px;--d:.2s;--dur:.7s"><b></b></i>
        <svg class="pl-dash" viewBox="0 0 ${V * 2 + 80} ${V * 2 + 80}" style="left:${CX - V - 40}px;top:${CY - V - 40}px" aria-hidden="true"><circle cx="${V + 40}" cy="${V + 40}" r="${R + 30}"/></svg>
        <svg class="pl-ring" viewBox="0 0 ${V * 2} ${V * 2}" style="left:${CX - V}px;top:${CY - V}px" aria-hidden="true">
          <defs><linearGradient id="plProgG" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#03FFCB"/><stop offset=".55" stop-color="#25C7BC"/><stop offset="1" stop-color="#8FC2DC"/></linearGradient></defs>
          <circle class="pl-track" cx="${V}" cy="${V}" r="${R}"/>
          <circle class="pl-prog" cx="${V}" cy="${V}" r="${R}" pathLength="100" transform="rotate(180 ${V} ${V})"/>
          <g class="pl-ticks">${ticks}</g>
          <g class="pl-months">${months}</g>
          <g class="pl-core"><text x="${V}" y="${V - 8}">One</text><text x="${V}" y="${V + 26}">quarter</text></g>
        </svg>
        <div class="pl-comet" style="left:${CX - R - 7}px;top:${CY - R - 7}px;width:${2 * R + 14}px;height:${2 * R + 14}px"></div>
        <div class="pl-orb" style="left:${CX}px;top:${CY}px;--r:${R}px"><i class="light"></i></div>
        <i class="pl-pin a-materialize" data-in="1" data-spark="1" data-spark-xy="${CX - R},${CY}" style="left:${CX - R}px;top:${CY}px;--d:.25s"></i>
        <i class="pl-pin sm a-materialize" data-in="1" style="left:${CX + R}px;top:${CY}px;--d:.8s"></i>
        <i class="pl-lead a-wipe" data-in="1" style="left:${CX + R + 14}px;top:${CY}px;width:${C2X - CX - R - 14}px;--d:.85s;--dur:.5s"></i>
        <span class="label pl-mark a-fade" data-in="1" style="right:${1920 - 744}px;top:${CY - 42}px;--d:.35s">Start</span>
        <span class="label pl-mark a-fade" data-in="1" style="right:${1920 - 744}px;top:${CY + 20}px;--d:1.15s">Quarter end</span>

        <div class="pl-c pl-c1 glass a-left" data-in="1" style="--d:.3s">
          <h3 class="pl-ct"><b class="pl-n">01</b>Open nominations</h3>
          <p class="pl-cx">Accept peer and leader nominations through a simple form.</p>
        </div>
        <div class="pl-c pl-c2 glass a-right" data-in="1" style="left:${C2X}px;top:${CY - 96}px;--d:.72s">
          <h3 class="pl-ct"><b class="pl-n">02</b>Run one full cycle</h3>
          <p class="pl-cx"><span class="pl-chain">Capture → Curate → Feature → Reinforce</span> <span class="pl-nb">within the quarter.</span></p>
        </div>
        <div class="pl-c pl-c3 glass a-left" data-in="1" style="--d:1.08s">
          <h3 class="pl-ct"><b class="pl-n">03</b>Report what changed</h3>
          <p class="pl-cx">Participation, reach, recognition and repeatable behaviour on a quarterly dashboard.</p>
        </div>
      </div>

      <!-- stop 2 · how we'll judge it -->
      <div class="kicker pl-judge a-wipe" data-in="2" style="--d:.15s">How we’ll judge it</div>
      <div class="pl-rig a-wipe" data-in="2" style="--d:.1s;--dur:1.1s"><div class="pl-rig-in">
        <div class="pl-lane" style="top:${LANE_Y}px;height:${LANE_H}px">
          <i class="pl-edge t"></i><i class="pl-edge b"></i>
          <svg class="pl-lanedash" viewBox="0 0 1920 4" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="2" x2="1920" y2="2"/></svg>
        </div>
        ${GANTRIES.map(gantry).join('')}
      </div></div>
      <div class="pl-car" style="top:${CAR_Y}px" aria-hidden="true"><b class="pl-tail"></b><i class="light lg"></i></div>
      <div class="pl-car c2" style="top:${CAR_Y}px" aria-hidden="true"><b class="pl-tail"></b><i class="light"></i></div>
      ${GANTRIES.map(glabel).join('')}

      <div class="pl-card pl-base glass plum a-unfold" data-in="2" style="--d:.45s">
        <div class="label pl-card-l">Baseline</div>
        <p class="pl-base-t">Recognition reach <b class="pl-fig"><span class="num" data-count="8" data-delay=".75" data-dur="1">8</span>%</b> <i>·</i> visibility gap <b class="pl-fig"><span class="num" data-count="56" data-delay=".85" data-dur="1.1">56</span>%</b> today</p>
        <p class="pl-base-t2">→ the same eight questions at quarter end.</p>
      </div>
      <div class="pl-card pl-need glass a-unfold" data-in="2" style="--d:.58s">
        <div class="label pl-card-l">What we need</div>
        <p class="pl-need-t">An executive sponsor <i>·</i> curation time from HR and Internal Communications <i>·</i> our existing channels</p>
      </div>
      <h2 class="pl-final" data-in="2" data-split style="--d:.62s;--wstep:.03s">After one quarter we come back with one recommendation:</h2>
      <div class="pl-herow" data-spark="2" data-spark-delay=".8" style="top:${HERO_Y}px">
        <p class="pl-hero" data-in="2" data-split style="--d:.86s;--wstep:.07s">scale, adjust or stop.</p>
      </div>
      <div class="pl-fork" aria-hidden="true">
        <svg viewBox="0 0 820 140">${fork}</svg>
        ${forkLights}${forkNodes}
      </div>
    `,
    step(n, prev, ctx) {
      // the spark rests just after the full stop, at the x-height of the display line
      const t = ctx.$('.pl-title');
      if (t && t.offsetWidth) t.dataset.sparkXy = Math.round(t.offsetLeft + t.offsetWidth + 54) + ',' + Math.round(t.offsetTop + t.offsetHeight * .64);
      // …and at stop 2 just after "stop.", where the fork of outcomes begins
      const hw = ctx.$('.pl-herow'), h = ctx.$('.pl-hero');
      if (hw && h && h.offsetWidth) hw.dataset.sparkXy = Math.round(hw.offsetLeft + h.offsetWidth + 42) + ',' + Math.round(hw.offsetTop + h.offsetHeight * .58);
    },
  });
})();
