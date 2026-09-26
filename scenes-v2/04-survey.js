/* 04 · Survey (v2) — 158 respondents, one square each; each figure relights the
   waffle to its share. Four stops: 158 · 56% · 8% · 80% (+49%).
   One continuous instrument: the big figure is an odometer whose reels roll from
   the previous figure to the next during each build (never while parked); the
   label and line beneath it cross-fade, the waffle relights column by column and a
   tinted glow pool slides to the lit share. At stop 3 the headline turns into the
   punchline. Every piece of state is keyed off the stop, so back lands on the
   same frame as forward. */
(function () {
  const ROWS = 10, N = 158; // 16 columns × 10 rows, filled column by column
  const METRICS = [
    { v: 158, tone: 'base', label: 'Colleagues responded', text: 'An anonymous, eight-question survey.' },
    { v: 56, tone: 'gap', label: 'Visibility gap', text: 'Rarely or never hear about another department’s achievement.' },
    { v: 8, tone: 'hero', label: 'Recognition reach', text: 'Say praise for a colleague reaches the whole organisation.' },
    { v: 80, tone: 'go', label: 'Connection', text: 'Say colleagues’ stories would strengthen connection to Tahakom.' },
  ];
  const lit = (k) => (k >= 1 ? Math.round(N * METRICS[k].v / 100) : 0); // 88 · 13 · 126
  const CYCLES = 5;                         // reel cycles: one per state (−1 … 3)
  const SPARK = '110,356';                  // the story light rests at the figure's top-left

  let cells = '';
  for (let i = 0; i < N; i++) {
    const c = Math.floor(i / ROWS), r = i % ROWS;
    cells += `<i style="--c:${c};--r:${r};--rd:${((i * 53) % 97) / 97}"></i>`;
  }
  let reel = '';
  for (let k = 0; k < CYCLES * 10; k++) reel += `<b>${k % 10}</b>`;
  const slot = (k) => `<span class="sv-slot" style="--k:${k}"><span class="sv-reel">${reel}</span></span>`;

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
      'Yet the appetite is there: 80% say these stories would strengthen their connection to Tahakom, and 49% say a colleague’s story gives them an approach they can use. The work exists. The visibility channel does not. Their channel preferences shape our communication plan.',
    ],
    field: [
      { dim: .3, lit: 0, travel: .4, offset: [-140, 60], links: .5, wave: .7, streaks: .1, sparkle: 1.1,
        calm: [[90, 120, 1500, 300, .85], [90, 320, 830, 960, .8], [830, 310, 1800, 930, .7]] },
      { wave: .6 },
      { dim: .2, wave: .3, sparkle: .5, links: .35, streaks: .06 },
      { dim: .32, wave: .8, travel: .8, sparkle: 1.4, links: .55, streaks: .12 },
    ],
    html: `
      <div class="pad sv-head">
        <div class="kicker" data-in="0">Current state · primary data</div>
        <div class="sv-swap">
          <h2 class="h2 sv-h" data-in="0" data-out="3" data-split style="--d:.1s">Employee feedback validates the opportunity.</h2>
          <h2 class="h2 sv-punch" data-in="3" data-split style="--d:.45s;--wstep:.05s">The work exists. <em class="hl">The visibility channel does not.</em></h2>
        </div>
      </div>

      <!-- the instrument: one figure that rolls from stop to stop -->
      <div class="sv-inst" data-in="0" style="--d:.2s">
        <i class="sv-inst-glow"></i>
        <div class="sv-odo">${slot(0)}${slot(1)}${slot(2)}<span class="sv-pct">%</span></div>
        <div class="sv-reads">
          ${METRICS.map((m, k) => `
          <div class="sv-say ${m.tone}" data-in="${k}" ${k < 3 ? `data-out="${k + 1}"` : ''} style="--d:${k ? .32 : .5}s">
            <div class="label sv-lab">${m.label}</div>
            <p class="body sv-txt">${m.text}</p>
          </div>`).join('')}
        </div>
      </div>
      ${[0, 1, 2, 3].map((k) => `<i class="sv-mark" data-spark="${k}" data-spark-xy="${SPARK}"${k ? '' : ' data-spark-delay=".3"'}></i>`).join('')}

      <!-- the key (stops 1–2), then the second figure (stop 3), in one slot -->
      <!-- support: a small caption-weight key (the figure and its label lead) -->
      <div class="sv-legend" data-in="1" data-out="3" style="--d:.55s">
        <span class="sv-key"><i class="k-lit"></i><span class="sv-kt">${[1, 2].map((k) => `<b data-at="${k}">${lit(k)} of 158 · ${METRICS[k].label.toLowerCase()}</b>`).join('')}</span></span>
        <span class="sv-key"><i class="k-off"></i>Other respondents</span>
      </div>
      <!-- the second figure: secondary to the 80% (smaller, quieter) -->
      <div class="sv-second glass amb-sheen" data-in="3" style="--d:.7s">
        <b class="num sv-49"><span data-count="49" data-dur=".9" data-delay=".75">0</span><small>%</small></b>
        <div class="sv-49t">
          <div class="label teal">Practical learning</div>
          <p>A colleague’s story gives them an approach they can use.</p>
        </div>
      </div>

      <i class="sv-wpool"></i>
      <div class="sv-waffle" data-in="0" style="--d:.25s;--rows:${ROWS}">
        ${cells}
        <div class="sv-sweep"></div>
      </div>
    `,
    init(ctx) {
      ctx.cells = ctx.$$('.sv-waffle i');
      ctx.slots = ctx.$$('.sv-slot');
    },
    step(n, prev, ctx) {
      const el = ctx.el, m = n >= 0 ? METRICS[n] : null;
      const w = ctx.$('.sv-waffle');
      w.classList.toggle('built', n >= 0);
      el.dataset.tone = m ? m.tone : '';
      const k = lit(Math.max(n, 0));
      ctx.cells.forEach((c, i) => c.classList.toggle('lit', i < k));

      // the odometer: every reel lands on its digit in the state's own cycle, so a
      // forward build rolls down, a step back rolls up, and both settle identically
      // (Somar's figures are proportional: each slot takes its digit's own width)
      if (!ctx.dw) {
        const s = document.createElement('span');
        s.className = 'sv-probe'; ctx.$('.sv-odo').appendChild(s);
        const dw = Array.from({ length: 10 }, (_, d) => { s.textContent = String(d); return s.offsetWidth; });
        s.remove();
        if (!document.fonts || document.fonts.status === 'loaded') ctx.dw = dw; else ctx.dwTmp = dw;
      }
      const dw = ctx.dw || ctx.dwTmp;
      const v = m ? m.v : 0;
      const dg = [Math.floor(v / 100) % 10, Math.floor(v / 10) % 10, v % 10];
      const show = [v >= 100, v >= 10, true];
      ctx.slots.forEach((s, i) => {
        s.style.setProperty('--ix', (n + 1) * 10 + dg[i]);
        s.style.setProperty('--w', show[i] ? dw[dg[i]].toFixed(1) + 'px' : '0px');
        s.classList.toggle('off', !show[i]);
      });
      el.classList.toggle('sv-pct-on', n >= 1);

      // one-shot lights play on live clicks only; their resting state is invisible
      el.classList.remove('sv-live'); void el.offsetWidth;
      if (!ctx.instant && n >= 0) el.classList.add('sv-live');
      if (n >= 1 && !ctx.instant) { w.classList.remove('roll'); void w.offsetWidth; w.classList.add('roll'); }
    },
  });
})();
