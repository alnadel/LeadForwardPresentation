/* Walk the deck stop by stop and screenshot every parked frame.
   Loads index.html over file:// (proves the deck needs no network).

   node tools/shoot.js [--scenes open,survey] [--out shots] [--wait 2600]
                       [--motion] [--file index.html] [--w 1920 --h 1080]

   --motion  also saves a second shot 1.2 s later on every stop into _motion/;
             python3 tools/motion.py shots reports how much of each parked
             frame is still moving (ambient motion must keep running). */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? (args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true) : d; };
const root = path.resolve(__dirname, '..');
const file = path.resolve(root, opt('file', 'index.html'));
const out = path.resolve(root, opt('out', 'shots'));
const wait = +opt('wait', 2600);
const only = opt('scenes', '') ? String(opt('scenes')).split(',') : null;
const W = +opt('w', 1920), H = +opt('h', 1080);
fs.mkdirSync(out, { recursive: true });

(async () => {
  const exe = ['/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((p) => fs.existsSync(p));
  const browser = await chromium.launch(exe ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  const errors = [];
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.type() + ': ' + m.text()); });
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('requestfailed', (r) => errors.push('requestfailed: ' + r.url()));
  await page.goto('file://' + file);
  await page.waitForFunction(() => document.body.classList.contains('ready'), null, { timeout: 15000 });
  const defs = await page.evaluate(() => Deck.defs.map((d) => ({ id: d.id, n: Math.max(1, (d.cues || []).length) })));
  const report = [];
  for (let si = 0; si < defs.length; si++) {
    const d = defs[si];
    if (only && !only.includes(d.id)) continue;
    // arrive the way a presenter does: from the last stop of the previous scene
    if (si > 0) {
      await page.evaluate((i) => Deck.go(i - 1, Deck.defs[i - 1].cues.length - 1, { instant: true }), si);
      await page.waitForTimeout(400);
      await page.keyboard.press('ArrowRight');
    } else {
      await page.evaluate(() => Deck.go(0, 0, { instant: true }));
    }
    for (let st = 0; st < d.n; st++) {
      if (st > 0) await page.keyboard.press('ArrowRight');
      await page.waitForTimeout(wait);
      const name = String(si + 1).padStart(2, '0') + '-' + d.id + '-' + st + '.png';
      const a = await page.screenshot({ path: path.join(out, name) });
      let moved = null;
      if (opt('motion', false)) {
        await page.waitForTimeout(1200);
        fs.mkdirSync(path.join(out, '_motion'), { recursive: true });
        await page.screenshot({ path: path.join(out, '_motion', name) });
        moved = true;
      }
      const state = await page.evaluate(() => Deck.state());
      report.push({ shot: name, state, moved });
      process.stdout.write(name + '\n');
    }
  }
  fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify({ report, errors }, null, 1));
  if (errors.length) console.log('ERRORS:\n' + errors.join('\n'));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
