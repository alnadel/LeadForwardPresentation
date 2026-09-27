/* 02 · The crossing (v2) — the deck's cold open: the first thing the room sees, straight
   after the start gate and before the title. An illustrative story, told in one stop.
   Stop 0 builds out of black in four beats (02-night.css has the clock):
     time and place  06:40 resolves in the dark, the kicker, the film frame opens on Sara
                     at the operations desk as first light comes up over the city;
     what she saw    the headline, then the crossing study: near-misses flare on the
                     school crossing;
     what she did    "Nobody asked her to fix it." The study reads twelve weeks of footage,
                     and the story light lands on her new signal timing;
     the result      the near-misses dissolve, the children's phase lights up, and the
                     payoff lands. Parked, children cross while the cars wait.
   Key: the headline, and the crossing study (the spark). The payoff is the key line; the
   rest is support. A curtain holds the room dark until the build lifts it; a live cold open
   adds .nt-wake (02-night.css), which plays the one-shots. A settled landing (the frame
   under the start gate, a jump, a step back) shows the parked frame at once.
   Stop 1: the camera pulls back until the whole story is two lit squares in a vast field:
   the film vanishes into Sara's light, "None of those children knows her name.", then the
   supervisor's light, and "Two people know." This is the exact v1 03.3
   image (the pins at Deck.NIGHT_PAIR, the camera at Deck.NIGHT_OFFSET, the words placed by
   the same formula); v2 scene 11 calls back to it. */
(function () {
  const t = Deck.t;
  const OFFSET = Deck.NIGHT_OFFSET;   // this scene's camera pan, held on every stop (shared with 11)
  const CARD = { x: 1176, y: 424, w: 600 };    // keep in step with .nt-card-w in 02-night.css
  // the timeline's turning point (her new timing) in card px: the story light lands here
  const NODE = [368, 368];
  // near-misses on the crossing (map px, 536 × 184): where the lanes meet the zebra
  const MISSES = [[248, 120], [292, 106], [266, 134], [297, 64], [252, 56], [276, 88]];
  // twelve weeks of footage: near-misses seen each week (illustrative pattern, never labelled)
  const WEEKS = [2, 1, 3, 2, 1, 2, 3, 2, 2, 1, 2, 3];

  /* The two colleagues who know: the field pins the squares nearest
     Deck.NIGHT_PAIR; one DOM light sits on each of them, with only a soft halo
     between. v2 scene 11 reuses this exact image. */
  const REST = Field.restOf(Deck.NIGHT_PAIR, OFFSET);
  const MID = [(REST[0][0] + REST[1][0]) / 2, (REST[0][1] + REST[1][1]) / 2];
  // the words sit centred under the pair, kept inside the margins (same formula as v1 03 / 17)
  const KNOW = { x: Math.round(Math.min(Math.max(144, MID[0] - 380), 1776 - 760)), y: Math.round(Math.max(REST[0][1], REST[1][1]) + 84) };
  // the quiet line sits over the pair, centred on the same axis, clear of the pair's drift
  const HUSH = { x: KNOW.x, y: KNOW.y - 282 };

  // dust drifting through the morning air (stop 0)
  const dust = Array.from({ length: 30 }, (_, i) => `<i style="left:${((i * 137 + 41) % 100) * 19.2}px;top:${(28 + (i * 71) % 70) * 10.8}px;--t:${11 + (i % 6) * 2.3}s;--dl:${-i * 1.3}s;--dx:${(i % 2 ? 1 : -1) * (30 + (i * 13) % 70)}px;--dy:${-150 - (i * 29) % 210}px"></i>`).join('');

  // the school crossing, top down (static: the road, the zebra, the school, the camera)
  const zebra = [45, 62, 79, 96, 113, 130].map((y) => `<rect x="240" y="${y}" width="52" height="9" rx="1.5"/>`).join('');
  const road = `<svg class="nt-road" viewBox="0 0 536 184" aria-hidden="true">
      <rect class="nt-side" x="0" y="0" width="536" height="42"/><rect class="nt-side" x="0" y="142" width="536" height="42"/>
      <path class="nt-kerb" d="M0 42H536M0 142H536"/>
      <path class="nt-lane" d="M0 92H226M306 92H536"/>
      <g class="nt-zebra">${zebra}</g>
      <rect class="nt-school" x="318" y="7" width="104" height="28" rx="6"/>
      <text class="nt-school-t" x="370" y="27" text-anchor="middle">SCHOOL</text>
      <g class="nt-cam"><rect x="12" y="11" width="20" height="12" rx="3"/><path d="M32 14l6-3v12l-6-3z"/></g>
    </svg>`;
  // the week columns: stacks of near-misses, one column per week
  const stacks = WEEKS.map((n, w) => `<span class="nt-wk" style="left:${11 + w * 26}px;--w:${w}">${'<i></i>'.repeat(n)}</span>`).join('');

  Deck.scene({
    id: 'night',
    title: 'The crossing',
    act: 0,
    bg: 'deep',
    tag: 'illustrative',
    transition: 'dolly',
    cues: ['06:40 · Sara and the school crossing', 'Pull back · two people know'],
    holds: [14, 9],
    notes: [
      'This is an illustrative story. Meet Sara, a traffic-operations analyst on the morning shift. At 06:40, every school morning, she watched the same crossing on the camera wall: children, cars, and near-misses. Nobody asked her to fix it. In her own time, she studied twelve weeks of footage and proposed a new signal timing, so the children cross first. Next term, the near-misses stopped. Hundreds of children now cross there safely, every school morning.',
      'Now pull back. None of those children knows her name. And across Tahakom, who knows this happened? Two people: Sara, and the supervisor who signed off the change. Pause here. Let the empty field land before you move on.',
    ],
    field: [
      { dim: .24, lit: 0, travel: 0, offset: OFFSET, pins: [], warm: 0, drift: 1.2, links: .3, wave: .3, streaks: .05, sparkle: .4, calm: [[100, 110, 1820, 400, .6], [1130, 400, 1810, 870, .75], [100, 820, 1100, 950, .6]] },
      // the pull-back: the pair is the only light — no flares, no shooting lights, no stories travelling,
      // no constellation lines (one would attach to the pair); the v1 03.3 image. The camera wanders
      // less than it used to, so the pair stays clear of the words above and below it.
      // (the right edge is quietened a little: it is where the stop-0 spark landed, so no flash can linger there)
      { dim: .8, pins: Deck.NIGHT_PAIR, links: 0, wave: 1, streaks: 0, sparkle: 0, travel: 0, drift: 1.4,
        calm: [[KNOW.x + 20, KNOW.y, KNOW.x + 740, KNOW.y + 180, .55], [HUSH.x + 20, HUSH.y - 10, HUSH.x + 740, HUSH.y + 70, .6], [1500, 130, 2010, 820, .7]] },
    ],
    html: `
      <!-- the house lights: black over the whole room until the story comes up (down only as the cold open starts) -->
      <div class="nt-curtain"></div>
      <div class="amb-dust nt-dust">${dust}</div>

      <div class="nt-film" style="transform-origin:${REST[0][0].toFixed(0)}px ${REST[0][1].toFixed(0)}px">
        <div class="nt-band">
          <div class="nt-zoom"${t('', ' data-rtl-keep')}>
            <div class="photo nt-photo" style="background-image:url('assets/photos/nouf.jpg')"></div>
            <div class="nt-screens"><i style="--x:790px;--y:230px;--w:240px;--ft:3.1s"></i><i style="--x:915px;--y:232px;--w:230px;--dl:-1.2s;--ft:4.3s"></i><i style="--x:1225px;--y:222px;--w:280px;--dl:-2.6s;--ft:3.7s"></i><i style="--x:40px;--y:216px;--w:190px;--dl:-.7s;--ft:5.2s"></i></div>
            <i class="nt-face"></i>
          </div>
          <!-- first light over the city, 06:40 -->
          <i class="nt-dawn"></i>
          <div class="fill nt-veil"></div>
        </div>

        <div class="nt-ui">
          <div class="kicker nt-kicker a-wipe" data-in="0" style="--d:.4s">Traffic operations centre · morning shift</div>
          <div class="nt-clock num a-blur" data-in="0" style="--d:.05s;--dur:1.3s" aria-label="06:40"${t('', ' data-flip')}><i class="nt-clock-glow"></i><span class="nt-dg">06</span><span class="nt-colon"><b></b><b></b></span><span class="nt-dg">40</span></div>
          <h2 class="nt-head" data-in="0" data-split style="--d:.5s">Every school morning, Sara saw near-misses at one crossing.</h2>
          <p class="nt-turn" data-in="0" data-split style="--d:1.3s;--wstep:.07s">Nobody asked her to fix it.</p>

          <div class="nt-card-w" data-spark="0" data-spark-xy="${CARD.x + NODE[0]},${CARD.y + NODE[1]}" data-spark-delay="2.3">
            <i class="nt-card-pool"></i>
            <div class="glass live nt-card">
              <div class="nt-card-h">${Deck.icon('eye-lightbulb', 'nt-card-ic')}<span class="nt-card-t">Crossing study</span></div>
              <div class="nt-map">
                <i class="nt-cone"></i>
                ${road}
                <i class="nt-walk"></i>
                <i class="nt-stop nt-se"></i><i class="nt-stop nt-sw"></i>
                <div class="nt-miss">${MISSES.map(([x, y], k) => `<i style="left:${x}px;top:${y}px;--k:${k}"></i>`).join('')}</div>
                <i class="nt-car nt-ce"></i><i class="nt-car nt-cw"></i><i class="nt-car nt-ce2"></i>
                <div class="nt-kids">${[250, 262, 274, 286].map((x, k) => `<i style="left:${x}px;--k:${k}"></i>`).join('')}</div>
              </div>
              <div class="nt-tl">
                <span class="nt-tl-l nt-l-before">12 weeks of footage</span>
                <span class="nt-tl-l nt-l-mid">New timing</span>
                <span class="nt-tl-l nt-l-after">Next term</span>
                <i class="nt-tl-base"></i>
                <div class="nt-wks">${stacks}</div>
                <i class="nt-tl-scan"></i>
                <i class="nt-tl-node"></i>
                <i class="nt-tl-after"><b></b></i>
              </div>
            </div>
          </div>

          <div class="nt-pay">
            <p class="nt-pay-k" data-in="0" style="--d:2.45s;--dur:.8s">Next term, <span class="nt-pay-hl">the near-misses stopped.</span></p>
            <p class="nt-pay-s" data-in="0" style="--d:2.7s;--dur:.7s">Hundreds of children cross there safely, every school morning.</p>
          </div>
        </div>
      </div>

      <p class="nt-hush a-blur" data-in="1" style="left:${HUSH.x}px;top:${HUSH.y}px;--d:1s;--dur:1.1s">None of those children knows her name.</p>
      <div class="nt-pair"><i class="nt-halo"></i></div>
      <b class="nt-p"><i class="nt-ign"></i><i class="light"></i></b><b class="nt-p"><i class="nt-ign"></i><i class="light"></i></b>
      <div class="nt-know" style="left:${KNOW.x}px;top:${KNOW.y}px">
        <!-- the words' slow glow: a static text-shadow copy that breathes in opacity (02-night.css) -->
        <div class="nt-know-glow" aria-hidden="true"><div class="nt-know-h">${t('Two people know.', 'شخصان فقط يعلمان.')}</div><p class="nt-know-s">Sara, and the supervisor who signed off the change.</p></div>
        <h2 class="nt-know-h" data-in="1" data-split style="--d:1.6s">${t('Two people know.', 'شخصان فقط يعلمان.')}</h2>
        <p class="nt-know-s" data-in="1" style="--d:2s;--dur:.5s">Sara, and the supervisor who signed off the change.</p>
      </div>
    `,
    init(ctx) {
      ctx.cardEl = ctx.$('.nt-card-w');
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
      // the one-shots play only on a live build: .nt-wake on the cold open (stop 0 built out of
      // black), .nt-pull on the click into the pull-back. A settled landing (the frame under the
      // start gate, a jump, a step back from the title) shows the parked frame without them.
      // .nt-wake also sets when the crossing's 10 s cycle began (--life), so it stays on through
      // the clicks that follow: taking it off would jump the cars and children mid-cycle.
      if (n < 0 || ctx.instant) ctx.el.classList.remove('nt-wake');
      else if (n === 0 && prev < 0) ctx.el.classList.add('nt-wake');
      ctx.el.classList.toggle('nt-pull', n === 1 && prev === 0 && !ctx.instant);
      // Under the start gate this stop sits settled (for the speaker view). There the story light
      // waits hidden, so that when the gate opens it is not left alone on the black stage before
      // the cold open has built anything; the cold open then lands it, exactly as a ?nogate start
      // does. (Runs before the engine places the light for this stop.)
      if (n === 0 && ctx.instant && document.getElementById('gate')) ctx.cardEl.removeAttribute('data-spark');
      else ctx.cardEl.setAttribute('data-spark', '0');
      if (!window.Field) return;
      // the pull-back: no colleague is lit but the pair
      if (n === 1) Field.setLit(0);
    },
    leave(ctx) {
      window.LFLeave && LFLeave(ctx);   // once faded out, it leaves the compositor
      // the pair stays lit only here; scene 11 relights it
      if (window.Field) Field.set({ pins: [] });
    },
  });
})();
