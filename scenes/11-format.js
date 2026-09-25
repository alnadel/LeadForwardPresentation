/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'format', title: 'The story format', act: 3, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3'],
  html: `<div class="pad"><div class="kicker" data-in="0">The story format (stub)</div>` + [0, 1, 2].map((k) => `<h2 class="h2" data-in="${k}" style="margin-top:40px">The story format · stop ${k + 1}</h2>`).join('') + `</div>`,
});
