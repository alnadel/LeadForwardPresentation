/* 10 · One story, through the cycle — ring rail + one hero UI object per stop.
   The rail on the left is the cycle from 09 in miniature: the current stage is lit
   and the story light sits on it, moving round the arc from stage to stage. The
   right side holds one hero object at about 1.6× real UI scale:
   0 the nomination form · 1 the curation checklist · 2 the channel post ·
   3 the certificate and four teams · 4 the chain, where the light divides.
   Nouf and Faisal are illustrative. No invented numbers. */
(function () {
  // the rail ring (stage px)
  const RCX = 250, RCY = 472, RR = 104;
  const ANG = [-45, 45, 135, 225];
  const STOP_ANG = [-45, 45, 135, 225, 315];      // stop 4 completes the lap back to Capture
  const STAGES = ['Capture', 'Curate', 'Feature', 'Reinforce'];
  const npos = (a, r) => [RCX + (r || RR) * Math.cos(a * Math.PI / 180), RCY + (r || RR) * Math.sin(a * Math.PI / 180)];
  const N1 = npos(-45);

  // stop 3: the four teams, and the takeaway's lights that reach just those four
  const TEAMS = ['Traffic Ops · Shift B', 'Enforcement Ops', 'Field Operations', 'Data Centre'];
  const TILE = { x: 572, y: 606, w: 280, h: 200, gap: 24 };
  const CERT_OUT = [1168, 426];
  const tileX = (i) => TILE.x + i * (TILE.w + TILE.gap);
  const reachPath = (i) => {
    const ex = tileX(i) + TILE.w - 34, ey = TILE.y + 34;
    return `M${CERT_OUT[0]} ${CERT_OUT[1]} C${CERT_OUT[0]} ${CERT_OUT[1] + 90} ${ex} ${ey - 120} ${ex} ${ey}`;
  };

  // stop 4: the pill sits on the path that leaves the ring; the next colleague waits after it
  const PILL = { x: 600, w: 700, h: 84 };
  const NEXT = [PILL.x + PILL.w + 74, N1[1]];
  const SPLIT = `M${N1[0].toFixed(1)} ${N1[1].toFixed(1)} C${N1[0] + 60} ${N1[1] + 44} ${PILL.x - 110} ${N1[1]} ${PILL.x} ${N1[1]} L${NEXT[0]} ${NEXT[1]}`;

  const svgCheck = '<svg class="jn-tick" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
  const svgArrow = '<svg class="jn-arr" viewBox="0 0 32 20" aria-hidden="true"><path d="M2 10h26M20 3l8 7-8 7"/></svg>';
  const av = (cls) => `<span class="jn-av ${cls || ''}" style="background-image:url('assets/photos/nouf.jpg')"></span>`;

  const railNodes = ANG.map((a, i) => {
    const [x, y] = npos(a);
    return `<div class="jn-nd" style="left:${(x - RCX + 150).toFixed(1)}px;top:${(y - RCY + 150).toFixed(1)}px"><span>0${i + 1}</span></div>`;
  }).join('');

  const tiles = TEAMS.map((t, i) => {
    const name = t.replace(' · ', ' ·<br>').replace(/^(Enforcement|Field|Data) /, '$1<br>');
    return `<div class="jn-tile" style="left:${tileX(i)}px;top:${TILE.y}px;--f:${(1.05 + i * 0.14).toFixed(2)}s">
        <div class="jn-face front"><b>${name}</b><i class="jn-hollow"></i></div>
        <div class="jn-face back"><b>${name}</b><span class="jn-adopt">${svgCheck}Adopted</span></div>
      </div>`;
  }).join('');

  Deck.scene({
    id: 'journey',
    title: 'One story, through the cycle',
    act: 3,
    bg: 'night',
    tag: 'illustrative',
    cues: ['Capture · Faisal nominates Nouf', 'Curate · three checks', 'Feature · the channel post', 'Reinforce · certificate and four teams', 'The chain · the light divides'],
    holds: [11, 8, 9, 10, 9],
    notes: [
      'Now follow Nouf’s story through it. A reminder: Nouf and Faisal are an illustrative story, not a real case. Faisal, a shift supervisor, opens the nomination form. It takes thirty seconds. Who changed how you work? Nouf Al-Harbi. What changed? In his own words: “Nobody asked her to fix it. She just did it — and then she taught the rest of us how.” He presses send, and the nomination enters the cycle as a story.',
      'Curate. Before anything is shared, three checks: the facts are checked with the shift lead, Nouf gives her consent, and the story is linked to one value — Excellence. Nothing is published without the employee’s consent.',
      'Feature. The story goes out on a channel we already have, as a short post: she rebuilt the night handover in one afternoon. We show reactions, not reach numbers. What matters is that other teams can now see what she did, and how.',
      'Reinforce. Her leader acknowledges the contribution with a personal certificate. Then the takeaway travels: in this example four teams adopt the new handover — Shift B, Enforcement, Field Operations and the Data Centre. The light reaches those four and no further; we are not claiming more than the story shows.',
      'And this is the part that matters most. Nouf nominates the next colleague, and the cycle starts again. For the first time, the light divides: one story has become two. Recognition becomes behaviour. Once more, the story is illustrative — the mechanism is what we are asking you to pilot.',
    ],
    field: [
      { dim: .2, lit: .02, travel: 0, offset: [-190, -110], litFrom: null, calm: [[520, 130, 1800, 940, .85], [110, 130, 470, 940, .45]] },
      {},
      {},
      {},
      { dim: .28, lit: .07, litFrom: NEXT, travel: .32, calm: [[540, 480, 1700, 760, .75], [110, 130, 470, 940, .45]] },
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
        ${railNodes}
        <div class="jn-orb"><div class="jn-orb-i"><b class="amb-ring"></b><b class="amb-ring" style="animation-delay:-1.6s"></b><i class="light amb-breathe"></i></div></div>
      </div>
      <ol class="jn-list" data-stagger style="--stagger:.06s">
        ${STAGES.map((s, i) => `<li class="jn-li" data-in="0" style="--d:.3s"><b>0${i + 1}</b><span>${s}</span></li>`).join('')}
      </ol>

      <!-- 0 · CAPTURE: Faisal nominates Nouf -->
      <div class="jn-faisal a-left" data-in="0" data-out="1" style="--d:.1s">
        <div class="jn-portrait"><div class="photo amb-ken" style="background-image:url('assets/photos/faisal.jpg')"></div></div>
        <b class="jn-name">Faisal Al-Otaibi</b>
        <span class="jn-role">Shift Supervisor</span>
      </div>
      <div class="paper jn-form a-right" data-in="0" data-out="1" style="--d:.2s">
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
      <div class="jn-flyer"><i class="light jn-fly"></i></div>

      <!-- 1 · CURATE: three checks -->
      <div class="paper jn-cur a-right" data-in="1" data-out="2" style="--d:.2s">
        <div class="jn-cur-h"><b>Curation checklist</b><span class="jn-draft">Before it is shared</span></div>
        <div class="jn-nom">${av('lg')}<span class="jn-nm"><b>Nouf Al-Harbi</b><span>Nominated by Faisal Al-Otaibi</span></span></div>
        <p class="jn-ex">“Nobody asked her to fix it. She just did it…”</p>
        <div class="jn-checks">
          <div class="jn-ck" style="--t:.45s"><i class="jn-box">${svgCheck}</i><span>Facts checked with the shift lead</span></div>
          <div class="jn-ck" style="--t:.8s"><i class="jn-box">${svgCheck}</i><span>Consent from Nouf</span></div>
          <div class="jn-ck" style="--t:1.15s"><i class="jn-box">${svgCheck}</i><span>Value: <em class="jn-value">Excellence</em></span></div>
        </div>
      </div>

      <!-- 2 · FEATURE: the channel post -->
      <div class="paper jn-post a-right" data-in="2" data-out="3" style="--d:.2s">
        <div class="jn-ph">
          <span class="jn-pav">${Deck.art('mark')}</span>
          <span class="jn-pk"><b>Behind a Better Life · Story 07</b><span>Traffic Operations Centre</span></span>
        </div>
        <h3 class="jn-pt">She rebuilt the night handover in one afternoon.</h3>
        <p class="jn-pl">Nouf Al-Harbi turned the night handover into one clear page — and showed the day shift how to use it.</p>
        <div class="jn-pimg"><div class="photo amb-ken-2" style="background-image:url('assets/photos/nouf.jpg')"></div><span class="jn-pval">Excellence</span></div>
        <div class="jn-react">
          <span>${Deck.icon('handshake')}Thank you</span>
          <span>${Deck.icon('eye-lightbulb')}Insightful</span>
          <span>${Deck.icon('person-message')}Comment</span>
        </div>
      </div>

      <!-- 3 · REINFORCE: the certificate, and four teams adopt the takeaway -->
      <div class="paper jn-cert a-down" data-in="3" data-out="4" style="--d:.15s">
        <span class="jn-cert-i">${Deck.icon('document-certified')}</span>
        <span class="jn-cert-t">
          <span class="jn-cert-k">Leader acknowledgement</span>
          <b>Nouf Al-Harbi</b>
          <span class="jn-cert-l">Personal certificate · Excellence</span>
        </span>
      </div>
      <div class="label jn-tl a-fade" data-in="3" data-out="4" style="--d:.4s">Takeaway shared with</div>
      <div class="jn-tiles a-fade" data-in="3" data-out="4" style="--d:.35s">${tiles}</div>
      <svg class="jn-links a-fade" data-in="3" data-out="4" style="--d:1.2s;--dur:1s" viewBox="0 0 1920 1080" aria-hidden="true">${TEAMS.map((t, i) => `<path class="amb-flow-slow" d="${reachPath(i)}"/>`).join('')}</svg>
      <div class="jn-reach a-fade" data-out="4">
        ${TEAMS.map((t, i) => `<i class="light sm jn-rt" style="offset-path:path('${reachPath(i)}');--k:${i}"></i>`).join('')}
      </div>

      <!-- 4 · THE CHAIN: the light divides -->
      <svg class="jn-trail a-fade" data-in="4" style="--d:1.6s;--dur:1s" viewBox="0 0 1920 1080" aria-hidden="true"><path class="amb-flow-slow" d="${SPLIT}"/></svg>
      <div class="jn-splitw"><i class="light jn-split" style="offset-path:path('${SPLIT}')"></i></div>
      <div class="jn-pill a-left" data-in="4" style="left:${PILL.x}px;top:${N1[1] - PILL.h / 2}px;width:${PILL.w}px;height:${PILL.h}px;--d:.15s">Nouf nominates the next colleague${svgArrow}</div>
      <div class="jn-next" style="left:${NEXT[0]}px;top:${NEXT[1]}px"><i class="jn-sq"></i><span class="jn-rings"><b class="amb-ring"></b><b class="amb-ring" style="animation-delay:-1.6s"></b></span></div>
      <h2 class="jn-big" data-in="4" data-split style="--d:.55s">Recognition becomes <em class="hl">behaviour.</em></h2>
    `,
    init(ctx) {
      ctx.orb = ctx.$('.jn-orb');
      ctx.orbI = ctx.$('.jn-orb-i');
      ctx.prog = ctx.$('.jn-rprog');
      ctx.nds = ctx.$$('.jn-nd');
      ctx.lis = ctx.$$('.jn-li');
      ctx.fly = ctx.$('.jn-fly');
    },
    step(n, prev, ctx) {
      const k = Math.max(0, n);
      // the story light rides the ring to the current stage (stop 4 completes the lap)
      const a = STOP_ANG[k];
      ctx.orb.style.transform = `rotate(${a}deg)`;
      ctx.orbI.style.transform = `translateX(${RR}px) rotate(${-a}deg)`;
      ctx.prog.style.strokeDasharray = (k * 25) + ' 100';
      const cur = k === 4 ? 0 : k;
      ctx.nds.forEach((d, i) => { d.classList.toggle('cur', i === cur); d.classList.toggle('done', k === 4 ? i !== 0 : i < cur); });
      ctx.lis.forEach((d, i) => { d.classList.toggle('cur', i === cur); d.classList.toggle('done', k === 4 ? i !== 0 : i < cur); });

      // stop 0, played forward: the sent nomination becomes a light and flies to Capture
      // (set the class before any layout read, so the rail light picks up its delay)
      const flying = n === 0 && prev < 0 && !ctx.instant;
      ctx.el.classList.toggle('jn-flown', !flying);
      ctx.fly.classList.remove('go');
      if (flying) {
        const s = sendPoint(ctx);
        ctx.fly.style.offsetPath = `path('M${s[0]} ${s[1]} Q${((s[0] + N1[0]) / 2).toFixed(0)} ${Math.min(s[1], N1[1]) - 330} ${N1[0].toFixed(1)} ${N1[1].toFixed(1)}')`;
        void ctx.fly.offsetWidth;
        ctx.fly.classList.add('go');
      }

      if (n === 4 && !ctx.instant) ctx.after(2050, () => window.Field && Field.burst(NEXT[0], NEXT[1], { radius: 520, dur: 2 }));
    },
  });

  // centre of the Send button in stage px (layout offsets ignore the build transforms)
  function sendPoint(ctx) {
    let el = ctx.$('.jn-send'), x = el.offsetWidth / 2, y = el.offsetHeight / 2;
    while (el && el !== ctx.el) { x += el.offsetLeft; y += el.offsetTop; el = el.offsetParent; }
    return [Math.round(x), Math.round(y)];
  }
})();
