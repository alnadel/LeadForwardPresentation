/* Find animations that pop: during a live build, an animation that is still in its start delay
   without a backwards fill shows the element in its resting style, then snaps to its first
   keyframe when it starts (e.g. visible → invisible → fade in = a flicker). Reports each one whose
   first-keyframe opacity differs from what is on screen during the delay.
   node tools/popcheck.js [--file index-v2.html] [--scenes a,b] */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const only = opt('scenes', '') ? opt('scenes').split(',') : null;
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  await page.goto('file://' + path.resolve(__dirname, '..', opt('file', 'index-v2.html')) + '?nogate');
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  const defs = await page.evaluate(() => Deck.defs.map((d) => ({ id: d.id, n: d.cues.length })));
  const found = {};
  for (let si = 0; si < defs.length; si++) {
    if (only && !only.includes(defs[si].id)) continue;
    for (let st = 0; st < defs[si].n; st++) {
      // arrive live: from the previous stop (or the previous scene's last stop)
      await page.evaluate(([i, s]) => { if (s > 0) Deck.go(i, s - 1, { instant: true }); else if (i > 0) Deck.go(i - 1, Deck.defs[i - 1].cues.length - 1, { instant: true }); }, [si, st]);
      await page.waitForTimeout(600);
      await page.evaluate(() => Deck.next());
      for (const at of [60, 400, 1000, 1800]) {
        await page.waitForTimeout(at === 60 ? 60 : 400);
        const r = await page.evaluate(() => {
          const out = [];
          for (const a of document.getAnimations()) {
            if (a instanceof CSSTransition) continue;
            const t = a.effect.target; if (!t || !t.closest || !t.closest('.scene.active')) continue;
            const tm = a.effect.getComputedTiming(), tg = a.effect.getTiming();
            if (!(tg.delay > 0) || tm.localTime == null || tm.localTime >= tg.delay) continue;
            if (tg.fill === 'backwards' || tg.fill === 'both') continue;
            const k0 = a.effect.getKeyframes()[0]; if (!k0 || k0.opacity == null) continue;
            const pseudo = a.effect.pseudoElement || null;
            const now = parseFloat(getComputedStyle(t, pseudo).opacity);
            if (Math.abs(now - parseFloat(k0.opacity)) > .3) out.push(a.animationName + (pseudo || '') + ' shows ' + now.toFixed(2) + ' then snaps to ' + k0.opacity);
          }
          return out;
        });
        for (const x of r) { const key = defs[si].id + '-' + st + ': ' + x; found[key] = 1; }
      }
      process.stdout.write('.');
    }
  }
  console.log('');
  const keys = Object.keys(found);
  keys.forEach((k) => console.log(k));
  console.log('pops:', keys.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
