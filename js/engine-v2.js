/* Behind a Better Life — presentation engine (v2: the condensed, cinematic cut).

   v2 adds on top of v1:
   · scene TRANSITIONS — transition: 'dolly' | 'push' | 'rise' | 'chapter' | 'iris'
     (default: 'chapter' across act boundaries, 'push' inside an act; back = quick fade).
     chapter: the old scene falls away into depth, the story light stretches into a line
     of light carrying the act's number and name, and the line splits open onto the next act.
   · the SPARK — one story light that flies to each stop's focus. Mark a target with
     data-spark="n" (the stop), optional data-spark-at="l|r|t|b|c|tl|tr" and
     data-spark-xy="x,y" (stage px override). It lands with a ripple and parks,
     breathing, until the next stop. Scene option spark: 'keep' keeps it parked on
     stops without a target (default: it fades), spark: false hides it.
   · count-ups finish with a punch (.counted), headlines with data-split flip in 3D.

   A scene is registered with Deck.scene({...}) and owns one <section>. It has one
   or more STOPS (cues). Each click plays the build for the next stop, then parks;
   ambient loops keep running while parked. Back returns to the previous stop's
   settled frame. Scene definition:

   Deck.scene({
     id: 'survey',                 // unique; section id is s-survey
     title: 'What colleagues told us',
     act: 1,                       // index into Deck.ACTS
     bg: 'night',                  // stage mood: plum | night | navy | deep | teal
     tag: 'illustrative',          // shows the ILLUSTRATIVE STORY tag
     chrome: { mark: true, progress: true },
     cues: ['158 responses', …],   // one per stop (presenter labels)
     notes: '…' | ['…per stop'],   // speaker notes
     field: {…} | [{…per stop}],   // Field.set params (per-stop entries merge onto the scene's)
     html: `…`,
     init(ctx) {}, enter(ctx) {}, step(n, prev, ctx) {}, leave(ctx) {}
   });

   Declarative builds (see css/deck.css): data-in / data-out / data-dim / data-at,
   data-split (word mask), data-count (count-up), data-type (typewriter).
   The section also carries .st-0 … .st-n for every reached stop, so scene CSS can
   style "from stop n on" with  #s-id.st-2 .thing { … }. */
(function () {
  const Deck = (window.Deck = {});
  Deck.ACTS = ['The moment', 'The case', 'The campaign', 'Leading it', 'The plan'];
  // pace targets for the speaker view: minutes elapsed by the end of each act
  Deck.ACT_TARGETS = [1.5, 6.25, 10.25, 12, 15];   // minutes: when each act should be finished (v3 timing)
  Deck.VERSION = 'v2';
  // The two colleagues who knew (03 · One night, stop 3). Scene 17 starts the
  // nomination chain from exactly these field positions. Stage px.
  Deck.NIGHT_PAIR = [[1084, 548], [1169, 572]];   // two same-layer colleagues, 88px apart
  Deck.NIGHT_OFFSET = [120, 40];                   // the field's camera offset in both scenes
  const defs = [];
  Deck.scene = (def) => defs.push(def);
  Deck.defs = defs;

  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  let stage, viewport, scenesEl, chrome, scale = 1;
  let cur = -1, step = 0;
  const S = [];                         // runtime scene records
  let presenter = null;
  let startTime = null;
  let auto = false, autoTimer = 0;
  let digits = '', digitsTimer = 0;
  let lastBuild = 0, lastKey = '', lastKeyAt = 0;

  /* ── helpers exposed to scenes ─────────────────────────────────────── */
  Deck.icon = function (name, cls) {
    const d = (window.TK_ICONS || {})[name];
    if (!d) return '';
    return '<span class="icon ' + (cls || '') + '"><svg viewBox="' + d.vb + '" fill="currentColor" aria-hidden="true">' + d.body + '</svg></span>';
  };
  Deck.art = function (name, cls) {
    const d = (window.TK_ART || {})[name];
    if (!d) return '';
    return '<svg class="' + (cls || '') + '" viewBox="' + d.vb + '" fill="currentColor" aria-hidden="true">' + d.body + '</svg>';
  };
  Deck.logo = function (cls) {
    // the white lockup, cropped to its artwork
    return '<svg class="' + (cls || '') + '" viewBox="12 12 1056 1056" fill="currentColor" aria-hidden="true">' + ((window.TK_ART || {}).logo || {}).body + '</svg>';
  };

  function ease(t) { return 1 - Math.pow(1 - t, 3); }
  function enterDelay(el) { const v = parseFloat(getComputedStyle(el).getPropertyValue('--enter')); return isNaN(v) ? 0 : v; }
  function fmt(v, dec, sep) {
    let s = v.toFixed(dec);
    if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return s;
  }
  function runCount(el, instant) {
    const to = parseFloat(el.dataset.count), from = parseFloat(el.dataset.from || 0);
    const dec = parseInt(el.dataset.decimals || 0, 10), dur = parseFloat(el.dataset.dur || 1.4) * 1000;
    const delay = (parseFloat(el.dataset.delay || 0) + enterDelay(el)) * 1000;
    const sep = el.dataset.sep !== undefined;
    cancelAnimationFrame(el._raf); clearTimeout(el._to);
    if (instant) { el.textContent = fmt(to, dec, sep); return; }
    el.textContent = fmt(from, dec, sep);
    el._to = setTimeout(() => {
      const t0 = performance.now();
      const tick = (now) => {
        const u = clamp((now - t0) / dur, 0, 1);
        el.textContent = fmt(from + (to - from) * ease(u), dec, sep);
        if (u < 1) el._raf = requestAnimationFrame(tick);
        else { el.classList.remove('counted'); void el.offsetWidth; el.classList.add('counted'); }
      };
      el._raf = requestAnimationFrame(tick);
    }, delay);
  }
  function resetCount(el) {
    cancelAnimationFrame(el._raf); clearTimeout(el._to);
    el.textContent = fmt(parseFloat(el.dataset.from || 0), parseInt(el.dataset.decimals || 0, 10), el.dataset.sep !== undefined);
  }
  function runType(el, instant) {
    const full = el._full != null ? el._full : (el._full = el.textContent);
    clearTimeout(el._to); clearInterval(el._iv);
    el.classList.remove('typing');
    if (instant) { el.textContent = full; return; }
    el.textContent = '';
    const cps = parseFloat(el.dataset.cps || 34), delay = (parseFloat(el.dataset.delay || 0) + enterDelay(el)) * 1000;
    el._to = setTimeout(() => {
      let i = 0;
      el.classList.add('typing');
      el._iv = setInterval(() => {
        i += 1;
        el.textContent = full.slice(0, i);
        if (i >= full.length) { clearInterval(el._iv); el.classList.remove('typing'); }
      }, 1000 / cps);
    }, delay);
  }
  function resetType(el) {
    if (el._full == null) el._full = el.textContent;
    clearTimeout(el._to); clearInterval(el._iv);
    el.textContent = '';
  }

  // Somar has no "→": swap every arrow in scene copy for a drawn one
  const ARROW = '<svg viewBox="0 0 24 12" aria-hidden="true"><path d="M1 6h20M16 1.5 21 6l-5 4.5" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  function arrows(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue.indexOf('\u2192') >= 0 && !n.parentNode.closest('svg') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const hits = [];
    while (walker.nextNode()) hits.push(walker.currentNode);
    hits.forEach((t) => {
      const frag = document.createDocumentFragment();
      t.nodeValue.split('\u2192').forEach((part, k) => {
        if (k) { const a = document.createElement('span'); a.className = 'arr'; a.innerHTML = ARROW; frag.appendChild(a); }
        if (part) frag.appendChild(document.createTextNode(part));
      });
      t.replaceWith(frag);
    });
  }

  function splitWords(el) {
    const walk = (node, idx) => {
      for (const ch of Array.from(node.childNodes)) {
        if (ch.nodeType === 3) {
          const parts = ch.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          for (const p of parts) {
            if (!p) continue;
            if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(p)); continue; }
            const w = document.createElement('span'); w.className = 'w';
            const inner = document.createElement('span'); inner.textContent = p;
            inner.style.setProperty('--wi', idx.n++);
            w.appendChild(inner); frag.appendChild(w);
          }
          ch.replaceWith(frag);
        } else if (ch.nodeType === 1 && ch.tagName !== 'BR') {
          if (ch.classList.contains('w')) continue;
          // wrap an inline element as one unit so its styling survives
          const w = document.createElement('span'); w.className = 'w';
          const inner = document.createElement('span');
          inner.style.setProperty('--wi', idx.n++);
          ch.replaceWith(w); inner.appendChild(ch); w.appendChild(inner);
        }
      }
    };
    walk(el, { n: 0 });
  }

  /* ── mounting ──────────────────────────────────────────────────────── */
  function mount() {
    defs.forEach((def, i) => {
      const el = document.createElement('section');
      el.className = 'scene';
      el.id = 's-' + def.id;
      el.dataset.scene = def.id;
      el.innerHTML = def.html || '';
      scenesEl.appendChild(el);
      arrows(el);
      $$('[data-split]', el).forEach(splitWords);
      $$('[data-stagger]', el).forEach((p) => {
        let i2 = 0;
        Array.from(p.children).forEach((c) => { if (c.hasAttribute('data-in') || c.querySelector('[data-in]')) c.style.setProperty('--i', i2++); });
      });
      $$('[data-type]', el).forEach(resetType);
      $$('[data-count]', el).forEach(resetCount);
      const n = Math.max(1, (def.cues || []).length);
      const rec = { def, el, n, i, loops: [], timers: [], intervals: [], leaveTimer: 0, t0: 0 };
      rec.ctx = makeCtx(rec);
      S.push(rec);
      try { def.init && def.init(rec.ctx); } catch (e) { console.error('init ' + def.id, e); }
    });
  }

  function makeCtx(rec) {
    const ctx = {
      el: rec.el, id: rec.def.id, def: rec.def, deck: Deck, field: window.Field,
      $: (s) => rec.el.querySelector(s), $$: (s) => Array.from(rec.el.querySelectorAll(s)),
      step: 0, instant: false, icon: Deck.icon,
      loop(fn) { rec.loops.push(fn); return fn; },
      after(ms, fn) { const id = setTimeout(fn, ms); rec.timers.push(id); return id; },
      every(ms, fn) { const id = setInterval(fn, ms); rec.intervals.push(id); return id; },
      count(el, instant) { runCount(el, instant); },
      type(el, instant) { runType(el, instant); },
      get active() { return S[cur] === rec; },
    };
    return ctx;
  }

  /* ── per-frame loops for the active scene(s) ───────────────────────── */
  let loopRaf = 0, lastNow = 0;
  function loopFrame(now) {
    loopRaf = requestAnimationFrame(loopFrame);
    const dt = lastNow ? Math.min(.05, (now - lastNow) / 1000) : 0;
    lastNow = now;
    const rec = S[cur];
    if (!rec || !rec.loops.length) return;
    const t = (now - rec.t0) / 1000;
    for (const fn of rec.loops) { try { fn(t, dt, rec.ctx); } catch (e) { console.error(e); } }
  }

  /* ── state application ─────────────────────────────────────────────── */
  function applyStep(rec, n, prev, instant, fieldMode) {
    const el = rec.el;
    if (instant) el.classList.add('no-anim');
    for (let k = 0; k < 24; k++) el.classList.toggle('st-' + k, k <= n);
    el.dataset.step = n;
    $$('[data-in]', el).forEach((x) => {
      const on = n >= parseInt(x.dataset.in, 10);
      const was = x.classList.contains('is-in');
      if (on !== was) {
        x.classList.toggle('is-in', on);
        if (x.hasAttribute('data-count')) on ? runCount(x, instant) : resetCount(x);
        if (x.hasAttribute('data-type')) on ? runType(x, instant) : resetType(x);
        $$('[data-count]', x).forEach((c) => (on ? runCount(c, instant) : resetCount(c)));
        $$('[data-type]', x).forEach((c) => (on ? runType(c, instant) : resetType(c)));
      } else if (instant && on) {
        if (x.hasAttribute('data-count')) runCount(x, true);
        if (x.hasAttribute('data-type')) runType(x, true);
      }
    });
    $$('[data-out]', el).forEach((x) => x.classList.toggle('is-out', n >= parseInt(x.dataset.out, 10)));
    $$('[data-dim]', el).forEach((x) => x.classList.toggle('is-dim', n >= parseInt(x.dataset.dim, 10)));
    $$('[data-at]', el).forEach((x) => {
      const a = parseInt(x.dataset.at, 10);
      x.classList.toggle('at', n === a);
      x.classList.toggle('past', n > a);
    });
    rec.ctx.step = n;
    rec.ctx.instant = !!instant;
    rec.timers.forEach(clearTimeout); rec.timers.length = 0;
    try { rec.def.step && rec.def.step(n, prev, rec.ctx); } catch (e) { console.error('step ' + rec.def.id, e); }
    if (n >= 0 && fieldMode !== 'skip') applyField(rec, n, fieldMode === 'snap');
    if (instant) { void el.offsetWidth; requestAnimationFrame(() => el.classList.remove('no-anim')); }
  }

  function fieldFor(rec, n) {
    const f = rec.def.field;
    if (!f) return { dim: .5, lit: 0, travel: .5, calm: [], litFrom: null, chain: false, pins: [], warm: 0, offset: [0, 0], links: .6, wave: .5, streaks: .12, sparkle: 1.2, drift: 1 };
    if (Array.isArray(f)) {
      const out = { dim: .5, lit: 0, travel: .5, calm: [], litFrom: null, chain: false, pins: [], warm: 0, offset: [0, 0], links: .6, wave: .5, streaks: .12, sparkle: 1.2, drift: 1 };
      for (let k = 0; k <= Math.min(n, f.length - 1); k++) Object.assign(out, f[k] || {});
      return out;
    }
    return Object.assign({ dim: .5, lit: 0, travel: .5, calm: [], litFrom: null, chain: false, pins: [], warm: 0, offset: [0, 0], links: .6, wave: .5, streaks: .12, sparkle: 1.2, drift: 1 }, f, (rec.def.fieldSteps || [])[n] || {});
  }
  function applyField(rec, n, instant) {
    if (!window.Field) return;
    Field.set(fieldFor(rec, n), instant ? .1 : 2.4);
    if (instant) Field.snap();
  }

  function stopScene(rec) {
    rec.timers.forEach(clearTimeout); rec.timers.length = 0;
    rec.intervals.forEach(clearInterval); rec.intervals.length = 0;
    rec.loops.length = 0;
    try { rec.def.leave && rec.def.leave(rec.ctx); } catch (e) { console.error(e); }
  }

  /* ── the spark: one story light that travels to each stop's focus ───── */
  const SPK = { x: 960, y: 1240, shown: false, raf: 0, el: null, trail: [], hist: [] };
  function layoutPos(el) {
    // position without transforms (builds animate with transforms), relative to the scene
    let x = 0, y = 0, n = el;
    while (n && !n.classList.contains('scene')) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
    return { x, y, w: el.offsetWidth, h: el.offsetHeight };
  }
  function sparkPoint(t) {
    if (t.dataset.sparkXy) { const [x, y] = t.dataset.sparkXy.split(',').map(Number); return { x, y }; }
    const r = layoutPos(t), at = t.dataset.sparkAt || 'l', g = 34;
    const cx = r.x + r.w / 2, cy = r.y + r.h / 2;
    return ({ l: { x: r.x - g, y: cy }, r: { x: r.x + r.w + g, y: cy }, t: { x: cx, y: r.y - g }, b: { x: cx, y: r.y + r.h + g }, c: { x: cx, y: cy },
      tl: { x: r.x - g, y: r.y + 8 }, tr: { x: r.x + r.w + g, y: r.y + 8 } })[at] || { x: r.x - g, y: cy };
  }
  function sparkPlace(x, y) {
    SPK.x = x; SPK.y = y;
    SPK.el.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)';
  }
  function sparkShow(on) { SPK.shown = on; SPK.el.classList.toggle('on', on); if (!on) { cancelAnimationFrame(SPK.raf); SPK.el.classList.remove('fly'); SPK.hist.length = 0; } }
  function sparkFly(tx, ty, delay, onLand) {
    cancelAnimationFrame(SPK.raf); clearTimeout(SPK.to);
    const go2 = () => {
      const x0 = SPK.x, y0 = SPK.y, d = Math.hypot(tx - x0, ty - y0);
      if (!SPK.shown || d < 4) { sparkPlace(tx, ty); sparkShow(true); SPK.el.classList.remove('fly'); land(); return; }
      const dur = clamp(d / 1.9, 420, 900), t0 = performance.now();
      // arc: control point lifted perpendicular to the path
      const mx = (x0 + tx) / 2, my = (y0 + ty) / 2, nx = -(ty - y0) / (d || 1), ny = (tx - x0) / (d || 1);
      const lift = Math.min(260, d * .28) * (ny > 0 ? -1 : 1);
      const cx = mx + nx * lift, cy = my + ny * lift;
      SPK.el.classList.add('fly');
      const tick = (now) => {
        const u = clamp((now - t0) / dur, 0, 1), e = u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        const x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * cx + e * e * tx, y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * cy + e * e * ty;
        sparkPlace(x, y);
        SPK.hist.unshift([x, y]); SPK.hist.length = Math.min(SPK.hist.length, 24);
        SPK.trail.forEach((g, i) => { const h = SPK.hist[Math.min(SPK.hist.length - 1, (i + 1) * 3)]; if (h) g.style.transform = 'translate(' + h[0].toFixed(1) + 'px,' + h[1].toFixed(1) + 'px)'; });
        if (u < 1) SPK.raf = requestAnimationFrame(tick);
        else { SPK.el.classList.remove('fly'); SPK.hist.length = 0; land(); }
      };
      SPK.raf = requestAnimationFrame(tick);
    };
    function land() {
      SPK.el.classList.remove('land'); void SPK.el.offsetWidth; SPK.el.classList.add('land');
      if (window.Field) Field.burst(SPK.x, SPK.y, { radius: 300, dur: 1.2 });
      if (onLand) onLand();
    }
    if (delay > 0) SPK.to = setTimeout(go2, delay); else go2();
  }
  function sparkFor(rec, n, instant, extraDelay) {
    if (!SPK.el) return;
    if (rec.def.spark === false || n < 0) { sparkShow(false); return; }
    const t = rec.el.querySelector('[data-spark="' + n + '"]');
    if (!t) { if (rec.def.spark !== 'keep') { cancelAnimationFrame(SPK.raf); clearTimeout(SPK.to); sparkShow(false); } return; }
    const p = sparkPoint(t);
    if (instant) { cancelAnimationFrame(SPK.raf); clearTimeout(SPK.to); SPK.el.classList.remove('fly'); SPK.hist.length = 0; sparkPlace(p.x, p.y); sparkShow(true); return; }
    const d = (parseFloat(t.dataset.sparkDelay || .12) + (extraDelay || 0)) * 1000;
    // the flash is transient, so the target's own ambient animation resumes afterwards
    // the landing flash is layered on top (Web Animations), so the target's own ambient loop keeps
    // running underneath instead of being replaced and restarted (which showed as a jump)
    sparkFly(p.x, p.y, d, () => {
      if (t.animate && !stage.classList.contains('lite')) t.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(1.45)', offset: .25 }, { filter: 'brightness(1)' }], { duration: 1000, easing: 'ease-out' });
    });
  }

  /* ── scene transitions ─────────────────────────────────────────────── */
  let txTimers = [], txPending = null;
  const TX_ENTER = { push: .32, rise: .32, dolly: .42, chapter: .22, iris: .25, back: 0 };
  function txAfter(ms, fn) { txTimers.push(setTimeout(fn, ms)); }
  function finishTx() {
    txTimers.forEach(clearTimeout); txTimers = [];
    if (txPending) { const f = txPending; txPending = null; f(); }
    delete stage.dataset.tx;
    const ch = $('#tx-chapter'); if (ch) ch.classList.remove('run', 'open');
    const r = $('#tx-ring'); if (r) r.classList.remove('run');
    const sw = $('#tx-sweep'); if (sw) sw.classList.remove('run');
    S.forEach((x) => x.el.classList.remove('ch-hold', 'ch-open', 'tx-from', 'iris-from', 'iris-run'));
  }
  function buildTxLayer() {
    // chapter card: a line of light, two opening edges and the act's number + name
    const ch = document.createElement('div'); ch.id = 'tx-chapter';
    ch.innerHTML = '<div class="ch-dim"></div><div class="ch-line"></div><div class="ch-edge t"></div><div class="ch-edge b"></div>' +
      '<div class="ch-label"><span class="ch-n"></span><span class="ch-t"></span></div>';
    stage.appendChild(ch);
    const ring = document.createElement('div'); ring.id = 'tx-ring'; stage.appendChild(ring);
    const sw = document.createElement('div'); sw.id = 'tx-sweep'; stage.appendChild(sw);
    const sp = document.createElement('div'); sp.id = 'spark';
    sp.innerHTML = '<i class="core"></i><b class="rip"></b><b class="rip r2"></b>';
    stage.appendChild(sp); SPK.el = sp;
    for (let i = 0; i < 5; i++) { const g = document.createElement('div'); g.className = 'spark-trail'; g.style.setProperty('--k', i); stage.appendChild(g); SPK.trail.push(g); }
    sparkPlace(960, 1240);
  }
  function go(si, st, opts) {
    opts = opts || {};
    si = clamp(si, 0, S.length - 1);
    const rec = S[si];
    st = clamp(st, 0, rec.n - 1);
    const instant = !!opts.instant;
    if (si !== cur) {
      finishTx();
      const old = S[cur];
      const dir = si > cur ? 1 : -1;
      const prevCur = cur;
      const landSettled = instant || (dir < 0 && prevCur !== -1) || opts.settled;
      const kind = instant || prevCur === -1 ? 'none'
        : dir < 0 || opts.settled ? 'back'
        : rec.def.transition || (old && (old.def.act || 0) !== (rec.def.act || 0) ? 'chapter' : 'push');
      if (old) {
        stopScene(old);
        old.el.classList.remove('active', 'entering-fwd', 'entering-back');
        clearTimeout(old.leaveTimer);
        if (kind === 'none') old.el.classList.remove('leaving');
        else { old.el.classList.add('leaving'); old.leaveTimer = setTimeout(() => old.el.classList.remove('leaving'), 1300); }
      }
      clearTimeout(rec.leaveTimer);
      rec.el.classList.remove('leaving');
      cur = si;
      step = st;
      if (kind !== 'none') stage.dataset.tx = kind;
      // start from a clean, hidden state; forward entries build stop 0 live,
      // backward entries and jumps land settled.
      applyStep(rec, landSettled ? st : -1, -1, true, instant ? 'snap' : 'ease');
      rec.el.classList.add('no-anim');
      if (kind === 'push' || kind === 'rise' || kind === 'dolly') rec.el.classList.add('tx-from');
      if (kind === 'chapter') rec.el.classList.add('ch-hold');
      if (kind === 'iris') {
        rec.el.style.setProperty('--ix', SPK.shown ? SPK.x + 'px' : '50%');
        rec.el.style.setProperty('--iy', SPK.shown ? SPK.y + 'px' : '50%');
        rec.el.classList.add('iris-from');
      }
      void rec.el.offsetWidth;
      rec.el.classList.remove('no-anim');
      rec.el.classList.add('active');
      rec.t0 = performance.now();
      stage.dataset.bg = rec.def.bg || 'night';
      try { rec.def.enter && rec.def.enter(rec.ctx); } catch (e) { console.error('enter ' + rec.def.id, e); }
      rec.el.style.setProperty('--enter', landSettled ? '0s' : (TX_ENTER[kind] || .3) + 's');
      const build = () => {
        if (!landSettled) { void rec.el.offsetWidth; applyStep(rec, st, -1, false, 'ease'); }
        sparkFor(rec, st, landSettled, landSettled ? 0 : (TX_ENTER[kind] || .3));
      };
      // camera + light for each kind of cut
      const F = window.Field;
      if (kind === 'push') { if (F) { F.warp('left', .95, .8); F.kick(-240, 0, 1.6); } }
      if (kind === 'rise') { if (F) { F.warp('up', .95, .8); F.kick(0, -180, 1.6); } }
      if (kind === 'dolly') { if (F) { F.warp('zoom', 1.15, 1.2, [SPK.shown ? SPK.x : 960, SPK.shown ? SPK.y : 540]); F.kick(0, 0, .1); } }
      if (kind === 'push' || kind === 'dolly' || kind === 'rise') {
        const sw = $('#tx-sweep'); sw.classList.remove('run'); void sw.offsetWidth; sw.classList.add('run');
        requestAnimationFrame(() => rec.el.classList.remove('tx-from'));
        build();
        txAfter(1400, finishTx);
      } else if (kind === 'iris') {
        const ring = $('#tx-ring');
        ring.style.left = (SPK.shown ? SPK.x : 960) + 'px'; ring.style.top = (SPK.shown ? SPK.y : 540) + 'px';
        ring.classList.remove('run'); void ring.offsetWidth; ring.classList.add('run');
        // irisBurst: per-scene radius of the field flash (0 = none), e.g. a scene that opens on a dark field
        const ib = rec.def.irisBurst == null ? 2200 : rec.def.irisBurst;
        if (F && ib) F.burst(SPK.shown ? SPK.x : 960, SPK.shown ? SPK.y : 540, { radius: ib, dur: 1.4 });
        requestAnimationFrame(() => { rec.el.classList.remove('iris-from'); rec.el.classList.add('iris-run'); });
        build();
        txAfter(1300, finishTx);
      } else if (kind === 'chapter') {
        const ch = $('#tx-chapter');
        const a = rec.def.act || 0;
        $('.ch-n', ch).textContent = String(a + 1).padStart(2, '0');
        $('.ch-t', ch).textContent = Deck.ACTS[a];
        // the line grows out of wherever the story light was
        ch.style.setProperty('--ox', (SPK.shown ? clamp(SPK.x, 80, 1840) : 960) + 'px');
        ch.classList.remove('run', 'open'); void ch.offsetWidth; ch.classList.add('run');
        sparkShow(false);
        if (F) { F.warp('zoom', 1.5, 1.3, [960, 540]); F.kick(0, 0, .1); }
        const open = () => {
          ch.classList.add('open');
          rec.el.classList.add('ch-open');
          rec.el.classList.remove('ch-hold');
          if (F) F.burst(960, 540, { radius: 1100, dur: 1.3 });
          // the light that carried the title becomes the story light again
          sparkPlace(960, 540); sparkShow(true);
          build();
        };
        txPending = open;
        txAfter(980, () => { txPending = null; open(); });
        txAfter(2000, finishTx);      } else {
        build();
        if (kind === 'back') txAfter(500, finishTx);
      }
    } else if (st !== step) {
      if (txTimers.length || txPending) finishTx();
      const prev = step;
      step = st;
      // a press during a build settles that build first, then plays the new one
      if (!instant && performance.now() - lastBuild < 1300) {
        rec.el.classList.add('no-anim'); void rec.el.offsetWidth; rec.el.classList.remove('no-anim'); void rec.el.offsetWidth;
      }
      rec.el.style.setProperty('--enter', '0s');
      applyStep(rec, st, prev, instant, instant ? 'snap' : 'ease');
      sparkFor(rec, st, instant || st < prev, 0);
    }
    lastBuild = performance.now();
    updateChrome();
    updateHash();
    updatePresenter();
    scheduleAuto();
  }

  Deck.next = function () {
    if (startTime == null) startTime = Date.now();
    const rec = S[cur];
    if (step < rec.n - 1) go(cur, step + 1);
    else if (cur < S.length - 1) go(cur + 1, 0);
    else if (auto) go(0, 0);
  };
  Deck.prev = function () {
    if (step > 0) go(cur, step - 1);
    else if (cur > 0) go(cur - 1, S[cur - 1].n - 1);
  };
  Deck.nextScene = () => { if (cur < S.length - 1) go(cur + 1, 0); };
  Deck.prevScene = () => { if (step > 0) go(cur, 0, { instant: true }); else if (cur > 0) go(cur - 1, 0, { settled: true }); };
  Deck.go = (si, st, o) => go(si, st || 0, o || { instant: true });
  Deck.goId = (id, st) => { const i = S.findIndex((r) => r.def.id === id); if (i >= 0) go(i, st || 0, { instant: true }); };
  Deck.state = () => ({ scene: cur, step, id: S[cur] && S[cur].def.id, n: S[cur] && S[cur].n, total: S.length });

  /* ── chrome ────────────────────────────────────────────────────────── */
  let trackBars = [], actLabels = [], pipsEl, sparkEl, tagEl;
  function buildChrome() {
    chrome.innerHTML =
      '<div class="mark">' + Deck.art('mark') + '</div>' +
      '<div class="tag"><span class="tag-illustrative">Illustrative story</span></div>' +
      '<div class="progress"><div class="acts"></div><div class="track"></div><div class="spark"><div class="light"></div></div><div class="pips"></div></div>';
    tagEl = $('.tag', chrome);
    pipsEl = $('.pips', chrome);
    sparkEl = $('.spark', chrome);
    const track = $('.track', chrome), acts = $('.acts', chrome);
    Deck.ACTS.forEach((name, a) => {
      const count = S.filter((r) => (r.def.act || 0) === a).length || 1;
      const b = document.createElement('b'); b.style.flex = count; b.innerHTML = '<i></i>';
      track.appendChild(b); trackBars.push(b);
      const s = document.createElement('span'); s.style.flex = count;
      s.innerHTML = '<em>' + String(a + 1).padStart(2, '0') + '</em><span class="nm">' + name + '</span>';
      acts.appendChild(s); actLabels.push(s);
    });
    // leave room on the right for the pips
    track.style.right = '0'; acts.style.right = '0';
  }
  function updateChrome() {
    const rec = S[cur];
    const c = rec.def.chrome || {};
    chrome.classList.toggle('no-mark', c.mark === false);
    chrome.classList.toggle('no-progress', c.progress === false);
    tagEl.classList.toggle('on', rec.def.tag === 'illustrative' && (!rec.def.tagFrom || step >= rec.def.tagFrom));
    // progress: fraction of scenes within each act
    const act = rec.def.act || 0;
    Deck.ACTS.forEach((_, a) => {
      const inAct = S.filter((r) => (r.def.act || 0) === a);
      const idx = inAct.indexOf(rec);
      let f = a < act ? 1 : a > act ? 0 : (idx + (step + 1) / rec.n) / inAct.length;
      trackBars[a].querySelector('i').style.width = (f * 100) + '%';
      actLabels[a].classList.toggle('on', a === act);
    });
    pipsEl.innerHTML = '';
    if (rec.n > 1) for (let k = 0; k < rec.n; k++) { const p = document.createElement('i'); if (k < step) p.className = 'done'; if (k === step) p.className = 'on'; pipsEl.appendChild(p); }
    const tw = 94 + 28;   // pips column has a fixed width, so the track never jumps between scenes
    $('.track', chrome).style.right = tw + 'px';
    $('.acts', chrome).style.right = tw + 'px';
    // spark position across the whole track
    const bar = trackBars[act];
    const inAct = S.filter((r) => (r.def.act || 0) === act);
    const f = (inAct.indexOf(rec) + (step + 1) / rec.n) / inAct.length;
    sparkEl.style.left = (bar.offsetLeft + bar.offsetWidth * f) + 'px';
  }

  /* ── hash, autoplay, toast ─────────────────────────────────────────── */
  function updateHash() {
    const rec = S[cur];
    try { history.replaceState(null, '', '#' + rec.def.id + (step ? '.' + step : '')); } catch (e) { /* file:// in some browsers */ }
  }
  function readHash() {
    const h = decodeURIComponent((location.hash || '').slice(1));
    if (!h) return null;
    const [id, st] = h.split('.');
    let i = S.findIndex((r) => r.def.id === id);
    if (i < 0 && /^\d+$/.test(id)) i = parseInt(id, 10) - 1;
    return i >= 0 ? { i, st: parseInt(st || 0, 10) || 0 } : null;
  }
  function scheduleAuto() {
    clearTimeout(autoTimer);
    if (!auto) return;
    const rec = S[cur];
    const holds = rec.def.holds;
    const hold = (Array.isArray(holds) ? holds[step] : holds) || 6.5;
    autoTimer = setTimeout(Deck.next, hold * 1000);
  }
  let toastTimer = 0;
  function toast(msg) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('on');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('on'), 1400);
  }

  /* ── overview ──────────────────────────────────────────────────────── */
  function buildOverview() {
    const o = $('#overview');
    o.innerHTML = '<h2>Behind a Better Life · scenes</h2><div class="grid"></div>' +
      '<div class="keys"><b>→</b> <b>Space</b> <b>PgDn</b> next stop &nbsp; <b>←</b> <b>PgUp</b> back &nbsp; <b>]</b> <b>[</b> next / previous scene &nbsp; <b>S</b> speaker view &nbsp; <b>B</b> blackout &nbsp; <b>F</b> fullscreen &nbsp; <b>H</b> hide progress &nbsp; <b>C</b> projector contrast &nbsp; <b>A</b> autoplay &nbsp; <b>L</b> lite mode &nbsp; <b>T</b> tech check &nbsp; <b>G</b> this overview &nbsp; type a number + <b>Enter</b> to jump</div>';
    const grid = $('.grid', o);
    S.forEach((r, i) => {
      const it = document.createElement('div'); it.className = 'it';
      it.innerHTML = '<div class="n">' + String(i + 1).padStart(2, '0') + '</div><div class="t">' + r.def.title + '</div><div class="a">' + Deck.ACTS[r.def.act || 0] + ' · ' + r.n + (r.n > 1 ? ' stops' : ' stop') + '</div>';
      it.addEventListener('click', (e) => { e.stopPropagation(); toggleOverview(false); go(i, 0, { instant: false }); });
      grid.appendChild(it);
    });
  }
  function toggleOverview(on) {
    const o = $('#overview');
    const show = on == null ? !o.classList.contains('on') : on;
    o.classList.toggle('on', show);
    $$('.it', o).forEach((it, i) => it.classList.toggle('cur', i === cur));
  }

  /* ── tech check (T): judge the real projector before the session ───── */
  function toggleTech() {
    let t = $('#techcheck');
    if (!t) {
      t = document.createElement('div');
      t.id = 'techcheck';
      const sw = [['Plum', '#602650'], ['Navy', '#06213D'], ['Teal', '#25C7BC'], ['Sea green', '#03FFCB'], ['Purple', '#9D67AA'], ['Queen blue', '#3B80AA'], ['Silver', '#D0D0D0'], ['White', '#FFFFFF']];
      t.innerHTML = '<div class="tc-safe"></div><div class="tc-low">Keep essential content above this line (bottom 10%)</div>' +
        '<div class="tc-in"><div class="kicker">Tech check · press T to close</div>' +
        '<div class="tc-sw">' + sw.map((c) => '<div><i style="background:' + c[1] + '"></i><span>' + c[0] + '</span></div>').join('') + '</div>' +
        '<div class="tc-type"><p style="font-size:20px">20px — progress labels and kickers must stay readable from the back row</p><p style="font-size:24px">24px — captions, sources and caveats</p><p style="font-size:31px">31px — body sentences</p><p style="font-size:36px">36px — lead lines</p><p style="font-size:70px;font-weight:700;color:#fff">70px headline</p></div>' +
        '<div class="tc-pair"><div style="background:#06213D"><b style="color:#602650">Plum on navy — should NOT be used for meaning</b></div><div style="background:#06213D"><b style="color:#C9A6D3">Purple-lt on navy — gaps</b></div><div style="background:#06213D"><b style="color:#25C7BC">Teal on navy — stories</b></div><div style="background:#06213D"><b style="color:#03FFCB">Sea green — the 8% moment</b></div></div>' +
        '<p class="tc-tip">If the colours look washed out or the 24px line is hard to read from the back, press C (projector contrast). If motion stutters, press L (lite mode).</p></div>';
      stage.appendChild(t);
    }
    t.classList.toggle('on');
  }

  /* ── speaker view ──────────────────────────────────────────────────── */
  function openPresenter() {
    if (presenter && !presenter.closed) { presenter.focus(); return; }
    presenter = window.open('', 'bbl-speaker', 'width=1100,height=720');
    if (!presenter) { toast('Allow pop-ups to open the speaker view'); return; }
    const d = presenter.document;
    d.open();
    d.write(PRESENTER_HTML);
    d.close();
    presenter.deck = Deck;
    presenter.addEventListener('keydown', (e) => onKey(e, true));
    setTimeout(updatePresenter, 60);
  }
  function notesFor(rec, n) {
    const N = rec.def.notes;
    if (!N) return '';
    if (Array.isArray(N)) return N.map((x, k) => '<p class="' + (k === n ? 'now' : k < n ? 'done' : '') + '"><b>' + (k + 1) + '</b> ' + x + '</p>').join('');
    return N.split(/\n\n+/).map((p) => '<p>' + p + '</p>').join('');
  }
  function updatePresenter() {
    if (!presenter || presenter.closed) return;
    try {
      const d = presenter.document;
      const rec = S[cur];
      const cues = rec.def.cues || [];
      let nx;
      if (step < rec.n - 1) nx = cues[step + 1];
      else if (cur < S.length - 1) nx = '<span class="sc">Next scene · ' + String(cur + 2).padStart(2, '0') + ' ' + S[cur + 1].def.title + '</span> — ' + ((S[cur + 1].def.cues || [])[0] || '');
      else nx = 'End of presentation';
      d.getElementById('scene').textContent = String(cur + 1).padStart(2, '0') + ' · ' + rec.def.title;
      const a = rec.def.act || 0;
      const tm = Deck.ACT_TARGETS[a]; d.getElementById('act').textContent = Deck.ACTS[a] + '  ·  aim to finish this act by ' + Math.floor(tm) + ':' + String(Math.round((tm % 1) * 60)).padStart(2, '0');
      d.getElementById('cue').textContent = cues[step] || '';
      d.getElementById('stop').textContent = 'Stop ' + (step + 1) + ' of ' + rec.n;
      d.getElementById('next').innerHTML = nx || '';
      d.getElementById('notes').innerHTML = notesFor(rec, step);
      const nowP = d.querySelector('#notes p.now');
      if (nowP) nowP.scrollIntoView({ block: 'center' });
      const all = S.reduce((a, r) => a + r.n, 0);
      const done = S.slice(0, cur).reduce((a, r) => a + r.n, 0) + step + 1;
      d.getElementById('bar').style.width = (done / all * 100) + '%';
      d.getElementById('count').textContent = done + ' / ' + all;
      const list = d.getElementById('list');
      if (!list.childElementCount) {
        S.forEach((r, i) => {
          const li = d.createElement('li');
          li.textContent = String(i + 1).padStart(2, '0') + '  ' + r.def.title;
          li.onclick = () => Deck.go(i, 0, { instant: false });
          list.appendChild(li);
        });
      }
      Array.from(list.children).forEach((li, i) => li.className = i === cur ? 'on' : i < cur ? 'done' : '');
    } catch (e) { /* window closed mid-update */ }
  }
  Deck.startTime = () => startTime;
  Deck.resetTimer = () => { startTime = Date.now(); };

  const PRESENTER_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>Speaker view — Behind a Better Life (v2)</title>
<style>
*{box-sizing:border-box}html,body{margin:0;height:100%;background:#0B0F17;color:#E9EEF5;font-family:Somar,'Segoe UI',Arial,sans-serif}
body{display:grid;grid-template-columns:1fr 300px;grid-template-rows:auto 1fr auto;height:100vh}
header{grid-column:1/3;display:flex;align-items:center;gap:28px;padding:18px 28px;border-bottom:1px solid #1E2635}
#clock,#timer{font:700 34px/1 Somar,Arial,sans-serif;font-variant-numeric:tabular-nums}#timer{color:#25C7BC}
header small{display:block;font:700 11px/1 Arial;letter-spacing:.2em;text-transform:uppercase;color:#6E7A8E;margin-bottom:6px}
header .sp{flex:1}header button{height:44px;padding:0 20px;border-radius:10px;border:1px solid #2A3446;background:#141B27;color:#fff;font:700 15px Arial;cursor:pointer}
header button.go{background:#25C7BC;border-color:#25C7BC;color:#06213D}
main{padding:26px 30px;overflow:auto}
#act{font:700 12px/1 Arial;letter-spacing:.24em;text-transform:uppercase;color:#25C7BC}
#scene{font:700 30px/1.15 Somar,Arial;margin:10px 0 18px}
.box{border:1px solid #1E2635;border-radius:12px;padding:16px 18px;margin-bottom:14px;background:#0F1520}
.box small{display:block;font:700 11px/1 Arial;letter-spacing:.2em;text-transform:uppercase;color:#6E7A8E;margin-bottom:10px}
#cue{font:700 26px/1.25 Somar,Arial;color:#fff}#stop{float:right;font:700 12px Arial;color:#6E7A8E;letter-spacing:.12em;text-transform:uppercase}
#next{font:400 20px/1.35 Somar,Arial;color:#B8C2D2}#next .sc{color:#03FFCB;font-weight:700}
#notes{font:400 21px/1.5 Somar,Arial;color:#D7DEE9}#notes p{margin:0 0 12px}#notes p.done{opacity:.4}#notes p.now{color:#fff}#notes p.now b{background:#25C7BC;color:#06213D}
#notes b{display:inline-block;min-width:26px;height:26px;border-radius:7px;background:#1E2635;color:#9AA6B8;text-align:center;font:700 14px/26px Arial;margin-right:8px}
aside{border-left:1px solid #1E2635;overflow:auto;padding:18px 0}
aside ol{list-style:none;margin:0;padding:0}aside li{padding:9px 20px;font:400 15px/1.3 Arial;color:#8C98AB;cursor:pointer}aside li.done{color:#4E5A6D}aside li.on{color:#fff;background:#141B27;border-left:3px solid #25C7BC}
footer{grid-column:1/3;padding:12px 28px;border-top:1px solid #1E2635;display:flex;align-items:center;gap:18px;font:700 12px Arial;color:#6E7A8E;letter-spacing:.12em}
.track{flex:1;height:4px;background:#1E2635;border-radius:3px;overflow:hidden}#bar{height:100%;background:#25C7BC;width:0}
</style></head><body>
<header><div><small>Clock</small><div id="clock">--:--</div></div><div><small>Elapsed</small><div id="timer">00:00</div></div><div class="sp"></div>
<button onclick="deck.resetTimer()">Reset timer</button><button onclick="deck.prev()">◀ Back</button><button class="go" onclick="deck.next()">Next ▶</button></header>
<main><div id="act"></div><div id="scene"></div>
<div class="box"><small>Now <span id="stop"></span></small><div id="cue"></div></div>
<div class="box"><small>Next click</small><div id="next"></div></div>
<div class="box"><small>Speaker notes</small><div id="notes"></div></div></main>
<aside><ol id="list"></ol></aside>
<footer><span id="count"></span><div class="track"><div id="bar"></div></div><span>← → / PgUp PgDn work here too</span></footer>
<script>
setInterval(function(){var d=new Date();document.getElementById('clock').textContent=String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0');
var s=window.deck&&deck.startTime();var e=s?Math.floor((Date.now()-s)/1000):0;document.getElementById('timer').textContent=String(Math.floor(e/60)).padStart(2,'0')+':'+String(e%60).padStart(2,'0');},500);
<\/script></body></html>`;

  /* ── input ─────────────────────────────────────────────────────────── */
  /* ── the start gate: double-clicking the file is enough to present. The deck waits on
     black until the first key or click, which enters full screen (unless the browser
     already is) and plays the cold open. S still opens the speaker view first.
     Automated runs (navigator.webdriver) and reloads with a #hash skip it. ───────── */
  let gated = false;
  function showGate() {
    gated = true;
    const g = document.createElement('div'); g.id = 'gate';
    g.innerHTML = '<div class="gate-in"><i class="gate-light"></i><div class="gate-t">Press any key or click to begin</div>' +
      '<div class="gate-s"><b>S</b> speaker view <span>·</span> <b>F</b> full screen <span>·</span> <b>B</b> black screen</div></div>';
    document.body.appendChild(g);
    g.addEventListener('click', (e) => { e.stopPropagation(); openGate(); });
  }
  function openGate() {
    if (!gated) return;
    gated = false;
    const full = document.fullscreenElement || (Math.abs(window.innerWidth - screen.width) < 8 && Math.abs(window.innerHeight - screen.height) < 8);
    if (!full && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {});
    const g = $('#gate'); if (g) g.remove();
    startTime = Date.now();
    // replay the first scene live (it sat settled under the gate so the speaker view had a frame)
    stopScene(S[0]); cur = -1;
    go(0, 0, {});
  }
  function onKey(e, fromPresenter) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const k = e.key;
    if (gated) {
      if (k === 's' || k === 'S') { openPresenter(); return; }
      if (/^(Shift|Control|Alt|Meta|CapsLock|Tab|F11|F12|Escape)$/.test(k) || e.repeat) return;
      e.preventDefault(); openGate(); return;
    }
    if (k === 'F5' || ((e.ctrlKey || e.metaKey) && (k === 'r' || k === 'R'))) { e.preventDefault(); if (k === 'F5' && !document.fullscreenElement) toggleFullscreen(); return; }
    if (e.repeat) { e.preventDefault(); return; }
    const nowK = performance.now();
    if (k === lastKey && nowK - lastKeyAt < 150) { e.preventDefault(); return; }
    lastKey = k; lastKeyAt = nowK;
    const blk = $('#blackout');
    if (blk.classList.contains('on') && !['b', 'B', '.', 'w', 'W', ','].includes(k)) {
      // any press only brings the screen back; it never also moves
      e.preventDefault(); blk.classList.remove('on'); return;
    }
    if (/^[0-9]$/.test(k)) {
      digits += k; clearTimeout(digitsTimer);
      digitsTimer = setTimeout(() => { digits = ''; }, 1600);
      toast('Go to scene ' + digits);
      return;
    }
    if (k === 'Enter' && digits) {
      e.preventDefault();
      const n = parseInt(digits, 10); digits = '';
      if (n >= 1 && n <= S.length) go(n - 1, S[n - 1].n - 1, { instant: true });
      return;
    }
    if ((k === 'ArrowRight' || k === 'ArrowDown') && e.shiftKey) { e.preventDefault(); Deck.nextScene(); return; }
    if ((k === 'ArrowLeft' || k === 'ArrowUp') && e.shiftKey) { e.preventDefault(); Deck.prevScene(); return; }
    switch (k) {
      case 'ArrowRight': case 'ArrowDown': case 'PageDown': case ' ': case 'Enter': case 'n': case 'N':
        e.preventDefault(); if ($('#overview').classList.contains('on')) toggleOverview(false); Deck.next(); break;
      case 'ArrowLeft': case 'ArrowUp': case 'PageUp': case 'Backspace': case 'p': case 'P':
        e.preventDefault(); Deck.prev(); break;
      case ']': Deck.nextScene(); break;
      case '[': Deck.prevScene(); break;
      case 'Home': e.preventDefault(); go(0, 0, { instant: true }); break;
      case 'End': e.preventDefault(); go(S.length - 1, S[S.length - 1].n - 1, { instant: true }); break;
      case 'b': case 'B': case '.': case 'w': case 'W': case ',': blk.classList.toggle('on'); break;
      case 'f': case 'F': e.preventDefault(); toggleFullscreen(); break;
      case 'l': case 'L': stage.classList.toggle('lite'); if (window.Field) Field.lite(stage.classList.contains('lite')); toast(stage.classList.contains('lite') ? 'Lite mode on' : 'Lite mode off'); break;
      case 'o': case 'O': toggleOverview(); break;
      case 't': case 'T': toggleTech(); break;
      case 's': case 'S': openPresenter(); break;
      case 'g': case 'G': toggleOverview(); break;
      case 'Escape': toggleOverview(false); { const tc = $('#techcheck'); if (tc) tc.classList.remove('on'); } break;
      case 'h': case 'H': chrome.classList.toggle('hidden'); break;
      case 'c': case 'C': stage.classList.toggle('hc'); if (window.Field) Field.boost(stage.classList.contains('hc') ? 1.35 : 1); toast(stage.classList.contains('hc') ? 'Projector contrast on' : 'Projector contrast off'); break;
      case 'a': case 'A': auto = !auto; toast(auto ? 'Autoplay on' : 'Autoplay off'); scheduleAuto(); break;
      case 'r': case 'R': if (e.shiftKey) { startTime = null; go(0, 0, { instant: true }); } break;
      default: return;
    }
    if (fromPresenter) e.preventDefault();
  }
  function toggleFullscreen() {
    if (!document.fullscreenElement) (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    else document.exitFullscreen && document.exitFullscreen();
  }

  function fit() {
    const w = window.innerWidth, h = window.innerHeight;
    scale = Math.min(w / 1920, h / 1080);
    const x = (w - 1920 * scale) / 2, y = (h - 1080 * scale) / 2;
    stage.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
    if (window.Field) Field.resize(scale);
  }

  let cursorTimer = 0;
  function bindInput() {
    window.addEventListener('keydown', (e) => onKey(e, false));
    viewport.addEventListener('click', (e) => {
      if (e.target.closest('#overview')) return;
      if (gated) { openGate(); return; }
      const blk = $('#blackout');
      if (blk.classList.contains('on')) { blk.classList.remove('on'); return; }
      Deck.next();
    });
    viewport.addEventListener('contextmenu', (e) => e.preventDefault());
    let tx = 0, ty = 0;
    viewport.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    viewport.addEventListener('touchend', (e) => {
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) { e.preventDefault(); dx < 0 ? Deck.next() : Deck.prev(); }
    });
    window.addEventListener('mousemove', () => {
      viewport.classList.remove('hide-cursor');
      clearTimeout(cursorTimer); cursorTimer = setTimeout(() => viewport.classList.add('hide-cursor'), 1800);
    });
    window.addEventListener('resize', () => { fit(); updateChrome(); });
    // typing #survey (or #5, #survey.2) in the address bar jumps there
    window.addEventListener('hashchange', () => {
      const h = readHash();
      if (h && (h.i !== cur || h.st !== step)) go(h.i, h.st, { instant: true });
    });
    window.addEventListener('beforeunload', () => { if (presenter && !presenter.closed) presenter.close(); });
  }

  Deck.start = function () {
    viewport = $('#viewport'); stage = $('#stage'); scenesEl = $('#scenes'); chrome = $('#chrome');
    // keep the chrome invisible until the first scene has set which parts it shows
    chrome.classList.add('booting');
    if (window.Field) Field.mount($('#field'));
    mount();
    buildTxLayer();
    buildChrome();
    buildOverview();
    bindInput();
    fit();
    requestAnimationFrame(loopFrame);
    const h = readHash();
    const begin = () => {
      const q = location.search, gate = !h && (/[?&]gate\b/.test(q) || (!navigator.webdriver && !/[?&]nogate\b/.test(q)));
      const start = () => {
        if (h) go(h.i, h.st, { instant: true });
        else if (gate) { showGate(); go(0, 0, { instant: true }); }
        else go(0, 0, {});
        document.body.classList.add('ready');
        setTimeout(() => chrome.classList.remove('booting'), 700);
      };
      // a live cold open waits two frames, so its timers and its first paint start together
      if (h) start(); else requestAnimationFrame(() => requestAnimationFrame(start));
    };
    // wait for fonts and photographs so nothing pops in late
    const urls = new Set();
    $$('.scene', scenesEl).forEach((sc) => {
      const m = sc.innerHTML.match(/assets\/photos\/[\w.-]+\.(?:jpg|png)/g) || [];
      m.forEach((u) => urls.add(u));
    });
    const imgs = Array.from(urls).map((u) => { const im = new Image(); im.src = u; return im.decode ? im.decode().catch(() => {}) : Promise.resolve(); });
    const fonts = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.race([Promise.all([fonts].concat(imgs)), new Promise((r) => setTimeout(r, 4000))]).then(begin);
  };
})();
