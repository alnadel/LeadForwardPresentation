/* Behind a Better Life — presentation engine.

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
  Deck.ACTS = ['The moment', 'The gap', 'Why it matters', 'The cycle', 'The pilot'];
  // pace targets for the speaker view: minutes elapsed by the end of each act
  Deck.ACT_TARGETS = [2.5, 6.5, 8.5, 12.5, 15];
  // The two colleagues who knew (03 · One night, stop 3). Scene 17 starts the
  // nomination chain from exactly these field positions. Stage px.
  Deck.NIGHT_PAIR = [[1030, 520], [1122, 546]];
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
  function fmt(v, dec, sep) {
    let s = v.toFixed(dec);
    if (sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return s;
  }
  function runCount(el, instant) {
    const to = parseFloat(el.dataset.count), from = parseFloat(el.dataset.from || 0);
    const dec = parseInt(el.dataset.decimals || 0, 10), dur = parseFloat(el.dataset.dur || 1.4) * 1000;
    const delay = parseFloat(el.dataset.delay || 0) * 1000;
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
    const cps = parseFloat(el.dataset.cps || 34), delay = parseFloat(el.dataset.delay || 0) * 1000;
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
    if (!f) return { dim: .5, lit: 0, travel: 0, calm: [], litFrom: null, chain: false, pins: [], warm: 0, offset: [0, 0] };
    if (Array.isArray(f)) {
      const out = { dim: .5, lit: 0, travel: 0, calm: [], litFrom: null, chain: false, pins: [], warm: 0, offset: [0, 0] };
      for (let k = 0; k <= Math.min(n, f.length - 1); k++) Object.assign(out, f[k] || {});
      return out;
    }
    return Object.assign({ dim: .5, lit: 0, travel: 0, calm: [], litFrom: null, chain: false, pins: [], warm: 0, offset: [0, 0] }, f, (rec.def.fieldSteps || [])[n] || {});
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

  function go(si, st, opts) {
    opts = opts || {};
    si = clamp(si, 0, S.length - 1);
    const rec = S[si];
    st = clamp(st, 0, rec.n - 1);
    const instant = !!opts.instant;
    if (si !== cur) {
      const old = S[cur];
      const dir = si > cur ? 1 : -1;
      if (old) {
        stopScene(old);
        old.el.classList.remove('active', 'entering-fwd', 'entering-back');
        if (instant) old.el.classList.remove('leaving');
        else {
          old.el.classList.add('leaving');
          clearTimeout(old.leaveTimer);
          old.leaveTimer = setTimeout(() => old.el.classList.remove('leaving'), 950);
        }
      }
      clearTimeout(rec.leaveTimer);
      rec.el.classList.remove('leaving');
      const prevCur = cur;
      cur = si;
      // start from a clean, hidden state; forward entries build stop 0 live,
      // backward entries and jumps land settled.
      const landSettled = instant || (dir < 0 && prevCur !== -1) || opts.settled;
      applyStep(rec, landSettled ? st : -1, -1, true, instant ? 'snap' : 'ease');
      rec.el.classList.add(dir > 0 ? 'entering-fwd' : 'entering-back');
      rec.el.classList.add('no-anim');
      void rec.el.offsetWidth;
      rec.el.classList.remove('no-anim');
      rec.el.classList.add('active');
      requestAnimationFrame(() => rec.el.classList.remove('entering-fwd', 'entering-back'));
      rec.t0 = performance.now();
      stage.dataset.bg = rec.def.bg || 'night';
      try { rec.def.enter && rec.def.enter(rec.ctx); } catch (e) { console.error('enter ' + rec.def.id, e); }
      if (!landSettled) { void rec.el.offsetWidth; applyStep(rec, st, -1, false, 'ease'); }
      step = st;
    } else if (st !== step) {
      const prev = step;
      step = st;
      // a press during a build settles that build first, then plays the new one
      if (!instant && performance.now() - lastBuild < 1300) {
        rec.el.classList.add('no-anim'); void rec.el.offsetWidth; rec.el.classList.remove('no-anim'); void rec.el.offsetWidth;
      }
      applyStep(rec, st, prev, instant, instant ? 'snap' : 'ease');
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
      const s = document.createElement('span'); s.style.flex = count; s.textContent = String(a + 1).padStart(2, '0') + '  ' + name;
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
    const tw = pipsEl.offsetWidth ? pipsEl.offsetWidth + 28 : 0;
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
      '<div class="keys"><b>→</b> <b>Space</b> <b>PgDn</b> next stop &nbsp; <b>←</b> <b>PgUp</b> back &nbsp; <b>]</b> <b>[</b> next / previous scene &nbsp; <b>S</b> speaker view &nbsp; <b>B</b> blackout &nbsp; <b>F</b> fullscreen &nbsp; <b>H</b> hide progress &nbsp; <b>C</b> projector contrast &nbsp; <b>A</b> autoplay &nbsp; <b>G</b> this overview &nbsp; type a number + <b>Enter</b> to jump</div>';
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
      d.getElementById('act').textContent = Deck.ACTS[a] + '  ·  aim to finish this act by ' + Deck.ACT_TARGETS[a] + ' min';
      d.getElementById('cue').textContent = cues[step] || '';
      d.getElementById('stop').textContent = 'Stop ' + (step + 1) + ' of ' + rec.n;
      d.getElementById('next').innerHTML = nx || '';
      d.getElementById('notes').innerHTML = notesFor(rec, step);
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

  const PRESENTER_HTML = `<!doctype html><html><head><meta charset="utf-8"><title>Speaker view — Behind a Better Life</title>
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
  function onKey(e, fromPresenter) {
    if (e.target && /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName)) return;
    const k = e.key;
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
      case 's': case 'S': openPresenter(); break;
      case 'g': case 'G': toggleOverview(); break;
      case 'Escape': toggleOverview(false); break;
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
    window.addEventListener('beforeunload', () => { if (presenter && !presenter.closed) presenter.close(); });
  }

  Deck.start = function () {
    viewport = $('#viewport'); stage = $('#stage'); scenesEl = $('#scenes'); chrome = $('#chrome');
    if (window.Field) Field.mount($('#field'));
    mount();
    buildChrome();
    buildOverview();
    bindInput();
    fit();
    requestAnimationFrame(loopFrame);
    const h = readHash();
    const begin = () => {
      if (h) go(h.i, h.st, { instant: true });
      else go(0, 0, {});
      document.body.classList.add('ready');
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
