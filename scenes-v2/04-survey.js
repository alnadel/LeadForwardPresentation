/* 04 · Survey (v2) — 158 respondents, one square each; each figure relights the
   waffle to its share. Condensed to four stops: 158 · 56% · 8% · 80% (+49%). */
(function () {
  const ROWS = 10, N = 158; // 16 columns × 10 rows, filled column by column
  const METRICS = [
    null,
    { v: 56, tone: 'gap', label: 'Visibility gap', text: 'Rarely or never hear about another department’s achievement.' },
    { v: 8, tone: 'hero', label: 'Recognition reach', text: 'Say praise for a colleague reaches the whole organisation.' },
    { v: 80, tone: 'go', label: 'Connection', text: 'Say colleagues’ stories would strengthen connection to Tahakom.' },
  ];

  let cells = '';
  for (let i = 0; i < N; i++) {
    const c = Math.floor(i / ROWS), r = i % ROWS;
    cells += `<i style="--c:${c};--r:${r};--rd:${((i * 53) % 97) / 97}"></i>`;
  }
  const panel = (m, k, last) => `
    <div class="sv-metric" data-in="${k}" ${last ? '' : `data-out="${k + 1}"`}>
      <div class="sv-big num ${m.tone}" data-spark="${k}" data-spark-at="tl"><span data-count="${m.v}" data-dur="1.1">0</span><small>%</small></div>
      <div class="label sv-lab ${m.tone}">${m.label}</div>
      <p class="body sv-txt">${m.text}</p>
    </div>`;

  Deck.scene({
    id: 'survey',
    title: 'What colleagues told us',
    act: 1,
    bg: 'navy',
    transition: 'push',
    cues: ['158 colleagues responded', '56% · visibility gap', '8% · recognition reach', '80% connection · 49% learning · the punchline'],
    notes: [
      'We asked before we designed: 158 colleagues answered an anonymous eight-question survey. Each square is one of them.',
      'More than half rarely or never hear about another department’s achievement.',
      'The number to remember: only 8% say praise for a colleague reaches the whole organisation — thirteen people out of 158.',
      'Yet the appetite is there: 80% say these stories would strengthen their connection to Tahakom, and 49% say a colleague’s story gives them an approach they can use. The work exists. The visibility channel does not. (Also heard: email preferred 123/158; 47% want a monthly rhythm; 32% anonymous nomination; 49% want to approve their story.)',
    ],
    field: [
      { dim: .3, lit: 0, travel: .4, offset: [-140, 60], links: .5, wave: .7, streaks: .1, calm: [[80, 100, 900, 1000, .85], [900, 170, 1820, 830, .75]] },
      {}, { wave: .3, sparkle: .6 }, { wave: .8, travel: .8, sparkle: 1.4 },
    ],
    html: `
      <div class="pad sv-left">
        <div class="kicker" data-in="0">Employee feedback</div>
        <h2 class="h2 sv-h" data-in="0" data-split style="--d:.15s">Employee feedback<br>validates the opportunity.</h2>
      </div>

      <div class="sv-stage">
        <div class="sv-metric sv-count" data-in="0" data-out="1" style="--d:.45s">
          <div class="sv-big num" data-spark="0" data-spark-at="tl"><span data-count="158" data-dur="1.8" data-delay=".3">0</span></div>
          <div class="label teal">Colleagues responded</div>
          <p class="body sv-txt">An anonymous, eight-question survey.</p>
        </div>
        ${[1, 2, 3].map((k) => panel(METRICS[k], k, k === 3)).join('')}
        <div class="sv-second" data-in="3" style="--d:.7s">
          <b class="num teal"><span data-count="49" data-dur="1" data-delay=".7">0</span>%</b>
          <span>practical learning · <em>a colleague’s story gives them an approach they can use</em></span>
        </div>
      </div>

      <div class="sv-waffle" data-in="0" style="--d:.25s;--rows:${ROWS}">${cells}<div class="sv-sweep"></div></div>
      <div class="sv-legend" data-in="1" data-out="3">
        <span class="sv-key"><i class="k-lit"></i><span class="sv-key-t"></span></span>
        <span class="sv-key"><i></i>Other respondents</span>
      </div>
      <p class="sv-punch" data-in="3" data-split style="--d:1.05s">The work exists. <em class="hl">The visibility channel does not.</em></p>
    `,
    init(ctx) { ctx.cells = ctx.$$('.sv-waffle i'); },
    step(n, prev, ctx) {
      const m = METRICS[n];
      const w = ctx.$('.sv-waffle');
      w.classList.toggle('built', n >= 0);
      ['gap', 'go', 'hero'].forEach((t) => w.classList.toggle('tone-' + t, !!m && m.tone === t));
      const lit = m ? Math.round(N * m.v / 100) : 0;
      ctx.cells.forEach((c, i) => c.classList.toggle('lit', i < lit));
      if (m) ctx.$('.sv-key-t').textContent = lit + ' of 158 · ' + m.label.toLowerCase();
      // a burst of light rolls across the waffle as it relights
      if (n >= 1 && !ctx.instant) { w.classList.remove('roll'); void w.offsetWidth; w.classList.add('roll'); }
    },
  });
})();
