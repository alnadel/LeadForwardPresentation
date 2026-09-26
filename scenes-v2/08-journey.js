/* 08 · One story, through the cycle (v2) — ring rail + hero UI objects, four stops.
   The rail on the left is the cycle from 07 in miniature: a light keeps orbiting
   it, and the story light (the spark) sits on the stage being discussed. The
   hero objects float gently with a sheen:
   0 CAPTURE  Faisal's 30-second nomination (the form sends).
   1 CURATE → FEATURE  the three checks tick, then the post publishes beside them.
   2 REINFORCE  the certificate, and the takeaway flows to four teams that ADOPT it.
   3 THE CHAIN  the lap completes at Capture and a new light leaves the ring with a
     trail, through "Nouf nominates the next colleague", to the next colleague.
   Nouf and Faisal are illustrative. No invented numbers. */
(function () {
  // the rail ring (stage px)
  const RCX = 250, RCY = 472, RR = 104;
  const ANG = [-45, 45, 135, 225];
  const STAGES = ['Capture', 'Curate', 'Feature', 'Reinforce'];
  const npos = (a, r) => [RCX + (r || RR) * Math.cos(a * Math.PI / 180), RCY + (r || RR) * Math.sin(a * Math.PI / 180)];
  const N = ANG.map((a) => npos(a));
  const xy = (p) => p[0].toFixed(1) + ',' + p[1].toFixed(1);
  const PUBLISH = 1.15;          // stop 1: the post publishes this long after the click

  // stop 1: the checklist hands the story to the post along a short connector
  const FLOW = { x0: 1044, x1: 1108, y: 740 };   // from the checklist's value to the post's value
  const FLOWP = `M${FLOW.x0} ${FLOW.y} L${FLOW.x1} ${FLOW.y}`;

  // stop 2: the certificate, the takeaway hub under it, and four teams below
  const TEAMS = ['Traffic Ops · Shift B', 'Enforcement Ops', 'Field Operations', 'Data Centre'];
  const CERT = { x: 548, y: 150, w: 1228, h: 290 };
  const TILE = { x: 548, y: 668, w: 286, h: 214, gap: 28 };   // the row spans the content column (548–1776)
  const HUB = [CERT.x + CERT.w / 2, 564];                     // the bottom of the "takeaway shared with" pill
  const STEM = `M${HUB[0]} ${CERT.y + CERT.h} L${HUB[0]} ${HUB[1] - 64}`;
  const tileX = (i) => TILE.x + i * (TILE.w + TILE.gap);
  const port = (i) => [tileX(i) + TILE.w / 2, TILE.y];
  const reachPath = (i) => {
    const [ex, ey] = port(i);
    return `M${HUB[0]} ${HUB[1]} C${HUB[0]} ${HUB[1] + 62} ${ex} ${ey - 70} ${ex} ${ey}`;
  };
  const LK = { dl: .6, dd: .38, st: .06 };                   // the branches draw after the hub lights
  const FLIP = (i) => LK.dl + LK.dd + i * LK.st - .04;        // each tile turns as its branch arrives

  // stop 3: the new light leaves node 01, passes through the pill and reaches the next colleague
  const PILL = { x: 560, w: 700, h: 84 };
  const NEXT = [1540, N[0][1]];
  const SPLIT = `M${N[0][0].toFixed(1)} ${N[0][1].toFixed(1)} C${(N[0][0] + 70).toFixed(1)} ${(N[0][1] + 40).toFixed(1)} ${PILL.x - 120} ${N[0][1].toFixed(1)} ${PILL.x} ${N[0][1].toFixed(1)} L${NEXT[0]} ${NEXT[1].toFixed(1)}`;

  // where the onward stories go from the next colleague (kept clear of the headline)
  const ONWARD = [[250, -230], [-120, -250], [300, 40], [100, -260], [-280, -170], [330, -120], [60, 330], [-90, -250]];

  // ── the ambient lights ride their curves on transforms (the compositor), not offset-path:
  // each curve becomes a sampled keyframe track (by arc length), written into the scene's <style> ──
  const bez = (s, t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * s[k] + 3 * u * u * t * s[2 + k] + 3 * u * t * t * s[4 + k] + t * t * t * s[6 + k]); };
  const line = (x0, y0, x1, y1) => [x0, y0, x0 + (x1 - x0) / 3, y0 + (y1 - y0) / 3, x0 + 2 * (x1 - x0) / 3, y0 + 2 * (y1 - y0) / 3, x1, y1];
  function tracer(segs) {          // segs: cubic segments [x0,y0,x1,y1,x2,y2,x3,y3] → f (share of the length) → [x, y]
    const P = [bez(segs[0], 0)], L = [0];
    segs.forEach((s) => { for (let i = 1; i <= 160; i++) { const p = bez(s, i / 160), q = P[P.length - 1]; P.push(p); L.push(L[L.length - 1] + Math.hypot(p[0] - q[0], p[1] - q[1])); } });
    const tot = L[L.length - 1];
    return (f) => {
      const d = Math.min(1, Math.max(0, f)) * tot; let lo = 0, hi = L.length - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; if (L[m] < d) lo = m; else hi = m; }
      const r = (d - L[lo]) / ((L[hi] - L[lo]) || 1);
      return [P[lo][0] + (P[hi][0] - P[lo][0]) * r, P[lo][1] + (P[hi][1] - P[lo][1]) * r];
    };
  }
  const cubic = (x1, y1, x2, y2) => (u) => {   // a CSS cubic-bezier() easing
    if (u <= 0 || u >= 1) return u <= 0 ? 0 : 1;
    let lo = 0, hi = 1, t = u;
    for (let i = 0; i < 40; i++) { t = (lo + hi) / 2; if (3 * (1 - t) * (1 - t) * t * x1 + 3 * (1 - t) * t * t * x2 + t * t * t < u) lo = t; else hi = t; }
    return 3 * (1 - t) * (1 - t) * t * y1 + 3 * (1 - t) * t * t * y2 + t * t * t;
  };
  // a track from the path's start: it moves between a% and b% of the cycle (eased), then holds at the end
  const KF = [];
  function track(name, segs, a, b, ease, n) {
    const at = tracer(segs), p0 = at(0);
    const key = (f) => { const p = at(f); return `{transform:translate(${(p[0] - p0[0]).toFixed(1)}px,${(p[1] - p0[1]).toFixed(1)}px)}`; };
    let s = a > 0 ? `0%${key(0)}` : '';
    for (let k = 0; k <= n; k++) s += `${(a + (b - a) * k / n).toFixed(2)}%${key(ease(k / n))}`;
    KF.push(`@keyframes ${name}{${s}${b < 100 ? `100%${key(1)}` : ''}}`);
    return name;
  }

  const svgCheck = '<svg class="jn-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
  const svgArrow = '<svg class="jn-arr" viewBox="0 0 32 20" aria-hidden="true"><path d="M2 10h26M20 3l8 7-8 7"/></svg>';
  const svgChev = '<svg viewBox="0 0 14 22" aria-hidden="true"><path d="M3 3l8 8-8 8"/></svg>';
  const av = (cls) => `<span class="jn-av ${cls || ''}" style="background-image:url('assets/photos/nouf.jpg')"></span>`;

  // the rail nodes carry the spark: Capture (stop 0), Feature (stop 1, once the post
  // publishes), Reinforce (stop 2); node 01's glow carries it at stop 3
  const railNodes = ANG.map((a, i) => {
    const [x, y] = N[i];
    const st = i === 0 ? 0 : i === 2 ? 1 : i === 3 ? 2 : -1;
    const spk = st >= 0 ? `data-spark="${st}" data-spark-xy="${xy(N[i])}"${st === 1 ? ` data-spark-delay="${PUBLISH}"` : ''}` : '';
    return `<div class="jn-nd" style="left:${(x - RCX + 150).toFixed(1)}px;top:${(y - RCY + 150).toFixed(1)}px" ${spk}>
        ${i === 0 ? `<b class="jn-ndg" data-spark="3" data-spark-xy="${xy(N[0])}"></b>` : ''}<span>0${i + 1}</span></div>`;
  }).join('');

  const tiles = TEAMS.map((t, i) => {
    const name = t.replace(' · ', '<br>').replace(/^(Enforcement|Field|Data) /, '$1<br>');
    return `<div class="jn-tile a-unfold" data-in="2" style="left:${tileX(i)}px;top:${TILE.y}px;--f:${FLIP(i).toFixed(2)}s;--k:${i};--d:.34s;--dur:.7s">
        <div class="jn-face front"><b>${name}</b><i class="jn-hollow"></i></div>
        <div class="jn-face back"><b>${name}</b><span class="jn-adopt">${svgCheck}Adopted</span></div>
      </div>`;
  }).join('');

  // the new light and its trail (lead first)
  // (the lead is a wrapper that travels the path, so the light inside can breathe on the compositor)
  const ghosts = [0, 1, 2, 3, 4, 5].map((k) => k ? `<i class="jn-gh" style="offset-path:path('${SPLIT}');--g:${k}"></i>` : `<i class="jn-new" style="offset-path:path('${SPLIT}')"><b class="light"></b></i>`).join('');

  // ambient tracks: a light runs down each branch to its team (eased, 0–78% of its cycle) and the
  // chain's lights run the whole split (steady, 0–90%); the chain's dashes flow on the short curve
  // out of the ring (stroke) and on a translated strip along the straight run to the next colleague
  const N0 = [+N[0][0].toFixed(1), +N[0][1].toFixed(1)];
  const reachSeg = (i) => { const [ex, ey] = port(i); return [HUB[0], HUB[1], HUB[0], HUB[1] + 62, ex, ey - 70, ex, ey]; };
  const runs = TEAMS.map((t, i) => track('jnRun' + i, [reachSeg(i)], 0, 78, cubic(.42, 0, .58, 1), 32));
  const splitCurve = [N0[0], N0[1], N0[0] + 70, N0[1] + 40, PILL.x - 120, N0[1], PILL.x, N0[1]];
  track('jnChainP', [splitCurve, line(PILL.x, N0[1], NEXT[0], N0[1])], 0, 90, (u) => u, 60);
  const CURVE = `M${N0[0]} ${N0[1]} C${N0[0] + 70} ${N0[1] + 40} ${PILL.x - 120} ${N0[1]} ${PILL.x} ${N0[1]}`;
  // the boxes (x, y, w, h) of the two flowing-dash paths
  const LKBOX = [tileX(0) + TILE.w / 2 - 6, HUB[1] - 6, 3 * (TILE.w + TILE.gap) + 12, TILE.y - HUB[1] + 12];
  const TRBOX = [Math.floor(N0[0]) - 6, Math.floor(N0[1]) - 6, Math.ceil(PILL.x - N0[0]) + 12, 32];
  // the drawn lines sit in svgs cut to their own boxes (a full-stage svg is a full-stage layer)
  const FBOX = [FLOW.x0 - 24, FLOW.y - 26, FLOW.x1 - FLOW.x0 + 48, 52];                        // stop 1: checklist → post
  const LBOX = [port(0)[0] - 24, CERT.y + CERT.h - 16, port(3)[0] - port(0)[0] + 48, TILE.y - CERT.y - CERT.h + 32];   // stop 2: stem and branches
  const SBOX = [Math.floor(N0[0]) - 16, Math.floor(N0[1]) - 16, Math.ceil(NEXT[0] - N0[0]) + 32, 56];   // stop 3: the split

  Deck.scene({
    id: 'journey',
    title: 'One story, through the cycle',
    act: 2,
    bg: 'night',
    tag: 'illustrative',
    transition: 'dolly',
    cues: ['Capture · Faisal nominates Nouf', 'Curate → Feature · the checks tick, the post publishes', 'Reinforce · certificate and four teams', 'The chain · recognition becomes behaviour'],
    holds: [11, 12, 10, 9],
    notes: [
      'Now follow Nouf’s story through the cycle — illustrative, not a real case. Faisal takes thirty seconds to nominate Nouf: “Nobody asked her to fix it. She just did it — and then she taught the rest of us how.”',
      'Curate: facts checked with the shift lead, Nouf’s consent, and one value, Excellence. Nothing goes out without consent. Then Feature: a short post on a channel we already have. Reactions, not reach numbers.',
      'Reinforce: her leader acknowledges her with a certificate, and the takeaway travels. In this illustrative story four teams adopt the new handover, and we claim no more than that.',
      'Then Nouf nominates the next colleague, and the cycle starts again: recognition becomes behaviour. Again, the story is illustrative; the mechanism is what we ask you to pilot.',
    ],
    field: [
      { dim: .24, lit: .02, travel: .12, offset: [-190, -110], litFrom: null, links: .45, wave: .45, streaks: .1, sparkle: .9, calm: [[520, 130, 1800, 940, .85], [110, 130, 470, 940, .45]] },
      {},
      { travel: .2 },
      { dim: .52, lit: .08, litFrom: NEXT, travel: .6, links: .85, wave: 1, streaks: .26, sparkle: 3.8, calm: [[540, 510, 1480, 730, .72], [110, 130, 470, 940, .4]] },
    ],
    html: `
      <!-- the rail: the cycle in miniature -->
      <div class="jn-rail">
        <div class="kicker" data-in="0">One story</div>
      </div>
      <!-- the stage being discussed: the one word the room reads first (it changes with the story) -->
      <div class="jn-stage" data-in="0" style="--d:.12s">
        ${STAGES.map((s, i) => `<div class="jn-sg"><b>0${i + 1}</b><span>${s}</span></div>`).join('')}
      </div>
      <div class="jn-ring a-fade" data-in="0" style="left:${RCX - 150}px;top:${RCY - 150}px;--d:.2s">
        <svg viewBox="0 0 300 300" aria-hidden="true">
          <circle class="jn-rtrack" cx="150" cy="150" r="${RR}"/>
        </svg>
        <svg class="jn-rsvg" viewBox="0 0 300 300" aria-hidden="true">
          <circle class="jn-rprog" cx="150" cy="150" r="${RR}" pathLength="100" transform="rotate(-45 150 150)"/>
        </svg>
        <div class="jn-orbit"><i class="jn-comet" style="left:${-RR - 18}px;top:${-RR - 18}px;width:${2 * RR + 36}px;height:${2 * RR + 36}px"></i><i class="light sm jn-ol" style="left:${RR - 7}px"></i></div>
        ${railNodes}
      </div>
      <ol class="jn-list" data-stagger style="--stagger:.06s">
        ${STAGES.map((s, i) => `<li class="jn-li" data-in="0" style="--d:.3s"><b>0${i + 1}</b><span>${s}</span></li>`).join('')}
      </ol>

      <!-- 0 · CAPTURE: Faisal nominates Nouf -->
      <div class="jn-faisal a-left" data-in="0" data-out="1" style="--d:.1s">
        <div class="jn-fi amb-float3d-2">
          <div class="jn-portrait"><div class="photo amb-ken" style="background-image:url('assets/photos/faisal.jpg')"></div></div>
          <b class="jn-name">Faisal Al-Otaibi</b>
          <span class="jn-role">Shift Supervisor</span>
        </div>
      </div>
      <div class="jn-form a-swing" data-in="0" data-out="1" style="--d:.2s">
        <div class="paper jn-form-i amb-float3d jn-sheen">
          <div class="jn-strip">
            <span class="jn-mk">${Deck.art('mark')}</span><b>Nominate a colleague</b>
            <span class="jn-time">${Deck.icon('gear-clock')}30 seconds</span>
          </div>
          <div class="jn-fb">
            <div class="jn-lab">Who changed how you work?</div>
            <div class="jn-field jn-pick">
              <div class="jn-val a-fade" data-in="0" style="--d:.5s;--dur:.5s">${av()}<span class="jn-nm"><b>Nouf Al-Harbi</b><span>Senior Operations Analyst</span></span></div>
            </div>
            <div class="jn-lab">What changed?</div>
            <div class="jn-field jn-quote">
              <p class="a-fade" data-in="0" style="--d:.65s;--dur:.5s">“Nobody asked her to fix it. She just did it — and then she taught the rest of us how.”</p>
            </div>
            <div class="jn-foot">
              <span class="jn-send"><span class="s1">Send${svgArrow}</span><span class="s2">${svgCheck}Sent</span></span>
            </div>
          </div>
        </div>
      </div>

      <!-- 1 · CURATE → FEATURE: the checks tick, then the post publishes -->
      <i class="jn-glow g1" data-at="1"></i>
      <div class="jn-cur a-flip" data-in="1" data-out="2" style="--d:.12s;--dur:.8s">
        <div class="paper jn-cur-i amb-float3d-2 jn-sheen">
          <div class="jn-cur-h"><b>Curation checklist</b><span>Before it is shared</span></div>
          <div class="jn-nom">${av('sm')}<span class="jn-nm"><b>Nouf Al-Harbi</b><span>Nominated by Faisal Al-Otaibi</span></span></div>
          <div class="jn-checks">
            <div class="jn-ck" style="--t:.45s"><i class="jn-box">${svgCheck}</i><span>Facts checked with the shift lead</span></div>
            <div class="jn-ck" style="--t:.7s"><i class="jn-box">${svgCheck}</i><span>Consent from Nouf</span></div>
            <div class="jn-ck" style="--t:.95s"><i class="jn-box">${svgCheck}</i><span>Value: <em class="jn-value">Excellence</em></span></div>
          </div>
        </div>
      </div>
      <div class="jn-flow a-fade" data-in="1" data-out="2" style="left:${FBOX[0]}px;top:${FBOX[1]}px;width:${FBOX[2]}px;height:${FBOX[3]}px;--d:${(PUBLISH - .2).toFixed(2)}s;--dur:.4s">
        <svg viewBox="${FBOX.join(' ')}" aria-hidden="true"><path class="jn-fl" d="${FLOWP}"/></svg>
        <span class="jn-chevs" style="left:${FLOW.x0 - FBOX[0]}px;top:${FLOW.y - FBOX[1]}px;width:${FLOW.x1 - FLOW.x0}px">${svgChev}${svgChev}${svgChev}</span>
        <i class="light sm jn-fdot" style="left:${FLOW.x0 - FBOX[0] - 7}px;top:${FLOW.y - FBOX[1] - 7}px"></i>
      </div>
      <div class="jn-post a-swing" data-in="1" data-out="2" style="--d:${PUBLISH}s;--dur:1s">
        <div class="paper jn-post-i amb-float3d jn-sheen">
          <div class="jn-ph">
            <span class="jn-pav">${Deck.art('mark')}</span>
            <span class="jn-pk"><b>Behind a Better Life · Story 07</b><span>Traffic Operations Centre</span></span>
          </div>
          <h3 class="jn-pt">She rebuilt the night handover in one afternoon.</h3>
          <div class="jn-pimg"><div class="photo amb-ken-2" style="background-image:url('assets/photos/nouf.jpg')"></div><span class="jn-pval">Excellence</span></div>
          <div class="jn-react">
            <span class="a-pop" data-in="1" style="--d:${(PUBLISH + .5).toFixed(2)}s;--dur:.6s">${Deck.icon('handshake')}Thank you</span>
            <span class="a-pop" data-in="1" style="--d:${(PUBLISH + .62).toFixed(2)}s;--dur:.6s">${Deck.icon('eye-lightbulb')}Insightful</span>
            <span class="a-pop" data-in="1" style="--d:${(PUBLISH + .74).toFixed(2)}s;--dur:.6s">${Deck.icon('person-message')}Comment</span>
          </div>
        </div>
      </div>

      <!-- 2 · REINFORCE: the certificate, and four teams adopt the takeaway -->
      <i class="jn-glow g2" data-at="2"></i>
      <div class="jn-certw a-drop" data-in="2" data-out="3" style="left:${CERT.x}px;top:${CERT.y}px;width:${CERT.w}px;height:${CERT.h}px;--d:.12s">
        <div class="paper jn-cert jn-bob jn-sheen">
          <i class="jn-frame"></i>
          <span class="jn-cert-i">${Deck.icon('document-certified')}</span>
          <span class="jn-cert-t">
            <span class="jn-cert-k">Leader acknowledgement</span>
            <b>Nouf Al-Harbi</b>
            <span class="jn-cert-l">Personal certificate · Excellence</span>
          </span>
          <span class="jn-seal"><svg viewBox="0 0 160 160" aria-hidden="true"><circle cx="80" cy="80" r="74" class="jn-seal-r"/><circle cx="80" cy="80" r="64" class="jn-seal-r2"/></svg><span class="jn-seal-i">${Deck.art('mark')}</span></span>
        </div>
      </div>
      <svg class="jn-links a-fade" data-in="2" data-out="3" viewBox="${LBOX.join(' ')}" style="left:${LBOX[0]}px;top:${LBOX[1]}px;width:${LBOX[2]}px;height:${LBOX[3]}px" aria-hidden="true">
        <path class="jn-lk jn-stem" d="${STEM}" pathLength="1" style="--dl:.4s;--dd:.22s"/>
        ${TEAMS.map((t, i) => `<path class="jn-lk" d="${reachPath(i)}" pathLength="1" style="--dl:${(LK.dl + i * LK.st).toFixed(2)}s;--dd:${LK.dd}s"/>`).join('')}
      </svg>
      <!-- the flowing dashes: one path on its own small layer (its repaint never touches the lit branches) -->
      <svg class="jn-lkfs a-fade" data-in="2" data-out="3" viewBox="${LKBOX.join(' ')}" style="left:${LKBOX[0]}px;top:${LKBOX[1]}px;width:${LKBOX[2]}px;height:${LKBOX[3]}px" aria-hidden="true"><path class="jn-lkf" d="${TEAMS.map((t, i) => reachPath(i)).join(' ')}"/></svg>
      <div class="jn-leads jn-lot" data-in="2" data-out="3">${TEAMS.map((t, i) => `<i class="jn-lead" style="offset-path:path('${reachPath(i)}');--dl:${(LK.dl + i * LK.st).toFixed(2)}s;--dd:${LK.dd}s"></i>`).join('')}</div>
      <div class="jn-hub a-materialize" data-in="2" data-out="3" style="left:${HUB[0]}px;top:${HUB[1] - 32}px;--d:.48s;--dur:.6s"><span class="jn-hub-i"><i class="light sm"></i>Takeaway shared with</span></div>
      <div class="jn-tiles" data-out="3" data-stagger style="--stagger:.07s">${tiles}</div>
      <div class="jn-ports jn-lot" data-in="2" data-out="3">${TEAMS.map((t, i) => { const [x, y] = port(i); return `<i class="jn-port" style="left:${x}px;top:${y}px;--k:${i};--f:${FLIP(i).toFixed(2)}s"></i>`; }).join('')}</div>
      <div class="jn-reach jn-lot" data-in="2" data-out="3">
        ${TEAMS.map((t, i) => `<i class="light sm jn-rt" style="left:${HUB[0] - 7}px;top:${HUB[1] - 7}px;--k:${i};--run:${runs[i]}"></i>`).join('')}
      </div>

      <!-- 3 · THE CHAIN: a new light leaves the ring -->
      <i class="jn-glow g3" data-at="3"></i>
      <svg class="jn-trail jn-lot" data-in="3" viewBox="${SBOX.join(' ')}" style="left:${SBOX[0]}px;top:${SBOX[1]}px;width:${SBOX[2]}px;height:${SBOX[3]}px" aria-hidden="true"><path class="jn-trace" d="${SPLIT}" pathLength="100"/></svg>
      <svg class="jn-trc jn-lot" data-in="3" viewBox="${TRBOX.join(' ')}" style="left:${TRBOX[0]}px;top:${TRBOX[1]}px;width:${TRBOX[2]}px;height:${TRBOX[3]}px" aria-hidden="true"><path class="jn-tr" d="${CURVE}"/></svg>
      <i class="jn-trs" style="left:${PILL.x}px;top:${N0[1] - 2}px;width:${NEXT[0] - PILL.x}px"><b></b></i>
      <div class="jn-newlight jn-lot" data-in="3">${ghosts}${[0, 1, 2].map((k) => `<i class="light sm jn-ch" style="left:${N0[0] - 7}px;top:${N0[1] - 7}px;--c:${k}"></i>`).join('')}</div>
      <div class="jn-pill a-left" data-in="3" style="left:${PILL.x}px;top:${(N[0][1] - PILL.h / 2).toFixed(1)}px;width:${PILL.w}px;height:${PILL.h}px;--d:.15s"><span class="jn-pill-i glass live"><b class="jn-pglow" style="--c:0"></b><b class="jn-pglow" style="--c:1"></b><b class="jn-pglow" style="--c:2"></b><span>Nouf nominates the next colleague</span>${svgArrow}</span></div>
      <div class="jn-next jn-lot" data-in="3" style="left:${NEXT[0]}px;top:${NEXT[1].toFixed(1)}px"><b class="jn-pool"></b><i class="jn-sq"></i><b class="jn-flash"></b><span class="jn-rings"><b class="amb-ring"></b><b class="amb-ring" style="animation-delay:-1.07s"></b><b class="amb-ring" style="animation-delay:-2.13s"></b></span></div>
      <h2 class="jn-big" data-in="3" data-split style="--d:.55s">Recognition becomes <em class="hl jn-beh" data-t="behaviour.">behaviour.</em></h2>
      <style>${KF.join('\n')}</style>
    `,
    init(ctx) {
      ctx.at3 = 0;
      ctx.sgs = ctx.$$('.jn-sg');
      ctx.nds = ctx.$$('.jn-nd');
      ctx.lis = ctx.$$('.jn-li');
      ctx.prog = ctx.$('.jn-rprog');
    },
    enter(ctx) {
      // the chain continues: once the next colleague is lit, stories keep leaving it into the field
      let k = 0;
      ctx.every(1400, () => {
        if (ctx.step !== 3 || !ctx.active || !window.Field || performance.now() - ctx.at3 < 2300) return;
        const [dx, dy] = ONWARD[k++ % ONWARD.length];
        Field.send(NEXT[0], NEXT[1], NEXT[0] + dx, NEXT[1] + dy, 1.9);
      });
    },
    leave(ctx) { window.LFLeave && LFLeave(ctx); },   // once faded out, it leaves the compositor
    step(n, prev, ctx) {
      window.LFPark && LFPark(ctx);   // each stop's objects leave the compositor once they have gone
      const k = Math.max(0, n);
      if (n === 3 && prev !== 3) ctx.at3 = performance.now() - (ctx.instant ? 3000 : 0);
      const forward = !ctx.instant && prev < n;
      // one-shot flourishes play only on a forward build
      ctx.el.dataset.play = forward ? String(n) : '';
      if (n === 1 && forward) {
        // curate first, then the post publishes and the story moves on to Feature
        rail(ctx, 1, 0);
        ctx.after(PUBLISH * 1000, () => rail(ctx, 2, 2));
      } else {
        rail(ctx, [0, 2, 3, 0][k], [0, 2, 3, 0][k], k === 3);
      }
      if (n === 3 && !ctx.instant) ctx.after(1950, () => window.Field && Field.burst(NEXT[0], NEXT[1], { radius: 340, dur: 1.6 }));
    },
  });

  // cur: the stage being discussed; spk: the node the story light sits on; lap: the lap is complete
  function rail(ctx, cur, spk, lap) {
    const done = lap ? 4 : cur;
    ctx.prog.style.strokeDasharray = (done * 25) + ' 100';
    ctx.nds.forEach((d, i) => {
      d.classList.toggle('cur', i === cur);
      d.classList.toggle('done', i < done);
      d.classList.toggle('spk', i === spk);
    });
    ctx.lis.forEach((d, i) => { d.classList.toggle('cur', i === cur); d.classList.toggle('done', i < done && i !== cur); });
    // the stage title: the current stage stands; earlier ones leave upward, later ones wait below
    ctx.sgs.forEach((d, i) => { d.classList.toggle('on', i === cur); d.classList.toggle('pre', i < cur); });
  }
})();
