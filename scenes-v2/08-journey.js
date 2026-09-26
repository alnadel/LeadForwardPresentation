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

  // stop 2: the four teams, and the takeaway's lights that reach just those four
  const TEAMS = ['Traffic Ops · Shift B', 'Enforcement Ops', 'Field Operations', 'Data Centre'];
  const TILE = { x: 584, y: 612, w: 280, h: 200, gap: 24 };   // the row ends on the right margin (1776)
  const HUB = [1326, 462];                                    // under the certificate, where the takeaway branches
  const tileX = (i) => TILE.x + i * (TILE.w + TILE.gap);
  const corner = (i) => [tileX(i) + TILE.w - 34, TILE.y + 34];
  const reachPath = (i) => {
    const [ex, ey] = corner(i);
    return `M${HUB[0]} ${HUB[1]} C${HUB[0]} ${HUB[1] + 80} ${ex} ${ey - 120} ${ex} ${ey}`;
  };

  // stop 3: the new light leaves node 01, passes through the pill and reaches the next colleague
  const PILL = { x: 560, w: 700, h: 84 };
  const NEXT = [1540, N[0][1]];
  const SPLIT = `M${N[0][0].toFixed(1)} ${N[0][1].toFixed(1)} C${(N[0][0] + 70).toFixed(1)} ${(N[0][1] + 40).toFixed(1)} ${PILL.x - 120} ${N[0][1].toFixed(1)} ${PILL.x} ${N[0][1].toFixed(1)} L${NEXT[0]} ${NEXT[1].toFixed(1)}`;

  // where the onward stories go from the next colleague (kept clear of the headline)
  const ONWARD = [[250, -230], [-120, -250], [300, 40], [100, -260], [-280, -170], [330, -120], [60, 330], [-90, -250]];

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
    return `<div class="jn-tile" style="left:${tileX(i)}px;top:${TILE.y}px;--f:${(1.05 + i * 0.14).toFixed(2)}s;--k:${i}">
        <div class="jn-face front"><b>${name}</b><i class="jn-hollow"></i></div>
        <div class="jn-face back"><b>${name}</b><span class="jn-adopt">${svgCheck}Adopted</span><i class="jn-cdot"></i></div>
      </div>`;
  }).join('');

  // the new light and its trail (lead first)
  const ghosts = [0, 1, 2, 3, 4, 5].map((k) => `<i class="${k ? 'jn-gh' : 'light jn-new'}" style="offset-path:path('${SPLIT}');--g:${k}"></i>`).join('');

  Deck.scene({
    id: 'journey',
    title: 'One story, through the cycle',
    act: 3,
    bg: 'night',
    tag: 'illustrative',
    transition: 'dolly',
    cues: ['Capture · Faisal nominates Nouf', 'Curate → Feature · the checks tick, the post publishes', 'Reinforce · certificate and four teams', 'The chain · recognition becomes behaviour'],
    holds: [11, 12, 10, 9],
    notes: [
      'Now one story through it — illustrative, not a real case. Faisal takes thirty seconds to nominate Nouf: “Nobody asked her to fix it. She just did it — and then she taught the rest of us how.”',
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
        <p class="jn-intro" data-in="0" style="--d:.1s">Now follow Nouf’s story through it.</p>
      </div>
      <div class="jn-ring a-fade" data-in="0" style="left:${RCX - 150}px;top:${RCY - 150}px;--d:.2s">
        <svg viewBox="0 0 300 300" aria-hidden="true">
          <circle class="jn-rtrack" cx="150" cy="150" r="${RR}"/>
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
      <div class="jn-flow a-fade" data-in="1" data-out="2" style="--d:${(PUBLISH - .15).toFixed(2)}s;--dur:.5s">${svgChev}${svgChev}${svgChev}</div>
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
      <div class="jn-certw a-drop" data-in="2" data-out="3" style="--d:.15s">
        <div class="paper jn-cert amb-float3d jn-sheen">
          <span class="jn-cert-i">${Deck.icon('document-certified')}</span>
          <span class="jn-cert-t">
            <span class="jn-cert-k">Leader acknowledgement</span>
            <b>Nouf Al-Harbi</b>
            <span class="jn-cert-l">Personal certificate · Excellence</span>
          </span>
        </div>
      </div>
      <div class="label jn-tl a-fade" data-in="2" data-out="3" style="--d:.4s">Takeaway shared with</div>
      <div class="jn-tiles a-fade" data-in="2" data-out="3" style="--d:.35s">${tiles}</div>
      <svg class="jn-links a-fade" data-in="2" data-out="3" style="--d:.9s;--dur:.8s" viewBox="0 0 1920 1080" aria-hidden="true">${TEAMS.map((t, i) => `<path class="jn-lk" d="${reachPath(i)}"/>`).join('')}</svg>
      <div class="jn-hub a-materialize" data-in="2" data-out="3" style="left:${HUB[0]}px;top:${HUB[1]}px;--d:.7s"><b class="amb-ring"></b><i class="light sm"></i></div>
      <div class="jn-reach" data-out="3">
        ${TEAMS.map((t, i) => `<i class="light sm jn-rt" style="offset-path:path('${reachPath(i)}');--k:${i}"></i>`).join('')}
      </div>

      <!-- 3 · THE CHAIN: a new light leaves the ring -->
      <svg class="jn-trail" viewBox="0 0 1920 1080" aria-hidden="true"><path class="jn-trace" d="${SPLIT}" pathLength="100"/><path class="jn-tr" d="${SPLIT}"/></svg>
      <div class="jn-newlight">${ghosts}${[0, 1, 2].map((k) => `<i class="light sm jn-ch" style="offset-path:path('${SPLIT}');--c:${k}"></i>`).join('')}</div>
      <div class="jn-pill a-left" data-in="3" style="left:${PILL.x}px;top:${(N[0][1] - PILL.h / 2).toFixed(1)}px;width:${PILL.w}px;height:${PILL.h}px;--d:.15s"><span class="jn-pill-i"><b class="jn-pglow" style="--c:0"></b><b class="jn-pglow" style="--c:1"></b><b class="jn-pglow" style="--c:2"></b><span>Nouf nominates the next colleague</span>${svgArrow}</span></div>
      <div class="jn-next" style="left:${NEXT[0]}px;top:${NEXT[1].toFixed(1)}px"><b class="jn-pool"></b><i class="jn-sq"></i><b class="jn-flash"></b><span class="jn-rings"><b class="amb-ring"></b><b class="amb-ring" style="animation-delay:-1.07s"></b><b class="amb-ring" style="animation-delay:-2.13s"></b></span></div>
      <h2 class="jn-big" data-in="3" data-split style="--d:.55s">Recognition becomes <em class="hl jn-beh">behaviour.</em></h2>
    `,
    init(ctx) {
      ctx.at3 = 0;
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
    step(n, prev, ctx) {
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
  }
})();
