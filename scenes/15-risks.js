/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'risks', title: 'What could break this', act: 4, bg: 'night',
  cues: ['Stop 1', 'Stop 2'],
  html: `<div class="pad"><div class="kicker" data-in="0">What could break this (stub)</div>` + [0, 1].map((k) => `<h2 class="h2" data-in="${k}" style="margin-top:40px">What could break this · stop ${k + 1}</h2>`).join('') + `</div>`,
});
