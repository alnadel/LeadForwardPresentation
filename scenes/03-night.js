/* 03 · One night — an illustrative story told as a film frame. Nouf rebuilds the
   night handover; then the camera pulls back and the whole night shrinks to two
   lit squares in a vast field. Two people know. */
(function () {
  const OFFSET = Deck.NIGHT_OFFSET;   // this scene's camera pan, held on every stop (shared with 17)
  const CARD = { x: 1216, y: 430, w: 560, h: 432 };   // right edge on the margin (1776)
  const ROWS = [
    'Overnight incidents · timestamped',
    'Signal faults still open',
    'Diversions in force at handover',
    'Camera outages · zone + ticket',
    'Anything the day shift must call',
    'Signed off by night supervisor',
  ];
  // the old handover: loose notes around the desk [left, top, w, h, tilt°]
  const SCRAPS = [
    [800, 470, 150, 92, -12], [1010, 770, 132, 84, 9], [1250, 432, 168, 98, -6],
    [1640, 470, 124, 80, 13], [1690, 770, 140, 92, -9], [1330, 850, 160, 72, 5],
    [880, 650, 120, 104, -15], [1540, 610, 112, 74, 17], [1130, 600, 140, 84, -3],
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
    const cx = CARD.x + CARD.w / 2, cy = CARD.y + CARD.h / 2;
    const lines = Math.max(2, Math.floor((h - 22) / 18));
    let paths = '';
    for (let l = 0; l < lines; l++) paths += scribble(12, 20 + l * 18, (w - 30) * (.45 + rnd(i * 7 + l) * .5), i * 31 + l * 5);
    return `<div class="nt-scrap" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px;--r:${r}deg;--tx:${(cx - x - w / 2).toFixed(0)}px;--ty:${(cy - y - h / 2).toFixed(0)}px;--i:${i}">
      <div class="nt-scrap-p${i % 3 === 1 ? ' tint' : ''}"><svg viewBox="0 0 ${w} ${h}" aria-hidden="true">${paths}</svg></div></div>`;
  }

  /* The two colleagues who know: the field pins the squares nearest
     Deck.NIGHT_PAIR; one DOM light sits on each of them, with only a soft
     halo between. Scene 17 reuses this exact image. */
  const REST = Field.restOf(Deck.NIGHT_PAIR, OFFSET);
  const MID = [(REST[0][0] + REST[1][0]) / 2, (REST[0][1] + REST[1][1]) / 2];
  // the words sit centred under the pair, kept inside the margins
  const KNOW = { x: Math.round(Math.min(Math.max(144, MID[0] - 380), 1776 - 760)), y: Math.round(Math.max(REST[0][1], REST[1][1]) + 84) };

  const check = '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="5.5 12.5 10 17 18.5 7.5"/></svg>';

  Deck.scene({
    id: 'night',
    title: 'One night',
    act: 0,
    bg: 'deep',
    tag: 'illustrative',
    cues: ['03:12 · the night shift', 'Nouf rebuilt the night handover', 'Before → after', 'Pull back · two people know'],
    holds: [8, 9, 7, 8],
    notes: [
      'A reminder: this story is illustrative. It is 03:12 in the traffic operations centre. Every morning, the day shift spent its first hour rebuilding what happened overnight.',
      'Nouf fixed it. Nobody asked her to. In one afternoon she rebuilt the night handover into one clean page: incidents timestamped, open signal faults, diversions, camera outages, what the day shift must call, and a supervisor sign-off.',
      'So the morning shift no longer spends its first hour rebuilding the night. They are on live incidents from minute one. No number on purpose: how the morning starts is the point.',
      'Now pull back. Across the whole organisation, who knows this happened? Two people: Nouf, and the colleague who sat next to her. Pause. Let the empty field land.',
    ],
    field: [
      { dim: .24, lit: 0, travel: 0, offset: OFFSET, pins: [], calm: [[100, 110, 1820, 420, .6], [1120, 400, 1780, 900, .7]] },
      {},
      {},
      { dim: .8, pins: Deck.NIGHT_PAIR, calm: [[KNOW.x + 20, KNOW.y, KNOW.x + 740, KNOW.y + 180, .55]] },
    ],
    html: `
      <div class="nt-film" style="transform-origin:${REST[0][0].toFixed(0)}px ${REST[0][1].toFixed(0)}px">
        <div class="nt-band">
          <div class="photo nt-photo amb-ken-2" style="background-image:url('assets/photos/nouf.jpg')"></div>
          <div class="nt-screens"><i style="--x:790px;--y:230px;--w:220px"></i><i style="--x:915px;--y:232px;--w:220px;--dl:-2.2s"></i><i style="--x:1225px;--y:222px;--w:260px;--dl:-3.4s"></i><i style="--x:40px;--y:216px;--w:170px;--dl:-4.6s"></i></div>
          <div class="fill nt-veil"></div>
          <div class="fill nt-veil-card"></div>
        </div>

        <div class="nt-ui">
          <div class="kicker nt-kicker a-wipe" data-in="0" style="--d:.3s">Traffic operations centre · night shift</div>
          <div class="nt-clock num a-blur" data-in="0" style="--d:.1s;--dur:1.4s">03<span class="nt-colon">:</span>12</div>

          <p class="nt-cap nt-s0" data-in="0" data-out="1" style="--d:.8s">Every morning, the day shift spent its first hour rebuilding what happened overnight.</p>
          <h2 class="nt-cap nt-head" data-in="1" data-out="2" data-split style="--d:.3s">Nouf rebuilt the night handover — unasked, in one afternoon.</h2>

          <div class="nt-cap nt-ba" data-in="2" style="--d:.1s">
            <div class="label nt-ba-k">Morning shift · first hour</div>
            <div class="nt-ba-row">
              <div class="nt-before">Rebuilding<br>the night</div>
              <svg class="nt-arrow" viewBox="0 0 120 40" aria-hidden="true"><path d="M4 20 H108"/><path d="M92 6 L110 20 L92 34"/></svg>
              <div class="nt-after">On live incidents<br>from minute one</div>
            </div>
          </div>

          <div class="nt-scraps">${SCRAPS.map(scrapHtml).join('')}</div>

          <div class="nt-card-w">
            <div class="paper nt-card">
              <div class="nt-card-h"><span>NIGHT HANDOVER · v2</span></div>
              ${ROWS.map((r, k) => `<div class="nt-row" style="--k:${k}"><span class="nt-box">${check}</span><span>${r}</span></div>`).join('')}
            </div>
          </div>
        </div>
      </div>

      <div class="nt-pair"><i class="nt-halo"></i></div>
      <b class="nt-p"><i class="light"></i></b><b class="nt-p"><i class="light"></i></b>
      <div class="nt-know" style="left:${KNOW.x}px;top:${KNOW.y}px">
        <h2 class="nt-know-h" data-in="3" data-split style="--d:.8s">Two people know.</h2>
        <p class="nt-know-s" data-in="3" style="--d:1s;--dur:.5s">Nouf, and the colleague who sat next to her.</p>
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
        if (ctx.step === 3) ctx.placePair(true);
      });
    },
    leave() {
      // the pair stays lit only here; scene 17 relights it
      if (window.Field) Field.set({ pins: [] });
    },
  });
})();
