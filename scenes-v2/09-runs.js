/* 09 · How it runs (v3) — what makes a story inspiring (the published criteria: four
   questions, plus the themes we look for), the operating rhythm and recognition as
   one scene: three glass boards under a lit tab bar, one board per stop. Each click
   is a camera pan: the next board swings in from the right out of depth (scale +
   blur) while the current one slides away left, a parallax world of light behind
   them travels more slowly (depth), a light sweeps the frame, the field streaks and
   the lit tab glides to the new tab.
   Ambient per board:
   0 · a light walks down the four questions (each has its icon), a reading band travels
       with it and each field's icon lights; beside the table a story card (a tilted glass
       card: cover photo, author, title) ticks the four checks as the light passes, and
       when all four pass it is stamped Featured story;
   1 · nominations drift into the always-open lane and glide to the form; a playhead
       sweeps the quarter, lighting each month's card (its pseudo-3D step rises month by
       month: curate, feature, reinforce), then drops a story into the annual collection;
   2 · the three tiers are three pictured objects on three equal plinths in one row (featured,
       not ranked: no podium): a certificate with a leader's signature and seal, a featured story
       on a screen broadcast to an audience, the annual story collection. In front of them stands
       the person they recognise, on a lit disc. The plinths rise out of the floor, then in turn
       each tier lights (a shaft of light, a lit rim, its row on the left) and sends a light down
       its thread to the person, who glows as it arrives; the broadcast pulses, sparkles rise
       over the collection.
   GPU: a board off screen is hidden (no layers); board 2 is small svgs and a few small lights.
   All state is keyed off .st-n / data-step, so back navigation lands on the same frame. */
(function () {
  const TABS = [
    { t: 'What makes it inspiring', i: 'eye-lightbulb' },
    { t: 'Quarterly rhythm', i: 'gear-clock' },
    { t: 'Recognition', i: 'document-certified' },
  ];
  // line icons on a 24 grid (outline, round caps; 1.1 here ≈ 1.8 px at 40 px)
  const ico = (d, cls) => `<svg class="rn-svgi${cls ? ' ' + cls : ''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const IC = {
    // purpose: an arrow in the centre of a target
    purpose: '<circle cx="11" cy="13" r="8.2"/><circle cx="11" cy="13" r="4.4"/><circle cx="11" cy="13" r="1.1" fill="currentColor"/><path d="M11 13 20.6 3.4"/><path d="M18 3.2V6h2.8"/><path d="M16.2 5v2.8H19"/>',
    // value: a cut gem
    value: '<path d="M6.6 4.2h10.8l4.2 5.2L12 20.6 2.4 9.4z"/><path d="M2.4 9.4h19.2"/><path d="M8.2 9.4 12 4.2l3.8 5.2"/><path d="M8.2 9.4 12 20.6l3.8-11.2"/>',
    // impact: a line that turns upward
    impact: '<path d="M3 20.6h18"/><path d="m3.8 16.2 5-5 4 3.2 7.4-7.8"/><path d="M15.4 6.4h4.8v4.8"/>',
    // repeat: two arrows chasing round
    repeat: '<path d="M20 11.6a8 8 0 0 0-14.3-4.9"/><path d="M4 12.4a8 8 0 0 0 14.3 4.9"/><path d="M5.2 2.8V7h4.2"/><path d="M18.8 21.2V17h-4.2"/>',
    check: '<path d="m5.5 12.5 4.2 4.2 8.8-9.4"/>',
    star: '<path d="m12 3.2 2.6 5.5 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.5l6-.8z"/>',
    arrow: '<path d="M4 12h15"/><path d="m14 7 5 5-5 5"/>',
  };
  const FIELDS = [
    { k: 'Purpose', i: 'purpose', q: 'What did this contribution enable?', c: 'Each selected story explains why the contribution mattered.' },
    { k: 'Value', i: 'value', q: 'Which Tahakom value was demonstrated?', c: 'Linked to one primary value and one observable behaviour.' },
    { k: 'Impact', i: 'impact', q: 'What changed because of the behaviour?', c: 'Evidence is reviewed before a story is featured.' },
    { k: 'Repeat', i: 'repeat', q: 'What can other employees do?', c: 'Shared across departments with one practical takeaway.' },
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
  // the tabs take the width their labels need (the slider fits each tab; keep in step with 09-runs.css)
  const TW = [650, 520, 462], TL = [0, 650, 1170];

  /* ── tab bar ── */
  const tabs = TABS.map((x, k) => `
    <div class="rn-tab a-flip" data-in="0" data-at="${k}" style="left:${TL[k]}px;width:${TW[k]}px;--d:${(.1 + k * .09).toFixed(2)}s">
      <span class="rn-ti">${Deck.icon(x.i)}</span><em>${nn(k)}</em><span class="rn-tl">${x.t}</span>
    </div>`).join('');

  /* ── the parallax world behind the boards: pools of light and soft bokeh squircles ── */
  const BOKEH = [
    [220, 300, 150, .09, 't'], [760, 860, 90, .07, 'p'], [1360, 240, 120, .06, 't'], [1740, 780, 180, .08, 'p'],
    [2160, 330, 110, .08, 't'], [2560, 820, 160, .07, 't'], [2980, 260, 140, .08, 'p'], [3380, 700, 100, .07, 't'],
    [3780, 380, 170, .09, 'p'], [4160, 860, 120, .07, 't'],
  ];
  const bokeh = BOKEH.map(([x, y, s, a, c], i) => `<b class="rn-bk ${c}" style="left:${x}px;top:${y}px;--s:${s}px;--a:${a};--t:${14 + (i % 4) * 3}s;--dl:${-i * 2.3}s"></b>`).join('');

  /* ── board 0 · what makes it inspiring: four questions (keep ROW0/ROWH in step with the walk in 09-runs.css) ── */
  const ROW0 = 88, ROWH = 116;
  // each field: its icon on the spine (a lit copy fades in as the light passes), the field, the
  // question the room reads, and under it the design decision (support)
  const rows = FIELDS.map((f, i) => `
    <div class="rn-row" data-in="0" style="--k:${i};top:${ROW0 + i * ROWH}px">
      <span class="rn-chip">${ico(IC[f.i])}<span class="rn-chip-on">${ico(IC[f.i])}</span></span>
      <b class="rn-key" data-t="${f.k}">${f.k}</b>
      <p class="rn-q">${f.q}</p>
      <p class="rn-dec">${ico(IC.arrow, 'rn-dec-a')}${f.c}</p>
    </div>`).join('');
  // the story card: it ticks the four checks as the light passes each field (keep in step with rnWalk)
  const checks = FIELDS.map((f, i) => `
          <div class="rn-ck ck${i}" style="top:${292 + i * 50}px">
            <span class="rn-ck-b"><span class="rn-ck-on">${ico(IC.check)}</span></span>
            <span class="rn-ck-i">${ico(IC[f.i])}</span><span class="rn-ck-t">${f.k}</span>
          </div>`).join('');

  /* ── board 1 · quarterly rhythm ── */
  // nominations drifting into the lane (lane-local x), one every 2 s on a 16 s loop
  const DROPS = [1060, 1290, 1160, 1400, 1100, 1330, 1220, 1450];
  const TRAY_X = 1562;
  const drops = DROPS.map((x, k) => `<span class="rn-drop" style="--x0:${x}px;--xt:${TRAY_X}px;--dl:${-k * 2}s"><span><i class="light"></i></span></span>`).join('');
  const QW = 1300, MW = 412, MG = 32;   // one quarter (stage px), a month card and the gap
  const weeks = Array.from({ length: 12 }, (_, k) => `<i style="left:${((k + 1) / 13 * QW).toFixed(1)}px"></i>`).join('');
  // each month stands on a pseudo-3D step that rises through the quarter (isometric: x runs
  // right-down, y left-down, z up), carrying what the month does: curate (a stack of stories
  // under a lens), feature (a story on a screen, broadcast), reinforce (a certificate and the trend)
  const CS = Math.cos(Math.PI / 6), K = 1.2;    // K: drawing scale
  const ISO_O = [111, 92];
  const ip = (x, y, z) => (ISO_O[0] + (x - y) * CS * K).toFixed(1) + ',' + (ISO_O[1] + ((x + y) * .5 - z) * K).toFixed(1);
  const at = (x, y, z) => `translate(${ip(x, y, z).split(',').join(' ')}) scale(${K})`;
  const box = (x, y, z, w, d, h, cls) => `<g class="${cls}">` +
    `<polygon class="fl" points="${ip(x, y + d, z)} ${ip(x + w, y + d, z)} ${ip(x + w, y + d, z + h)} ${ip(x, y + d, z + h)}"/>` +
    `<polygon class="fr" points="${ip(x + w, y, z)} ${ip(x + w, y + d, z)} ${ip(x + w, y + d, z + h)} ${ip(x + w, y, z + h)}"/>` +
    `<polygon class="ft" points="${ip(x, y, z + h)} ${ip(x + w, y, z + h)} ${ip(x + w, y + d, z + h)} ${ip(x, y + d, z + h)}"/></g>`;
  const line = (pts, cls) => `<polyline class="${cls || 'ln'}" points="${pts.map((q) => ip(q[0], q[1], q[2])).join(' ')}"/>`;
  const STEP = [8, 25, 42];                     // the step heights: the quarter rises month by month
  const scenes = [
    (h) => box(18, 12, h, 46, 32, 3, 'sc') + box(15, 9, h + 5, 46, 32, 3, 'sc') + box(12, 6, h + 10, 46, 32, 3, 'sc hi') +
      line([[20, 12, h + 13], [48, 12, h + 13]], 'ln') + line([[20, 18, h + 13], [40, 18, h + 13]], 'ln') + line([[20, 24, h + 13], [44, 24, h + 13]], 'ln') +
      // the lens, held over the stack
      `<g class="lens" transform="${at(40, 4, h + 44)}"><path class="hd" d="M9 9 19 19"/><circle class="gl" r="13"/><circle class="gl2" r="13"/><path class="gs" d="M-6.5-3.5a7.5 7.5 0 0 1 4-4"/></g>`,
    (h) => box(26, 30, h, 26, 16, 3, 'sc') + box(36, 36, h + 3, 6, 4, 10, 'sc') + box(14, 34, h + 13, 50, 3, 34, 'sc scr') +
      // the story on the screen (the screen is the face toward the viewer's left)
      line([[19, 37, h + 40], [37, 37, h + 40]], 'ln lg') + line([[19, 37, h + 34], [58, 37, h + 34]], 'ln') + line([[19, 37, h + 29], [52, 37, h + 29]], 'ln') +
      `<polygon class="img" points="${ip(41, 37, h + 43)} ${ip(59, 37, h + 43)} ${ip(59, 37, h + 36.5)} ${ip(41, 37, h + 36.5)}"/>` +
      // broadcast: the feature reaches the whole organisation
      `<g class="cast" transform="${at(66, 34, h + 44)}"><path d="M4-6a8 8 0 0 1 0 12"/><path d="M9.5-11a15 15 0 0 1 0 22"/><path d="M15-16a22 22 0 0 1 0 32"/></g>`,
    (h) => box(8, 36, h, 38, 3, 30, 'sc cert') + line([[13, 39, h + 24], [33, 39, h + 24]], 'ln lg') + line([[13, 39, h + 18], [38, 39, h + 18]], 'ln') + line([[13, 39, h + 13], [30, 39, h + 13]], 'ln') +
      `<g class="seal" transform="${at(40, 39, h + 8)}"><path class="rb" d="M-4 4-7 13l4-2 2 4 2-9"/><path class="rb" d="M4 4 7 13l-4-2-2 4"/><circle r="6.5"/></g>` +
      // the trend they review: three rising bars
      box(56, 8, h, 9, 9, 10, 'bar') + box(56, 20, h, 9, 9, 16, 'bar') + box(56, 32, h, 9, 9, 23, 'bar hi'),
  ];
  const art = (k) => `<svg class="rn-art" viewBox="0 0 250 184" aria-hidden="true">
        <ellipse class="rn-art-sh" cx="${(ISO_O[0] + 13 * CS * K).toFixed(1)}" cy="${(ISO_O[1] + 70 * K).toFixed(1)}" rx="100" ry="18"/>
        ${box(0, 0, 0, 80, 54, STEP[k], 'st')}
        ${scenes[k](STEP[k])}
      </svg>`;
  const months = MONTHS.map((m, k) => `
    <div class="rn-m glass a-unfold" data-in="1" style="--k:${k};left:${k * (MW + MG)}px;--d:${(.62 + k * .14).toFixed(2)}s">
      <i class="rn-m-halo"></i>${art(k)}
      <div class="rn-m-lab">${m.m}</div>
      <div class="rn-m-k" data-t="${m.k}">${m.k}</div>
      <p class="rn-m-t">${m.t}</p>
    </div>`).join('');
  const marks = MONTHS.map((m, k) => `<i class="rn-tick a-materialize" data-in="1" style="left:${k * (MW + MG) + 36}px;--k:${k};--d:${(.7 + k * .14).toFixed(2)}s"></i>`).join('');

  /* ── board 2 · recognition: the three tiers as three pictured objects on equal plinths (one row,
     one height: featured, not ranked), and in front of them the person they recognise ── */
  const tiers = TIERS.map((x, k) => `
    <div class="rn-t" data-in="2" style="--k:${k}">
      <span class="node rn-tn" data-n="${nn(k)}">${nn(k)}</span>
      <div><h3 class="rn-tt">${x.t}</h3><p class="rn-ts">${x.s}</p></div>
    </div>`).join('');
  // stage px: the plinths' base centres, their radius (an ellipse seen from above: ry = .42 r) and height
  const PX = [1120, 1385, 1650], PY = 620, PR = 100, PRY = 42, PH = 50, OS = 1.14;   // OS: the objects' scale
  // each plinth is one svg box (object + plinth); its base centre sits at (BX, BY) in the box
  const PB = { w: 300, h: 380, x: 150, y: 312 };
  // the person: the disc's centre on the floor, and the portrait hovering above it
  const HU = { x: 1385, y: 836, py: 744 };
  // the floor: one elliptical glass stage under everything
  const FL = { x: 1385, y: 690, rx: 420, ry: 180 };
  const f1 = (v) => (+v).toFixed(1);
  // a cylinder: its front band and its top ellipse (centred on its base at 0,0)
  const cyl = (r, ry, h, cls) => `<g class="${cls}">` +
    `<path class="cy-s" d="M${-r} ${-h}V0A${r} ${ry} 0 0 0 ${r} 0V${-h}A${r} ${ry} 0 0 1 ${-r} ${-h}Z"/>` +
    `<ellipse class="cy-t" cx="0" cy="${-h}" rx="${r}" ry="${ry}"/></g>`;
  // arcs of a broadcast (centre, radius, from/to angle in degrees)
  const arc = (cx, cy, r, a0, a1) => {
    const p = (a) => f1(cx + r * Math.cos(a * Math.PI / 180)) + ' ' + f1(cy + r * Math.sin(a * Math.PI / 180));
    return `M${p(a0)}A${r} ${r} 0 0 1 ${p(a1)}`;
  };
  const person = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="0" cy="-15" r="6.4"/><path d="M-11.5 0C-11.5-7.6-6.4-10.4 0-10.4S11.5-7.6 11.5 0Z"/></g>`;
  // the objects, drawn face-on on top of each plinth (origin: the plinth's top centre)
  const OBJ = [
    // 01 · a personal certificate on an easel: the employee's portrait, a title, a leader's signature and seal
    `<g class="ob cert">
       <path class="ez" d="M-5-206-70 4M5-206 70 4"/>
       <rect class="dp" x="-89" y="-189" width="190" height="140" rx="8"/>
       <rect class="pp" x="-95" y="-184" width="190" height="140" rx="8"/>
       <rect class="pb" x="-86" y="-175" width="172" height="122" rx="5"/>
       <path class="ezb" d="M-104-41H104"/>
       <circle class="av" cx="-56" cy="-146" r="17"/>${person(-56, -134, .9).replace('<g ', '<g class="avp" ')}
       <path class="tl" d="M-28-153H60"/><path class="t2" d="M-28-138H36"/>
       <path class="t3" d="M-66-112H66M-66-99H42"/>
       <path class="sg" d="M-68-68c6-12 11-14 13-6s-2 12 3 6 8-15 12-9-1 10 4 7 9-8 14-6"/>
       <path class="sl" d="M-70-61H-4"/>
       <path class="rb" d="M47-63 40-33 49-38 54-29 57-60M69-63 76-33 67-38 62-29 59-60"/>
       <circle class="se" cx="58" cy="-73" r="19"/><circle class="se2" cx="58" cy="-73" r="12.5"/>
       <path class="st" d="m58-80.5 2.3 4.6 5 .7-3.6 3.5.9 5-4.6-2.4-4.6 2.4.9-5-3.6-3.5 5-.7z"/>
     </g>`,
    // 02 · a featured story on a screen, broadcast across the organisation to a small audience
    `<g class="ob scr">
       <path class="bc" d="${arc(-104, -131, 14, 150, 210)}${arc(-104, -131, 25, 148, 212)}${arc(-104, -131, 36, 146, 214)}${arc(104, -131, 14, -30, 30)}${arc(104, -131, 25, -32, 32)}${arc(104, -131, 36, -34, 34)}"/>
       <rect class="dp" x="-98" y="-205" width="208" height="138" rx="11"/>
       <path class="nk" d="M-9-62h18v36h-18z"/>
       <ellipse class="ft" cx="0" cy="-22" rx="48" ry="11"/>
       <rect class="bz" x="-104" y="-200" width="208" height="138" rx="11"/>
       <rect class="sn" x="-97" y="-193" width="194" height="124" rx="6"/>
       <path class="tl" d="M-86-110H16"/><path class="t3" d="M-86-96H70M-86-84H44"/>
       <circle class="av" cx="76" cy="-86" r="9"/>
       <g class="au">${[-64, -32, 0, 32, 64].map((x) => person(x, 22, 1)).join('')}</g>
     </g>`,
    // 03 · the annual story collection: an open book on a lectern, a ribbon marking a story
    `<g class="ob bk">
       <path class="lc" d="M-70-44H70L58-30H-58ZM-10-32h20v26h-20z"/><ellipse class="lcf" cx="0" cy="-5" rx="40" ry="8"/>
       <path class="cv" d="M0-40C-34-50-76-49-112-42V-168C-76-176-34-174 0-162C34-174 76-176 112-168V-42C76-49 34-50 0-40Z"/>
       <path class="pe" d="M0-45C-33-55-72-54-104-48M0-45C33-55 72-54 104-48"/>
       <path class="pg" d="M0-50C-32-60-70-59-102-53V-178C-70-186-32-184 0-172ZM0-50C32-60 70-59 102-53V-178C70-186 32-184 0-172Z"/>
       <path class="sp" d="M0-172V-50"/>
       <rect class="ph" x="-88" y="-164" width="70" height="50" rx="5"/>${person(-53, -118, 1.25).replace('<g ', '<g class="php" ')}
       <path class="t3" d="M-88-100H-20M-88-88H-34M-88-76H-26"/>
       <path class="st2" d="m44-166 3.5 7 7.7 1.1-5.6 5.4 1.3 7.7-6.9-3.6-6.9 3.6 1.3-7.7-5.6-5.4 7.7-1.1z"/>
       <path class="t3" d="M18-128H88M18-116H80M18-104H86M18-92H64"/>
       <path class="rbn" d="M28-176h9v134l-4.5-5-4.5 5z"/>
     </g>`,
  ];
  const plinths = PX.map((x, k) => `
        <div class="rn-pd k${k}" data-in="2" style="left:${x - PB.x}px;top:${PY - PB.y}px;--d:${(.72 + k * .15).toFixed(2)}s">
          <svg viewBox="0 0 ${PB.w} ${PB.h}" aria-hidden="true">
            <g transform="translate(${PB.x} ${PB.y})">
              <ellipse class="sh" cx="0" cy="6" rx="${PR + 30}" ry="${PRY + 14}"/>
              ${cyl(PR, PRY, PH, 'pl')}
              <ellipse class="pl-r" cx="0" cy="${-PH}" rx="${PR - 18}" ry="${PRY - 8}"/>
              <g transform="translate(0 ${-PH}) scale(${OS})">${OBJ[k]}</g>
            </g>
          </svg>
          ${k === 1 ? `<div class="rn-ban" style="left:${f1(PB.x - 91 * OS)}px;top:${f1(PB.y - PH - 187 * OS)}px;width:${f1(182 * OS)}px;height:${f1(61 * OS)}px;background-image:url('assets/photos/nouf.jpg')"><span>${ico(IC.star)}</span></div>` : ''}
          <span class="rn-pn">${nn(k)}</span>
        </div>`).join('');
  // the light each tier sends down to the person: from the plinth's foot to the disc's rim
  const THR = [[PX[0] + 34, PY + PRY - 4, HU.x - 58, HU.y - 10], [PX[1], PY + PRY + 2, HU.x, HU.y - 36], [PX[2] - 34, PY + PRY - 4, HU.x + 58, HU.y - 10]];
  const FLB = { x: FL.x - FL.rx - 10, y: FL.y - FL.ry - 10, w: 2 * FL.rx + 20, h: 2 * FL.ry + 36 };   // the floor's svg box
  const loc = (x, y) => f1(x - FLB.x) + ' ' + f1(y - FLB.y);
  const floor = `<svg class="rn-floor" data-in="2" viewBox="0 0 ${FLB.w} ${FLB.h}" style="left:${FLB.x}px;top:${FLB.y}px;width:${FLB.w}px;height:${FLB.h}px;--d:.36s" aria-hidden="true">
          <defs>
            <linearGradient id="rn-cy" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#1B5E6E"/><stop offset=".38" stop-color="#124658"/><stop offset="1" stop-color="#061A2C"/></linearGradient>
            <linearGradient id="rn-paper" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#F2FBF9"/><stop offset="1" stop-color="#C8E4E0"/></linearGradient>
            <linearGradient id="rn-scr" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#103D59"/><stop offset="1" stop-color="#06182A"/></linearGradient>
            <linearGradient id="rn-page" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#FAF3FB"/><stop offset="1" stop-color="#DCC8E2"/></linearGradient>
            <radialGradient id="rn-sh" cx=".5" cy=".5" r=".5"><stop offset=".55" stop-color="#000810" stop-opacity=".5"/><stop offset="1" stop-color="#000810" stop-opacity="0"/></radialGradient>
            <radialGradient id="rn-fl-g" cx=".5" cy=".62" r=".6"><stop offset="0" stop-color="#25C7BC" stop-opacity=".16"/><stop offset=".55" stop-color="#25C7BC" stop-opacity=".05"/><stop offset="1" stop-color="#25C7BC" stop-opacity=".02"/></radialGradient></defs>
          <g transform="translate(${loc(FL.x, FL.y)})">
            <path class="fl-s" d="M${-FL.rx} 0V12A${FL.rx} ${FL.ry} 0 0 0 ${FL.rx} 12V0A${FL.rx} ${FL.ry} 0 0 1 ${-FL.rx} 0Z"/>
            <ellipse class="fl-t" rx="${FL.rx}" ry="${FL.ry}"/>
            <ellipse class="fl-r" rx="${FL.rx - 70}" ry="${FL.ry - 31}"/>
            <ellipse class="fl-r" rx="${FL.rx - 150}" ry="${FL.ry - 66}" transform="translate(0 38)"/>
          </g>
          ${THR.map(([x0, y0, x1, y1]) => `<path class="fl-th" pathLength="1" d="M${loc(x0, y0)}L${loc(x1, y1)}"/>`).join('')}
        </svg>`;
  // the lights riding the threads (one carrier each), and the ring each one sets off on the person
  const threadLights = THR.map(([x0, y0, x1, y1], k) => `<span class="rn-thl k${k}" style="left:${x0}px;top:${y0}px;--dx:${f1(x1 - x0)}px;--dy:${f1(y1 - y0)}px"><i class="light sm"></i></span>`).join('');

  Deck.scene({
    id: 'runs',
    title: 'How it runs',
    act: 2,
    bg: 'night',
    transition: 'push',
    cues: ['01 What makes it inspiring · four questions · the themes we look for', '02 Quarterly rhythm · always open, month by month', '03 Recognition · three tiers · Featured Story'],
    holds: [11, 10, 11],
    notes: [
      'What makes a story inspiring? Clear criteria, published to everyone. A story is featured when it answers four questions: what it enabled, which value it showed, what changed, and what others can repeat. Resilience, innovation, collaboration and service are the themes we look for.',
      'Nominations never close: any peer or leader can nominate through a simple form. Each quarter, one cycle runs: curate in month one, feature in month two, reinforce in month three. Once a year, featured stories become a curated collection.',
      'The story comes first; the reward supports the moment. Three scales: a leader’s acknowledgement and certificate, a quarterly feature across Tahakom, an annual collection. Featured Story, not Best Story: clear criteria, and popularity never decides.',
    ],
    field: [
      { dim: .34, lit: .03, travel: .2, offset: [200, -70], litFrom: null, warm: 0, links: .5, wave: .45, streaks: .1, sparkle: 1, drift: 1,
        calm: [[100, 90, 1820, 200, .75], [100, 210, 1600, 320, .8], [110, 320, 1810, 960, .9]] },
      { offset: [20, -30], travel: .45, wave: .6, streaks: .14, sparkle: 1.3,
        calm: [[100, 90, 1820, 200, .75], [100, 210, 1400, 320, .8], [110, 310, 1810, 460, .85], [110, 480, 1810, 920, .9]] },
      { offset: [-170, 40], lit: .05, travel: .3, warm: .3, links: .65, wave: .5, streaks: .12, sparkle: 1.2,
        calm: [[100, 90, 1820, 200, .75], [100, 210, 960, 950, .9]] },
    ],
    html: `
      <div class="rn-mood"><i></i><i></i><i></i></div>
      <div class="rn-world" aria-hidden="true"><div class="rn-world-in">
        <i class="rn-pool p0"></i><i class="rn-pool p1"></i><i class="rn-pool p2"></i>${bokeh}
      </div></div>

      <nav class="rn-tabs">
        <div class="rn-bar glass a-fade" data-in="0" style="--d:0s;--dur:.8s"></div>
        <i class="rn-ind a-fade" data-in="0" style="--d:.35s"><b></b></i>
        ${tabs}
      </nav>

      <!-- 0 · what makes it inspiring: the published criteria -->
      <div class="rn-panel rn-p0" data-in="0" data-out="1">
        <h2 class="h2 rn-h rn-h0" data-in="0" data-split style="--d:.12s">A story is featured when it answers <em class="hl">four questions.</em></h2>
        <div class="rn-card glass a-unfold" data-in="0" style="--d:.34s;--dur:1.1s">
          <i class="rn-dots"></i>
          <div class="rn-bandw a-fade" data-in="0" style="--d:1.5s"><i class="rn-band"></i></div>
          <div class="rn-colh a-fade" data-in="0" style="--d:.6s"><span style="left:146px">Field</span><span style="left:340px">The question <b>${ico(IC.arrow)} design decision</b></span></div>
          <i class="rn-spine a-wipe-down" data-in="0" style="--d:.5s;--dur:1.2s"></i>
          <i class="rn-port" data-spark="0" data-spark-at="c"></i>
          <div class="rn-rows" data-stagger style="--stagger:.1s;--d:.5s">${rows}</div>
          <div class="rn-walk a-fade" data-in="0" style="--d:1.6s"><i class="light"></i></div>
        </div>
        <!-- illustrative: one story card passing the four checks (a single tilted plane) -->
        <div class="rn-story a-swing" data-in="0" style="--d:.78s;--dur:1.2s" aria-hidden="true">
          <div class="rn-sc glass">
            <div class="rn-sc-cov" style="background-image:url('assets/photos/nouf-question.jpg')"><span class="rn-sc-tag">Story</span></div>
            <span class="rn-sc-av">${Deck.icon('employee-female')}</span>
            <i class="rn-sc-t1"></i><i class="rn-sc-t2"></i>
            <i class="rn-sc-hr"></i>
            ${checks}
            <div class="rn-sc-ft">${ico(IC.star)}<span>Featured story</span>
              <div class="rn-sc-ft-on">${ico(IC.star)}<span>Featured story</span></div></div>
          </div>
        </div>
        <!-- support: the brief's themes, each tied to a value (small, under the table) -->
        <p class="rn-themes a-fade" data-in="0" style="--d:1.05s;--dur:.8s"><span class="rn-th-k">Themes we look for:</span> ${['resilience', 'innovation', 'collaboration', 'service'].map((t) => `<b>${t}</b>`).join(' <i>·</i> ')}, each linked to a Tahakom value.</p>
      </div>

      <!-- 1 · quarterly rhythm -->
      <div class="rn-panel rn-p1" data-in="1" data-out="2">
        <h2 class="h2 rn-h rn-h1" data-in="1" data-split style="--d:.28s">The operating cycle <em class="hl">keeps stories moving.</em></h2>
        <div class="rn-lane glass" data-in="1" style="--d:.4s">
          <span class="rn-cap" data-spark="1" data-spark-at="c" data-spark-delay=".45"></span>
          <div class="rn-lane-lab"><span>Always open</span><b>·</b><strong>Capture</strong></div>
          <p class="rn-lane-s">Accept peer and leader nominations through a simple form.</p>
          <span class="rn-track"></span>
          <span class="rn-tray">${Deck.icon('person-message')}</span>
        </div>
        <div class="rn-drops a-fade" data-in="1" style="--d:1s">${drops}</div>
        <div class="rn-qtr">
          <div class="rn-qtr-lab a-fade" data-in="1" style="--d:.55s">One quarter</div>
          <div class="rn-axis a-wipe" data-in="1" style="--d:.5s;--dur:1.2s"><span class="rn-weeks">${weeks}</span></div>
          ${marks}
          <div class="rn-months">${months}</div>
          <div class="rn-ext a-wipe" data-in="1" style="--d:1.1s;--dur:.6s"></div>
          <div class="rn-annual glass plum a-unfold" data-in="1" style="--d:1.02s">
            <span class="rn-coll a-materialize" data-in="1" style="--d:1.1s;--dur:1.1s"><i></i><i></i><i></i><i></i></span>
            <div class="rn-m-lab rn-an-lab">Annual</div>
            <p class="rn-an-t">Curated story collection</p>
            <span class="rn-stack a-fade" data-in="1" style="--d:1.3s"><i></i><i></i><i><b></b></i></span>
          </div>
          <div class="rn-play a-fade" data-in="1" style="--d:1.4s"><span class="rn-fill"></span><span class="rn-play-x"><i class="light"></i></span><span class="rn-shot"><i class="light sm"></i></span></div>
        </div>
      </div>

      <!-- 2 · recognition -->
      <div class="rn-panel rn-p2" data-in="2">
        <h2 class="h2 rn-h rn-h2" data-in="2" data-split style="--d:.28s">Recognition should make the employee <em class="hl">feel seen.</em></h2>
        <div class="rn-tiers" data-stagger style="--stagger:.14s;--d:.5s">${tiers}</div>
        <div class="rn-pr" data-in="2" style="--d:.95s">
          <span class="rn-pr-k">Principle</span>
          <p class="rn-pr-t">Use <em class="amb-shimmer">Featured Story</em> — not Best Story.</p>
        </div>
        <!-- illustrative: the three tiers as three objects on equal plinths, and the person they recognise -->
        <div class="rn-glow" style="left:${FL.x}px;top:${FL.y}px"></div>
        <div class="rn-rec" aria-hidden="true">
          ${floor}
          ${PX.map((x, k) => `<i class="rn-oh k${k}" style="left:${x}px;top:${f1(PY - PH - 118 * OS)}px"></i>`).join('')}
          ${plinths}
          <div class="rn-lights">
            ${threadLights}
            ${PX.map((x, k) => `<i class="rn-rim k${k}" style="left:${x}px;top:${PY - PH}px"></i><i class="rn-cone k${k}" style="left:${x}px;top:${PY - PH + 14}px"></i>`).join('')}
            <svg class="rn-bcl" viewBox="-180 -60 360 120" style="left:${PX[1]}px;top:${f1(PY - PH - 131 * OS)}px">${[[14, 30], [25, 32], [36, 34]].map(([r, a]) => `<path d="${arc(-104 * OS, 0, r * OS, 180 - a, 180 + a)}${arc(104 * OS, 0, r * OS, -a, a)}"/>`).join('')}</svg>
            ${[[-78, -232, 0], [70, -250, 1], [-4, -262, 2], [100, -196, 3]].map(([x, y, i]) => `<i class="rn-spk" style="left:${f1(PX[2] + x * OS)}px;top:${f1(PY - PH + y * OS)}px;--i:${i}">${ico(IC.star)}</i>`).join('')}
          </div>
          <div class="rn-hu" data-in="2" style="left:${HU.x}px;top:${HU.y}px;--d:1.2s">
            <i class="rn-hu-pool"></i>
            <svg class="rn-hu-d" viewBox="-80 -44 160 88"><g>${cyl(70, 29, 10, 'hd')}<ellipse class="hd-r" cx="0" cy="-10" rx="52" ry="21"/></g></svg>
            <i class="rn-hu-beam"></i>
            <i class="rn-ring"></i>
            <span class="rn-hu-av" style="top:${HU.py - HU.y}px;background-image:url('assets/photos/nouf.jpg')" data-spark="2" data-spark-xy="${HU.x - 88},${HU.py - 42}" data-spark-delay=".9"></span>
          </div>
        </div>
      </div>

      <div class="rn-sweep"></div>
    `,
    step(n, prev, ctx) {
      // recognition: the loops (the tiers' lights, the broadcast, the sparkles) start once the board has
      // built (at once when it is reached settled, e.g. going back)
      const land = () => ctx.el.classList.add('rn-land');
      ctx.el.classList.remove('rn-land');
      if (n === 2) { if (ctx.instant || prev < 0 || prev === 2) land(); else ctx.after(2150, land); }
      // a camera pan between boards (the scene's own entrance is the engine's push)
      const sw = ctx.$('.rn-sweep');
      sw.classList.remove('run-f', 'run-b');
      if (ctx.instant || prev < 0 || n < 0 || n === prev) return;
      const fwd = n > prev;
      void sw.offsetWidth; sw.classList.add(fwd ? 'run-f' : 'run-b');
      // the sweep exists only while it runs (at rest it would be a full-screen layer)
      ctx.after(1300, () => sw.classList.remove('run-f', 'run-b'));
      if (window.Field) { Field.warp(fwd ? 'left' : 'right', 1.05, .7); Field.kick(fwd ? -210 : 210, 0, 1.6); }
      // the board lands: a ripple of light leaves the person the tiers recognise
      if (n === 2 && fwd) ctx.after(1950, () => window.Field && Field.burst(HU.x, HU.py, { radius: 900, dur: 2 }));
    },
  });
})();
