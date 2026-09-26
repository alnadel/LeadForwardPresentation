/* Screencast one stop's build with real timestamps:
   node tools/cast.js --scene cycle --stop 1 --out DIR --at 100,300,500 [--dur 3000] [--clip x,y,w,h]
   Arrives at the stop via Deck.next() from the previous stop (or the previous scene's last
   stop for stop 0) and saves the screencast frames nearest to each --at time (ms after the press). */
const path = require('path');
const fs = require('fs');
let chromium;
try { ({ chromium } = require('playwright')); } catch (e) { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf('--' + k); return i >= 0 ? args[i + 1] : d; };
const root = path.resolve(__dirname, '..');
const out = path.resolve(opt('out', 'cast'));
const at = String(opt('at', '0,300,600,900,1200,1600,2000,2600')).split(',').map(Number);
const dur = +opt('dur', Math.max(...at) + 400);
fs.mkdirSync(out, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.join(root, opt('file', 'index-v2.html')));
  await page.waitForFunction(() => document.body.classList.contains('ready'));
  const id = opt('scene'), st = +opt('stop', 0);
  await page.evaluate(([id, st]) => {
    const i = Deck.defs.findIndex((d) => d.id === id);
    if (st > 0) Deck.go(i, st - 1, { instant: true });
    else Deck.go(i - 1, Deck.defs[i - 1].cues.length - 1, { instant: true });
  }, [id, st]);
  await page.waitForTimeout(+opt('pre', 1500));
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on('Page.screencastFrame', async (f) => {
    frames.push({ ts: f.metadata.timestamp, data: f.data });
    try { await cdp.send('Page.screencastFrameAck', { sessionId: f.sessionId }); } catch (e) { /* closed */ }
  });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 80, maxWidth: +opt('w', 1280), maxHeight: +opt('h', 720), everyNthFrame: 1 });
  await page.waitForTimeout(300);
  const tPress = await page.evaluate(() => { Deck.next(); return Date.now() / 1000; });
  await page.waitForTimeout(dur);
  await cdp.send('Page.stopScreencast');
  for (const ms of at) {
    const target = tPress + ms / 1000;
    let best = null;
    for (const f of frames) if (!best || Math.abs(f.ts - target) < Math.abs(best.ts - target)) best = f;
    if (!best) continue;
    const real = Math.round((best.ts - tPress) * 1000);
    fs.writeFileSync(path.join(out, id + '-' + st + '-' + String(ms).padStart(5, '0') + '~' + real + '.jpg'), Buffer.from(best.data, 'base64'));
  }
  console.log('frames', frames.length, errs.length ? 'ERRORS ' + errs.join(' | ') : '');
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
