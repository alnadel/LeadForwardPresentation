/* 17 · Close — the payoff. The two colleagues who knew in scene 03 come back;
   the story passes colleague to colleague (a branching nomination chain) until
   the whole field is lit; the title returns over the dusk skyline; the last
   frame holds the decision on screen for Q&A. */
(function () {
  const PAIR = Deck.NIGHT_PAIR;
  const REST = Field.restOf(PAIR, Deck.NIGHT_OFFSET);          // where 03 left them
  const MID = [(REST[0][0] + REST[1][0]) / 2, (REST[0][1] + REST[1][1]) / 2];
  // the words sit exactly where 03 put "Two people know." (same formula as 03-night.js)
  const KNOW = { x: Math.round(Math.min(Math.max(144, MID[0] - 380), 1776 - 760)), y: Math.round(Math.max(REST[0][1], REST[1][1]) + 84) };
  const CHAIN_DELAY = 1.3;   // s after the click, once the words have landed
  const CHAIN_DUR = 3.6;     // s for the chain to reach everyone
  const TRAVEL = .6;         // stories hopping once the chain has reached everyone
  let chainT0 = null;        // performance.now() when the chain starts; -1 = already complete

  Deck.scene({
    id: 'close',
    title: 'Close',
    act: 4,
    bg: 'deep',
    chrome: { mark: false, progress: false },
    cues: ['Two people knew — the chain', 'Behind a Better Life · thank you', 'Q&A hold · the ask stays on screen'],
    holds: [9, 8, 30],
    notes: [
      'Remember the night shift: two people knew. Now the story is told, and the colleague it featured nominates the next — and the next. Let the chain run; say nothing for a moment.',
      'Behind a Better Life. Real stories, visible values, repeatable impact. Make the contribution visible. Make the learning travel. Light the way. Thank you.',
      'Hold here for questions. The decision: one quarterly pilot — open nominations, run one full cycle, report what changed. To show a slide, type its number and press Enter; End returns here.',
    ],
    field: [
      // travel starts at 0 so the callback frame matches 03.3; the loop raises it once the chain is complete
      { dim: .8, travel: 0, offset: Deck.NIGHT_OFFSET, pins: PAIR, litFrom: PAIR[0], chain: true, warm: 0, calm: [[KNOW.x + 20, KNOW.y, KNOW.x + 740, KNOW.y + 120, .85]] },
      // keep the lit field off the lockup: logo · title + Arabic · lines below
      { dim: .9, lit: 1, travel: 2.2, warm: .15, calm: [[800, 20, 1120, 205, 1], [380, 215, 1540, 470, .9], [380, 470, 1540, 700, .75]] },
      { travel: 1.4, calm: [[800, 20, 1120, 205, 1], [380, 215, 1540, 470, .9], [380, 470, 1540, 700, .75], [300, 760, 1620, 930, .7]] },
    ],
    html: `
      <div class="cl-sky a-fade" data-in="1" style="--dur:2.6s"><div class="photo amb-ken-2" style="background-image:url('assets/photos/riyadh-dusk.jpg')"></div></div>

      <!-- the same image as 03.3: a soft halo between two lights, one on each colleague -->
      <div class="cl-pair a-fade" data-in="0" data-out="1" style="--dur:1.2s">
        <b class="cl-mid"><i class="cl-halo"></i></b>
        <b class="cl-p"><i class="light"></i></b><b class="cl-p"><i class="light"></i></b>
      </div>
      <div class="cl-knew" data-out="1" style="left:${KNOW.x}px;top:${KNOW.y}px">
        <h2 class="h1" data-in="0" data-split style="--d:.15s">Two people knew.</h2>
      </div>

      <div class="cl-logo a-fade" data-in="1" style="--d:.1s;--dur:1.4s">${Deck.logo()}</div>
      <div class="cl-main">
        <h1 class="display cl-title" data-in="1" data-split style="--d:.25s">Behind a Better Life</h1>
        <div class="cl-ar ar a-blur" data-in="1" lang="ar" dir="rtl" style="--d:.6s">خلف حياة أفضل</div>
        <p class="cl-make" data-in="1" style="--d:.85s">Make the contribution visible. Make the learning travel.</p>
        <p class="cl-way" data-in="1" style="--d:1.05s"><i class="light sm"></i><span>Light the way.</span></p>
        <div class="cl-thanks" data-in="1" style="--d:1.15s">Thank you</div>
      </div>

      <div class="cl-ask" data-in="2" style="--d:.1s">
        <div class="cl-ask-l">
          <div class="kicker">The ask</div>
          <div class="cl-ask-h">Approve a one-quarter pilot.</div>
        </div>
        <div class="cl-ask-r" data-stagger style="--stagger:.1s">
          <span class="cl-step" data-in="2" style="--d:.3s"><b>01</b>Open nominations</span>
          <span class="cl-step" data-in="2" style="--d:.3s"><b>02</b>Run one full cycle</span>
          <span class="cl-step" data-in="2" style="--d:.3s"><b>03</b>Report what changed</span>
        </div>
      </div>
    `,
    init(ctx) {
      const midEl = ctx.$('.cl-mid'), lightEls = ctx.$$('.cl-p');
      // follow the pinned colleagues as the camera settles (fallback: where 03 left them)
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
        // ease-in: a slow first hop from the pair, then it accelerates outwards
        Field.setLit(u <= 0 ? 0 : Math.min(1, u * u * (1.6 - .6 * u)));
        Field.set({ travel: u >= 1 ? TRAVEL : 0 });
      });
    },
    step(n, prev, ctx) {
      if (n < 0) { chainT0 = null; return; }
      if (n === 0) {
        chainT0 = ctx.instant || prev > 0 ? -1 : performance.now() + CHAIN_DELAY * 1000;
        // arriving from 16 the camera pans to the night offset: settle it quickly
        // (after the engine applies this stop's field) so the pair is in 03's place
        // by the time the words land
        if (!ctx.instant) ctx.after(0, () => window.Field && Field.set({}, 1.35));
      }
    },
    leave() { chainT0 = null; },
  });
})();
