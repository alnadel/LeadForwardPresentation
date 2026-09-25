/* 01 · Open — the title over the night operations centre. One light ignites. */
Deck.scene({
  id: 'open',
  title: 'Behind a Better Life',
  act: 0,
  bg: 'night',
  chrome: { mark: false, progress: false },
  cues: ['Title', 'Tagline · one light ignites'],
  holds: [5, 7],
  notes: [
    'Let the title sit. Introduce the team and the programme: Lead Forward 2026. Say the decision up front: “In the next fifteen minutes we will ask you to approve one quarterly pilot.”',
    '“Real stories. Visible values. Repeatable impact.” Then: “One person’s story can light the way for others.” That light is the thread through everything that follows.',
  ],
  field: [
    { dim: .5, lit: 0, travel: 0, offset: [0, 0], calm: [[100, 90, 1100, 980, .7]] },
    { dim: .7, lit: .02, travel: .15, litFrom: [300, 905] },
  ],
  html: `
    <div class="photo op-photo amb-ken" style="background-image:url('assets/photos/ops-centre-night.jpg')"></div>
    <div class="fill op-veil"></div>
    <div class="op-wall amb-breathe"></div>
    <div class="op-motes">${Array.from({ length: 14 }, (_, i) => `<i style="--x:${(i * 137) % 100}%;--y:${(i * 71) % 100}%;--t:${9 + (i % 5) * 2}s;--dl:${-i * 1.3}s"></i>`).join('')}</div>

    <div class="op-logo a-fade" data-in="0" style="--d:.2s;--dur:1.6s">${Deck.logo()}</div>
    <div class="kicker op-kicker a-wipe" data-in="0" style="--d:.9s">Team presentation · Lead Forward 2026</div>
    <h1 class="display op-title" data-in="0" data-split style="--d:1.1s">Behind a<br>Better Life</h1>
    <div class="op-ar ar a-blur" data-in="0" style="--d:1.9s;--dur:1.4s">خلف حياة أفضل</div>

    <div class="op-rule a-wipe" data-in="1"></div>
    <p class="op-tag" data-in="1" data-split style="--d:.2s">Real stories. Visible values. Repeatable impact.</p>
    <div class="op-line" data-in="1" style="--d:1.5s">
      <span class="op-light"><i class="light"></i><b class="amb-ring"></b><b class="amb-ring" style="animation-delay:-1.6s"></b></span>
      <span class="op-line-t">One person’s story can light the way for others.</span>
    </div>
  `,
  step(n, prev, ctx) {
    if (n === 1 && !ctx.instant) {
      ctx.after(1500, () => window.Field && Field.burst(300, 905, { radius: 2300, dur: 3.2 }));
    }
  },
});
