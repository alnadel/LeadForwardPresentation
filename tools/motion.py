"""Report ambient motion on parked frames: python3 tools/motion.py shots
Compares each shot with its twin in shots/_motion (taken 1.2 s later)."""
import sys, os, glob
from PIL import Image, ImageChops
d = sys.argv[1] if len(sys.argv) > 1 else 'shots'
for f in sorted(glob.glob(os.path.join(d, '_motion', '*.png'))):
    a = Image.open(os.path.join(d, os.path.basename(f))).convert('L').resize((480, 270))
    b = Image.open(f).convert('L').resize((480, 270))
    diff = ImageChops.difference(a, b)
    px = diff.getdata()
    moving = sum(1 for v in px if v > 6) / len(px) * 100
    print(f'{os.path.basename(f):40s} moving {moving:5.1f}% of frame  (max delta {max(px)})')
