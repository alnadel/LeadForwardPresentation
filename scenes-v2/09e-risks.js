/* 09e · What could break it (v4) — the risk plan, in one stop. Four glass rows
   slide in one by one; in each, the risk (left) is the hero, carried by its own
   picture on a raised plum key (a podium, an empty inbox, a locked document, dots
   bunched in one corner). As a row lands, its guard (right) reaches back along a
   stem to a raised teal shield at the risk's edge, and the shield's padlock snaps
   shut: the guard locks on. The owner sits quietly at the end of the row. The
   spark lands on the corner of the first risk's key.
   Ambient: every 8 s each lock is checked in turn: the shield glows, a light runs
   back along the row's top and bottom edges to the risk's key while the risk's cell
   warms from the shield outwards, and the key lights teal for a moment (the guard's
   hold wraps the whole risk). Nothing moves inside the text. A small caption carries
   the change message.
   GPU: five small animated pieces per row (shield glow, cell wash, two edge lights, key glow);
   the one-shot lights (the stem's leading light, the click ring) play only on a live
   entrance and rest invisible, so a jump or a step back shows the same settled frame. */
(function () {
  // the risks' pictures: outline, currentColor, round caps (48-unit box, drawn at 58px)
  const star = (cx, cy, R, r) => 'M' + Array.from({ length: 10 }, (_, k) => {
    const a = -Math.PI / 2 + k * Math.PI / 5, d = k % 2 ? r : R;
    return (cx + d * Math.cos(a)).toFixed(2) + ' ' + (cy + d * Math.sin(a)).toFixed(2);
  }).join('L') + 'Z';
  const ICONS = {
    // a popularity contest: the podium, a star over the winner
    podium: `<path d="M4 43H44"/><path d="M17.5 43V22h13v21"/><path d="M5.5 43V29h12"/><path d="M30.5 34h12v9"/><path d="M22 28.5h4" opacity=".55"/><path d="${star(24, 11.5, 6.4, 2.7)}"/>`,
    // nominations dry up: an empty inbox, a dashed arrow with nothing on it
    inbox: `<path d="M6 30l6.5-11h23L42 30v9.5a2.5 2.5 0 0 1-2.5 2.5h-31A2.5 2.5 0 0 1 6 39.5z"/><path d="M6 30h10.5l3 5h9l3-5H42"/><path d="M24 3.5v10" stroke-dasharray="2.4 3.6"/><path d="M19.8 10.5 24 14.7l4.2-4.2"/>`,
    // a sensitive story: the document, locked
    doc: `<path d="M23 42H12a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h15.5L37 13.5V24"/><path d="M27.5 4v9.5H37"/><path d="M15 19.5h11.5M15 25.5h9M15 31.5h5"/><rect x="26.5" y="32.5" width="16" height="11.5" rx="2.6"/><path d="M30 32.5V29a4.5 4.5 0 0 1 9 0v3.5"/><path d="M34.5 36.6v3.2"/>`,
    // stories cluster: every dot bunched in one corner
    cluster: `<rect x="5" y="5" width="38" height="38" rx="8.5"/><g class="rk-dot" stroke="none">${[[32.5, 12], [38, 12], [35.2, 17], [29.7, 17], [38, 22], [32.5, 22]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.8"/>`).join('')}</g><g opacity=".38" stroke-width="1.5">${[[13, 16], [14, 33], [26, 35], [36.5, 34]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5"/>`).join('')}</g>`,
  };
  const ROWS = [
    { risk: 'It becomes a popularity contest or a broadcast', guard: 'Peers nominate; the criteria are published.', owner: 'Curation panel', i: 'team', p: 'podium' },
    { risk: 'Nominations dry up after launch', guard: 'Always open; each featured colleague nominates the next.', owner: 'Internal Communications', i: 'person-message', p: 'inbox' },
    { risk: 'A sensitive story is published', guard: 'Facts checked and consent given before anything is shared.', owner: 'HR, with Legal on request', i: 'handshake', p: 'doc' },
    { risk: 'Stories cluster in a few departments', guard: 'Representation tracked from month one.', owner: 'HR / People Analytics', i: 'laptop-analytics', p: 'cluster' },
  ];
  const TOP = 350, H = 112, GAP = 14;          // rows (stage px)
  const r2 = (v) => Math.round(v * 100) / 100;

  // the row, in its own px: the risk's key, the risk, the shield, the stem, the guard, the owner
  const KEY = { x: 20, y: 12, s: 80 };         // the raised key (its side shows 6px below)
  const RX = 124, RW = 580;                    // the risk (hero)
  const SH = { x: 716, y: 8, w: 80, h: 96 };  // the shield
  const XS = SH.x + SH.w - 8, XG = 834;        // the stem runs from the guard's anchor (XG) to the shield (XS)
  const GX = 856, GW = 446;                    // the guard
  const OWN = 1336;                            // the owner column
  const CHECK0 = 2.6, CHECK_STEP = 2;          // the ambient check (8 s lap in the CSS): its start, row stagger

  // the shield: a raised face over its own solid side (six stacked copies, down and right)
  const SP = 'M35 4 63 12.5V39c0 18.5-12.4 30.2-28 37.5C19.4 69.2 7 57.5 7 39V12.5Z';
  const shield = `
    <svg class="rk-sh" viewBox="0 0 70 84" aria-hidden="true">
      <g class="rk-sh-side">${[1, 2, 3, 4, 5, 6].map((k) => `<path d="${SP}" transform="translate(${r2(k * .55)} ${r2(k * 1.05)})"/>`).join('')}</g>
      <path class="rk-sh-face" d="${SP}"/>
      <path class="rk-sh-hi" d="${SP}"/>
      <path class="rk-sh-bevel" d="${SP}" transform="translate(35 40) scale(.8) translate(-35 -40)"/>
      <path class="rk-shk" d="M28.4 41v-6.2a6.6 6.6 0 0 1 13.2 0V41"/>
      <rect class="rk-lock" x="23.5" y="40" width="23" height="18" rx="4"/>
      <g class="rk-kh"><circle cx="35" cy="47.2" r="2.4"/><rect x="34" y="48" width="2" height="5.2" rx="1"/></g>
    </svg>`;

  const row = (r, i) => {
    const b = .28 + i * .16;                     // this row's build (s after the scene's entrance)
    return `
      <div class="rk-row glass a-left" data-in="0" style="top:${TOP + i * (H + GAP)}px;--d:${r2(b)}s;--dur:.85s;--ck:${r2(CHECK0 + i * CHECK_STEP)}s">
        <i class="rk-cell" style="width:${SH.x + 44}px"></i>
        <div class="rk-key" style="left:${KEY.x}px;top:${KEY.y}px"${i === 0 ? ` data-spark="0" data-spark-xy="${144 + KEY.x + 2},${TOP + KEY.y + 2}" data-spark-delay=".45"` : ''}>
          <svg class="rk-pic" viewBox="0 0 48 48" aria-hidden="true">${ICONS[r.p]}</svg>
          <i class="rk-kg"></i>
        </div>
        <p class="rk-risk" style="left:${RX}px;width:${RW}px">${r.risk}</p>
        <svg class="rk-stem" viewBox="0 0 ${XG - XS} 12" style="left:${XS}px;top:${H / 2 - 6}px;width:${XG - XS}px" aria-hidden="true"><path d="M${XG - XS} 6H0" pathLength="100"/></svg>
        <i class="rk-lead" style="left:${XG}px;top:${H / 2}px;--run:${XS - XG}px"></i>
        <i class="rk-anchor" style="left:${XG}px;top:${H / 2}px"></i>
        <div class="rk-shw" style="left:${SH.x}px;top:${SH.y}px;width:${SH.w}px;height:${SH.h}px">
          <i class="rk-sg"></i>${shield}<i class="rk-click"></i>
        </div>
        <p class="rk-guard a-right" data-in="0" style="left:${GX}px;width:${GW}px;--d:${r2(b + .16)}s;--dur:.7s">${r.guard}</p>
        <div class="rk-owner a-fade" data-in="0" style="left:${OWN}px;--d:${r2(b + .34)}s;--dur:.7s">
          <span class="rk-oi">${Deck.icon(r.i)}</span><span>${r.owner}</span>
        </div>
        <i class="rk-run t"></i><i class="rk-run b"></i>
      </div>`;
  };

  Deck.scene({
    id: 'risks',
    title: 'What could break it',
    act: 4,
    bg: 'deep',
    transition: 'push',
    cues: ['Four risks · the guard built in'],
    holds: [12],
    notes: [
      'What could break it? Four risks, each with a guard already in the design and an owner. And the change stays small, because it runs on meetings and channels people already use.',
    ],
    field: [
      { dim: .34, lit: .03, travel: .4, offset: [140, 180], warm: .2, litFrom: [1500, 220], links: .5, wave: .6, streaks: .18, sparkle: 1.6, drift: 1,
        calm: [[100, 120, 1400, 290, .8], [110, 300, 1810, 850, .9], [110, 855, 1000, 945, .8]] },
    ],
    html: `
      <i class="rk-mood"></i>
      <svg class="rk-defs" aria-hidden="true"><defs>
        <linearGradient id="rkShF" x1="0" y1="0" x2=".7" y2="1"><stop offset="0" stop-color="#3FE6D6"/><stop offset=".45" stop-color="#1A9E9A"/><stop offset="1" stop-color="#0B4F58"/></linearGradient>
        <linearGradient id="rkShH" x1="0" y1="0" x2=".55" y2=".6"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".5" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      </defs></svg>
      <div class="kicker rk-kick a-wipe" data-in="0" style="--d:.08s">Risks &amp; change</div>
      <h2 class="h2 rk-h" data-in="0" data-split style="--d:.12s">What could break it, and <em class="hl">the guard built in.</em></h2>

      <div class="rk-cols a-fade" data-in="0" style="--d:.3s">
        <span class="label" style="left:${144 + RX}px">Risk</span>
        <span class="label" style="left:${144 + GX}px">Guard</span>
        <span class="label" style="left:${144 + OWN}px">Owner</span>
      </div>
      ${ROWS.map(row).join('')}

      <p class="rk-cap a-fade" data-in="0" style="--d:1.3s;--dur:.9s">
        <span class="rk-ci">${Deck.icon('hands-teamwork')}</span><span><b>Change stays small:</b> it runs on meetings and channels people already use.</span>
      </p>
    `,
    step(n, prev, ctx) {
      // the leading lights and the click rings play only on a live entrance
      const el = ctx.el;
      el.classList.remove('rk-live');
      void el.offsetWidth;
      if (!ctx.instant && n === 0 && prev === -1) el.classList.add('rk-live');
    },
  });
})();
