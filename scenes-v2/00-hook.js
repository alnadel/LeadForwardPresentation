/* 00 · The hook (v2) — the talk opens cold on the question, before any title or
   introduction. On a live load the frame awakens from near-black: a warm light
   blooms, the question rises word by word, two glints run in along the horizon
   and meet where the story light lands, and a wave of light wakes the colleague
   field while the room (rays, bokeh, dust, ripples) fades up around it.
   Parked: the warm light turns and breathes, the atmosphere pushes in, ripples
   spread from the light, glints run out along the horizon.
   The next click opens the title out of that light (01 enters with 'iris'): the
   horizon gathers into the light, the question lifts away, the light flares.
   All state is keyed off .st-0 (a settled landing shows the parked frame); the
   field wave plays only on a live build. */
(function () {
  const LIGHT = [960, 716];   // where the story light rests (the horizon's centre)
  const LAND = 2;             // s after --enter: the light lands (the spark's data-spark-delay)
  const MEET = .68;           // s the arrival glints take to run in (keep in step with .hk-glints in 00-hook.css)
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
      <!-- the house lights: near-black over the field until the light lands (live cold open only) -->
      <div class="hk-curtain"></div>
      <div class="nt-warm"><i></i></div>
      <div class="nt-deep">
        <div class="nt-rays"></div>
        <div class="nt-rings"><i></i><i></i><i></i></div>
        <div class="nt-horizon"><i></i></div>
      </div>
      <div class="amb-dust nt-dust">${dust}</div>
      <div class="nt-bokeh">${bokeh}</div>
      <!-- the arrival: two glints run in along the horizon and meet where the light lands -->
      <div class="hk-glints" style="left:${LIGHT[0]}px;top:${LIGHT[1]}px"><b class="l"></b><b class="r"></b></div>
      <!-- the hand-off: the light flares as the title opens out of it -->
      <div class="hk-flare" style="left:${LIGHT[0]}px;top:${LIGHT[1]}px"><i></i><b></b></div>

      <div class="nt-q" data-spark="0" data-spark-xy="${LIGHT[0]},${LIGHT[1]}" data-spark-delay="${LAND}">
        <h1 class="display" data-in="0" data-split style="--d:.3s;--wstep:.085s">When was the last time</h1>
        <h1 class="display" data-in="0" data-split style="--d:.74s;--wstep:.085s">a colleague inspired you?</h1>
      </div>
    `,
    step(n, prev, ctx) {
      // The live cold open (one-shot): .hk-wake holds the room dark; the arrival is driven by
      // the same clock as the engine's spark (timers, not CSS delays), so the glints meet, the
      // horizon draws and the field wakes exactly as the light lands, even if the first
      // frames after load are slow. A settled landing (.st-0 alone) shows the parked frame.
      const live = n === 0 && !ctx.instant;
      ctx.el.classList.toggle('hk-wake', live);
      ctx.el.classList.remove('hk-meeting', 'hk-landed');
      if (!live) return;
      const enter = parseFloat(getComputedStyle(ctx.el).getPropertyValue('--enter')) || 0;
      ctx.after((enter + LAND - MEET) * 1000, () => ctx.el.classList.add('hk-meeting'));
      ctx.after((enter + LAND) * 1000, () => {
        ctx.el.classList.add('hk-landed');
        // a wave of light wakes the whole colleague field from the light
        if (window.Field) Field.burst(LIGHT[0], LIGHT[1], { radius: 2100, dur: 3.2 });
      });
    },
  });
})();
