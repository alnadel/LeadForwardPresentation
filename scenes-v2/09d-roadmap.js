/* 09d · From one quarter to a habit (v3) — act V opens on the plan. The chapter
   card's line of light does not go away: the scene opens on exactly that line
   (stage y 540), which becomes the roadmap's timeline.
   Stop 0: four milestones on the glowing timeline, 2026 → 2030. The pilot is the
   hero (its year lit, its card in live glass, the spark docks in its node); the
   later stages get quieter step by step, and the line turns to a dashed horizon
   after 2028. Ambient: a story light leaves the pilot and travels the timeline,
   pausing at each milestone (its node pings and its card's top edge lights), then
   dissolves past 2030; sparks rise off the line; a horizon glow breathes behind
   the pilot; the live edge circles the pilot card.
   Stop 1: "Who runs it, and what it costs." The years and cards fold away and the
   timeline rises into a slim rail under the headline (the story keeps travelling
   it), with two glass panels below: Owners (a light walks down the owners' spine,
   lighting each role's icon) and Budget, whose hero line takes the spark.
   Audience first: stop 0, the four stage names and years (Pilot brightest);
   descriptions are support. Stop 1, the budget hero line, then the five roles;
   their duties and the three budget lines are support.
   All state is keyed off .st-n, so back navigation lands on the same frame. */
(function () {
  const Y = 540;               // the timeline: the chapter card's centre line
  const UP = 222;              // stop 1: the timeline rises to a rail at y 318 (keep in step with the CSS)
  const CARD_Y = 600, CARD_H = 246;           // the milestone cards hang below the line
  const MS = [
    { when: 'Q4 2026', stage: 'Pilot', what: 'One quarterly cycle, open to everyone. <b>Decide: scale, adjust or stop.</b>', x: 144, w: 480 },
    { when: '2027', stage: 'Scale', what: 'Every department, a story champion in each, video and town-hall spotlights.', x: 660, w: 348 },
    { when: '2028', stage: 'Embed', what: 'Part of onboarding and leadership development; the first annual story collection.', x: 1044, w: 348 },
    { when: '2030', stage: 'Habit', what: 'Self-running: stories are how Tahakom shares what works.', x: 1428, w: 348 },
  ];
  const NX = MS.map((m) => m.x + 46);          // node centres on the timeline
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

  const OWNERS = [
    { r: 'Executive sponsor', d: 'Direction and the quarterly decision', i: 'user-network' },
    { r: 'Curation panel', d: 'HR, Internal Communications and one rotating employee, choosing monthly', i: 'team' },
    { r: 'Internal Communications', d: 'Channels and calendar', i: 'person-message' },
    { r: 'HR / People Analytics', d: 'The dashboard', i: 'laptop-analytics' },
    { r: 'Story champions', d: 'From 2027', i: 'users-connected' },
  ];
  const BUDGET = [
    { k: 'No new platform:', t: 'email, intranet and town halls already exist.', i: 'content-layout' },
    { k: 'People time:', t: 'the curation panel, about two hours a week.', i: 'gear-clock' },
    { k: 'A small recognition budget:', t: 'certificates and the annual event.', i: 'document-certified' },
  ];
  // the owners' spine: a light walks down the five roles (keep in step with rmWalk)
  const OY = [0, 82, 192, 274, 356];           // row tops in the list (the curation row has two lines)
  const OWN_LAP = 7.5, OWN_FIRST = 1.4, OF = [.02, .2, .38, .56, .74];

  /* ── stop 0 · the timeline ── */
  const nodes = MS.map((m, i) => `
      <i class="rm-node n${i} a-materialize" data-in="0" style="left:${NX[i]}px;--d:${r2(.18 + i * .1)}s;--pt:${ping(i)}s"${i === 0 ? ` data-spark="0" data-spark-xy="${NX[0]},${Y}" data-spark-delay=".2"` : ''}><b></b></i>`).join('');
  const years = MS.map((m, i) => `
      <div class="rm-year y${i}" data-in="0" style="left:${m.x + 28}px;--d:${r2(.3 + i * .09)}s">${m.when}</div>`).join('');
  const stems = MS.map((m, i) => `
      <i class="rm-stem s${i} a-wipe-down" data-in="0" style="left:${NX[i] - 1}px;top:${Y + (i ? 12 : 20)}px;height:${CARD_Y - Y - (i ? 12 : 20)}px;--d:${r2(.42 + i * .09)}s;--dur:.5s"></i>`).join('');
  const cards = MS.map((m, i) => `
      <div class="rm-card c${i} glass${i === 0 ? ' live' : ''} a-unfold" data-in="0" style="left:${m.x}px;top:${CARD_Y}px;width:${m.w}px;height:${CARD_H}px;--d:${r2(.46 + i * .09)}s;--dur:1s;--pt:${ping(i)}s">
        <i class="rm-wash"></i><i class="rm-cap"></i>
        <h3 class="rm-stage">${m.stage}</h3>
        <p class="rm-what">${m.what}</p>
      </div>`).join('');
  // stop 1: the rail's quiet labels, to the right of each node
  const tags = MS.map((m, i) => `
      <span class="rm-tag t${i} a-fade" data-in="1" style="left:${NX[i] + (i ? 20 : 30)}px;--d:${r2(.72 + i * .06)}s;--dur:.6s">${m.when}<em>·</em>${m.stage}</span>`).join('');
  // sparks rising off the line (between the headline and the years)
  const dust = Array.from({ length: 30 }, (_, i) => `<i style="left:${120 + (i * 263) % 1640}px;top:${Y - 8 - (i * 37) % 50}px;--t:${8 + (i % 5) * 1.7}s;--dl:${-r2(i * .93)}s;--dx:${50 + (i * 29) % 110}px;--dy:${-140 - (i * 41) % 170}px"></i>`).join('');

  /* ── stop 1 · owners and budget ── */
  const owners = OWNERS.map((o, i) => `
        <div class="rm-own" data-in="1" style="top:${OY[i]}px;--ot:${r2(OWN_FIRST + OF[i] * OWN_LAP)}s">
          <i class="rm-oband"></i>
          <span class="rm-oi">${Deck.icon(o.i)}</span>
          <b class="rm-role">${o.r}</b>
          <p class="rm-duty">${o.d}</p>
        </div>`).join('');
  const budget = BUDGET.map((b, i) => `
        <div class="rm-bl" data-in="1" style="top:${258 + i * 86}px;--d:${r2(.92 + i * .1)}s;--bt:${r2(2.2 + i * 2.5)}s">
          <span class="rm-bi">${Deck.icon(b.i)}</span>
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
      { dim: .34, lit: .04, travel: .3, offset: [-200, 60], litFrom: [NX[0], Y], warm: .1, links: .5, wave: .55, streaks: .14, sparkle: 1.2, drift: 1,
        calm: [[100, 120, 1500, 290, .8], [110, 420, 1820, 520, .6], [110, 590, 1820, 880, .88]] },
      { dim: .3, travel: .2, links: .4, wave: .45, sparkle: 1,
        calm: [[100, 120, 1500, 330, .8], [110, 340, 1820, 900, .9]] },
    ],
    html: `
      <style>${runKeys}</style>
      <i class="rm-sun"></i>
      <div class="amb-dust rm-dust a-fade" data-in="0" data-out="1" style="--d:1s;--dur:1.4s">${dust}</div>

      <div class="kicker rm-kick a-wipe" data-in="0" style="--d:.1s">Roadmap</div>
      <h2 class="h2 rm-h" data-in="0" data-out="1" data-split style="--d:.16s">From one quarter to a habit.</h2>
      <h2 class="h2 rm-h" data-in="1" data-split style="--d:.18s">Who runs it, and what it costs.</h2>

      <!-- stop 0 · years above the line, cards below (they fold away at stop 1) -->
      <div class="rm-s0" data-out="1">
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
        <i class="rm-dock a-fade" data-in="1" data-spark="1" data-spark-at="c" data-spark-delay=".7" style="--d:.6s"></i>
        <p class="rm-hero" data-in="1" data-split style="--d:.62s;--wstep:.04s">Low cost by design:<br><em class="hl amb-shimmer">people time, not new software.</em></p>
        <i class="rm-hair a-wipe" data-in="1" style="--d:.86s;--dur:.7s"></i>
        ${budget}
      </div>
    `
  });
})();
