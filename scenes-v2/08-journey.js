/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'journey', title: 'One story, through the cycle', act: 3, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4'],
  html: `<div class="pad"><div class="kicker" data-in="0">One story, through the cycle (stub)</div>` + [0, 1, 2, 3].map((k) => `<h2 class="h2" data-in="${k}" data-split data-spark="${k}" style="margin-top:40px">One story, through the cycle · stop ${k + 1}</h2>`).join('') + `</div>`,
});
