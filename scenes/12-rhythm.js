/* 12 · Operating rhythm — the cycle ring from 09, unrolled into one quarter.
   Nominations arrive all the time along the top lane; below it, one governance
   cycle runs month by month while a playhead sweeps the quarter. */
(function () {
  const MONTHS = [
    { n: '02', m: 'Month 1', k: 'Curate', t: 'Review relevance, evidence, consent and value alignment.' },
    { n: '03', m: 'Month 2', k: 'Feature', t: 'Prepare and publish selected stories; encourage team discussion.' },
    { n: '04', m: 'Month 3', k: 'Reinforce', t: 'Recognise contributors, capture learning and review trends.' },
  ];
  // nominations drifting into the lane: start x (stage px), one every 3 s on an 18 s loop
  const DROPS = [1250, 1420, 1310, 1500, 1200, 1370];
  const TRAY_X = 1690;

  const drops = DROPS.map((x, k) => `<span class="rh-drop" style="--x0:${x - 144}px;--xt:${TRAY_X - 144}px;--dl:${-k * 3}s"><span><i class="light sm"></i></span></span>`).join('');
  const weeks = Array.from({ length: 12 }, (_, k) => `<i style="left:${((k + 1) / 13 * 100).toFixed(3)}%"></i>`).join('');

  const months = MONTHS.map((m, k) => `
    <div class="rh-m" data-in="1" style="--k:${k}">
      <span class="node rh-node">${m.n}</span>
      <div class="rh-m-lab">${m.m}<b>·</b><em>${m.k}</em></div>
      <p class="rh-m-t">${m.t}</p>
    </div>`).join('');

  Deck.scene({
    id: 'rhythm',
    title: 'Operating rhythm',
    act: 3,
    bg: 'navy',
    cues: ['Always open · capture', 'The quarter · curate, feature, reinforce', 'Every quarter · annual collection'],
    notes: [
      'How does it run week to week? Two tempos. Nominations never close: any peer or leader can nominate a colleague through a simple form, on any day of the quarter. Around that, one clear governance cycle runs each quarter.',
      'Month one, we curate: we review relevance, evidence, consent and value alignment. Month two, we feature: we prepare and publish the selected stories and encourage teams to discuss them. Month three, we reinforce: we recognise the contributors, capture the learning and review the trends.',
      'These are the same four stages you saw in the ring: capture, curate, feature, reinforce. They run every quarter. At the end of the year, the featured stories become one curated story collection.',
    ],
    field: [
      { dim: .36, lit: .02, travel: .14, offset: [-200, 70], litFrom: null, warm: 0, calm: [[80, 120, 1300, 360, .8], [100, 370, 1800, 520, .6]] },
      { dim: .24, calm: [[80, 120, 1300, 360, .8], [100, 370, 1800, 520, .6], [80, 540, 1840, 940, .85]] },
      { lit: .04 },
    ],
    html: `
      <div class="pad">
        <div class="kicker" data-in="0">Quarterly rhythm</div>
        <h2 class="h2 rh-h" data-in="0" data-split style="--d:.1s">The operating cycle keeps stories moving.</h2>
        <p class="rh-sub" data-in="0" style="--d:.45s">Nominations stay open; one clear governance cycle runs each quarter.</p>
      </div>

      <div class="rh-lanewrap"><div class="rh-lane" data-in="0" style="--d:.7s">
        <div class="rh-drops">${drops}</div>
        <span class="node on rh-lane-n">01</span>
        <div class="rh-lane-t">
          <div class="rh-lane-lab">Always open<b>·</b>Capture</div>
          <p class="rh-lane-s">Accept peer and leader nominations through a simple form.</p>
        </div>
        <span class="rh-track"></span>
        <span class="rh-tray">${Deck.icon('person-message')}</span>
      </div></div>

      <div class="rh-q">
        <div class="rh-q-lab a-fade" data-in="1" style="--d:.35s">One quarter</div>
        <div class="rh-axis a-wipe" data-in="1" style="--d:.35s;--dur:1.2s"><span class="rh-weeks">${weeks}</span></div>
        <div class="rh-months" data-stagger style="--stagger:.16s;--d:.5s">${months}</div>
        <div class="rh-play a-fade" data-in="1" style="--d:1.2s"><span class="rh-play-x"><i class="light"></i></span></div>
      </div>

      <div class="rh-strip">
        <p class="rh-cycle" data-in="2" data-split style="--d:.1s">Capture <em>→</em> Curate <em>→</em> Feature <em>→</em> Reinforce<span class="rh-every">, every quarter</span></p>
        <span class="rh-link a-wipe" data-in="2" style="--d:.5s;--dur:.9s"></span>
        <div class="rh-annual a-right" data-in="2" style="--d:.8s">
          <span class="rh-coll"><i></i><i></i><i></i><i></i></span>
          <div><div class="rh-an-lab">Annual</div><p class="rh-an-t">Curated story collection</p></div>
        </div>
      </div>
    `,
  });
})();
