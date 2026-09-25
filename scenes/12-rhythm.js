/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'rhythm', title: 'Operating rhythm', act: 3, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3'],
  html: `<div class="pad"><div class="kicker" data-in="0">Operating rhythm (stub)</div>` + [0, 1, 2].map((k) => `<h2 class="h2" data-in="${k}" style="margin-top:40px">Operating rhythm · stop ${k + 1}</h2>`).join('') + `</div>`,
});
