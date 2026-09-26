/* 09e · What could break it (v3) — the risk plan, in one stop. Four glass rows
   slide in one by one; in each, the risk (left) is the hero. As a row lands, its
   guard (right) reaches back along a stem and a light closes a bracket round the
   risk's edge: the guard locks on (the lock node clicks). The owner sits quietly
   at the end of the row. The spark docks in row one.
   Ambient: every 8 s each lock is checked in turn: a light runs from the guard up
   the stem and splits round the bracket (the lock pulses, a glow blooms at the joint),
   then runs on along the row's top and bottom edges to the dock at its left end, which
   glows, while the risk's cell warms from the lock outwards (the guard's hold wraps the
   whole risk). The locks breathe, the spark breathes
   in row one and the field drifts. Nothing moves inside the text. A small caption
   carries the change message.
   One-shot lights (the leading light that closes each bracket, the click ring)
   play only on a live entrance; their resting state is invisible, so a stop reached
   by a jump or by going back shows the same settled frame. */
(function () {
  const ROWS = [
    { risk: 'It becomes a popularity contest or a broadcast', guard: 'Peers nominate; the criteria are published.', owner: 'Curation panel', i: 'team' },
    { risk: 'Nominations dry up after launch', guard: 'Always open; each featured colleague nominates the next.', owner: 'Internal Communications', i: 'person-message' },
    { risk: 'A sensitive story is published', guard: 'Facts checked and consent given before anything is shared.', owner: 'HR, with Legal on request', i: 'handshake' },
    { risk: 'Stories cluster in a few departments', guard: 'Representation tracked from month one.', owner: 'HR / People Analytics', i: 'laptop-analytics' },
  ];
  const TOP = 350, H = 112, GAP = 14;          // rows (stage px)
  const r2 = (v) => Math.round(v * 100) / 100;

  // the lock, in the row's own px: a bracket ] closes round the risk's edge at XB; the
  // guard's stem runs back to it from XG (the SVG box starts at row x SX)
  const SX = 700, XB = 40, XG = 106, MID = H / 2, YT = 22, YB = H - 22, ARM = 18;
  const STEM = `M${XG} ${MID}H${XB}`;
  const ARM_T = `M${XB} ${MID}V${YT}H${XB - ARM}`, ARM_B = `M${XB} ${MID}V${YB}H${XB - ARM}`;
  const RUN_T = `M${XG} ${MID}H${XB}V${YT}H${XB - ARM}`, RUN_B = `M${XG} ${MID}H${XB}V${YB}H${XB - ARM}`;
  const OWN = 1336;                            // the owner column (row px)
  const CHECK0 = 2.6, CHECK_STEP = 2;          // the ambient check (8 s lap in the CSS): its start, row stagger

  const row = (r, i) => {
    const b = .28 + i * .16;                     // this row's build (s after the scene's entrance)
    return `
      <div class="rk-row glass a-left" data-in="0" style="top:${TOP + i * (H + GAP)}px;--d:${r2(b)}s;--dur:.85s;--ck:${r2(CHECK0 + i * CHECK_STEP)}s">
        <i class="rk-cell" style="width:${SX + XB}px"></i><i class="rk-glow"></i>
        <i class="rk-cm t" style="--x0:${SX + XB - ARM - 8}px"></i><i class="rk-cm b" style="--x0:${SX + XB - ARM - 8}px"></i>
        <i class="rk-dock"${i === 0 ? ' data-spark="0" data-spark-at="c" data-spark-delay=".45"' : ''}></i>
        <p class="rk-risk">${r.risk}</p>
        <div class="rk-lk" style="left:${SX}px">
          <svg viewBox="0 0 150 ${H}" aria-hidden="true">
            <path class="rk-stem" d="${STEM}" pathLength="100"/>
            <path class="rk-arm" d="${ARM_T}" pathLength="100"/>
            <path class="rk-arm" d="${ARM_B}" pathLength="100"/>
          </svg>
          <i class="rk-lead" style="offset-path:path('${RUN_T}')"><b class="light sm"></b></i>
          <i class="rk-lead" style="offset-path:path('${RUN_B}')"><b class="light sm"></b></i>
          <i class="rk-chk" style="offset-path:path('${RUN_T}')"></i>
          <i class="rk-chk" style="offset-path:path('${RUN_B}')"></i>
          <i class="rk-anchor" style="left:${XG}px;top:${MID}px"></i>
          <i class="rk-node" style="left:${XB}px;top:${MID}px"><b></b></i>
        </div>
        <p class="rk-guard a-right" data-in="0" style="left:${SX + XG + 28}px;--d:${r2(b + .16)}s;--dur:.7s">${r.guard}</p>
        <div class="rk-owner a-fade" data-in="0" style="left:${OWN}px;--d:${r2(b + .34)}s;--dur:.7s">
          <span class="rk-oi">${Deck.icon(r.i)}</span><span>${r.owner}</span>
        </div>
      </div>`;
  };

  Deck.scene({
    id: 'risks',
    title: 'What could break it',
    act: 4,
    bg: 'deep',
    transition: 'push',
    cues: ['Four risks · the guard built in'],
    holds: [12],
    notes: [
      'What could break it? Four risks, each with a guard already in the design and an owner. And the change stays small, because it runs on meetings and channels people already use. [Team: confirm owners.]',
    ],
    field: [
      { dim: .34, lit: .03, travel: .4, offset: [140, 180], warm: .2, litFrom: [1500, 220], links: .5, wave: .6, streaks: .18, sparkle: 1.6, drift: 1,
        calm: [[100, 120, 1400, 290, .8], [110, 300, 1810, 850, .9], [110, 855, 1000, 945, .8]] },
    ],
    html: `
      <i class="rk-mood"></i>
      <div class="kicker rk-kick a-wipe" data-in="0" style="--d:.08s">Risks &amp; change</div>
      <h2 class="h2 rk-h" data-in="0" data-split style="--d:.12s">What could break it, and <em class="hl">the guard built in.</em></h2>

      <div class="rk-cols a-fade" data-in="0" style="--d:.3s">
        <span class="label" style="left:226px">Risk</span>
        <span class="label" style="left:${144 + SX + XG + 28}px">Guard</span>
        <span class="label" style="left:${144 + OWN}px">Owner</span>
      </div>
      ${ROWS.map(row).join('')}

      <p class="rk-cap a-fade" data-in="0" style="--d:1.3s;--dur:.9s">
        <span class="rk-ci">${Deck.icon('hands-teamwork')}</span><span><b>Change stays small:</b> it runs on meetings and channels people already use.</span>
      </p>
    `,
    step(n, prev, ctx) {
      // the leading lights and the click rings play only on a live entrance
      const el = ctx.el;
      el.classList.remove('rk-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('rk-live');
    },
  });
})();
