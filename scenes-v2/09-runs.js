/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'runs', title: 'How it runs', act: 3, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3'],
  html: `<div class="pad"><div class="kicker" data-in="0">How it runs (stub)</div>` + [0, 1, 2].map((k) => `<h2 class="h2" data-in="${k}" data-split data-spark="${k}" style="margin-top:40px">How it runs · stop ${k + 1}</h2>`).join('') + `</div>`,
});
