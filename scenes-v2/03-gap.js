/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'gap', title: 'The gap', act: 1, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3'],
  html: `<div class="pad"><div class="kicker" data-in="0">The gap (stub)</div>` + [0, 1, 2].map((k) => `<h2 class="h2" data-in="${k}" data-split data-spark="${k}" style="margin-top:40px">The gap · stop ${k + 1}</h2>`).join('') + `</div>`,
});
