/* 01 · Open (v2) — the title opens out of the question's light (iris) over the
   night operations centre; the video wall is alive with data; at stop 1 the story
   light is born at the key line.
   Stop 0 · key: the title (Arabic and the kicker support it). The iris reveals a
   glow at its origin that dissipates while the plate settles out of a bright focus
   pull, then the lockup builds.
   Stop 1 · key: "One person's story can light the way for others." with the light;
   the tagline above it is a quiet support line. */
(function () {
  const BIRTH = [159, 900];   // the light's birthplace: the centre of .op-light (keep in step with .op-line in 01-open.css)
  Deck.scene({
    id: 'open',
    title: 'Behind a Better Life',
    act: 0,
    bg: 'night',
    transition: 'iris',       // the title opens out of the light resting under the question
    irisBurst: 1400,
    chrome: { mark: false, progress: false },
    cues: ['Title', 'Tagline · the light is born'],
    holds: [5, 7],
    notes: [
      'Hold that thought — we will come back to it. Now introduce yourselves: the team, Lead Forward 2026, Behind a Better Life. Say the decision up front: in fifteen minutes we will ask you to approve one quarterly pilot.',
      'Real stories. Visible values. Repeatable impact. One person’s story can light the way for others — that light is the thread through everything that follows.',
    ],
    field: [
      { dim: .5, lit: 0, travel: .3, offset: [0, 0], links: .45, wave: .5, streaks: .16, sparkle: 1.4, calm: [[100, 90, 1120, 980, .72]] },
      { dim: .72, lit: .02, travel: .6, litFrom: [300, 900], links: .7, streaks: .22 },
    ],
    html: `
      <div class="op-cam">
        <!-- the plate: the photo and its working video wall move together (far layer) -->
        <div class="op-plate amb-ken-strong">
          <div class="photo op-photo" style="background-image:url('assets/photos/ops-centre-night.jpg')"></div>
          <div class="op-wall">
            ${Array.from({ length: 18 }, (_, i) => `<b style="--x:${(i * 37) % 96}%;--y:${(i * 53) % 88}%;--w:${18 + (i * 7) % 26}px;--t:${2.4 + (i % 5) * .7}s;--dl:${-i * .43}s"></b>`).join('')}
            <em class="op-scanline"></em>
          </div>
        </div>
        <div class="amb-leak op-leak"></div>
      </div>
      <div class="fill op-veil"></div>
      <div class="op-glow"></div>
      <!-- the light the title opened out of (01 enters with 'iris' from the hook's light): it dissipates -->
      <i class="op-iris"></i>
      <!-- mid layer: dust; near layer: soft out-of-focus lights drifting the other way (parallax) -->
      <div class="amb-dust op-dust">${Array.from({ length: 26 }, (_, i) => `<i style="left:${(i * 137) % 100}%;top:${40 + (i * 71) % 60}%;--t:${10 + (i % 6) * 2.4}s;--dl:${-i * 1.1}s;--dx:${(i % 2 ? 1 : -1) * (30 + (i * 13) % 60)}px;--dy:${-160 - (i * 29) % 200}px"></i>`).join('')}</div>
      <div class="op-near">${[[1180, 120, 120, 'a'], [1760, 300, 170, 'b'], [1500, 760, 210, 'a'], [1860, 860, 120, 'b'], [1180, 980, 150, 'b'], [1320, 420, 70, 'a']].map(([x, y, sz, k], i) => `<i class="${k}" style="left:${x}px;top:${y}px;--sz:${sz}px;--dl:${-i * 3.7}s"></i>`).join('')}</div>

      <div class="op-logo a-materialize" data-in="0" style="--d:.2s;--dur:1.6s">${Deck.logo()}</div>
      <div class="kicker op-kicker a-wipe" data-in="0" style="--d:.9s">Lead Forward 2026 · Capstone · Inspire Others</div>
      <h1 class="display op-title" data-in="0" data-split style="--d:1.05s">Behind a<br>Better Life</h1>
      <div class="op-ar ar a-blur" data-in="0" lang="ar" dir="rtl" style="--d:1.9s;--dur:1.4s">خلف حياة أفضل</div>

      <!-- the birth of the story light: motes gather, then it ignites with a flare -->
      <div class="op-birth" style="left:${BIRTH[0]}px;top:${BIRTH[1]}px"><i class="op-bloom"></i><i class="op-flare"></i>${Array.from({ length: 12 }, (_, i) => `<b style="--a:${i * 30 + 8}deg;--r:${120 + (i * 47) % 90}px;--k:${i}"></b>`).join('')}</div>
      <div class="op-rule a-wipe" data-in="1"></div>
      <p class="op-tag" data-in="1" data-split style="--d:.15s">Real stories. Visible values. Repeatable impact.</p>
      <div class="op-line" data-in="1" style="--d:.8s;--dur:.7s">
        <span class="op-light" data-spark="1" data-spark-at="c" data-spark-delay=".9"><b class="op-ring"></b><b class="op-ring" style="animation-delay:-1.6s"></b></span>
        <span class="op-line-t">One person’s story can light the way for others.</span>
      </div>
    `,
    step(n, prev, ctx) {
      // the birth plays once, on a live click (a settled landing shows the light already born)
      ctx.el.classList.toggle('op-born', n === 1 && !ctx.instant);
      if (n === 1 && !ctx.instant) {
        ctx.after(1150, () => window.Field && Field.burst(BIRTH[0], BIRTH[1], { radius: 2400, dur: 3.4 }));
      }
    },
  });
})();
