/* STUB — replaced by the scene implementation. */
Deck.scene({
  id: 'alignment', title: 'Strategic alignment', act: 2, bg: 'night',
  cues: ['Stop 1', 'Stop 2', 'Stop 3'],
  html: `<div class="pad"><div class="kicker" data-in="0">Strategic alignment (stub)</div>` + [0, 1, 2].map((k) => `<h2 class="h2" data-in="${k}" style="margin-top:40px">Strategic alignment · stop ${k + 1}</h2>`).join('') + `</div>`,
});
