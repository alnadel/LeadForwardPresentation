/* Which running animations on each parked stop are expensive? Compositor-friendly animations
   (transform, opacity) are cheap; anything else (box-shadow, filter, text-shadow, background,
   width/left/top, stroke-dashoffset, clip-path, colours…) repaints every frame.
   node tools/animaudit.js [--file index-v2.html] [--scenes a,b] */
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
  let grand = 0;
  for (let si = 0; si < defs.length; si++) {
    if (only && !only.includes(defs[si].id)) continue;
    for (let st = 0; st < defs[si].n; st++) {
      await page.evaluate(([i, s]) => Deck.go(i, s, { instant: true }), [si, st]);
      await page.waitForTimeout(2600);
      const r = await page.evaluate(() => {
        const cheap = new Set(['transform', 'opacity', 'offset', 'composite', 'easing', 'computedOffset', 'translate', 'scale', 'rotate']);
        const by = {}; let n = 0, bad = 0;
        for (const a of document.getAnimations()) {
          if (a.playState !== 'running' || a instanceof CSSTransition) continue;
          const t = a.effect.target; const sc = t && t.closest && t.closest('.scene.active'); if (!sc) continue;
          n++;
          const props = new Set(); for (const k of a.effect.getKeyframes()) for (const p of Object.keys(k)) if (!cheap.has(p)) props.add(p);
          if (props.size) { bad++; const key = a.animationName + ' [' + [...props].join(',') + ']'; by[key] = (by[key] || 0) + 1; }
        }
        return { n, bad, by: Object.entries(by).sort((a, b) => b[1] - a[1]) };
      });
      grand += r.bad;
      console.log(String(si + 1).padStart(2, '0') + '-' + defs[si].id + '-' + st, 'running', r.n, 'expensive', r.bad);
      for (const [k, c] of r.by) console.log('     ', String(c).padStart(3), k);
    }
  }
  console.log('total expensive running animations across stops:', grand);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
