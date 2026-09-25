/* 11 · The story format — the featured story card from 10 turns over. Its back
   holds four fields, each named by a callout with a leader line. Nouf's answers
   write into the fields; then the design decision behind each field appears.
   Ambient: the story light walks down the four fields. */
(function () {
  // stage y of each field row (top of the label line); the card slots align to these
  const ROWS = [470, 576, 682, 788];
  const CARD_Y = 180;
  const FIELDS = [
    { k: 'Purpose', q: 'What did this contribution enable?', a: 'The day shift starts on live incidents from minute one.', c: 'Each selected story explains why the contribution mattered.' },
    { k: 'Value', q: 'Which Tahakom value was demonstrated?', a: 'Excellence — a recurring gap, fixed without being asked.', c: 'Linked to one primary value and one observable behaviour.' },
    { k: 'Impact', q: 'What changed because of the behaviour?', a: 'The morning no longer starts by rebuilding the night.' },
    { k: 'Repeat', q: 'What can other employees do?', a: 'Write the one page you wish you had been handed.', c: 'Shared across departments with one practical takeaway.' },
  ];
  const nn = (i) => String(i + 1).padStart(2, '0');

  const callouts = FIELDS.map((f, i) => `
    <div class="fm-f" style="top:${ROWS[i]}px;--k:${i}">
      <div class="fm-row">
        <span class="fm-key a-fade" data-in="0" style="--d:1.05s">${nn(i)}<b>${f.k}</b></span>
        <p class="fm-q" data-in="0" style="--d:1.1s">${f.q}</p>
        <span class="fm-lead a-wipe" data-in="0" style="--d:1.2s;--dur:.9s"><i></i></span>
      </div>
      ${f.c ? `<p class="fm-cap" data-in="2" style="--d:.55s">${f.c}</p>` : ''}
    </div>`).join('');

  const slots = FIELDS.map((f, i) => `
    <div class="fm-slot" style="top:${ROWS[i] - CARD_Y}px;--k:${i}">
      <span class="fm-chip">${nn(i)}</span>
      <span class="fm-blank a-fade" data-out="1"><i></i><i></i></span>
      <p class="fm-ans a-wipe" data-in="1" style="--d:${(0.15 + i * 0.22).toFixed(2)}s;--dur:1s">${f.a}</p>
    </div>`).join('');

  const react = ['handshake', 'eye-lightbulb', 'hands-teamwork'].map((n) => `<span class="fm-re">${Deck.icon(n)}</span>`).join('');

  Deck.scene({
    id: 'format',
    title: 'The story format',
    act: 3,
    bg: 'night',
    tag: 'illustrative',
    tagFrom: 1,
    cues: ['The card turns over · four fields', 'Nouf’s answers fill the fields (skippable)', 'The principle · design decisions'],
    notes: [
      'This is the same story card, turned over. Every featured story is built on four fields: purpose, value, impact, and one thing others can repeat. The alignment with our strategy is built into the format. We do not add it after a story is selected.',
      'Still the illustrative story. Nouf’s answers fill the fields. Purpose: the day shift starts on live incidents from minute one. Value: Excellence, a recurring gap fixed without being asked. Impact: the morning no longer starts by rebuilding the night. Repeat: write the one page you wish you had been handed.',
      'So the rule is simple. A selected story must show purpose, value, impact, and one action others can repeat. Each field is a design decision: why it mattered, one value and one behaviour you can see, and one practical takeaway shared across departments. Employees nominate; leaders validate and reinforce the learning. And every story carries the same signature: Inspired by You.',
    ],
    field: [
      { dim: .26, lit: .03, travel: .1, offset: [170, -80], litFrom: null, warm: 0, calm: [[80, 120, 1180, 900, .85], [1190, 150, 1800, 960, .9]] },
      { dim: .28 },
      { lit: .05, travel: .16 },
    ],
    html: `
      <div class="fm-top">
        <div class="kicker" data-in="0">Story principle</div>
        <div class="fm-hd">
          <h2 class="h2 fm-h" data-in="0" data-out="2" data-split style="--d:.1s">Every story turns strategy into repeatable behaviour.</h2>
          <p class="fm-sub" data-in="0" data-out="2" style="--d:.5s">The alignment is built into the story format — not added after selection.</p>
        </div>
        <div class="fm-hd">
          <p class="fm-rule" data-in="2" data-split style="--d:.3s">A selected story must show purpose, value, impact and one action others can repeat.</p>
          <p class="fm-nom" data-in="2" style="--d:.8s"><span class="fm-nom-k">Nomination</span>Employees nominate; leaders validate and reinforce the learning.</p>
        </div>
      </div>

      <div class="fm-card">
        <div class="fm-flip">
          <div class="fm-face fm-front paper">
            <div class="fm-ph" style="background-image:url('assets/photos/nouf.jpg')"></div>
            <div class="fm-fr">
              <div class="fm-fr-lab">Behind a Better Life · Story 07<br>Traffic Operations Centre</div>
              <div class="fm-fr-t">She rebuilt the night handover in one afternoon.</div>
              <div class="fm-fr-re">${react}</div>
            </div>
          </div>
          <div class="fm-face fm-back">
            <i class="fm-band"></i>
            <div class="fm-bk-lab">Behind a Better Life · Story 07</div>
            <div class="fm-bk-t">She rebuilt the night handover in one afternoon.</div>
            <div class="fm-bk-div"><span>Story format</span></div>
            ${slots}
            <div class="fm-sig" data-in="2" style="--d:1.1s"><span>Inspired by You</span></div>
          </div>
        </div>
        <div class="fm-walk a-fade" data-in="0" style="--d:1.7s"><i class="light"></i></div>
      </div>

      <div class="fm-fields" data-stagger style="--stagger:.12s">${callouts}</div>
    `,
  });
})();
