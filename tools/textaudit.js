// Readability audit: lists, for every stop, the visible text that is small or faint enough to be
// hard to read on a projector (font-size below --min px, or contrast below --contrast against the
// deck's dark ground; filters, blend modes and backdrops are ignored, so treat it as a guide).
//   node tools/textaudit.js [--file index-v2.html] [--scenes a,b] [--min 16] [--contrast 4.5] [--json out.json]
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i < 0 ? d : (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true); };
const file = path.resolve(opt('file', 'index-v2.html'));
const only = opt('scenes', '') ? String(opt('scenes')).split(',') : null;
const MIN = +opt('min', 16), CON = +opt('contrast', 4.5);

(async () => {
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + file + '?nogate');
  await page.waitForFunction(() => document.body.classList.contains('ready'), null, { timeout: 15000 });
  const defs = await page.evaluate(() => Deck.defs.map((d) => ({ id: d.id, n: Math.max(1, (d.cues || []).length) })));
  const all = [];
  for (let si = 0; si < defs.length; si++) {
    const d = defs[si];
    if (only && !only.includes(d.id)) continue;
    for (let st = 0; st < d.n; st++) {
      await page.evaluate(([i, s]) => Deck.go(i, s, { instant: true }), [si, st]);
      await page.waitForTimeout(1200);
      const rows = await page.evaluate(([MIN, CON]) => {
        const lin = (c) => { c /= 255; return c <= .03928 ? c / 12.92 : Math.pow((c + .055) / 1.055, 2.4); };
        const lum = (r, g, b) => .2126 * lin(r) + .7152 * lin(g) + .0722 * lin(b);
        const BG = [8, 18, 36], LB = lum(...BG);
        const sc = document.querySelector('.scene.active');
        const out = [], seen = new Set();
        const w = document.createTreeWalker(sc, NodeFilter.SHOW_TEXT);
        let n;
        while ((n = w.nextNode())) {
          const t = n.textContent.replace(/\s+/g, ' ').trim();
          if (!t || t.length < 2) continue;
          const el = n.parentElement;
          if (el.closest('svg, [aria-hidden="true"], style, script')) continue;
          const r = document.createRange(); r.selectNodeContents(n);
          const b = r.getBoundingClientRect();
          if (b.width < 2 || b.height < 2 || b.right < 0 || b.bottom < 0 || b.left > 1920 || b.top > 1080) continue;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden') continue;
          let op = 1;
          for (let e = el; e && e !== document.body; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
          if (op < .05) continue;
          const m = cs.color.match(/[\d.]+/g).map(Number);
          const a = (m[3] == null ? 1 : m[3]) * op;
          const c = [0, 1, 2].map((k) => m[k] * a + BG[k] * (1 - a));
          const L = lum(...c), con = (Math.max(L, LB) + .05) / (Math.min(L, LB) + .05);
          const fs = parseFloat(cs.fontSize) * (b.height > 0 ? 1 : 1);
          const need = fs >= 24 || (fs >= 18.6 && +cs.fontWeight >= 700) ? 3 : CON;
          if (fs < MIN || con < need) {
            const key = el.className + '|' + t.slice(0, 40);
            if (seen.has(key)) continue; seen.add(key);
            out.push({ fs: Math.round(fs * 10) / 10, con: Math.round(con * 10) / 10, cls: (typeof el.className === 'string' ? el.className : '').slice(0, 40), t: t.slice(0, 70) });
          }
        }
        return out;
      }, [MIN, CON]);
      const tag = String(si + 1).padStart(2, '0') + '-' + d.id + '-' + st;
      rows.forEach((x) => all.push(Object.assign({ stop: tag }, x)));
      console.log(tag.padEnd(16) + ' flagged ' + rows.length);
      rows.forEach((x) => console.log('    ' + String(x.fs).padStart(5) + 'px  ' + String(x.con).padStart(4) + ':1  ' + x.cls.padEnd(30) + ' ' + x.t));
    }
  }
  if (opt('json', '')) fs.writeFileSync(opt('json'), JSON.stringify(all, null, 1));
  console.log('total flagged: ' + all.length);
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
