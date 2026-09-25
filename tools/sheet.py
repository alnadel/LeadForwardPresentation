"""Contact sheet of a shots folder: python3 tools/sheet.py shots [cols] [width] [filter]"""
import sys, os, glob
from PIL import Image
d = sys.argv[1] if len(sys.argv) > 1 else 'shots'
cols = int(sys.argv[2]) if len(sys.argv) > 2 else 4
w = int(sys.argv[3]) if len(sys.argv) > 3 else 480
flt = sys.argv[4] if len(sys.argv) > 4 else ''
fs = sorted(f for f in glob.glob(os.path.join(d, '*.png')) if flt in os.path.basename(f) and not os.path.basename(f).startswith('_'))
h = w * 9 // 16
rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * h), 'black')
for i, f in enumerate(fs):
    sheet.paste(Image.open(f).convert('RGB').resize((w, h), Image.LANCZOS), ((i % cols) * w, (i // cols) * h))
name = os.path.join(d, '_sheet' + ('_' + flt if flt else '') + '.jpg')
sheet.save(name, quality=80)
print(name, len(fs))
