/* 10 · The pilot (v3) — enters with a rise from the risks: the room comes up under the
   camera and the headline ("Proof before scale.") lands in giant type, set in the dark ceiling band of the
   operations room while the video wall keeps working.
   Stop 1: the headline steps back to a heading and the plan becomes one tangible quarter:
   three month blocks (M1, M2, M3) side by side on a glass plate, seen in perspective,
   from START to QUARTER END, spanned by "One quarter". The commitments stand in glass
   where they happen: opening nominations over the start, reporting over quarter end,
   and the full cycle hanging from the span of the whole quarter. A story light walks
   the quarter month by month; each month and each commitment lights as it is reached,
   and quarter end flashes as it arrives.
   (The former stop 2, the KPI panel, was removed; the targets and "scale, adjust or stop"
   now live in the stop-1 notes.)
   Pictures: each commitment carries its own raised key (a form, the cycle, a dashboard).
   GPU: the room is one photo layer (its light leak painted in), one dim layer (the veil,
   with the two shades that fade in over it) and the video wall; the stop-1
   group is visibility: hidden while it is off stage, so they hold no layers.
   All state is keyed off .st-n, so back navigation lands on the same frame.
   Audience first — stop 0: the headline. Stop 1: "one quarterly cycle" (lit in the line
   and on the quarter's span) and the three commitment titles; their descriptions are
   fine print. */
(function () {
  const t = Deck.t;
  /* ── the quarter: one tangible object — three month blocks side by side on a glass plate, seen
     in perspective (stage px). A point x along the quarter, d into it and h above the plate lands
     at qp(x, d, h); lines stay lines, so at one depth x maps linearly and a CSS translate walks it. ── */
  const QVX = 960, QF = 2000, QC = .5, QYG = 694, QT = 44, QD = 120;
  const qp = (x, d, h) => { const f = QF / (QF + d); return [QVX + (x - QVX) * f, QYG - QC * QF + (QC * QF - h) * f]; };
  const r1 = (v) => Math.round(v * 10) / 10;
  const qpts = (a) => a.map((q) => qp(...q)).map((q) => r1(q[0]) + ',' + r1(q[1])).join(' ');
  const QX0 = 196, QX1 = 1724, QG = 18, QW = (QX1 - QX0 - 2 * QG) / 3;
  const MON = [0, 1, 2].map((k) => ({ a: QX0 + k * (QW + QG), b: QX0 + k * (QW + QG) + QW }));
  // an axis-aligned block: the faces the camera sees (top, front, and the side facing the middle)
  const qblock = (x0, x1, d0, d1, h0, h1, cls) => {
    let o = `<g class="${cls}">`;
    if (x1 < QVX) o += `<polygon class="fs" points="${qpts([[x1, d0, h0], [x1, d1, h0], [x1, d1, h1], [x1, d0, h1]])}"/>`;
    if (x0 > QVX) o += `<polygon class="fs" points="${qpts([[x0, d0, h0], [x0, d1, h0], [x0, d1, h1], [x0, d0, h1]])}"/>`;
    o += `<polygon class="ff" points="${qpts([[x0, d0, h0], [x1, d0, h0], [x1, d0, h1], [x0, d0, h1]])}"/>`;
    o += `<polygon class="ft" points="${qpts([[x0, d0, h1], [x1, d0, h1], [x1, d1, h1], [x0, d1, h1]])}"/>`;
    return o + '</g>';
  };
  const QBOX = [150, Math.floor(qp(QX0, QD + 16, QT)[1]) - 20, 1620, 0];
  QBOX[3] = Math.ceil(qp(QX0 - 20, -14, -12)[1]) + 30 - QBOX[1];
  // the walk: along the middle of the blocks' tops, from START to QUARTER END
  const WY = r1(qp(QX0, QD / 2, QT)[1]);
  const WX0 = r1(qp(QX0 + 36, QD / 2, QT)[0]), WX1 = r1(qp(QX1 - 36, QD / 2, QT)[0]);
  // one walk of the quarter every WP s (from WAT s): it lights in, walks for 76% of the period,
  // reaches quarter end and fades there; each month and each commitment lights as it is reached
  const WP = 8, WAT = 1.3, WEND = .76;   // (keep WP and WAT in step with the 8s / 1.3s in 10-pilot.css)
  const wAt = (x) => (x - WX0) / (WX1 - WX0) * WEND * 100;     // % of the period when the walk reaches x
  const pct = (v) => Math.max(0, Math.min(100, v)).toFixed(2) + '%';
  const monX = MON.map((m) => [qp(m.a, QD / 2, QT)[0], qp(m.b, QD / 2, QT)[0]]);
  const QKF = [];
  // a month is lit while the walk is on it (rising and falling over ≥ 240 ms)
  // (the walk sets out just inside M1, so M1 rises with the light itself, over its first 4%)
  monX.forEach(([a, b], k) => {
    const on = wAt(a), off = wAt(b), e = 3.2, up0 = Math.max(0, on - e), up1 = Math.max(4, on + e * .4);
    QKF.push(`@keyframes plMon${k} { ${up0 > 0 ? `0%, ${pct(up0)}` : '0%'} { opacity: 0; animation-timing-function: ease-in-out; } ${pct(up1)}, ${pct(off - e * .4)} { opacity: 1; animation-timing-function: ease-in-out; } ${pct(off + e)}, 100% { opacity: 0; } }`);
  });
  // the commitments light where they happen: 01 as the walk sets out, 02 across the middle month, 03 at quarter end
  const CWIN = [[0, 12], [wAt(monX[1][0]), wAt(monX[1][1])], [WEND * 100, WEND * 100 + 14]];
  CWIN.forEach(([on, off], k) => QKF.push(`@keyframes plCom${k} { 0%${on > 3 ? `, ${pct(on - 3)}` : ''} { opacity: 0; animation-timing-function: ease-in-out; } ${pct(on + 3)}, ${pct(off - 3)} { opacity: 1; animation-timing-function: ease-in-out; } ${pct(off + 4)}, 100% { opacity: 0; } }`));
  // the walk itself, and quarter end's flash as it arrives
  QKF.push(`@keyframes plWalk { 0% { transform: translateX(0); } ${pct(WEND * 100)}, 100% { transform: translateX(${r1(WX1 - WX0)}px); } }`);
  QKF.push(`@keyframes plWalkO { 0% { opacity: 0; animation-timing-function: ease-in-out; } 4% { opacity: 1; } ${pct(WEND * 100)} { opacity: 1; animation-timing-function: ease-in-out; } ${pct(WEND * 100 + 7)}, 100% { opacity: 0; } }`);
  QKF.push(`@keyframes plEnd { 0%, ${pct(WEND * 100 - 3)} { opacity: 0; transform: scale(.7); animation-timing-function: ease-in-out; } ${pct(WEND * 100 + 1)} { opacity: .9; transform: scale(1); animation-timing-function: cubic-bezier(.16, 1, .3, 1); } ${pct(WEND * 100 + 20)}, 100% { opacity: 0; transform: scale(3.2); } }`);
  // each month's lit top: a small svg of its own (its opacity loop repaints nothing else)
  const monLit = MON.map((m, k) => {
    const c = [[m.a, 0, QT], [m.b, 0, QT], [m.b, QD, QT], [m.a, QD, QT]].map((q) => qp(...q));
    const b = [Math.floor(Math.min(...c.map((q) => q[0]))) - 14, Math.floor(Math.min(...c.map((q) => q[1]))) - 14];
    b.push(Math.ceil(Math.max(...c.map((q) => q[0]))) + 14 - b[0], Math.ceil(Math.max(...c.map((q) => q[1]))) + 14 - b[1]);
    return `<svg class="pl-mlit m${k}" viewBox="${b.join(' ')}" style="left:${b[0]}px;top:${b[1]}px;width:${b[2]}px;height:${b[3]}px;--k:${k}" aria-hidden="true"><polygon points="${qpts([[m.a + 4, 4, QT], [m.b - 4, 4, QT], [m.b - 4, QD - 4, QT], [m.a + 4, QD - 4, QT]])}"/></svg>`;
  }).join('');
  const CT = 356, CH = 170, CB = CT + CH, C2T = 772, BY = 728;   // the upper commitments' top, height and bottom (where their drops start), the lower one's top, the span's line
  /* ── the commitments' pictures (outline, currentColor, round caps; 48-unit box) ── */
  const CICON = {
    form: '<rect x="9" y="4" width="30" height="40" rx="4.5"/><path d="M15 11.5h18"/><rect x="15" y="18" width="6.5" height="6.5" rx="1.6"/><path d="M26 21.2h7"/><path d="M16.4 21.4l1.5 1.5 2.5-2.9"/><rect x="15" y="28.5" width="6.5" height="6.5" rx="1.6"/><path d="M26 31.8h7"/><path d="M19 39.5h10"/>',
    cycle: '<g class="pl-cyc"><path d="M9 24A15 15 0 0 1 34.6 13.4"/><path d="M28.7 12.4 34.6 13.4 33.6 7.5"/><path d="M39 24A15 15 0 0 1 13.4 34.6"/><path d="M19.3 35.6 13.4 34.6 14.4 40.5"/></g><circle cx="24" cy="24" r="3.2" fill="currentColor" stroke="none"/>',
    chart: '<path d="M6 42.5h36"/><rect x="10" y="29" width="6" height="13.5" rx="1.6"/><rect x="21" y="22" width="6" height="20.5" rx="1.6"/><rect x="32" y="15" width="6" height="27.5" rx="1.6"/><path d="M8 19l10-8 8.5 4.5L39 6"/><path d="M33.6 6.2 39 6l-.5 5.3"/>',
  };
  const cic = (k) => `<span class="pl-ci"><svg viewBox="0 0 48 48" aria-hidden="true">${CICON[k]}</svg></span>`;

  /* ── the room: the video wall keeps working ── */
  const blips = Array.from({ length: 24 }, (_, i) => `<b style="--x:${(i * 41) % 97}%;--y:${4 + (i * 59) % 32}%;--w:${16 + (i * 7) % 30}px;--t:${2.2 + (i % 5) * .8}s;--dl:${-i * .37}s"></b>`).join('');
  const dust = Array.from({ length: 18 }, (_, i) => `<i style="left:${Math.round((4 + (i * 137) % 92) * 19.2)}px;top:${Math.round((58 + (i * 71) % 40) * 10.8)}px;--t:${11 + (i % 6) * 2.2}s;--dl:${-i * 1.3}s;--dx:${(i % 2 ? 1 : -1) * (24 + (i * 13) % 50)}px;--dy:${-150 - (i * 29) % 180}px"></i>`).join('');

  Deck.scene({
    id: 'pilot',
    title: t('Proof before scale', 'الإثبات قبل التوسّع'),
    act: 4,
    bg: 'night',
    transition: 'rise',
    cues: t(['Proof before scale.', 'One quarterly cycle · three commitments'], ['الإثبات قبل التوسّع.', 'دورة ربع سنوية واحدة · ثلاثة التزامات']),
    holds: [6, 18],
    notes: [
      'Impact measurement. We do not start by scaling; we start with proof. Pause, and let it sit. What follows is how one quarter proves the idea, and how we will know whether it worked.',
      'We start with one quarterly cycle and measure what changes. This is one quarter, month one to month three: open nominations to peers and leaders at the start, run one full cycle — capture, curate, feature, reinforce — within the quarter, and report what changed on a quarterly dashboard at quarter end. We measure participation from every department, colleagues reading, a sentiment pulse, and the same survey questions again: recognition reach from 8% towards 25%, the visibility gap from 56% to below 40%. After one quarter, the data decides: scale, adjust or stop.',
    ],
    field: [
      { dim: .3, lit: .03, travel: .25, offset: [-60, -200], litFrom: [960, 300], links: .4, wave: .4, streaks: .14, sparkle: 1, calm: [[100, 110, 1500, 380, .85]] },
      { dim: .22, travel: .1, links: .3, calm: [[100, 110, 1800, 960, .88]] },
    ],
    html: `
      <!-- the room: one photo layer (the light leak is painted in with it), the video wall, and one
           dim layer (the veil, with the shade that lands over it at stop 1) -->
      <div class="pl-cam">
        <div class="pl-plate">
          <div class="photo pl-photo" style="background-image:url('assets/photos/team-ops.jpg')"></div>
          <div class="pl-leak"></div>
          <div class="pl-wall"><i class="pl-wglow"></i>${blips}<em class="pl-wscan"></em><em class="pl-wsweep"></em></div>
        </div>
      </div>
      <div class="pl-dim"><i class="fill pl-veil"></i><i class="fill pl-shade-1 a-fade" data-in="1" style="--dur:1.2s"></i></div>
      <div class="pl-cove"></div>
      <div class="amb-dust pl-dust">${dust}</div>

      <!-- stop 0 · the headline -->
      <div class="kicker pl-kicker a-wipe" data-in="0" style="--d:.2s">${t('Impact measurement', 'قياس الأثر')}</div>
      <h1 class="display pl-title" data-in="0" data-split data-spark="0" data-spark-delay="1.05" style="--d:.35s;--wstep:.09s">${t('Proof before scale.', 'الإثبات قبل التوسّع.')}</h1>

      <!-- stop 1 · one quarter, three commitments (the group is hidden while off stage) -->
      <div class="pl-g1">
      <p class="lead pl-sub" data-in="1" style="--d:.15s">${t('Start with <b class="pl-key">one quarterly cycle</b> and measure what changes.', 'نبدأ <b class="pl-key">بدورة ربع سنوية واحدة</b> ونقيس ما يتغيّر.')}</p>
      <div class="pl-plan">
        <i class="pl-qdark" style="left:${QVX}px;top:${QYG}px"></i>
        <i class="pl-qglow" style="left:${QVX}px;top:${QYG - 10}px"></i>
        <!-- the quarter: a glass plate and three month blocks, in perspective -->
        <div class="pl-q a-fade" data-in="1" style="--d:.18s;--dur:.8s">
          <svg class="pl-qsvg" viewBox="${QBOX.join(' ')}" style="left:${QBOX[0]}px;top:${QBOX[1]}px;width:${QBOX[2]}px;height:${QBOX[3]}px" aria-hidden="true">
            <defs>
              <linearGradient id="plTopG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E6A74"/><stop offset="1" stop-color="#2A8C8C"/></linearGradient>
              <linearGradient id="plFrontG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0E3E4C"/><stop offset="1" stop-color="#072430"/></linearGradient>
            </defs>
            <ellipse class="pl-qsh" cx="${QVX}" cy="${QYG + 30}" rx="820" ry="34"/>
            ${qblock(QX0 - 20, QX1 + 20, -14, QD + 14, -12, 0, 'pl-qbase')}
            ${MON.map((m) => qblock(m.a, m.b, 0, QD, 0, QT, 'pl-mb')).join('')}
            ${MON.map((m) => `<text class="pl-mt" x="${r1((m.a + m.b) / 2)}" y="${QYG - QT / 2}">${t('M', 'الشهر ')}${MON.indexOf(m) + 1}</text>`).join('')}
            <path class="pl-wline" d="M${WX0} ${WY} L${WX1} ${WY}"/>
          </svg>
        </div>
        <div class="pl-mlits">${monLit}</div>
        <!-- the walk: a story light crosses the quarter, month by month -->
        <div class="pl-walk" style="left:${WX0}px;top:${WY}px" aria-hidden="true"><b class="pl-wtail"></b><i class="pl-wglow"></i><i class="light lg"></i></div>
        <i class="pl-endfx" style="left:${WX1}px;top:${WY}px"></i>
        <i class="pl-pin a-materialize" data-in="1" data-spark="1" data-spark-xy="${WX0},${WY}" style="left:${WX0}px;top:${WY}px;--d:.3s"></i>
        <i class="pl-pin end a-materialize" data-in="1" style="left:${WX1}px;top:${WY}px;--d:1.2s"></i>
        <!-- where each commitment happens -->
        <i class="pl-drop a-wipe-down" data-in="1" style="left:${WX0}px;top:${CB}px;height:${r1(WY - 16 - CB)}px;--d:.62s;--dur:.5s"></i>
        <i class="pl-drop a-wipe-down" data-in="1" style="left:${WX1}px;top:${CB}px;height:${r1(WY - 16 - CB)}px;--d:1.28s;--dur:.5s"></i>
        <span class="label pl-mark a-fade" data-in="1" style="left:${WX0 + 18}px;top:${r1(WY - 58)}px;--d:.5s">${t('Start', 'البداية')}</span>
        <span class="label pl-mark e a-fade" data-in="1" style="left:${r1(WX1 - 18)}px;top:${r1(WY - 58)}px;--d:1.3s">${t('Quarter end', 'نهاية الربع')}</span>
        <svg class="pl-span a-fade" data-in="1" viewBox="${QX0 - 4} ${BY - 16} ${QX1 - QX0 + 8} ${C2T - BY + 20}" style="left:${QX0 - 4}px;top:${BY - 16}px;width:${QX1 - QX0 + 8}px;height:${C2T - BY + 20}px;--d:.85s;--dur:.6s" aria-hidden="true">
          <path class="pl-sp" d="M${QX0} ${BY - 12} V${BY} H${QVX - 128} M${QVX + 128} ${BY} H${QX1} V${BY - 12}" pathLength="100"/>
          <path class="pl-sp st" d="M${QVX} ${BY + 20} V${C2T - 2}"/>
        </svg>
        <span class="pl-oneq a-scale" data-in="1" style="left:${QVX}px;top:${BY}px;--d:.95s;--dur:.7s">${t('One quarter', 'ربع سنة واحد')}</span>

        <div class="pl-c pl-c1 glass a-left" data-in="1" style="left:144px;top:${CT}px;height:${CH}px;--d:.3s">
          <i class="pl-cglow"></i>${cic('form')}<div class="pl-cb"><h3 class="pl-ct"><b class="pl-n">01</b>${t('Open nominations', 'فتح باب الترشيح')}</h3>
          <p class="pl-cx">${t('Accept peer and leader nominations through a simple form.', 'استقبال ترشيحات الزملاء والقادة عبر نموذج بسيط.')}</p></div>
        </div>
        <div class="pl-c pl-c2 glass" data-in="1" style="left:${QVX - 370}px;top:${C2T}px;--d:.72s">
          <i class="pl-cglow"></i>${cic('cycle')}<div class="pl-cb"><h3 class="pl-ct"><b class="pl-n">02</b>${t('Run one full cycle', 'تنفيذ دورة كاملة')}</h3>
          <p class="pl-cx"><span class="pl-chain">${t('Capture → Curate → Feature → Reinforce', 'رصد → انتقاء → إبراز → ترسيخ')}</span> <span class="pl-nb">${t('within the quarter.', 'خلال الربع.')}</span></p></div>
        </div>
        <div class="pl-c pl-c3 glass a-right" data-in="1" style="left:${1920 - 144 - 600}px;top:${CT}px;height:${CH}px;--d:1.08s">
          <i class="pl-cglow"></i>${cic('chart')}<div class="pl-cb"><h3 class="pl-ct"><b class="pl-n">03</b>${t('Report what changed', 'عرض ما تغيّر')}</h3>
          <p class="pl-cx">${t('On a quarterly dashboard.', 'على لوحة مؤشرات ربع سنوية.')}</p></div>
        </div>
        <style>${QKF.join('\n')}</style>
      </div>
      </div>

    `,
    step(n, prev, ctx) {
      // the spark rests just after the full stop, at the x-height of the display line
      const t = ctx.$('.pl-title');
      if (t && t.offsetWidth) t.dataset.sparkXy = Math.round(t.offsetLeft + t.offsetWidth + 54) + ',' + Math.round(t.offsetTop + t.offsetHeight * .64);
    },
  });
})();
