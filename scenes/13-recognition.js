/* 13 · Recognition — a zoom-out through nested brand squircles. The story light
   sits in a small frame (the certificate on a desk); the camera pulls out until
   that frame is one square in the internal channel, then one square in the annual
   collection. The tier labels stay upright in their own column, outside the frames.
   The frames are laid out in % of the outermost box, and only that box is resized
   per stop, so strokes stay crisp and the light stays centred on screen. */
(function () {
  const TIERS = [
    { t: 'Immediate recognition', s: 'Leader acknowledgement and a personal certificate.' },
    { t: 'Quarterly feature', s: 'Newsletter or internal-channel spotlight across Tahakom.' },
    { t: 'Annual recognition', s: 'Selected stories featured at a company event or in an annual collection.' },
  ];
  // 3 × 3 grid inside every frame; the centre cell holds the next frame down
  const P = 6, G = 3, C = (100 - 2 * P - 2 * G) / 3;
  const pos = (j) => (P + j * (C + G)).toFixed(3) + '%';
  const cells = (cls, lit) => {
    let h = '';
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      if (r === 1 && c === 1) continue;
      const on = lit && lit.includes(r * 3 + c);
      // every cell holds a faint story of its own; the featured ones light up at stop 4
      h += `<i class="rc-cell ${cls}${on ? ' f' : ''}" style="left:${pos(c)};top:${pos(r)}"><b class="rc-dot"></b>${on ? '<b class="light"></b>' : ''}</i>`;
    }
    return h;
  };
  const centre = `left:${pos(1)};top:${pos(1)};width:${C.toFixed(3)}%;height:${C.toFixed(3)}%`;

  const tiers = TIERS.map((x, k) => `
    <div class="rc-t" data-in="${k + 1}" data-at="${k + 1}" style="--d:${k ? '.9s' : '.3s'}">
      <span class="node rc-n">0${k + 1}</span>
      <div><h3 class="rc-tt">${x.t}</h3><p class="rc-ts">${x.s}</p></div>
    </div>`).join('');

  Deck.scene({
    id: 'recognition',
    title: 'Recognition',
    act: 3,
    bg: 'plum',
    cues: ['Recognition should make the employee feel seen', '01 · Immediate recognition', '02 · Quarterly feature (skippable)', '03 · Annual recognition', 'Principle · Featured Story, not Best Story'],
    notes: [
      'Recognition should make the employee feel seen. The story and its impact come first. The reward supports the moment; it is not the point.',
      'Recognition works at three scales. The first is immediate: the leader acknowledges the contribution, and the colleague receives a personal certificate.',
      'Each quarter, featured stories reach the whole organisation, through a newsletter or an internal-channel spotlight across Tahakom. The same story, now seen far beyond the desk.',
      'Once a year, selected stories are featured at a company event or gathered in an annual collection. Each tier is the same story, reaching further.',
      'One principle protects all of this. We use Featured Story, not Best Story. Selection follows clear criteria, and popularity does not decide the outcome. There are no rankings and no podium.',
    ],
    field: [
      { dim: .32, lit: .02, travel: .06, offset: [80, 200], litFrom: null, warm: .3, calm: [[80, 120, 940, 960, .85]] },
      {}, { dim: .28, travel: .1 }, { lit: .04 },
      { lit: .06, travel: .14 },
    ],
    html: `
      <div class="rc-hd">
        <div class="kicker" data-in="0" data-out="4">Recognition</div>
        <h2 class="h2 rc-h" data-in="0" data-out="4" data-split style="--d:.1s">Recognition should make the employee feel seen.</h2>
        <p class="rc-sub" data-in="0" data-out="4" style="--d:.55s">The story and its impact come first; the reward supports the moment.</p>
      </div>
      <div class="rc-hd">
        <div class="kicker" data-in="4">Principle</div>
        <h2 class="h2 rc-h rc-pr" data-in="4" data-split style="--d:.25s">Use Featured <span class="rc-nw">Story —</span> not Best Story.</h2>
        <p class="rc-sub" data-in="4" style="--d:.7s">Selection follows clear criteria; popularity does not decide the outcome.</p>
      </div>

      <div class="rc-tiers">${tiers}</div>

      <div class="rc-s3">
        ${cells('c3', [2, 3, 7])}
        <div class="rc-s2" style="${centre}">
          ${cells('c2')}
          <div class="rc-s1" style="${centre}">
            <span class="rc-wave"><b class="rc-halo"></b><b class="rc-pulse"></b></span>
            <span class="rc-cert">${Deck.icon('document-certified')}</span>
            <span class="rc-lt"><i class="light"></i></span>
          </div>
        </div>
      </div>
    `,
  });
})();
