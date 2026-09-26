/* 02 · One night (v2) — the question now opens the talk on its own (00-hook).
   Stop 0: the film frame builds as the camera dollies in from the Open's light.
   While the frame flies in, 03:12 resolves first (the establishing shot), then the
   kicker and the headline; once it has arrived (var(--enter) + …) the photo band
   opens, loose notes drop and fly together into the new night handover as the
   story light lands on it, and the morning changes beneath.
   Key: the headline, and the handover card (the spark). The checklist rows and the
   before → after line are support: small and quiet (the rows are fine print).
   Stop 1: the camera pulls back until the whole night is two lit squares in a
   vast field. Two people know. This is the exact v1 03.3 image (the pins at
   Deck.NIGHT_PAIR, the camera at Deck.NIGHT_OFFSET, the words placed by the same
   formula); v2 scene 11 calls back to it. */
(function () {
  const OFFSET = Deck.NIGHT_OFFSET;   // this scene's camera pan, held on every stop (shared with 11)
  const CARD = { x: 1176, y: 420, w: 600 };   // keep in step with .nt-card-w in 02-night.css
  const ROWS = [
    'Overnight incidents · timestamped',
    'Signal faults still open',
    'Diversions in force at handover',
    'Camera outages · zone + ticket',
    'Anything the day shift must call',
    'Signed off by night supervisor',
  ];
  const CARD_CY = CARD.y + 192;       // the card's centre (it is 384px tall)
  // the old handover: loose notes dropped around the desk [left, top, w, h, tilt°]
  const SCRAPS = [
    [780, 452, 150, 92, -12], [980, 760, 132, 84, 9], [1220, 420, 168, 98, -6],
    [1640, 440, 124, 80, 13], [1690, 760, 140, 92, -9], [1330, 830, 160, 72, 5],
    [860, 640, 120, 104, -15], [1560, 600, 112, 74, 17], [1110, 590, 140, 84, -3],
    [640, 800, 126, 80, 11], [1440, 700, 118, 78, -8], [1760, 600, 104, 70, -14],
  ];

  const rnd = (s) => { s = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };

  // a line of handwriting: a small wavy path
  function scribble(x, y, len, seed) {
    let d = 'M' + x + ' ' + y;
    for (let i = 0, cx = x; cx < x + len; i++, cx += 11) {
      const up = (i % 2 ? -1 : 1) * (2 + rnd(seed + i) * 3);
      d += ' q5.5 ' + up.toFixed(1) + ' 11 ' + ((rnd(seed + i * 3) - .5) * 2).toFixed(1);
    }
    return '<path d="' + d + '"/>';
  }
  function scrapHtml(s, i) {
    const [x, y, w, h, r] = s;
    const cx = CARD.x + CARD.w / 2, cy = CARD_CY;
    const lines = Math.max(2, Math.floor((h - 22) / 18));
    let paths = '';
    for (let l = 0; l < lines; l++) paths += scribble(12, 20 + l * 18, (w - 30) * (.45 + rnd(i * 7 + l) * .5), i * 31 + l * 5);
    return `<div class="nt-scrap" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;--r:${r}deg;--tx:${(cx - x - w / 2).toFixed(0)}px;--ty:${(cy - y - h / 2).toFixed(0)}px;--i:${i}">
      <div class="nt-scrap-p${i % 3 === 1 ? ' tint' : ''}"><svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${paths}</svg></div></div>`;
  }

  /* The two colleagues who know: the field pins the squares nearest
     Deck.NIGHT_PAIR; one DOM light sits on each of them, with only a soft halo
     between. v2 scene 11 reuses this exact image. */
  const REST = Field.restOf(Deck.NIGHT_PAIR, OFFSET);
  const MID = [(REST[0][0] + REST[1][0]) / 2, (REST[0][1] + REST[1][1]) / 2];
  // the words sit centred under the pair, kept inside the margins (same formula as v1 03 / 17)
  const KNOW = { x: Math.round(Math.min(Math.max(144, MID[0] - 380), 1776 - 760)), y: Math.round(Math.max(REST[0][1], REST[1][1]) + 84) };

  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5.5 12.5 10 17 18.5 7.5"/></svg>';
  // dust drifting through the night air (stop 0)
  const dust = Array.from({ length: 30 }, (_, i) => `<i style="left:${((i * 137 + 41) % 100) * 19.2}px;top:${(28 + (i * 71) % 70) * 10.8}px;--t:${11 + (i % 6) * 2.3}s;--dl:${-i * 1.3}s;--dx:${(i % 2 ? 1 : -1) * (30 + (i * 13) % 70)}px;--dy:${-150 - (i * 29) % 210}px"></i>`).join('');

  Deck.scene({
    id: 'night',
    title: 'One night',
    act: 0,
    bg: 'deep',
    tag: 'illustrative',
    transition: 'dolly',
    cues: ['03:12 · Nouf rebuilt the night handover', 'Pull back · two people know'],
    holds: [10, 8],
    notes: [
      'Here is one of those moments. Nouf is an illustrative story. At 03:12, in the traffic operations centre, she rebuilt the night handover — unasked, in one afternoon. The morning shift no longer rebuilds the night; it is on live incidents from minute one.',
      'Now pull back. Across the whole organisation, who knows this happened? Two people: Nouf, and the colleague who sat next to her. Pause, and let the empty field land.',
    ],
    field: [
      { dim: .24, lit: 0, travel: 0, offset: OFFSET, pins: [], warm: 0, drift: 1.2, links: .3, wave: .3, streaks: .05, sparkle: .4, calm: [[100, 110, 1820, 420, .6], [1120, 400, 1780, 900, .7], [100, 840, 1420, 950, .6]] },
      // the pull-back: the pair is the only light — no flares, no shooting lights, no stories travelling,
      // no constellation lines (one would attach to the pair); the v1 03.3 image
      // (the right edge is quietened a little: it is where the stop-1 spark landed, so no flash can linger there)
      { dim: .8, pins: Deck.NIGHT_PAIR, links: 0, wave: 1, streaks: 0, sparkle: 0, travel: 0, drift: 2, calm: [[KNOW.x + 20, KNOW.y, KNOW.x + 740, KNOW.y + 180, .55], [1500, 130, 2010, 800, .7]] },
    ],
    html: `
      <div class="amb-dust nt-dust">${dust}</div>

      <div class="nt-film" style="transform-origin:${REST[0][0].toFixed(0)}px ${REST[0][1].toFixed(0)}px">
        <div class="nt-band">
          <div class="nt-zoom">
            <div class="photo nt-photo" style="background-image:url('assets/photos/nouf.jpg')"></div>
            <div class="nt-screens"><i style="--x:790px;--y:230px;--w:240px;--ft:3.1s"></i><i style="--x:915px;--y:232px;--w:230px;--dl:-1.2s;--ft:4.3s"></i><i style="--x:1225px;--y:222px;--w:280px;--dl:-2.6s;--ft:3.7s"></i><i style="--x:40px;--y:216px;--w:190px;--dl:-.7s;--ft:5.2s"></i></div>
            <i class="nt-face"></i>
          </div>
          <div class="fill nt-veil"></div>
        </div>

        <div class="nt-ui">
          <div class="kicker nt-kicker a-wipe" data-in="0" style="--d:.45s">Traffic operations centre · night shift</div>
          <div class="nt-clock num a-blur" data-in="0" style="--d:.2s;--dur:1.2s" aria-label="03:12"><i class="nt-clock-glow"></i><span class="nt-dg">03</span><span class="nt-colon"><b></b><b></b></span><span class="nt-dg">12</span></div>
          <h2 class="nt-head" data-in="0" data-split style="--d:.4s">Nouf rebuilt the night handover — unasked, in one afternoon.</h2>

          <div class="nt-scraps">${SCRAPS.map(scrapHtml).join('')}</div>

          <div class="nt-card-w" data-spark="0" data-spark-xy="${CARD.x + CARD.w - 49},${CARD.y + 43}" data-spark-delay=".75">
            <i class="nt-card-pool"></i>
            <div class="glass live nt-card">
              <div class="nt-card-h">${Deck.icon('document-certified', 'nt-card-ic')}<span class="nt-card-t">NIGHT HANDOVER · v2</span><span class="nt-card-slot"></span></div>
              ${ROWS.map((r, k) => `<div class="nt-row" style="--k:${k}"><span class="nt-box">${check}</span><span class="nt-row-t">${r}</span></div>`).join('')}
            </div>
          </div>

          <p class="nt-ba" data-in="0" style="--d:1.45s"><span class="nt-ba-k">Morning shift, first hour:</span> <span class="nt-before">rebuilding the night<i></i></span> → <span class="nt-after">on live incidents from minute one.</span></p>
        </div>
      </div>

      <div class="nt-pair"><i class="nt-halo"></i></div>
      <b class="nt-p"><i class="light"></i></b><b class="nt-p"><i class="light"></i></b>
      <div class="nt-know" style="left:${KNOW.x}px;top:${KNOW.y}px">
        <!-- the words' slow glow: a static text-shadow copy that breathes in opacity (02-night.css) -->
        <div class="nt-know-glow" aria-hidden="true"><div class="nt-know-h">Two people know.</div><p class="nt-know-s">Nouf, and the colleague who sat next to her.</p></div>
        <h2 class="nt-know-h" data-in="1" data-split style="--d:.8s">Two people know.</h2>
        <p class="nt-know-s" data-in="1" style="--d:1s;--dur:.5s">Nouf, and the colleague who sat next to her.</p>
      </div>
    `,
    init(ctx) {
      ctx.pairEl = ctx.$('.nt-pair');
      ctx.lightEls = ctx.$$('.nt-p');
      // the halo sits between the two colleagues; each light sits on one of them
      ctx.placePair = (live) => {
        const lp = live && window.Field ? Field.pinned() : [];
        const p = lp.length === 2 ? lp : REST;
        ctx.pairEl.style.transform = 'translate(' + ((p[0][0] + p[1][0]) / 2).toFixed(1) + 'px,' + ((p[0][1] + p[1][1]) / 2).toFixed(1) + 'px)';
        ctx.lightEls.forEach((el, i) => { el.style.transform = 'translate(' + p[i][0].toFixed(1) + 'px,' + p[i][1].toFixed(1) + 'px)'; });
      };
      ctx.placePair(null);
    },
    enter(ctx) {
      ctx.loop(() => {
        if (ctx.step === 1) ctx.placePair(true);
      });
    },
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // what the stop has taken away leaves the compositor
      if (!window.Field) return;
      // the pull-back: no colleague is lit but the pair (clears any lit share still easing out of 01)
      if (n === 1) Field.setLit(0);
    },
    leave(ctx) {
      window.LFLeave && LFLeave(ctx);   // once faded out, it leaves the compositor
      // the pair stays lit only here; scene 11 relights it
      if (window.Field) Field.set({ pins: [] });
    },
  });
})();
