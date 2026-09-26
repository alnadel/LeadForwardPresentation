/* 09d · From one quarter to a habit (v3) — act V opens on the plan. The chapter
   card's line of light does not go away: the scene opens on exactly that line
   (stage y 540), which becomes the roadmap's timeline.
   Stop 0: four milestones on the glowing timeline, 2026 → 2030. The timeline is the
   ground of a pseudo-3D staircase: each stage is a step that rises from its node and
   grows as the programme scales (Pilot a low slab, Habit the tallest), with its year
   standing on it and, toward 2030, a faint Riyadh horizon behind the top step. The
   pilot is the hero (its year lit, its card in live glass, the spark docks in its
   node); each card carries its stage's icon; the later stages get quieter step by
   step, and the line turns to a dashed horizon after 2028. Ambient: a story light
   leaves the pilot and travels the timeline, pausing at each milestone (its node
   pings, and its step's and its card's top edges light), then
   dissolves past 2030; sparks rise off the line; a horizon glow breathes behind
   the pilot; the live edge circles the pilot card.
   Stop 1: "Who runs it, and what it costs." The years and cards fold away and the
   timeline rises into a slim rail under the headline (the story keeps travelling
   it), with two glass panels below: Owners (each role has an avatar; a light walks
   down the owners' spine, lighting each avatar) and Budget, whose hero line takes the
   spark, above a pseudo-3D stack of what it costs: people time (the main block), a
   thin recognition layer, and new software, crossed out. No figures but the one we
   have: about two hours a week.
   Audience first: stop 0, the four stage names and years (Pilot brightest);
   descriptions are support. Stop 1, the budget hero line, then the five roles;
   their duties and the three budget lines are support.
   GPU: soft glows are drawn small and scaled up; the stop that is not showing is hidden,
   so it holds no layers.
   All state is keyed off .st-n, so back navigation lands on the same frame. */
(function () {
  const Y = 540;               // the timeline: the chapter card's centre line
  const UP = 222;              // stop 1: the timeline rises to a rail at y 318 (keep in step with the CSS)
  const CARD_Y = 600, CARD_H = 246;           // the milestone cards hang below the line
  const S0Y = 230;                             // stop 0's box starts here (keep in step with .rm-s0 in the CSS)
  const MS = [
    { when: 'Q4 2026', stage: 'Pilot', what: 'One quarterly cycle, open to everyone. <b>Decide: scale, adjust or stop.</b>', x: 144, w: 480 },
    { when: '2027', stage: 'Scale', what: 'Every department, a story champion in each, video and town-hall spotlights.', x: 660, w: 348 },
    { when: '2028', stage: 'Embed', what: 'Part of onboarding and leadership development; the first annual story collection.', x: 1044, w: 348 },
    { when: '2030', stage: 'Habit', what: 'Self-running: stories are how Tahakom shares what works.', x: 1428, w: 348 },
  ];
  const NX = MS.map((m) => m.x + 46);          // node centres on the timeline
  // line icons on a 24 grid (outline, round caps)
  const ico = (d, cls) => `<svg class="rm-svgi${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const STAGE_IC = [
    // pilot: a first shoot
    '<path d="M12 21v-9"/><path d="M12 13.5C12 9 8.8 6.6 4.4 6.6c0 4.3 3 6.9 7.6 6.9z"/><path d="M12 11.2c0-4.6 3.1-7.4 7.6-7.4 0 4.5-3.1 7.4-7.6 7.4z"/><path d="M7.5 21h9"/>',
    // scale: every department, a champion in each
    '<circle cx="12" cy="7.2" r="2.7"/><path d="M7.4 17.6a4.6 4.6 0 0 1 9.2 0"/><circle cx="4.9" cy="10.4" r="2.1"/><path d="M1.6 18.4a3.5 3.5 0 0 1 5.4-2.9"/><circle cx="19.1" cy="10.4" r="2.1"/><path d="M22.4 18.4a3.5 3.5 0 0 0-5.4-2.9"/>',
    // embed: part of the layers of how Tahakom develops people
    '<path d="m12 3.2 9 4.9-9 4.9-9-4.9z"/><path d="m3 12.1 9 4.9 9-4.9"/><path d="m3 16 9 4.9 9-4.9"/>',
    // habit: self-running
    '<path d="M12 12c-2.3-3.3-7.8-3.8-7.8 0s5.5 3.3 7.8 0c2.3-3.3 7.8-3.8 7.8 0s-5.5 3.3-7.8 0z"/>',
  ];
  // the staircase: each step rises from its node on the timeline to the next node, growing as
  // the stages scale; its top recedes up and to the right (pseudo-3D)
  const SH = [26, 62, 98, 134], SDX = 22, SDY = 15, SX = NX.map((x) => x - 22);
  const SW = SX.map((x, i) => (i < 3 ? SX[i + 1] : 1782) - x);
  const r2 = (v) => Math.round(v * 100) / 100;

  // the story light's lap: it leaves the pilot, rests briefly at each later milestone and
  // dissolves past 2030; a second story runs half a lap behind, so every milestone pings
  // twice a lap (the pings in 09d-roadmap.css peak at 0% and 50%)
  const LAP = 9, FIRST = 1.5;                  // s per lap; the first lap starts after the build
  const AT = [.03, .22, .42, .64];             // share of the lap when the light reaches each node
  const ping = (i) => r2(FIRST + AT[i] * LAP);
  // the lap as keyframes, built from the node positions: out of the pilot, a rest at each
  // later milestone (each segment eases in and out), then it dissolves beyond 2030
  const io = 'animation-timing-function: cubic-bezier(.5, 0, .4, 1)';
  const tx = (x, sc, op) => `transform: translateX(${x}px) scale(${sc})` + (op == null ? '' : `; opacity: ${op}`);
  const runKeys = `@keyframes rmRun {
    0% { ${tx(NX[0], .3, 0)} } 3% { ${tx(NX[0], 1.15, 1)} } 6% { ${tx(NX[0], 1)}; ${io} }
    22% { ${tx(NX[1], 1)} } 25% { ${tx(NX[1], 1)}; ${io} }
    42% { ${tx(NX[2], 1)} } 45% { ${tx(NX[2], 1)}; ${io} }
    64% { ${tx(NX[3], 1, 1)} } 67% { ${tx(NX[3], 1, 1)}; animation-timing-function: cubic-bezier(.4, 0, .8, .6) }
    77% { ${tx(NX[3] + 260, 1.8, 0)} } 100% { ${tx(NX[3] + 260, .3, 0)} } }`;

  // each owner has an avatar (people, drawn as simple silhouettes) with a badge for the role
  const BADGE = {
    flag: '<path d="M6.5 20.5V4"/><path d="M6.5 4.5h11l-2.4 3.9 2.4 3.9h-11"/>',
    check: '<path d="m5.5 12.5 4.2 4.2 8.8-9.4"/>',
    cast: '<path d="M4 10v4h3.2l6.3 4.2V5.8L7.2 10z"/><path d="M16.6 9.2a4 4 0 0 1 0 5.6"/><path d="M19.2 6.6a7.6 7.6 0 0 1 0 10.8"/>',
    bars: '<path d="M5 19.5v-6"/><path d="M10 19.5v-10"/><path d="M15 19.5v-7"/><path d="M20 19.5v-14"/>',
    story: '<path d="M4.5 5.5h15v10h-8.5l-4.5 3.4v-3.4h-2z"/>',
  };
  const who = (cls, x) => `<span class="rm-pp ${cls}" style="left:${x}px"><svg viewBox="0 0 40 40" aria-hidden="true"><circle class="hd" cx="20" cy="16" r="7"/><path class="bd" d="M5 42c0-9.5 6.7-15.2 15-15.2S35 32.5 35 42z"/></svg></span>`;
  const avatar = (o) => `<span class="rm-av ${o.a}">${o.a === 'one' ? who('lg', 0) : o.a === 'three' ? who('sm p1', -10) + who('sm p3', 26) + who('sm p2', 8) : who('sm p1', -4) + who('sm p2', 20)}` +
    `<span class="rm-badge">${ico(BADGE[o.b])}</span><i class="rm-lit-ic"></i></span>`;
  const OWNERS = [
    { r: 'Executive sponsor', d: 'Direction and the quarterly decision', a: 'one', b: 'flag' },
    { r: 'Curation panel', d: 'HR, Internal Communications and one rotating employee, choosing monthly', a: 'three', b: 'check' },
    { r: 'Internal Communications', d: 'Channels and calendar', a: 'one', b: 'cast' },
    { r: 'HR / People Analytics', d: 'The dashboard', a: 'one', b: 'bars' },
    { r: 'Story champions', d: 'From 2027', a: 'two', b: 'story' },
  ];
  // the budget as a pseudo-3D stack: people time is the main block, recognition a thin layer on
  // it, and new software a ghost above it, crossed out (sizes are illustrative, not figures)
  const BUDGET = [
    { k: 'No new platform:', t: 'email, intranet and town halls already exist.', z: 108, h: 34, c: 'ghost' },
    { k: 'A small recognition budget:', t: 'certificates and the annual event.', z: 66, h: 16, c: 'rec' },
    { k: 'People time:', t: 'the curation panel, about two hours a week.', z: 0, h: 66, c: 'ppl' },
  ];
  const BW = 130, BD = 90, CS = Math.cos(Math.PI / 6), BO = [103, 160];     // block footprint; iso origin in the stack svg
  const bp = (x, y, z) => [BO[0] + (x - y) * CS, BO[1] + (x + y) * .5 - z];
  const pts = (a) => a.map((q) => bp(q[0], q[1], q[2]).map((v) => v.toFixed(1)).join(',')).join(' ');
  const faces = (z, h) => ({
    l: pts([[0, BD, z], [BW, BD, z], [BW, BD, z + h], [0, BD, z + h]]),
    r: pts([[BW, 0, z], [BW, BD, z], [BW, BD, z + h], [BW, 0, z + h]]),
    t: pts([[0, 0, z + h], [BW, 0, z + h], [BW, BD, z + h], [0, BD, z + h]]),
  });
  const STACK_W = 240, STACK_H = 280;
  const blocks = BUDGET.slice().reverse().map((b) => {
    const f = faces(b.z, b.h);
    const cx = bp(BW / 2, BD / 2, b.z + b.h / 2);
    const cross = b.c === 'ghost' ? `<path class="x" d="M${(cx[0] - 20).toFixed(1)} ${(cx[1] - 20).toFixed(1)}l40 40M${(cx[0] + 20).toFixed(1)} ${(cx[1] - 20).toFixed(1)}l-40 40"/>` : '';
    return `<g class="bk ${b.c}"><polygon class="l" points="${f.l}"/><polygon class="r" points="${f.r}"/><polygon class="t" points="${f.t}"/>${cross}</g>`;
  }).join('');
  // each block's lit top: its own small svg (only its opacity moves), in turn with the lines
  const lits = BUDGET.map((b, i) => `<svg class="rm-blit ${b.c}" viewBox="0 0 ${STACK_W} ${STACK_H}" style="--bt:${r2(2.2 + i * 2.5)}s" aria-hidden="true"><polygon points="${faces(b.z, b.h).t}"/></svg>`).join('');
  // the owners' spine: a light walks down the five roles (keep in step with rmWalk)
  const OY = [0, 82, 192, 274, 356];           // row tops in the list (the curation row has two lines)
  const OWN_LAP = 7.5, OWN_FIRST = 1.4, OF = [.02, .2, .38, .56, .74];

  /* ── stop 0 · the timeline ── */
  const nodes = MS.map((m, i) => `
      <i class="rm-node n${i} a-materialize" data-in="0" style="left:${NX[i]}px;--d:${r2(.18 + i * .1)}s;--pt:${ping(i)}s"${i === 0 ? ` data-spark="0" data-spark-xy="${NX[0]},${Y}" data-spark-delay=".2"` : ''}><b></b></i>`).join('');
  const years = MS.map((m, i) => `
      <div class="rm-year y${i}" data-in="0" style="left:${m.x + 28}px;top:${Y - SH[i] - SDY - 8 - (i ? 60 : 72) - S0Y}px;--d:${r2(.3 + i * .09)}s">${m.when}</div>`).join('');
  const steps = MS.map((m, i) => {
    const w = SW[i], h = SH[i], W = w + SDX + 2, H = h + SDY + 2;
    const front = `0,${SDY} ${w},${SDY} ${w},${H} 0,${H}`;
    const top = `0,${SDY} ${w},${SDY} ${w + SDX},0 ${SDX},0`;
    const side = `${w},${SDY} ${w + SDX},0 ${w + SDX},${H - SDY} ${w},${H}`;
    return `
      <div class="rm-step k${i}" data-in="0" style="left:${SX[i]}px;top:${Y - h - SDY - S0Y}px;width:${W}px;height:${H}px;--d:${r2(.36 + i * .12)}s;--dur:1s;--pt:${ping(i)}s">
        <svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" aria-hidden="true">
          <defs><linearGradient id="rm-sf${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s0"/><stop offset="1" class="s1"/></linearGradient></defs>
          ${i === 3 ? `<polygon class="sd" points="${side}"/>` : ''}
          <polygon class="fr" points="${front}" fill="url(#rm-sf${i})"/>
          <polygon class="tp" points="${top}"/>
          <path class="ed" d="M0 ${SDY}H${w}"/>
        </svg>
        <i class="rm-step-lit" style="width:${w}px"></i>
      </div>`;
  }).join('');
  const stems = MS.map((m, i) => `
      <i class="rm-stem s${i} a-wipe-down" data-in="0" style="left:${NX[i] - 1}px;top:${Y + (i ? 12 : 20) - S0Y}px;height:${CARD_Y - Y - (i ? 12 : 20)}px;--d:${r2(.42 + i * .09)}s;--dur:.5s"></i>`).join('');
  const cards = MS.map((m, i) => `
      <div class="rm-card c${i} glass${i === 0 ? ' live' : ''} a-unfold" data-in="0" style="left:${m.x}px;top:${CARD_Y - S0Y}px;width:${m.w}px;height:${CARD_H}px;--d:${r2(.46 + i * .09)}s;--dur:1s;--pt:${ping(i)}s">
        <i class="rm-wash"></i><i class="rm-cap"></i>
        <span class="rm-sic">${ico(STAGE_IC[i])}</span>
        <h3 class="rm-stage">${m.stage}</h3>
        <p class="rm-what">${m.what}</p>
      </div>`).join('');
  // stop 1: the rail's quiet labels, to the right of each node
  const tags = MS.map((m, i) => `
      <span class="rm-tag t${i} a-fade" data-in="1" style="left:${NX[i] + (i ? 20 : 30)}px;--d:${r2(.72 + i * .06)}s;--dur:.6s">${m.when}<em>·</em>${m.stage}</span>`).join('');
  // sparks rising off the line (between the headline and the years)
  // (the box they rise in starts at DUST_Y, so its fade is a band-sized layer, not a full-screen one)
  const DUST_Y = 150;
  const dust = Array.from({ length: 18 }, (_, i) => `<i style="left:${120 + (i * 263) % 1640}px;top:${Y - 8 - (i * 37) % 50 - DUST_Y}px;--t:${8 + (i % 5) * 1.7}s;--dl:${-r2(i * 1.37)}s;--dx:${50 + (i * 29) % 110}px;--dy:${-140 - (i * 41) % 170}px"></i>`).join('');

  /* ── stop 1 · owners and budget ── */
  const owners = OWNERS.map((o, i) => `
        <div class="rm-own" data-in="1" style="top:${OY[i]}px;--ot:${r2(OWN_FIRST + OF[i] * OWN_LAP)}s">
          <i class="rm-oband"></i>
          ${avatar(o)}
          <b class="rm-role">${o.r}</b>
          <p class="rm-duty">${o.d}</p>
        </div>`).join('');
  // in the budget panel: the stack on the left, a label row per block on the right, a leader
  // from each block's right face to its row
  const STACK_X = 60, STACK_Y = 236, LX = 346, ROW = [300, 384, 468];
  const leaders = BUDGET.map((b, i) => {
    const q = bp(BW, BD / 2, b.z + b.h / 2), x0 = STACK_X + q[0] + 8, y0 = STACK_Y + q[1];
    return `<polyline class="${b.c}" points="${x0.toFixed(1)},${y0.toFixed(1)} ${(x0 + 18).toFixed(1)},${y0.toFixed(1)} ${LX - 34},${ROW[i]} ${LX - 14},${ROW[i]}"/><circle class="${b.c}" cx="${LX - 14}" cy="${ROW[i]}" r="4"/>`;
  }).join('');
  const budget = `
        <div class="rm-stack a-unfold" data-in="1" style="left:${STACK_X}px;top:${STACK_Y}px;width:${STACK_W}px;height:${STACK_H}px;--d:.86s;--dur:1s">
          <svg viewBox="0 0 ${STACK_W} ${STACK_H}" aria-hidden="true"><ellipse class="sh" cx="${bp(BW / 2, BD / 2, 0)[0].toFixed(1)}" cy="${(bp(BW, BD, 0)[1] - 22).toFixed(1)}" rx="120" ry="28"/>${blocks}</svg>
          ${lits}
        </div>
        <svg class="rm-leads a-fade" data-in="1" style="--d:1.1s;--dur:.8s" viewBox="0 0 836 530" aria-hidden="true">${leaders}</svg>` + BUDGET.map((b, i) => `
        <div class="rm-bl ${b.c}" data-in="1" style="top:${ROW[i] - 32}px;left:${LX}px;--d:${r2(1.14 + i * .1)}s">
          <p><b>${b.k}</b> ${b.t}</p>
        </div>`).join('');

  Deck.scene({
    id: 'roadmap',
    title: 'From one quarter to a habit',
    act: 4,
    bg: 'navy',
    transition: 'chapter',
    cues: ['Roadmap · 2026 to 2030', 'Who runs it, and what it costs'],
    holds: [12, 14],
    notes: [
      'This is a roadmap, not a one-off. A one-quarter pilot this year. In 2027 we scale to every department, with a story champion in each. In 2028 it becomes part of onboarding and leadership development. By 2030 it runs itself: stories are simply how Tahakom shares what works.',
      'Who runs it: the sponsor decides, a curation panel from HR, Internal Communications and one rotating employee selects each month, Communications runs the channels, and HR runs the dashboard. The cost is mostly people time, about two hours a week for the panel, plus a small recognition budget. No new software. [Team: confirm the estimate and the budget.]',
    ],
    field: [
      { dim: .34, lit: .04, travel: .35, offset: [-200, 60], litFrom: [NX[0], Y], warm: .1, links: .5, wave: .65, streaks: .2, sparkle: 1.6, drift: 1,
        calm: [[100, 120, 1500, 290, .8], [110, 420, 1820, 520, .6], [110, 590, 1820, 880, .88]] },
      { dim: .3, travel: .25, links: .4, wave: .5, streaks: .16, sparkle: 1.3,
        calm: [[100, 120, 1500, 330, .8], [110, 340, 1820, 900, .9]] },
    ],
    html: `
      <style>${runKeys}</style>
      <i class="rm-sun"></i>
      <div class="amb-dust rm-dust a-fade" data-in="0" data-out="1" style="top:${DUST_Y}px;--d:1s;--dur:1.4s">${dust}</div>

      <div class="kicker rm-kick a-wipe" data-in="0" style="--d:.1s">Roadmap</div>
      <h2 class="h2 rm-h" data-in="0" data-out="1" data-split style="--d:.16s">From one quarter to a habit.</h2>
      <h2 class="h2 rm-h" data-in="1" data-split style="--d:.18s">Who runs it, and what it costs.</h2>

      <!-- stop 0 · the staircase and its years above the line, cards below (they fold away at stop 1) -->
      <div class="rm-s0" data-out="1">
        <div class="rm-city a-fade" data-in="0" style="--d:1.2s;--dur:2.2s;background-image:url('assets/photos/riyadh-dusk.jpg')" aria-hidden="true"></div>
        ${steps}
        ${years}
        ${stems}
        ${cards}
      </div>

      <!-- the timeline: the chapter line, then a rail under the headline at stop 1 -->
      <div class="rm-rail" style="top:${Y}px;--up:${-UP}px">
        <i class="rm-band a-fade" data-in="0" style="--d:.3s;--dur:1.4s"></i>
        <i class="rm-line" data-in="0" style="--d:-.2s;--dur:.9s;--p0:${NX[0] - 96}px;--p1:${NX[1] - 96}px;--p2:${NX[2] - 96}px"><b class="rm-lit"></b><b class="rm-dash"></b></i>
        <div class="rm-run" aria-hidden="true"><b class="rm-tail"></b><i class="light"></i></div>
        <div class="rm-run2w" aria-hidden="true"><div class="rm-run r2"><b class="rm-tail"></b><i class="light sm"></i></div></div>
        ${nodes}
        ${tags}
      </div>

      <!-- stop 1 · who runs it, and what it costs -->
      <div class="rm-panel rm-owners glass a-unfold" data-in="1" style="--d:.34s;--dur:1s">
        <div class="label rm-pl">Owners</div>
        <i class="rm-spine"><b class="rm-walk"><i class="light sm"></i></b></i>
        <div class="rm-owns" data-stagger style="--stagger:.08s;--d:.5s">${owners}</div>
      </div>
      <div class="rm-panel rm-budget glass live a-unfold" data-in="1" style="--d:.48s;--dur:1s">
        <div class="label rm-pl">Budget</div>
        <i class="rm-dock a-fade" data-in="1" data-spark="1" data-spark-at="c" data-spark-delay=".28" style="--d:.6s"></i>
        <p class="rm-hero" data-in="1" data-split style="--d:.62s;--wstep:.04s">Low cost by design:<br><em class="hl amb-shimmer">people time, not new software.</em></p>
        <i class="rm-hair a-wipe" data-in="1" style="--d:.86s;--dur:.7s"></i>
        ${budget}
      </div>
    `
  });
})();
