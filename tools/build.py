"""Build one self-contained, offline HTML file from a deck page.

    python3 tools/build.py index-v2.html Present/Behind-a-Better-Life.html   (v2, the one to present)
    python3 tools/build.py                                   -> Present-v1-full/Behind-a-Better-Life.html (v1)

Everything is inlined: stylesheets, scripts, the Somar fonts and the photographs.
Each photograph is embedded once as a CSS custom property (--ph-<name>) and every
url('assets/photos/<name>.jpg') is rewritten to var(--ph-<name>); any other
reference to a photo gets the data URI directly."""
import base64
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else 'index.html'
OUT = os.path.join(ROOT, sys.argv[2] if len(sys.argv) > 2 else os.path.join('Present-v1-full', 'Behind-a-Better-Life.html'))
MIME = {'.otf': 'font/otf', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml'}


def read(rel):
    with open(os.path.join(ROOT, rel), encoding='utf-8') as f:
        return f.read()


def data_uri(path):
    ext = os.path.splitext(path)[1].lower()
    with open(path, 'rb') as f:
        return 'data:%s;base64,%s' % (MIME[ext], base64.b64encode(f.read()).decode('ascii'))


DYNAMIC = []   # photo urls that are not literal file names


def photo_key(name):
    return '--ph-' + re.sub(r'[^a-z0-9]+', '-', os.path.splitext(name)[0].lower())


def rewrite_assets(text, base_dir):
    # url('assets/photos/x.jpg') -> var(--ph-x)
    def url_photo(m):
        if not re.fullmatch(r'assets/photos/[\w.-]+\.(?:jpg|jpeg|png)', m.group(2)):
            DYNAMIC.append(m.group(2))   # e.g. a url built at runtime: it cannot be inlined
        return 'var(%s)' % photo_key(os.path.basename(m.group(2)))
    text = re.sub(r"""url\(\s*(['"]?)(?:\.\./)?(assets/photos/[^'")]+)\1\s*\)""", url_photo, text)

    # remaining url(...) to local assets (fonts, brand svg) -> data URI
    def url_other(m):
        ref = m.group(2)
        if ref.startswith('data:') or ref.startswith('var('):
            return m.group(0)
        p = os.path.normpath(os.path.join(base_dir, ref))
        if not os.path.exists(p):
            p = os.path.normpath(os.path.join(ROOT, ref))
        if not os.path.exists(p):
            sys.exit('missing asset: %s' % ref)
        return "url('%s')" % data_uri(p)
    text = re.sub(r"""url\(\s*(['"]?)((?:\.\./)?assets/[^'")]+)\1\s*\)""", url_other, text)

    # bare photo paths (e.g. <img src="assets/photos/x.jpg">) -> data URI
    def bare(m):
        return data_uri(os.path.join(ROOT, m.group(1)))
    text = re.sub(r"""(?<![\w/])(assets/photos/[\w.-]+\.(?:jpg|jpeg|png))""", bare, text)
    return text


def main():
    html = read(SRC)
    photos_dir = os.path.join(ROOT, 'assets', 'photos')
    linked = re.findall(r'(?:href|src)="((?:scenes[^/]*)/[^"]+)"', html)
    used = set(re.findall(r'assets/photos/([\w.-]+\.(?:jpg|jpeg|png))', ''.join(read(f) for f in linked)))
    root_vars = ':root{%s}' % ''.join(
        '%s:url(%s);' % (photo_key(n), data_uri(os.path.join(photos_dir, n))) for n in sorted(used))

    def inline_css(m):
        rel = m.group(1)
        css = rewrite_assets(read(rel), os.path.dirname(os.path.join(ROOT, rel)))
        return '<style data-src="%s">\n%s\n</style>' % (rel, css)
    html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)

    def inline_js(m):
        rel = m.group(1)
        js = rewrite_assets(read(rel), os.path.dirname(os.path.join(ROOT, rel)))
        js = re.sub(r'</(script)', r'<\\/\1', js, flags=re.I)
        return '<script data-src="%s">\n%s\n</script>' % (rel, js)
    html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)

    html = html.replace('</head>', '<style data-src="photos">%s</style>\n</head>' % root_vars, 1)
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(html)
    left = re.findall(r'(?<![\w-])(?:src|href)="(?!data:|#)[^"]+"', html)
    print('wrote %s (%.1f MB), photos: %s' % (os.path.relpath(OUT, ROOT), os.path.getsize(OUT) / 1e6, ', '.join(sorted(used))))
    if left:
        print('WARNING: external references remain:', left[:10])
    if DYNAMIC:
        print('WARNING: photo urls that are not literal will not load offline (write them out in full):', DYNAMIC[:10])


if __name__ == '__main__':
    main()
