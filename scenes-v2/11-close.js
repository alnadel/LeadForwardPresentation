/* 11 · Close (v2) — the payoff. The two colleagues who knew in 02 come back at
   exactly the same place; the story passes colleague to colleague (a branching
   nomination chain) until the whole field is lit. Then the brand frame rises
   over the dusk skyline with the ask strip beneath it, and holds for Q&A while
   stories keep travelling above the city and its traffic keeps moving.
   Port of v1 17: the pinned pair, the chain drive loop, the KNOW placement
   formula, Deck.NIGHT_PAIR / Deck.NIGHT_OFFSET. v1 stops 1 and 2 are merged. */
(function () {
  const PAIR = Deck.NIGHT_PAIR;
  const REST = Field.restOf(PAIR, Deck.NIGHT_OFFSET);          // where 02 left them
  const MID = [(REST[0][0] + REST[1][0]) / 2, (REST[0][1] + REST[1][1]) / 2];
  // the words sit exactly where 02 put "Two people know." (same formula as v1 03-night.js)
  const KNOW = { x: Math.round(Math.min(Math.max(144, MID[0] - 380), 1776 - 760)), y: Math.round(Math.max(REST[0][1], REST[1][1]) + 84) };
  const CHAIN_DELAY = 2.2;   // s after the click: the words have landed and the iris flash has faded
  const CHAIN_DUR = 3.6;     // s for the chain to reach everyone
  const TRAVEL = 1.1;        // stories hopping once the chain has reached everyone
  let chainT0 = null;        // performance.now() when the chain starts; -1 = already complete

  /* the dusk skyline: traffic keeps moving on the two roads (box px: stage y − 440) */
  const ROADS = [
    // headlights coming towards us on the frontage road
    { d: 'M1796 331 Q1320 424 420 640', k: 'w', t: 5.6, n: 3 },
    { d: 'M1796 339 Q1260 452 660 640', k: 'w', t: 6.4, n: 3 },
    // tail lights heading away on the highway
    { d: 'M1470 640 Q1650 470 1808 327', k: 'r', t: 5.2, n: 2 },
    { d: 'M1650 640 Q1762 470 1818 327', k: 'r', t: 4.6, n: 2 },
    { d: 'M1800 640 Q1832 470 1826 327', k: 'r', t: 5.8, n: 2 },
  ];
  const trails = ROADS.map((r, i) => Array.from({ length: r.n }, (_, j) =>
    `<path class="cl-car ${r.k}" d="${r.d}" pathLength="1000" style="--t:${r.t}s;--dl:${(-(j / r.n) * r.t - i * .7).toFixed(2)}s"/>`).join('')).join('');

  /* stories travelling across the lit field, in the band between the brand block and the ask */
  const STORIES = [
    { d: 'M-80 672 C 360 636, 700 712, 1000 676 S 1640 650, 2000 694', t: 11, dl: -1.5 },
    { d: 'M2000 656 C 1600 700, 1260 640, 940 690 S 320 664, -80 700', t: 13, dl: -7.5 },
    { d: 'M-80 704 C 420 684, 820 660, 1180 698 S 1700 712, 2000 676', t: 15, dl: -11 },
  ];
  const stories = STORIES.map((s) => `<i class="cl-story" style="offset-path:path('${s.d}');--t:${s.t}s;--dl:${s.dl}s"><b></b><i class="light sm"></i></i>`).join('');

  Deck.scene({
    id: 'close',
    title: 'Close',
    act: 4,
    bg: 'deep',
    transition: 'iris',
    spark: false,
    irisBurst: 520, // a small flash only: the field must still read dark before the chain
    chrome: { mark: false, progress: false },
    cues: ['Two people knew — the chain', 'Behind a Better Life · thank you · the ask stays on screen for Q&A'],
    holds: [9, 30],
    notes: [
      'Remember the night shift: two people knew. Now the story is told, and the colleague it featured nominates the next — and the next. Let the chain run; say nothing for a moment.',
      'Behind a Better Life. Make the contribution visible. Make the learning travel. Light the way. Thank you. Hold here for questions: the ask stays on screen. For detail, type a slide number and press Enter; End returns here.',
    ],
    field: [
      // travel starts at 0 so the callback frame matches 02.1; the loop raises it once the chain is complete
      { dim: .8, travel: 0, offset: Deck.NIGHT_OFFSET, pins: PAIR, litFrom: PAIR[0], chain: true, warm: 0, drift: .35, links: .55, wave: .45, streaks: .1, sparkle: 1,
        calm: [[KNOW.x + 20, KNOW.y, KNOW.x + 740, KNOW.y + 120, .85]] },
      // the lit field frames the brand block: calm (nearly dark) behind the lockup, the title
      // block and the ask card, alive at the sides and in the band where the stories travel
      { dim: .9, lit: 1, travel: 2.2, warm: .15, drift: .6, pins: [], links: .42, wave: .5, streaks: .16, sparkle: 1.4,
        calm: [[720, 10, 1200, 196, 1], [200, 150, 1720, 470, 1], [280, 440, 1640, 640, .95], [100, 720, 1820, 980, .9]] },
    ],
    html: `
      <div class="cl-sky a-fade" data-in="1" style="--dur:2.6s">
        <div class="cl-cam amb-ken-strong">
          <div class="photo cl-photo" style="background-image:url('assets/photos/riyadh-dusk.jpg')"></div>
          <div class="cl-shade"></div>
          <svg class="cl-trails" viewBox="0 0 1920 640" aria-hidden="true">${trails}</svg>
        </div>
        <div class="amb-leak cl-leak"></div>
      </div>
      <!-- a soft dark pool keeps the lit field and the city lights off the words -->
      <div class="cl-hush a-fade" data-in="1" style="--d:.1s;--dur:1.6s"></div>
      <div class="cl-stories a-fade" data-in="1" style="--d:1s;--dur:1.2s">${stories}</div>

      <!-- the same image as 02.1: a soft halo between two lights, one on each colleague -->
      <div class="cl-pair a-fade" data-in="0" data-out="1" style="--dur:1.2s">
        <b class="cl-mid"><i class="cl-halo"></i></b>
        <b class="cl-p"><i class="light"></i></b><b class="cl-p"><i class="light"></i></b>
      </div>
      <div class="cl-knew" data-out="1" style="left:${KNOW.x}px;top:${KNOW.y}px">
        <h2 class="h1" data-in="0" data-split style="--d:.15s">Two people knew.</h2>
      </div>

      <div class="cl-logo a-materialize" data-in="1" style="--d:.05s;--dur:1.3s">${Deck.logo()}</div>
      <div class="cl-main">
        <h1 class="display cl-title" data-in="1" data-split style="--d:.15s">Behind a Better Life</h1>
        <div class="cl-ar ar a-blur" data-in="1" lang="ar" dir="rtl" style="--d:.45s">خلف حياة أفضل</div>
        <p class="cl-make" data-in="1" style="--d:.6s">Make the contribution visible. Make the learning travel.</p>
        <p class="cl-way" data-in="1" style="--d:.72s"><i class="light sm"></i><span class="amb-shimmer">Light the way.</span></p>
        <div class="cl-thanks a-fade" data-in="1" style="--d:.84s">Thank you</div>
      </div>

      <div class="cl-ask glass live a-unfold" data-in="1" style="--d:.8s">
        <div class="cl-ask-l">
          <div class="kicker">The ask</div>
          <div class="cl-ask-h">Approve a one-quarter pilot.</div>
        </div>
        <i class="cl-ask-div"></i>
        <div class="cl-ask-r" data-stagger style="--stagger:.1s">
          <i class="cl-rail"><b></b></i>
          <span class="cl-step a-left" data-in="1" style="--d:1s"><b>01</b>Open nominations</span>
          <span class="cl-step a-left" data-in="1" style="--d:1s"><b>02</b>Run one full cycle</span>
          <span class="cl-step a-left" data-in="1" style="--d:1s"><b>03</b>Report what changed</span>
        </div>
      </div>
    `,
    init(ctx) {
      const midEl = ctx.$('.cl-mid'), lightEls = ctx.$$('.cl-p');
      // follow the pinned colleagues as the camera settles (fallback: where 02 left them)
      ctx.placePair = () => {
        const lp = window.Field ? Field.pinned() : [];
        const p = lp.length === 2 ? lp : REST;
        midEl.style.transform = 'translate(' + ((p[0][0] + p[1][0]) / 2).toFixed(1) + 'px,' + ((p[0][1] + p[1][1]) / 2).toFixed(1) + 'px)';
        lightEls.forEach((el, i) => { el.style.transform = 'translate(' + p[i][0].toFixed(1) + 'px,' + p[i][1].toFixed(1) + 'px)'; });
      };
      midEl.style.transform = 'translate(' + MID[0].toFixed(1) + 'px,' + MID[1].toFixed(1) + 'px)';
      lightEls.forEach((el, i) => { el.style.transform = 'translate(' + REST[i][0].toFixed(1) + 'px,' + REST[i][1].toFixed(1) + 'px)'; });
    },
    enter(ctx) {
      ctx.loop(() => {
        if (!window.Field) return;
        if (ctx.step <= 0) ctx.placePair();
        if (ctx.step >= 1 || chainT0 === -1) { Field.setLit(1); if (ctx.step === 0) Field.set({ travel: TRAVEL }); return; }
        if (chainT0 == null) { Field.setLit(0); return; }
        const u = (performance.now() - chainT0) / 1000 / CHAIN_DUR;
        // complete: hand over to the branch above (v1's curve turns negative past u≈2.7,
        // which darkened the field again if the presenter lingered on this stop)
        if (u >= 1) { chainT0 = -1; Field.setLit(1); Field.set({ travel: TRAVEL }); return; }
        // ease-in: a slow first hop from the pair, then it accelerates outwards
        Field.setLit(u <= 0 ? 0 : u * u * (1.6 - .6 * u));
        Field.set({ travel: 0 });
      });
    },
    step(n, prev, ctx) {
      if (n < 0) { chainT0 = null; return; }
      if (n === 0) {
        chainT0 = ctx.instant || prev > 0 ? -1 : performance.now() + CHAIN_DELAY * 1000;
        // arriving from 10 the camera pans to the night offset: settle it quickly
        // (after the engine applies this stop's field) so the pair is in 02's place
        // by the time the words land
        if (!ctx.instant) ctx.after(0, () => window.Field && Field.set({}, 1.35));
      }
    },
    leave() { chainT0 = null; },
  });
})();
