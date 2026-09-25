/* 14 · Measure — a measurement lane with four sensor gantries, the kind this
   audience runs every day. The story light drives the lane and each gantry's
   readout blinks BASELINE as it passes: we are measuring the starting point,
   so the readouts never show a number. All motion is CSS, keyed off .st-1, so
   back navigation lands on exactly the same frame. */
(function () {
  // gantry centres on the stage; the lane runs the full width of the frame
  const GANTRIES = [
    { x: 348, label: 'Participation', text: 'Nominations, completion rate and representation across groups.' },
    { x: 756, label: 'Reach', text: 'Story views, completion, shares and channel reach.' },
    { x: 1164, label: 'Recognition', text: 'Employees featured, perceived fairness and feeling valued.' },
    { x: 1572, label: 'Repeatable behaviour', text: 'Story recall, intention to repeat and reported action.' },
  ];
  // the light's path: x from -60 to 1980. First pass is quick (the build),
  // then it cycles slowly (about 10 s a pass) while the presenter talks.
  const X0 = -60, X1 = 1980;
  const FIRST_AT = 0.45, FIRST = 1, SLOW = 10;   // keep in step with .ms-car in the CSS
  const frac = (x) => (x - X0) / (X1 - X0);
  const r2 = (v) => Math.round(v * 100) / 100;

  // a truss crossbar, the lattice every overhead gantry carries
  let truss = 'M8 20H252M8 40H252';
  for (let x = 8; x < 252; x += 16) truss += `M${x} 40L${x + 8} 20L${x + 16} 40`;

  const gantry = (g, i) => {
    const f = frac(g.x);
    const tf = r2(FIRST_AT + f * FIRST);          // first pass arrival
    const ts = r2(FIRST_AT + FIRST + f * SLOW);   // slow pass arrival
    return `
    <div class="ms-g" data-in="1" style="left:${g.x - 130}px;--d:${r2(0.3 + i * 0.06)}s;--tf:${tf}s;--ts:${ts}s">
      <svg class="ms-frame" viewBox="0 0 260 144" aria-hidden="true">
        <rect x="14" y="40" width="7" height="100" rx="2"/><rect x="239" y="40" width="7" height="100" rx="2"/>
        <rect x="8" y="138" width="19" height="4" rx="1"/><rect x="233" y="138" width="19" height="4" rx="1"/>
        <path class="ms-truss" d="${truss}"/>
        <rect class="ms-head" x="117" y="58" width="26" height="14" rx="3"/>
      </svg>
      <i class="ms-lens"></i>
      <div class="ms-vms"><span>Baseline</span></div>
      <div class="ms-beam"></div>
      <div class="ms-foot"></div>
    </div>`;
  };

  const col = (g, i) => `
    <div class="ms-col" data-in="1" style="left:${g.x - 190}px;--d:${r2(FIRST_AT + frac(g.x) * FIRST - 0.05)}s">
      <div class="label ms-lab">${g.label}</div>
      <p class="ms-txt">${g.text}</p>
    </div>`;

  Deck.scene({
    id: 'measure',
    title: 'Measure',
    act: 4,
    bg: 'navy',
    cues: ['Measure whether visibility becomes behaviour', 'Four gantries · baseline', 'Baseline → after one quarter'],
    holds: [6, 9, 8],
    notes: [
      'A pilot is only worth approving if it can prove something. So we measure one thing: whether visibility becomes behaviour. That means participation, reach, recognition and repeatable learning.',
      'Think of it as a measurement lane, like the sensor gantries on our own roads. Each story passes four gantries. Participation: nominations, completion and whether every group is represented. Reach: views, completion, shares and channel reach. Recognition: who is featured, whether it feels fair, whether people feel valued. Repeatable behaviour: do people remember the story, intend to repeat it, and report acting on it. For now every readout says baseline: the pilot has not started, so there is nothing to report yet, and we will not put a number on it before there is one.',
      'We already have a baseline. Recognition reach is 8% today, and the visibility gap is 56%. At the end of the quarter we re-ask the same eight questions and compare. The results go on a quarterly dashboard, we review the trend, and we use it to improve the design.',
    ],
    field: [
      { dim: .5, lit: .07, travel: 1, offset: [-200, -90], litFrom: [960, 820], calm: [[100, 370, 1800, 610, .8]] },
      { dim: .26, lit: .04, travel: .15, calm: [[100, 110, 1800, 360, .8], [80, 380, 1840, 800, .75]] },
      { calm: [[100, 110, 1800, 360, .8], [80, 380, 1840, 960, .8]] },
    ],
    html: `
      <div class="pad ms-head">
        <div class="kicker" data-in="0">Pilot outcome</div>
        <h2 class="h2 ms-h" data-in="0" data-split style="--d:.15s">Measure whether visibility becomes behaviour.</h2>
        <p class="lead ms-sub" data-in="0" style="--d:.7s">The pilot should prove participation, reach, recognition and repeatable learning.</p>
      </div>

      <div class="ms-lane a-wipe" data-in="1" style="--d:.25s;--dur:.9s">
        <i class="ms-edge t"></i><i class="ms-edge b"></i>
        <svg class="ms-dash" viewBox="0 0 1920 4" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="2" x2="1920" y2="2"/></svg>
      </div>
      ${GANTRIES.map(gantry).join('')}
      <div class="ms-car" aria-hidden="true"><b class="ms-tail"></b><i class="light lg"></i></div>
      ${GANTRIES.map(col).join('')}

      <div class="ms-strip" data-in="2">
        <div class="ms-strip-rule a-wipe" data-in="2" style="--dur:1s"></div>
        <div class="label ms-strip-l" data-in="2" style="--d:.1s">Baseline <span class="ms-arr">→</span> After one quarter</div>
        <p class="ms-strip-t" data-in="2" style="--d:.25s">Recognition reach <b>8%</b> today · Visibility gap <b>56%</b> today <span class="ms-arr">→</span> the same eight questions, re-asked at quarter end.</p>
        <p class="ms-strip-b" data-in="2" style="--d:.5s">Quarterly dashboard <span>·</span> trend review <span>·</span> design improvements</p>
      </div>
    `,
  });
})();
