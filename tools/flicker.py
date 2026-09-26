"""Flag keyframes that flash: opacity (or brightness) jumping by >= 0.45 within a short slice
of the cycle, and any steps() timing. The real duration is looked up from the animation
declarations that use the keyframes, so the report is in milliseconds.
    python3 tools/flicker.py [css files...]   (default: css/deck-v2.css scenes-v2/*.css)"""
import re, sys, glob
files = sys.argv[1:] or ['css/deck-v2.css'] + sorted(glob.glob('scenes-v2/*.css'))
src = {f: open(f).read() for f in files}
kf = {}
for f, s in src.items():
    for m in re.finditer(r'@keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}', s):
        kf[m.group(1)] = (f, m.group(2))
# durations: animation: name <dur>s ... (first time value after the name)
dur = {}
for f, s in src.items():
    for m in re.finditer(r'animation(?:-name)?\s*:\s*([^;}]+)', s):
        for part in m.group(1).split(','):
            toks = part.split()
            for i, t in enumerate(toks):
                if t in kf:
                    tv = [x for x in toks if re.fullmatch(r'-?[\d.]+m?s', x)]
                    if tv:
                        v = tv[0]; ms = float(v[:-2]) if v.endswith('ms') else float(v[:-1]) * 1000
                        dur.setdefault(t, set()).add(ms)
steps = [(f, l.strip()[:120]) for f, s in src.items() for l in s.split('\n') if 'steps(' in l]
out = []
for name, (f, body) in kf.items():
    pts = []
    for m in re.finditer(r'([\d.%\s,fromto]+)\{([^{}]*)\}', body):
        sel, decl = m.group(1), m.group(2)
        o = re.search(r'opacity\s*:\s*([\d.]+)', decl)
        if not o: continue
        for p in sel.split(','):
            p = p.strip()
            v = 0 if p == 'from' else 100 if p == 'to' else float(p.rstrip('%')) if p.rstrip('%').replace('.', '', 1).isdigit() else None
            if v is not None: pts.append((v, float(o.group(1))))
    pts.sort()
    worst = None
    for (a, oa), (b, ob) in zip(pts, pts[1:]):
        if abs(ob - oa) >= .45:
            span = b - a
            ms = min(dur.get(name, {4000})) * span / 100
            if worst is None or ms < worst[0]: worst = (ms, a, b, oa, ob)
    if worst and worst[0] < 180:
        out.append((worst[0], name, f, worst))
for ms, name, f, w in sorted(out):
    print(f'{ms:6.0f} ms  {name:24s} {f:32s} {w[1]}%→{w[2]}%  opacity {w[3]}→{w[4]}')
for f, l in steps: print('steps()', f, l)
