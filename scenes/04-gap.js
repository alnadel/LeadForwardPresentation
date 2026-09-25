/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'gap', title: 'The gap', act: 1, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3', 'Stop 4', 'Stop 5'],
  html: `<div class="pad"><div class="kicker" data-in="0">The gap (stub)</div>` + [0, 1, 2, 3, 4].map((k) => `<h2 class="h2" data-in="${k}" style="margin-top:40px">The gap · stop ${k + 1}</h2>`).join('') + `</div>`,
});
