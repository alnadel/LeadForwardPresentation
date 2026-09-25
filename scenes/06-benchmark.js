/* 06 · Reading the numbers — a full-width dumbbell chart on one shared 0–100%
   axis. Each row joins a queen-blue benchmark dot to a Tahakom dot; the Tahakom
   dot leaves the benchmark value and travels to our value, drawing the segment,
   and the difference is printed beside it. Mechanism rows (purple) sit behind the
   benchmark; willingness rows (teal) sit ahead. The directional caveat and the
   sources stay on screen at every stop. */
(function () {
  const X0 = 600, W = 960;                  // stage x of 0%, and the width of 0–100%
  const X = (v) => X0 + W * v / 100;
  const ROWS = [
    { g: 'mech', label: 'Org-wide recognition', t: 8, b: 22, y: 358, stop: 1, d: 0 },
    { g: 'mech', label: 'Choice in recognition', t: 49, b: 64, y: 424, stop: 1, d: .22 },
    { g: 'will', label: 'Peer recognition', t: 89, b: 41, y: 524, stop: 2, d: 0, hero: true },
    { g: 'will', label: 'Connection / loyalty', t: 80, b: 77, y: 590, stop: 2, d: .22, note: 'broadly aligned' },
  ];
  const GROUPS = [
    { g: 'mech', label: 'The mechanism', y: 300, stop: 1 },
    { g: 'will', label: 'The willingness', y: 466, stop: 2 },
  ];
  const TICKS = [0, 25, 50, 75, 100];

  const row = (r, i) => {
    const tx = X(r.t), bx = X(r.b);
    const behind = r.t < r.b;                // Tahakom dot sits left of the benchmark
    const diff = r.t - r.b;
    // the difference sits just beyond the right-hand value label
    const deltaX = Math.max(tx, bx) + 14 + 10 + 61 + 26;
    return `
      <div class="bm-row ${r.g}${r.hero ? ' hero' : ''} a-fade" data-in="${r.stop}" style="top:${r.y - 35}px;--dx:${(tx - bx).toFixed(1)}px;--d:${r.d}s;--gp:${(i % 2) * 1.3}s;--gt:${[6, 6.8, 6.2, 7.2][i]}s;--tl:${Math.min(70, Math.abs(tx - bx) * .45).toFixed(0)}px;--bp:${(-i * .85 - .4).toFixed(2)}s">
        <div class="bm-lab">${r.label}</div>
        <i class="bm-seg ${behind ? 'to-l' : 'to-r'}" style="left:${Math.min(tx, bx)}px;width:${Math.abs(tx - bx)}px"></i>
        <span class="bm-dot bm-b" style="left:${bx}px"><i><u></u></i><b class="${behind ? 'r' : 'l'}">${r.b}%</b></span>
        <span class="bm-dot bm-t" style="left:${bx}px"><i><u></u></i><b class="${behind ? 'l' : 'r'}">${r.t}%</b></span>
        <i class="bm-glint" style="left:${bx}px"></i>
        <div class="bm-delta" style="left:${deltaX}px"><span class="num">${diff < 0 ? '−' : '+'}${Math.abs(diff)}</span><small>pts</small>${r.note ? `<em>${r.note}</em>` : ''}</div>
      </div>`;
  };

  Deck.scene({
    id: 'benchmark',
    title: 'Reading the numbers',
    act: 1,
    bg: 'deep',
    cues: ['Willingness is strong; the mechanism is weak', 'The mechanism · −14 and −15 pts', 'The willingness · +48 and +3 pts', 'Reading · build the channel, then test it'],
    holds: [8, 10, 10, 8],
    notes: [
      'Now let’s read our survey against outside benchmarks. The short version is the headline: willingness is strong; the mechanism is weak. One caveat before any number: this is a directional comparison only. The benchmarks come from Gallup and Workhuman’s 2024 research, the Achievers Workforce Institute and Globoforce/Workhuman. Their measures and populations are not the same as ours, and they are not Saudi norms.',
      'First, the mechanism: how recognition actually travels. Org-wide recognition: 8% of our colleagues, against a benchmark of 22%. That is 14 points behind, and it is the same 8% you just saw as recognition reach. Choice in recognition: 49% against 64%, 15 points behind.',
      'Now the willingness. Peer recognition: 89% of our colleagues, against a benchmark of 41%. That is 48 points ahead, the standout number on this slide. Connection and loyalty: 80% against 77%. Three points, so broadly aligned. Read these as direction, not as precise scores.',
      'So the reading is simple. We are behind on the mechanism and ahead on the willingness. People are ready to recognise each other; what is missing is the channel that carries it. Build the channel, then test it. That is what the pilot does.',
    ],
    field: [
      { dim: .3, lit: 0, travel: 0, warm: 0, offset: [-190, 110], calm: [[100, 120, 1600, 290, .55], [100, 290, 1820, 960, .45]] },
      {},
      {},
      { dim: .32 },
    ],
    html: `
      <div class="pad">
        <div class="kicker" data-in="0">Reading the numbers</div>
        <h2 class="h2 bm-h" data-in="0" data-split style="--d:.15s">Willingness is strong; the mechanism is weak.</h2>
      </div>

      <div class="bm-chart">
        ${TICKS.map((v, k) => `<i class="bm-grid${v % 50 ? '' : ' major'}" data-in="0" style="left:${X(v)}px;--d:${.45 + k * .07}s;--dur:1s"></i>`).join('')}
        <i class="bm-axis a-wipe" data-in="0" style="left:${X0}px;width:${W}px;--d:.35s;--dur:1.2s"></i>
        <i class="bm-scan"></i>
        ${ROWS.map((r, k) => `<i class="bm-lane a-wipe" data-in="0" style="top:${r.y}px;left:${X0}px;width:${W}px;--d:${.55 + k * .08}s;--dur:1.1s"></i>`).join('')}
        <div class="bm-ticks">${TICKS.map((v, k) => `<span class="a-fade" data-in="0" style="left:${X(v) - 50}px;--d:${.6 + k * .07}s">${v}%</span>`).join('')}</div>
        <div class="bm-legend a-fade" data-in="0" style="--d:.9s">
          <span><i class="k-t"></i>Tahakom</span><span><i class="k-b"></i>Benchmark</span>
        </div>

        ${GROUPS.map((g) => `<div class="bm-grp ${g.g} a-fade" data-in="${g.stop}" style="top:${g.y}px"><i></i><span>${g.label}</span><b></b></div>`).join('')}
        ${ROWS.map(row).join('')}
      </div>

      <p class="bm-cav a-fade" data-in="0" style="--d:1s">Directional comparison only: measures and populations are not identical.</p>

      <div class="kicker bm-read-k a-fade" data-in="3">Reading</div>
      <p class="bm-read" data-in="3" data-split style="--d:.1s"><span class="purple">Behind on the mechanism,</span> <span class="teal">ahead on the willingness —</span><br>build the channel, then test it.</p>

      <p class="bm-src a-fade" data-in="0" style="--d:1.1s"><b>Sources:</b> Tahakom internal survey (158 responses); Gallup &amp; Workhuman 2024, Achievers Workforce Institute, Globoforce/Workhuman.<br>Benchmarks are directional and are not Saudi norms.</p>
    `,
  });
})();
