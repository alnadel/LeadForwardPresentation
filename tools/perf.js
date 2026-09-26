/* Paint load per parked stop: records a 2 s Chrome trace on each settled stop and reports
   how many full frames' worth of pixels were repainted per second (paint area / 1920×1080),
   plus layout and style work. High numbers mean the stop is expensive to keep alive; those
   are the stops that stutter on a presenter laptop.
   node tools/perf.js [--file index-v2.html] [--scenes a,b] [--ms 2000] [--settle 3500] [--vw 1920 --vh 1080] */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const root = path.resolve(__dirname, '..');
const only = opt('scenes', '') ? opt('scenes').split(',') : null;
const MS = +opt('ms', 2000), VW = +opt('vw', 1920), VH = +opt('vh', 1080);
(async () => {
  const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
  const browser = await chromium.launch(fs.existsSync(exe) ? { executablePath: exe } : {});
  const page = await browser.newPage({ viewport: { width: VW, height: VH } });
  await page.goto('file://' + path.resolve(root, opt('file', 'index-v2.html')) + '?nogate');
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  const defs = await page.evaluate(() => Deck.defs.map((d) => ({ id: d.id, n: d.cues.length })));
  const cdp = await page.context().newCDPSession(page);
  const rows = [];
  for (let si = 0; si < defs.length; si++) {
    if (only && !only.includes(defs[si].id)) continue;
    for (let st = 0; st < defs[si].n; st++) {
      await page.evaluate(([i, s]) => Deck.go(i, s, { instant: true }), [si, st]);
      await page.waitForTimeout(+opt('settle', 3500));   // let any build or transition finish: measure the parked frame
      const events = [];
      cdp.removeAllListeners('Tracing.dataCollected');
      cdp.on('Tracing.dataCollected', (e) => events.push(...e.value));
      const done = new Promise((r) => cdp.once('Tracing.tracingComplete', r));
      await cdp.send('Tracing.start', { categories: 'devtools.timeline,disabled-by-default-devtools.timeline', transferMode: 'ReportEvents' });
      await page.waitForTimeout(MS);
      await cdp.send('Tracing.end');
      await done;
      let area = 0, paints = 0, layout = 0, style = 0, frames = 0;
      for (const ev of events) {
        if (ev.name === 'Paint' && ev.args && ev.args.data && ev.args.data.clip) {
          const c = ev.args.data.clip; const xs = [c[0], c[2], c[4], c[6]], ys = [c[1], c[3], c[5], c[7]];
          const w = Math.max(0, Math.min(VW, Math.max(...xs)) - Math.max(0, Math.min(...xs))), h = Math.max(0, Math.min(VH, Math.max(...ys)) - Math.max(0, Math.min(...ys)));
          area += w * h; paints++;
        }
        if (ev.name === 'Layout' && ev.dur) layout += ev.dur;
        if (ev.name === 'UpdateLayoutTree' && ev.dur) style += ev.dur;
        if (ev.name === 'BeginFrame' || ev.name === 'DrawFrame') frames++;
      }
      const sec = MS / 1000;
      rows.push({ stop: String(si + 1).padStart(2, '0') + '-' + defs[si].id + '-' + st, screensPerSec: +(area / (VW * VH) / sec).toFixed(1), paintsPerSec: Math.round(paints / sec), layoutMsPerSec: +(layout / 1000 / sec).toFixed(1), styleMsPerSec: +(style / 1000 / sec).toFixed(1) });
      process.stdout.write('.');
    }
  }
  console.log('');
  rows.sort((a, b) => b.screensPerSec - a.screensPerSec);
  for (const r of rows) console.log(r.stop.padEnd(20), 'repaint', String(r.screensPerSec).padStart(6), 'screens/s', ' paints', String(r.paintsPerSec).padStart(5), '/s  layout', r.layoutMsPerSec, 'ms/s  style', r.styleMsPerSec, 'ms/s');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
