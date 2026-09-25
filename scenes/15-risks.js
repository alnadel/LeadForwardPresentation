/* 15 · What could break this — four risks, each set against the guard that is
   already part of the design and the team that would own it. A slow scan light
   reads down the rows while the presenter talks. */
(function () {
  const ROWS = [
    { risk: 'It becomes a popularity contest or a leadership broadcast', mit: 'Peers nominate; Featured Story criteria are published', own: 'Curation panel' },
    { risk: 'Nominations dry up after launch', mit: 'Nominations always open; every featured colleague nominates the next', own: 'Internal Communications' },
    { risk: 'A sensitive or contested story is published', mit: 'Facts checked and the employee’s consent before anything is shared', own: 'HR, with Legal on request' },
    { risk: 'Stories cluster in two departments', mit: 'Representation tracked from month one', own: 'HR / People Analytics' },
  ];

  const row = (r) => `
    <div class="rk-row" data-in="0">
      <p class="rk-risk">${r.risk}</p>
      <div class="rk-mit"><i class="rk-tick"></i><p>${r.mit}</p></div>
      <div class="rk-own"><span>${r.own}</span></div>
    </div>`;

  Deck.scene({
    id: 'risks',
    title: 'What could break this',
    act: 4,
    bg: 'deep',
    cues: ['Four risks · the guard already in the design · an owner', 'Owners to confirm · every mitigation is already in the design'],
    holds: [12, 7],
    notes: [
      'Before you approve anything: what could break this, and what already guards against it. A popularity contest or a leadership broadcast: peers nominate, and the Featured Story criteria are published. Nominations drying up: they stay open, and every featured colleague nominates the next. A sensitive or contested story: facts and consent are checked before anything is shared. Stories clustering in two departments: we track representation from month one. Team, confirm before presenting: these owners are our proposal, not yet agreed with the curation panel, Internal Communications, HR, Legal or People Analytics.',
      'The owners still need confirming with each team before launch. The point: every mitigation here is something you have already seen in the design. (Skippable when time is short.)',
    ],
    field: [
      { dim: .3, lit: .03, travel: .45, offset: [120, 170], warm: .15, litFrom: [1500, 200], calm: [[100, 110, 1820, 960, .7]] },
      { dim: .32 },
    ],
    html: `
      <div class="pad rk-head">
        <div class="kicker" data-in="0">Risks, designed in</div>
        <h2 class="h2 rk-h" data-in="0" data-split style="--d:.15s">What could break this — and what already guards against it.</h2>
      </div>

      <div class="rk-table">
        <div class="rk-cols a-fade" data-in="0" style="--d:.45s">
          <span class="label rk-c-risk">Risk</span>
          <span class="label rk-c-mit">Mitigation already in the design</span>
          <span class="label rk-c-own">Owner</span>
        </div>
        <div class="rk-rows" data-stagger style="--d:.6s;--stagger:.14s">
          ${ROWS.map(row).join('')}
        </div>
        <div class="rk-scan" aria-hidden="true"><i></i></div>
      </div>

      <div class="rk-foot">
        <p class="rk-punch" data-in="1" data-split>Every mitigation is something you have <em class="hl">already seen in the design.</em></p>
        <p class="caption rk-note a-fade" data-in="1" style="--d:.5s">Owners to be confirmed with each team before launch.</p>
      </div>
    `,
  });
})();
