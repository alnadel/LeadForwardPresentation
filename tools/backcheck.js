/* Back-navigation check: every stop reached going BACK must match the same stop
   reached going FORWARD. node tools/backcheck.js [--scenes a,b] [--out shots/_back]
   Writes fwd/back pairs; python3 tools/backdiff.py compares them. */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const root = path.resolve(__dirname, '..');
const out = path.resolve(root, opt('out', 'shots/_back'));
const only = opt('scenes') ? opt('scenes').split(',') : null;
fs.mkdirSync(out, { recursive: true });
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('file://' + path.join(root, 'index.html'));
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  // freeze ambient motion so frames are comparable
  await page.addStyleTag({ content: '*,*::before,*::after{animation-play-state:paused!important}#field{display:none!important}' });
  const defs = await page.evaluate(() => Deck.defs.map((d) => ({ id: d.id, n: Math.max(1, (d.cues || []).length) })));
  for (let si = 0; si < defs.length; si++) {
    const d = defs[si];
    if (only && !only.includes(d.id)) continue;
    const tag = String(si + 1).padStart(2, '0') + '-' + d.id;
    await page.evaluate((i) => Deck.go(i, 0, { instant: false }), si);
    await page.waitForTimeout(3000);
    for (let st = 0; st < d.n; st++) {
      if (st) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(3000); }
      await page.screenshot({ path: path.join(out, tag + '-' + st + '-fwd.png') });
    }
    // go one past the end (next scene), then walk back
    if (si < defs.length - 1) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(1500); }
    for (let st = d.n - 1; st >= 0; st--) {
      await page.keyboard.press('ArrowLeft');
      await page.waitForTimeout(2500);
      await page.screenshot({ path: path.join(out, tag + '-' + st + '-back.png') });
    }
    process.stdout.write(tag + ' done\n');
  }
  if (errors.length) console.log('ERRORS\n' + errors.join('\n'));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
