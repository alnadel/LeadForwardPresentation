/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'benchmark', title: 'Reading the numbers', act: 1, bg: 'night',
  cues: ['Stop 1', 'Stop 2'],
  html: `<div class="pad"><div class="kicker" data-in="0">Reading the numbers (stub)</div>` + [0, 1].map((k) => `<h2 class="h2" data-in="${k}" data-split data-spark="${k}" style="margin-top:40px">Reading the numbers · stop ${k + 1}</h2>`).join('') + `</div>`,
});
