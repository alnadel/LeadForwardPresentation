/* 02 · The question — one question alone on the screen, then the moments it
   brings back. Four lights, one per moment; three sink back into the field and
   one is held. */
(function () {
  const VERBS = [
    ['HELPED', 'A colleague stepped in when support was needed.'],
    ['SUPPORTED', 'Someone went the extra mile for another person or team.'],
    ['IMPROVED', 'A small action solved a problem or made work easier.'],
    ['INSPIRED', 'The behaviour could help others — if they could see it.'],
  ];
  const KEEP = 3;            // the light that is held at stop 3

  Deck.scene({
    id: 'question',
    title: 'The question',
    act: 0,
    bg: 'plum',
    tag: 'illustrative',
    tagFrom: 1,              // Nouf's photo arrives at stop 1; the question stands alone at stop 0
    cues: ['When was the last time a colleague inspired you?', 'Think of one moment', 'Helped · supported · improved · inspired', 'What if one story could travel further?'],
    holds: [6, 7, 9, 8],
    notes: [
      'Ask it, then stay quiet for a few seconds: “When was the last time a colleague inspired you?” Give the room time to think of someone.',
      'One thing first: Nouf, whom you will follow today, is an illustrative story, not a specific colleague. Now think of one moment that made work better. Who else ever heard about it?',
      'These moments tend to look like four things. Someone helped. Someone supported another person or team. Someone improved how the work gets done. And some could inspire others, if people could see them.',
      'Every day, these moments happen, yet most stay visible only to the people who were there. So here is the question behind this proposal: what if one story could travel further?',
    ],
    field: [
      { dim: .42, lit: 0, travel: 0, offset: [170, -90], calm: [[220, 340, 1700, 700, .55]] },
      { dim: .3, calm: [[80, 110, 1080, 960, .7]] },
      {},
      { dim: .36 },
    ],
    html: `
      <div class="qs-glow"></div>

      <div class="qs-panel" data-in="1" style="--d:.15s;--dur:1.5s">
        <div class="photo qs-photo amb-ken" style="background-image:url('assets/photos/nouf-question.jpg')"></div>
        <div class="fill qs-veil"></div>
        <div class="fill qs-dim"></div>
      </div>

      <div class="qs-q">
        <div class="qs-ln"><h1 class="display" data-in="0" data-split style="--d:.1s">When was the last time</h1></div>
        <div class="qs-ln"><h1 class="display" data-in="0" data-split style="--d:.38s">a colleague inspired you?</h1></div>
      </div>

      <p class="lead qs-lead" data-in="1" data-out="2" style="--d:.75s">Think of one moment that made work better — and ask who else ever heard about it.</p>

      <div class="qs-stack">
        ${VERBS.map(([v, s], k) => `
        <div class="qs-row${k === KEEP ? ' keep' : ''}" style="--k:${k}">
          <div class="qs-v" data-in="2" style="--d:${(0.1 + k * 0.14).toFixed(2)}s">
            <span class="qs-lt"><i class="light"></i>${k === KEEP ? '<b class="amb-ring"></b>' : ''}</span>
            <div class="qs-word">${v}</div>
            <p class="qs-sent">${s}</p>
          </div>
        </div>`).join('')}
      </div>

      <p class="qs-l1" data-in="3" style="--d:.35s">Every day, these moments happen.<br>Most stay visible only to the people who were there.</p>
      <p class="qs-l2" data-in="3" data-split style="--d:.75s">What if one story could<br>travel further?</p>
    `,
  });
})();
