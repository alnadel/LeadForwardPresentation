/* 09 · How it runs (v2) — v1 scenes 11 (story format), 12 (operating rhythm) and
   13 (recognition) as one scene: three boards under a tab bar, one board per stop.
   Each click is a camera pan: the next board slides in from the right out of depth
   (scale + blur) while the current one slides away to the left, a light sweeps the
   frame, the field streaks and the tab indicator glides to the new tab.
   Ambient per board:
   0 · a light walks down the four fields, a reading band travels with it, each
       field's chip lights and its connector fires;
   1 · nominations drift into the always-open lane and glide to the form; a playhead
       sweeps the quarter, lighting each month, then drops a story into the annual
       collection;
   2 · the three tiers are nested squircles: the camera pulls out twice (certificate →
       quarterly feature → annual collection); a pulse travels out through the frames,
       lighting each tier as it crosses; a light orbits the outer frame. */
(function () {
  const TABS = [
    { t: 'Story format', i: 'content-layout' },
    { t: 'Quarterly rhythm', i: 'gear-clock' },
    { t: 'Recognition', i: 'document-certified' },
  ];
  const FIELDS = [
    { k: 'Purpose', q: 'What did this contribution enable?', c: 'Each selected story explains why the contribution mattered.' },
    { k: 'Value', q: 'Which Tahakom value was demonstrated?', c: 'Linked to one primary value and one observable behaviour.' },
    { k: 'Impact', q: 'What changed because of the behaviour?', c: 'Evidence is reviewed before a story is featured.' },
    { k: 'Repeat', q: 'What can other employees do?', c: 'Shared across departments with one practical takeaway.' },
  ];
  const MONTHS = [
    { m: 'Month 1', k: 'Curate', t: 'Review relevance, evidence, consent and value alignment.' },
    { m: 'Month 2', k: 'Feature', t: 'Prepare and publish selected stories; encourage team discussion.' },
    { m: 'Month 3', k: 'Reinforce', t: 'Recognise contributors, capture learning and review trends.' },
  ];
  const TIERS = [
    { t: 'Immediate recognition', s: 'Leader acknowledgement and a personal certificate.' },
    { t: 'Quarterly feature', s: 'Newsletter or internal-channel spotlight across Tahakom.' },
    { t: 'Annual recognition', s: 'Selected stories featured at a company event or in an annual collection.' },
  ];
  const nn = (i) => String(i + 1).padStart(2, '0');

  /* ── tab bar ── */
  const tabs = TABS.map((x, k) => `
    <div class="rn-tab a-flip" data-in="0" data-at="${k}" style="--k:${k};--d:${(k * .09).toFixed(2)}s">
      <span class="rn-ti">${Deck.icon(x.i)}</span><em>${nn(k)}</em><span class="rn-tl">${x.t}</span>
    </div>`).join('');

  /* ── board 0 · story format ── */
  const rows = FIELDS.map((f, i) => `
    <div class="rn-row" data-in="0" style="--k:${i};top:${96 + i * 98}px">
      <span class="rn-chip">${nn(i)}</span>
      <b class="rn-key">${f.k}</b>
      <p class="rn-q">${f.q}</p>
      <span class="rn-con"><i></i></span>
      <p class="rn-dec">${f.c}</p>
    </div>`).join('');

  /* ── board 1 · quarterly rhythm ── */
  // nominations drifting into the lane (lane-local x), one every 2 s on a 16 s loop
  const DROPS = [1010, 1250, 1120, 1380, 1060, 1300, 1180, 1440];
  const TRAY_X = 1564;
  const drops = DROPS.map((x, k) => `<span class="rn-drop" style="--x0:${x}px;--xt:${TRAY_X}px;--dl:${-k * 2}s"><span><i class="light"></i></span></span>`).join('');
  const QW = 1380;   // one quarter, stage px (three months of 460)
  const weeks = Array.from({ length: 12 }, (_, k) => `<i style="left:${((k + 1) / 13 * QW).toFixed(1)}px"></i>`).join('');
  const months = MONTHS.map((m, k) => `
    <div class="rn-m" data-in="1" style="--k:${k};left:${k * 460}px">
      <span class="rn-mk"></span>
      <div class="rn-m-lab">${m.m}</div>
      <div class="rn-m-k">${m.k}</div>
      <p class="rn-m-t">${m.t}</p>
    </div>`).join('');

  /* ── board 2 · recognition: three frames, each the centre cell of the next ── */
  const P = 6, G = 3, C = (100 - 2 * P - 2 * G) / 3;
  const pos = (j) => (P + j * (C + G)).toFixed(3) + '%';
  const cells = (cls, lit) => {
    let h = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (r === 1 && c === 1) continue;
      const i = r * 3 + c, on = lit && lit.includes(i);
      h += `<i class="rn-cell ${cls}${on ? ' f' : ''}" style="left:${pos(c)};top:${pos(r)};--tw:${((i * 7) % 9) * .41}s"><b class="rn-dot"></b>${on ? '<b class="light"></b>' : ''}</i>`;
    }
    return h;
  };
  const centre = `left:${pos(1)};top:${pos(1)};width:${C.toFixed(3)}%;height:${C.toFixed(3)}%`;
  const tiers = TIERS.map((x, k) => `
    <div class="rn-t" data-in="2" style="--k:${k}">
      <span class="node rn-tn">${nn(k)}</span>
      <div><h3 class="rn-tt">${x.t}</h3><p class="rn-ts">${x.s}</p></div>
    </div>`).join('');

  // The zoom-out is one CSS transition of the outer frame's size (so strokes stay
  // crisp). Its easing is built here: two pull-outs with a beat between them,
  // each eased in log space so the camera moves at a steady perceived speed.
  const Z = { a: 4015.5, b: 1683, c: 660 };
  function zoomEase() {
    const eio = (u) => (u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);
    const la = Math.log(Z.a), lb = Math.log(Z.b), lc = Math.log(Z.c);
    const L = (t) => (t < .42 ? la + (lb - la) * eio(t / .42) : t < .52 ? lb : lb + (lc - lb) * eio((t - .52) / .48));
    const pts = [];
    for (let i = 0; i <= 50; i++) {
      const t = i / 50, s = Math.exp(L(t));
      pts.push(((Z.a - s) / (Z.a - Z.c)).toFixed(4) + ' ' + (t * 100).toFixed(1) + '%');
    }
    return 'linear(' + pts.join(', ') + ')';
  }

  Deck.scene({
    id: 'runs',
    title: 'How it runs',
    act: 3,
    bg: 'night',
    transition: 'push',
    cues: ['01 Story format · four fields', '02 Quarterly rhythm · always open, month by month', '03 Recognition · three tiers · Featured Story'],
    holds: [10, 10, 11],
    notes: [
      'How does it run? Every featured story answers four questions: purpose, value, impact, and what others can repeat. Each field carries a design decision, so alignment is built in, not added after selection.',
      'Nominations never close: any peer or leader can nominate through a simple form. Each quarter, one cycle runs: curate in month one, feature in month two, reinforce in month three. Once a year, featured stories become a curated collection.',
      'The story comes first; the reward supports the moment. Three scales: a leader’s acknowledgement and certificate, a quarterly feature across Tahakom, an annual collection. Featured Story, not Best Story: clear criteria, and popularity never decides.',
    ],
    field: [
      { dim: .34, lit: .03, travel: .2, offset: [200, -70], litFrom: null, warm: 0, links: .5, wave: .45, streaks: .1, sparkle: 1, drift: 1,
        calm: [[100, 100, 1800, 210, .7], [100, 220, 1520, 400, .8], [120, 410, 1800, 950, .88]] },
      { offset: [20, -30], travel: .45, wave: .6, streaks: .14, sparkle: 1.3,
        calm: [[100, 100, 1800, 210, .7], [100, 220, 1400, 330, .8], [120, 350, 1800, 500, .75], [100, 530, 1800, 880, .85]] },
      { offset: [-170, 40], lit: .05, travel: .3, warm: .3, links: .65, wave: .5, streaks: .12, sparkle: 1.2,
        calm: [[100, 100, 1800, 210, .7], [100, 220, 980, 920, .88]] },
    ],
    html: `
      <div class="rn-mood"><i></i><i></i><i></i></div>

      <nav class="rn-tabs">
        ${tabs}
        <i class="rn-rail a-wipe" data-in="0" style="--d:.2s;--dur:1.2s"></i>
        <i class="rn-ind a-fade" data-in="0" style="--d:.5s"><b></b></i>
      </nav>

      <!-- 0 · story format -->
      <div class="rn-panel rn-p0" data-in="0" data-out="1">
        <h2 class="h2 rn-h rn-h0" data-in="0" data-split style="--d:.12s">Every story turns strategy into repeatable behaviour.</h2>
        <div class="rn-card a-unfold" data-in="0" style="--d:.38s;--dur:1.1s">
          <div class="rn-bandw a-fade" data-in="0" style="--d:1.5s"><i class="rn-band"></i></div>
          <div class="rn-colh a-fade" data-in="0" style="--d:.7s"><span style="left:96px">Field</span><span style="left:248px">The question</span><span style="left:878px">Design decision</span></div>
          <i class="rn-spine"></i>
          <i class="rn-port" data-spark="0" data-spark-at="c"></i>
          <div class="rn-rows" data-stagger style="--stagger:.1s;--d:.55s">${rows}</div>
          <div class="rn-walk a-fade" data-in="0" style="--d:1.6s"><i class="light"></i></div>
        </div>
      </div>

      <!-- 1 · quarterly rhythm -->
      <div class="rn-panel rn-p1" data-in="1" data-out="2">
        <h2 class="h2 rn-h rn-h1" data-in="1" data-split style="--d:.28s">The operating cycle keeps stories moving.</h2>
        <div class="rn-drops a-fade" data-in="1" style="--d:1s">${drops}</div>
        <div class="rn-lane" data-in="1" style="--d:.4s">
          <span class="rn-cap" data-spark="1" data-spark-at="c" data-spark-delay=".45"></span>
          <div class="rn-lane-lab">Always open<b>·</b>Capture</div>
          <p class="rn-lane-s">Accept peer and leader nominations through a simple form.</p>
          <span class="rn-track"></span>
          <span class="rn-tray">${Deck.icon('person-message')}</span>
        </div>
        <div class="rn-qtr">
          <div class="rn-qtr-lab a-fade" data-in="1" style="--d:.6s">One quarter</div>
          <div class="rn-axis a-wipe" data-in="1" style="--d:.55s;--dur:1.3s"><span class="rn-weeks">${weeks}</span></div>
          <div class="rn-months" data-stagger style="--stagger:.14s;--d:.65s">${months}</div>
          <div class="rn-ext a-wipe" data-in="1" style="--d:1.25s;--dur:.7s"></div>
          <div class="rn-annual" data-in="1" style="--d:1s">
            <span class="rn-coll a-materialize" data-in="1" style="--d:1.05s;--dur:1.2s"><i></i><i></i><i></i><i></i></span>
            <div class="rn-m-lab rn-an-lab">Annual</div>
            <p class="rn-an-t">Curated story collection</p>
          </div>
          <div class="rn-play a-fade" data-in="1" style="--d:1.5s"><span class="rn-fill"></span><span class="rn-play-x"><i class="light"></i></span><span class="rn-shot"><i class="light sm"></i></span></div>
        </div>
      </div>

      <!-- 2 · recognition -->
      <div class="rn-panel rn-p2" data-in="2">
        <h2 class="h2 rn-h rn-h2" data-in="2" data-split style="--d:.28s">Recognition should make the employee feel seen.</h2>
        <div class="rn-tiers" data-stagger style="--stagger:.15s;--d:.5s">${tiers}</div>
        <div class="rn-pr" data-in="2" style="--d:1.05s">
          <span class="rn-pr-k">Principle</span>
          <p class="rn-pr-t">Use <em class="amb-shimmer">Featured Story</em> — not Best Story.</p>
        </div>
        <div class="rn-view">
          <b class="rn-halo"></b>
          <div class="rn-s3">
            <b class="rn-orb"></b>
            ${cells('c3', [2, 3, 7])}
            <div class="rn-s2" style="${centre}">
              ${cells('c2')}
              <div class="rn-s1" style="${centre}" data-spark="2" data-spark-xy="1420,580" data-spark-delay=".6"></div>
            </div>
          </div>
          <b class="rn-pulse"></b>
        </div>
      </div>

      <div class="rn-sweep"></div>
    `,
    init(ctx) {
      let ease = 'cubic-bezier(.3, .7, .3, 1)';
      try { if (window.CSS && CSS.supports('transition-timing-function', 'linear(0, 1)')) ease = zoomEase(); } catch (e) { /* keep the fallback */ }
      ctx.el.style.setProperty('--rn-zoom', ease);
    },
    step(n, prev, ctx) {
      // a camera pan between boards (the scene's own entrance is the engine's push)
      if (ctx.instant || prev < 0 || n < 0 || n === prev) return;
      const fwd = n > prev;
      const sw = ctx.$('.rn-sweep');
      sw.classList.remove('run-f', 'run-b'); void sw.offsetWidth; sw.classList.add(fwd ? 'run-f' : 'run-b');
      if (window.Field) { Field.warp(fwd ? 'left' : 'right', .95, .55); Field.kick(fwd ? -170 : 170, 0, 1.5); }
      // the pull-out ends: a ripple of light leaves the collection
      if (n === 2 && fwd) ctx.after(2500, () => window.Field && Field.burst(1420, 580, { radius: 1100, dur: 2.2 }));
    },
  });
})();
