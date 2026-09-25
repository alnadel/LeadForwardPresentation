/* 08 · Strategic alignment — Riyadh from above under a plum veil. Three pillars
   show how the stories serve the strategy; the six values take turns in the light. */
(function () {
  const VALUES = ['Commitment', 'Collaboration', 'Innovation', 'Impact', 'Learning', 'Excellence'];
  const CYCLE = 4000;           // ms between highlight moves (each chip cross-fades, it never slides)
  const FIRST = 4600;           // the first value holds a little longer while the pillars build
  // city lights that shimmer over the photo (stage px, on the photo's bright districts)
  // the last eight sit on the interchange in the lower right, which stays in view at stop 2
  const GLINTS = [[1560, 575, 1], [1742, 338, .8], [1640, 282, .7], [1402, 500, .8], [1286, 222, .6], [1208, 655, .7], [1812, 842, .9], [1700, 470, .9], [1480, 350, .6], [1860, 610, .8],
    [1590, 640, 1.4], [1740, 700, 1.5], [1450, 625, 1.2], [1325, 752, 1.1], [1680, 800, 1.3], [1850, 735, 1.2], [1530, 715, 1.1], [1395, 680, 1]];

  const pillar = (n, title, text, extra) => `
    <div class="al-p" data-in="1">
      <div class="al-p-head"><span class="al-n num">${String(n).padStart(2, '0')}</span><i class="al-p-rule"></i></div>
      <h3 class="al-p-t">${title}</h3>
      <p class="al-p-s">${text}</p>
      ${extra || ''}
    </div>`;

  // the light moves by cross-fading chip to chip, so a parked frame never catches it between two
  function place(ctx, i) {
    ctx.chips.forEach((x, k) => x.classList.toggle('on', k === i));
  }

  Deck.scene({
    id: 'alignment',
    title: 'Strategic alignment',
    act: 2,
    bg: 'plum',
    cues: ['Stories connect to purpose, values and people priorities', 'Three pillars · purpose · values · learning', 'Strategic value'],
    notes: [
      'Tahakom’s strategy is not delivered through technology alone. It is also delivered through the people and behaviours behind it. Behind a Better Life supports the strategy in three practical ways: it connects daily work to our purpose, shows our values through real examples, and allows useful behaviours to move across departments.',
      'First, purpose: each story shows how daily work supports Urban Intelligence for a Better Life. Second, values: all six, seen in real work. Third, learning: peer stories make useful behaviours visible and repeatable across teams.',
      'The key point: we are not inventing new values. The initiative helps employees recognise and apply the values Tahakom already has, so the culture behind the strategy is easier to see in everyday work.',
    ],
    field: [
      { dim: .18, lit: 0, travel: 0, offset: [-200, 110], warm: .35, calm: [[80, 100, 1300, 460, .9], [80, 440, 1820, 960, .7]] },
      { dim: .14 },
      {},
    ],
    html: `
      <div class="al-plate amb-ken">
        <div class="photo al-photo" style="background-image:url('assets/photos/riyadh-aerial.jpg')"></div>
        <div class="al-glints">${GLINTS.map(([x, y, s], i) => `<i style="left:${x}px;top:${y}px;--s:${s};animation-delay:${(-i * 1.37).toFixed(2)}s;animation-duration:${(4.6 + (i % 4) * 1.1).toFixed(1)}s"></i>`).join('')}</div>
      </div>
      <div class="fill al-veil"></div>
      <div class="fill al-veil-b a-fade" data-in="1" style="--dur:1.4s"></div>
      <div class="fill al-veil-t a-fade" data-in="2" style="--dur:1.2s"></div>
      <div class="fill al-veil-p a-fade" data-in="2" style="--dur:1.2s"></div>

      <div class="pad al-head">
        <div class="al-swap">
          <div class="al-intro" data-out="2">
            <div class="kicker" data-in="0">Strategic alignment</div>
            <h2 class="h2 al-h" data-in="0" data-split style="--d:.15s">Behind a Better Life connects employee stories to Tahakom’s purpose, values and people priorities.</h2>
          </div>
          <div class="al-final">
            <div class="kicker a-wipe" data-in="2" style="--d:.3s">Strategic value</div>
            <h2 class="h2 al-st" data-in="2" data-split style="--d:.4s">The initiative does not create new <span class="al-nw">values —</span> it helps employees recognise and apply <em class="hl">the values Tahakom already has.</em></h2>
            <p class="al-sub" data-in="2" style="--d:1s">This makes the culture behind the strategy easier to see in everyday work.</p>
          </div>
        </div>
      </div>

      <div class="al-pillars" data-stagger style="--stagger:.2s;--d:.1s">
        ${pillar(1, 'Purpose is connected to work', 'Each story shows how daily contributions support <em class="hl">Urban Intelligence for a Better Life.</em>')}
        ${pillar(2, 'Values become visible', 'Stories show Commitment, Collaboration, Innovation, Impact, Learning and Excellence in action.',
          `<div class="al-chips">${VALUES.map((v) => `<span class="al-chip">${v}</span>`).join('')}</div>`)}
        ${pillar(3, 'Learning moves across teams', 'Peer stories make useful behaviours visible, understood and repeatable.')}
      </div>
    `,
    init(ctx) {
      ctx.chips = ctx.$$('.al-chip');
      ctx.idx = 0;
      ctx.nextMove = 0;
    },
    enter(ctx) {
      // one value in the light at a time; the light moves to the next every 4 s.
      // A fine tick keeps the rhythm anchored to the moment the pillars arrived.
      ctx.every(200, () => {
        const now = performance.now();
        if (ctx.step < 1 || now < ctx.nextMove) return;
        ctx.nextMove += CYCLE;
        if (ctx.nextMove < now) ctx.nextMove = now + CYCLE;
        ctx.idx = (ctx.idx + 1) % VALUES.length;
        place(ctx, ctx.idx);
      });
    },
    step(n, prev, ctx) {
      // arriving at the pillars (from either side, or by a jump) starts from the first value;
      // moving on to stop 2 lets the cycle carry on, dimmed
      if (n !== 2 || prev !== 1 || ctx.instant) {
        ctx.idx = 0;
        ctx.nextMove = performance.now() + FIRST;
      }
      place(ctx, ctx.idx);
      ctx.el.classList.toggle('al-lit', n >= 1);
    },
  });
})();
