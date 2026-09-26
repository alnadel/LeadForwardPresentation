/* Capture scene-to-scene handoffs: from each scene's last stop, press next and
   grab frames at a few moments into the transition.
   node tools/transitions.js [--out shots/_trans] [--at 150,350,650,1100] */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const root = path.resolve(__dirname, '..');
const out = path.resolve(root, opt('out', 'shots/_trans'));
const at = String(opt('at', '150,350,650,1100')).split(',').map(Number);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  await page.goto('file://' + path.resolve(root, opt('file', 'index.html')));
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  const n = await page.evaluate(() => Deck.defs.length);
  for (let i = 0; i < n - 1; i++) {
    await page.evaluate((k) => Deck.go(k, Deck.defs[k].cues.length - 1, { instant: true }), i);
    await page.waitForTimeout(900);
    await page.keyboard.press('ArrowRight');
    let t = 0;
    for (const ms of at) {
      await page.waitForTimeout(ms - t); t = ms;
      await page.screenshot({ path: path.join(out, String(i + 1).padStart(2, '0') + '-to-' + String(i + 2).padStart(2, '0') + '-' + ms + '.png') });
    }
    process.stdout.write('.');
  }
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
