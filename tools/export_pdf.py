"""Static fallback: one PDF page per stop (the parked frame + cue + speaker notes).

    node tools/shoot.js --file dist/Behind-a-Better-Life.html --out shots/all --wait 3200
    python3 tools/export_pdf.py shots/all dist/Behind-a-Better-Life-stops.pdf

Use it if the venue laptop cannot run the HTML deck: it opens anywhere and
works with any clicker (no motion)."""
import json
import os
import sys
import textwrap
from PIL import Image, ImageDraw, ImageFont

src = sys.argv[1] if len(sys.argv) > 1 else 'shots/all'
out = sys.argv[2] if len(sys.argv) > 2 else 'dist/Behind-a-Better-Life-stops.pdf'
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rep = json.load(open(os.path.join(src, 'report.json')))['report']
W, IH, NH = 1600, 900, 250
reg = ImageFont.truetype(os.path.join(root, 'assets/fonts/Somar-Regular.otf'), 24)
bold = ImageFont.truetype(os.path.join(root, 'assets/fonts/Somar-Bold.otf'), 24)
pages = []
for r in rep:
    im = Image.open(os.path.join(src, r['shot'])).convert('RGB').resize((W, IH), Image.LANCZOS)
    page = Image.new('RGB', (W, IH + NH), (11, 15, 23))
    page.paste(im, (0, 0))
    d = ImageDraw.Draw(page)
    head = '%02d · %s — stop %d of %d · %s' % (r['scene'], r['title'], r['stop'], r['stops'], r['cue'])
    d.text((40, IH + 24), head, font=bold, fill=(37, 199, 188))
    y = IH + 66
    for line in textwrap.wrap(r.get('notes') or '', 128)[:6]:
        d.text((40, y), line, font=reg, fill=(215, 222, 233))
        y += 30
    pages.append(page)
os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
pages[0].save(out, save_all=True, append_images=pages[1:], resolution=110, quality=80)
print('wrote', out, len(pages), 'pages', round(os.path.getsize(out) / 1e6, 1), 'MB')
