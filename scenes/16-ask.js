/* 16 · The ask — the decision in giant type, set in the dark ceiling band of the
   operations room, then the plan as one quarter: a ring where one revolution is
   one quarter, rolled up from the lane of scene 12. The story light runs it. */
(function () {
  const CX = 960, CY = 610, R = 138;          // the quarter ring, stage px
  const V = 160;                               // SVG box half-size
  // tick marks at the month boundaries, measured clockwise from the start (9 o'clock)
  const pt = (deg, r) => {
    const a = (180 + deg) * Math.PI / 180;
    return [V + r * Math.cos(a), V + r * Math.sin(a)].map((v) => Math.round(v * 10) / 10);
  };
  const ticks = [0, 120, 240].map((d) => {
    const [x1, y1] = pt(d, R - 13), [x2, y2] = pt(d, R + 13);
    return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
  }).join('');
  const months = [60, 180, 300].map((d, i) => {
    const [x, y] = pt(d, R - 42);
    return `<text x="${x}" y="${y}">M${i + 1}</text>`;
  }).join('');

  Deck.scene({
    id: 'ask',
    title: 'The ask',
    act: 4,
    bg: 'night',
    cues: ['Approve the pilot.', 'One quarterly cycle · three commitments', 'What we need · scale, adjust or stop'],
    holds: [6, 12, 10],
    notes: [
      'So here is the ask, in three words: approve the pilot. Pause, and let it sit.',
      'We start with one quarterly cycle and measure what changes. One revolution of this ring is one quarter. At the start we open nominations, so peers and leaders can nominate through a simple form. Along the way we run one full cycle: capture, curate, feature and reinforce, all inside the quarter. Where the loop closes, we report what changed: participation, reach, recognition and repeatable behaviour, on a quarterly dashboard.',
      'What we need from you: an executive sponsor, curation time from HR and Internal Communications, and our existing channels. There is no new platform to buy. After one quarter we come back with one recommendation: scale, adjust or stop. Team, confirm before presenting: this list of needs is our proposal and has not yet been agreed with HR, Internal Communications or a sponsor.',
    ],
    field: [
      { dim: .3, lit: .03, travel: .2, offset: [-60, -200], litFrom: [960, 300], calm: [[100, 110, 1500, 380, .85]] },
      { dim: .22, travel: .1, calm: [[100, 110, 1800, 800, .85]] },
      { calm: [[100, 110, 1800, 960, .85]] },
    ],
    html: `
      <div class="aq-plate amb-ken">
        <div class="photo aq-photo" style="background-image:url('assets/photos/team-ops.jpg')"></div>
        <div class="aq-wall"><i></i></div>
      </div>
      <div class="fill aq-veil"></div>
      <div class="fill aq-shade-1 a-fade" data-in="1" style="--dur:1.2s"></div>
      <div class="fill aq-shade-2 a-fade" data-in="2" style="--dur:1s"></div>

      <div class="kicker aq-kicker a-wipe" data-in="0" style="--d:.2s">The ask</div>
      <h1 class="display aq-title" data-in="0" data-split style="--d:.35s;--wstep:.09s">Approve the pilot.</h1>

      <p class="lead aq-sub" data-in="1">Start with one quarterly cycle and measure what changes.</p>

      <div class="aq-plan">
        <div class="aq-lane a-wipe" data-in="1" style="--d:.05s;--dur:.7s"></div>
        <svg class="aq-ring" viewBox="0 0 ${V * 2} ${V * 2}" style="left:${CX - V}px;top:${CY - V}px" aria-hidden="true">
          <circle class="aq-track" cx="${V}" cy="${V}" r="${R}"/>
          <circle class="aq-prog" cx="${V}" cy="${V}" r="${R}" pathLength="100" transform="rotate(180 ${V} ${V})"/>
          <g class="aq-ticks">${ticks}</g>
          <g class="aq-months">${months}</g>
          <g class="aq-core"><text x="${V}" y="${V - 6}">One</text><text x="${V}" y="${V + 22}">quarter</text></g>
        </svg>
        <div class="aq-orb" style="left:${CX}px;top:${CY}px"><i class="light"></i></div>
        <i class="aq-pin a-pop" data-in="1" style="left:${CX - R}px;top:${CY}px;--d:.15s"></i>
        <i class="aq-pin sm a-pop" data-in="1" style="left:${CX + R}px;top:${CY}px;--d:.7s"></i>
        <i class="aq-lead a-wipe" data-in="1" style="left:${CX + R + 14}px;top:${CY}px;--d:.75s;--dur:.5s"></i>

        <div class="aq-c aq-c1" data-in="1" style="--d:.15s">
          <h3 class="aq-ct">Open nominations</h3>
          <p class="aq-cx">Accept peer and leader nominations through a simple form.</p>
        </div>
        <div class="aq-c aq-c2" data-in="1" style="--d:.7s">
          <h3 class="aq-ct">Run one full cycle</h3>
          <p class="aq-cx"><span class="aq-chain">Capture → Curate → Feature → Reinforce</span> <span class="aq-nb">within the quarter.</span></p>
        </div>
        <div class="aq-c aq-c3" data-in="1" style="--d:1.2s">
          <h3 class="aq-ct">Report what changed</h3>
          <p class="aq-cx">Participation, reach, recognition and repeatable behaviour on a quarterly dashboard.</p>
        </div>
      </div>

      <div class="aq-need" data-in="2">
        <span class="label aq-need-l">What we need</span>
        <p class="aq-need-t">An executive sponsor <b>·</b> Curation time from HR and Internal Communications <b>·</b> Our existing channels — no new platform</p>
      </div>
      <p class="aq-final" data-in="2" data-split style="--d:.45s">After one quarter we come back with one recommendation: <em class="hl">scale, adjust or stop.</em></p>
    `,
  });
})();
