/* GPU layer pressure per build: arrives at each stop live (a click from the previous stop) and
   samples Chrome's compositor layer tree through the build. Reports the peak number of layers
   that draw content and their total area in megapixels (1920×1080 ≈ 2.1 MP; each MP ≈ 4 MB of
   GPU memory). Big, sudden peaks are what blank the screen on a laptop GPU for a frame.
   node tools/layers.js [--file index-v2.html] [--scenes a,b] [--at 100,500,900,1400,1900,2600,3500] */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const only = opt('scenes', '') ? opt('scenes').split(',') : null;
const AT = String(opt('at', '100,500,900,1400,1900,2600,3500')).split(',').map(Number);
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('file://' + path.resolve(__dirname, '..', opt('file', 'index-v2.html')) + '?nogate');
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  const cdp = await page.context().newCDPSession(page);
  let layers = [];
  cdp.on('LayerTree.layerTreeDidChange', (e) => { if (e.layers) layers = e.layers; });
  await cdp.send('LayerTree.enable');
  const defs = await page.evaluate(() => Deck.defs.map((d) => ({ id: d.id, n: d.cues.length })));
  const rows = [];
  for (let si = 0; si < defs.length; si++) {
    if (only && !only.includes(defs[si].id)) continue;
    for (let st = 0; st < defs[si].n; st++) {
      await page.evaluate(([i, s]) => { if (s > 0) Deck.go(i, s - 1, { instant: true }); else if (i > 0) Deck.go(i - 1, Deck.defs[i - 1].cues.length - 1, { instant: true }); }, [si, st]);
      await page.waitForTimeout(1500);
      await page.evaluate(() => Deck.next());
      let t = 0, peakN = 0, peakMP = 0, peakAt = 0, maxLayer = 0;
      for (const at of AT) {
        await page.waitForTimeout(at - t); t = at;
        const draw = layers.filter((l) => l.drawsContent && !l.invisible);
        const mp = draw.reduce((a, l) => a + l.width * l.height, 0) / 1e6;
        if (mp > peakMP) { peakMP = mp; peakAt = at; }
        peakN = Math.max(peakN, draw.length);
        maxLayer = Math.max(maxLayer, ...draw.map((l) => l.width * l.height / 1e6));
      }
      rows.push({ stop: String(si + 1).padStart(2, '0') + '-' + defs[si].id + '-' + st, peakN, peakMP: +peakMP.toFixed(1), peakAt, maxLayer: +maxLayer.toFixed(1) });
      process.stdout.write('.');
    }
  }
  console.log('');
  rows.sort((a, b) => b.peakMP - a.peakMP);
  for (const r of rows) console.log(r.stop.padEnd(20), 'layers', String(r.peakN).padStart(4), ' total', String(r.peakMP).padStart(6), 'MP  (≈' + Math.round(r.peakMP * 4) + ' MB) at', r.peakAt + 'ms', ' largest', r.maxLayer, 'MP');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
