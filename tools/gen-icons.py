"""Regenerate js/icons.js from assets/icons/*.svg and assets/brand/*.svg.
Run from the repo root: python3 tools/gen-icons.py"""
import re, os, json
icons = {}
for f in sorted(os.listdir('assets/icons')):
    if not f.endswith('.svg'):
        continue
    s = open('assets/icons/' + f).read()
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    body = re.sub(r'\s+', ' ', re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1).strip())
    icons[f[:-4]] = {'vb': vb, 'body': body}

def brand(fn):
    s = re.sub(r'<\?xml[^>]*\?>', '', open('assets/brand/' + fn).read())
    vb = re.search(r'viewBox="([^"]+)"', s).group(1)
    body = re.search(r'<svg[^>]*>(.*)</svg>', s, re.S).group(1)
    body = re.sub(r'fill="#(FFFFFF|25C7BC|3CBDB6)"', 'fill="currentColor"', body).replace('&#x9;', '')
    return {'vb': vb, 'body': re.sub(r'\s+', ' ', body).strip()}

art = {'logo': brand('logo-white.svg'), 'mark': brand('mark-white.svg'), 'pattern': brand('pattern-nodes.svg')}
open('js/icons.js', 'w').write(
    "/* Tahakom brand icon set (40px outline, currentColor) and logo artwork.\n"
    "   Generated from assets/icons/*.svg and assets/brand/*.svg by tools/gen-icons.py. */\n"
    "window.TK_ICONS = %s;\nwindow.TK_ART = %s;\n" % (
        json.dumps(icons, separators=(',', ':')), json.dumps(art, separators=(',', ':'))))
