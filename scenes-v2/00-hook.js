/* 00 · The hook (v2) — the talk opens on the question, before any title or
   introduction: the question alone at display size, a warm light turning behind
   it, light shafts from above, a horizon of light the story light rests on, and
   slow ripples across the floor. The next click opens the title out of that light. */
(function () {
  // near-camera bokeh: large soft squares drifting slowly at the edges of the frame
  const BOKEH = [[120, 170, 96, 18, -4], [1690, 130, 130, 22, -9], [300, 820, 150, 24, -13], [1540, 790, 110, 20, -2], [40, 520, 70, 16, -7], [1820, 470, 84, 19, -11], [880, 70, 60, 17, -5]];
  const bokeh = BOKEH.map(([x, y, sz, t, dl], i) => `<i style="left:${x}px;top:${y}px;--sz:${sz}px;--t:${t}s;--dl:${dl}s;--bx:${(i % 2 ? -1 : 1) * (40 + i * 9)}px;--by:${(i % 3 - 1) * 36}px"></i>`).join('');
  // dust drifting through the night air
  const dust = Array.from({ length: 30 }, (_, i) => `<i style="left:${(i * 137 + 41) % 100}%;top:${28 + (i * 71) % 70}%;--t:${11 + (i % 6) * 2.3}s;--dl:${-i * 1.3}s;--dx:${(i % 2 ? 1 : -1) * (30 + (i * 13) % 70)}px;--dy:${-150 - (i * 29) % 210}px"></i>`).join('');

  Deck.scene({
    id: 'hook',
    title: 'The question',
    act: 0,
    bg: 'deep',
    chrome: { mark: false, progress: false },
    cues: ['When was the last time a colleague inspired you?'],
    holds: [8],
    notes: [
      'Open with the question, before you introduce anyone. Ask it, then stay quiet for a few seconds: when was the last time a colleague inspired you? Give the room time to picture one person and one moment.',
    ],
    field: [
      { dim: .6, lit: 0, travel: 0, offset: [0, 0], pins: [], warm: .3, links: .7, wave: .7, streaks: .14, sparkle: 1.4, drift: 1.2, calm: [[180, 330, 1740, 690, .6]] },
    ],
    html: `
      <div class="nt-warm"><i></i></div>
      <div class="nt-deep">
        <div class="nt-rays"></div>
        <div class="nt-rings"><i></i><i></i><i></i></div>
        <div class="nt-horizon"><i></i></div>
      </div>
      <div class="amb-dust nt-dust">${dust}</div>
      <div class="nt-bokeh">${bokeh}</div>

      <div class="nt-q" data-spark="0" data-spark-xy="960,716" data-spark-delay="1.05">
        <h1 class="display" data-in="0" data-split style="--d:.3s">When was the last time</h1>
        <h1 class="display" data-in="0" data-split style="--d:.58s">a colleague inspired you?</h1>
      </div>
    `,
  });
})();
