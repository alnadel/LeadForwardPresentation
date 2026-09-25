"""Report ambient motion on parked frames: python3 tools/motion.py shots
Compares each parked shot with its later samples in shots/_motion and reports
the largest share of the frame that changed (ambient motion must keep running)."""
import sys, os, glob
from PIL import Image, ImageChops
d = sys.argv[1] if len(sys.argv) > 1 else 'shots'
for f in sorted(glob.glob(os.path.join(d, '*.png'))):
    name = os.path.basename(f)
    if name.startswith('_'):
        continue
    samples = sorted(glob.glob(os.path.join(d, '_motion', name[:-4] + '~*.jpg'))) or glob.glob(os.path.join(d, '_motion', name))
    if not samples:
        continue
    a = Image.open(f).convert('L').resize((480, 270))
    best = 0.0
    for s in samples:
        b = Image.open(s).convert('L').resize((480, 270))
        px = ImageChops.difference(a, b).get_flattened_data() if hasattr(Image.Image, 'get_flattened_data') else ImageChops.difference(a, b).getdata()
        best = max(best, sum(1 for v in px if v > 8) / len(px) * 100)
    flag = '  <-- STILL' if best < 0.5 else ''
    print(f'{name:40s} moving {best:5.1f}% of frame{flag}')
