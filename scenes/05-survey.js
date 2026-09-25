/* 05 · Survey — 158 respondents, one square each. Every figure relights the
   waffle to its share, so the room sees the proportion, not just the number. */
(function () {
  const COLS = 18, ROWS = 9, N = 158;
  const METRICS = [
    null,
    { v: 56, tone: 'gap', label: 'Visibility gap', text: 'Rarely or never hear about another department’s achievement.' },
    { v: 8, tone: 'hero', label: 'Recognition reach', text: 'Say praise for a colleague reaches the whole organisation.' },
    { v: 49, tone: 'go', label: 'Practical learning', text: 'Say a colleague’s story gives them an approach they can use.' },
    { v: 80, tone: 'go', label: 'Connection', text: 'Say colleagues’ stories would strengthen connection to Tahakom.' },
  ];

  let cells = '';
  for (let i = 0; i < N; i++) {
    const c = Math.floor(i / ROWS), r = i % ROWS; // fill column by column, so a share reads as width
    cells += `<i style="--c:${c};--r:${r};--rd:${((i * 53) % 97) / 97}"></i>`;
  }

  const panel = (m, k) => `
    <div class="sv-metric" data-in="${k}" data-out="${k + 1}">
      <div class="sv-big num ${m.tone}"><span data-count="${m.v}" data-dur="1.1">0</span><small>%</small></div>
      <div class="label sv-lab ${m.tone}">${m.label}</div>
      <p class="body sv-txt">${m.text}</p>
    </div>`;

  Deck.scene({
    id: 'survey',
    title: 'What colleagues told us',
    act: 1,
    bg: 'navy',
    cues: ['158 colleagues responded', '56% · visibility gap', '8% · recognition reach', '49% · practical learning', '80% · connection', 'The work exists. The visibility channel does not.'],
    notes: [
      'We asked before we designed. 158 colleagues answered an anonymous, eight-question survey. Each square is one of them.',
      'More than half rarely or never hear about another department’s achievement.',
      'This is the number to remember. Only 8% say praise for a colleague reaches the whole organisation — thirteen people out of 158.',
      'But the appetite is there: almost half say a colleague’s story gives them an approach they can use…',
      '…and 80% say these stories would strengthen their connection to Tahakom.',
      'What else we heard: email is the preferred channel (123 of 158), 47% want a monthly rhythm, 32% want anonymous nomination, 49% want to approve their own story. The work exists. The visibility channel does not.',
    ],
    field: [
      { dim: .22, lit: 0, travel: 0, offset: [-120, 40], calm: [[80, 100, 900, 1000, .85]] },
      {}, {}, {}, {},
      { dim: .32 },
    ],
    html: `
      <div class="pad sv-left">
        <div class="kicker" data-in="0">Employee feedback</div>
        <h2 class="h2 sv-h" data-in="0" data-split style="--d:.15s">Employee feedback validates the opportunity.</h2>
      </div>

      <div class="sv-stage">
        <div class="sv-metric sv-count" data-in="0" data-out="1" style="--d:.5s">
          <div class="sv-big num"><span data-count="158" data-dur="2" data-delay=".4">0</span></div>
          <div class="label teal">Colleagues responded</div>
          <p class="body sv-txt">An anonymous, eight-question survey.</p>
        </div>
        ${[1, 2, 3, 4].map((k) => panel(METRICS[k], k)).join('')}

        <div class="sv-sum" data-in="5" data-stagger style="--stagger:.1s">
          ${[1, 2, 3, 4].map((k) => `<div class="sv-sum-i" data-in="5"><b class="num ${METRICS[k].tone}">${METRICS[k].v}%</b><span>${METRICS[k].label}</span></div>`).join('')}
        </div>
      </div>

      <div class="sv-waffle" data-in="0" style="--d:.3s">${cells}</div>
      <div class="sv-legend" data-in="1">
        <span class="sv-key"><i class="k-lit"></i><span class="sv-key-t"></span></span>
        <span class="sv-key"><i></i>Other respondents</span>
      </div>

      <div class="sv-else" data-in="5" style="--d:.5s">
        <div class="label muted">What else we heard</div>
        <div class="sv-chips">
          <span class="chip">Email · 123/158</span><span class="chip">Monthly · 47%</span><span class="chip">Anonymous nomination · 32%</span><span class="chip">Story approval · 49%</span>
        </div>
      </div>
      <p class="sv-punch" data-in="5" data-split style="--d:.9s">The work exists. <em class="hl">The visibility channel does not.</em></p>
    `,
    init(ctx) {
      ctx.cells = ctx.$$('.sv-waffle i');
    },
    step(n, prev, ctx) {
      const m = METRICS[n];
      const w = ctx.$('.sv-waffle');
      w.classList.toggle('built', n >= 0);
      w.classList.toggle('tone-gap', !!m && m.tone === 'gap');
      w.classList.toggle('tone-go', !!m && m.tone === 'go');
      w.classList.toggle('tone-hero', !!m && m.tone === 'hero');
      w.classList.toggle('rest', n >= 5);
      const lit = m ? Math.round(N * m.v / 100) : 0;
      ctx.cells.forEach((c, i) => c.classList.toggle('lit', i < lit));
      if (m) ctx.$('.sv-key-t').textContent = lit + ' of 158 · ' + m.label.toLowerCase();
    },
  });
})();
