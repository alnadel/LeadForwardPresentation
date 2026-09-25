"""Compare forward vs back frames from tools/backcheck.js: python3 tools/backdiff.py shots/_back"""
import sys, os, glob
from PIL import Image, ImageChops
d = sys.argv[1] if len(sys.argv) > 1 else 'shots/_back'
bad = 0
for f in sorted(glob.glob(os.path.join(d, '*-fwd.png'))):
    b = f.replace('-fwd.png', '-back.png')
    if not os.path.exists(b):
        continue
    A = Image.open(f).convert('L').resize((480, 270)); B = Image.open(b).convert('L').resize((480, 270))
    px = list(ImageChops.difference(A, B).getdata())
    pct = sum(1 for v in px if v > 24) / len(px) * 100
    flag = '  <-- MISMATCH' if pct > 1.5 else ''
    bad += bool(flag)
    print(f'{os.path.basename(f)[:-8]:34s} differs {pct:5.2f}%{flag}')
print('mismatches:', bad)
