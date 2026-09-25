/* 17 · Close — the payoff. The two colleagues who knew in scene 03 come back;
   the story passes colleague to colleague (a branching nomination chain) until
   the whole field is lit; the title returns over the dusk skyline; the last
   frame holds the decision on screen for Q&A. */
(function () {
  const PAIR = Deck.NIGHT_PAIR;
  const MID = [(PAIR[0][0] + PAIR[1][0]) / 2, (PAIR[0][1] + PAIR[1][1]) / 2];
  const CHAIN_DELAY = 1.3;   // s after the click, once the words have landed
  const CHAIN_DUR = 5.2;     // s for the chain to reach everyone
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
      'Remember the night shift: two people knew. Now watch what happens when that story is told, and the person it featured nominates the next one — and the next. Let the chain run; say nothing for a moment.',
      'Behind a Better Life. Real stories, visible values, repeatable impact. Make the contribution visible. Make the learning travel. Light the way. Thank you.',
      'Leave this on screen for questions: the decision is one quarterly pilot — open nominations, run one full cycle, report what changed. To answer a question with a slide, type its number and press Enter; press End to come back here.',
    ],
    field: [
      { dim: .78, travel: .6, offset: [0, 0], pins: PAIR, litFrom: MID, chain: true, warm: 0, calm: [[100, 380, 900, 720, .55]] },
      { dim: .9, lit: 1, travel: 2.2, warm: .15, calm: [[260, 60, 1660, 700, .55]] },
      { travel: 1.4, calm: [[260, 60, 1660, 700, .55], [300, 760, 1620, 930, .7]] },
    ],
    html: `
      <div class="cl-sky a-fade" data-in="1" style="--dur:2.6s"><div class="photo amb-ken-2" style="background-image:url('assets/photos/riyadh-dusk.jpg')"></div></div>

      <div class="cl-pair a-fade" data-in="0" data-out="1" style="left:${MID[0]}px;top:${MID[1]}px;--dur:1.2s">
        <i class="light"></i><b class="amb-ring"></b><b class="amb-ring" style="animation-delay:-1.6s"></b>
      </div>
      <div class="cl-knew" data-out="1">
        <h2 class="h1" data-in="0" data-split style="--d:.15s">Two people knew.</h2>
        <p class="cl-knew-sub" data-in="0" style="--d:.7s">With Behind a Better Life, the story keeps going.</p>
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
    enter(ctx) {
      ctx.loop(() => {
        if (!window.Field) return;
        if (ctx.step >= 1 || chainT0 === -1) { Field.setLit(1); return; }
        if (chainT0 == null) { Field.setLit(0); return; }
        const u = (performance.now() - chainT0) / 1000 / CHAIN_DUR;
        // ease-in: a slow first hop from the pair, then it accelerates outwards
        Field.setLit(u <= 0 ? 0 : Math.min(1, u * u * (1.6 - .6 * u)));
      });
    },
    step(n, prev, ctx) {
      if (n < 0) { chainT0 = null; return; }
      if (n === 0) {
        chainT0 = ctx.instant || prev > 0 ? -1 : performance.now() + CHAIN_DELAY * 1000;
      }
    },
    leave() { chainT0 = null; },
  });
})();
