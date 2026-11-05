#!/usr/bin/env python3
"""Собирает единый самодостаточный HTML (картинки, CSS и JS внутри файла).
Нужен для публикации в одном файле: python3 build.py -> dist/konstantin-design.html
Для обычного хостинга (GitHub Pages) сборка не нужна: достаточно index.html и папок css, js, assets."""
import base64, mimetypes, os, re
ROOT = os.path.dirname(os.path.abspath(__file__))
def read(p, mode="r"):
    with open(os.path.join(ROOT, p), mode, **({} if "b" in mode else {"encoding": "utf-8"})) as f:
        return f.read()
def data_uri(rel):
    mime = mimetypes.guess_type(rel)[0] or "application/octet-stream"
    return "data:%s;base64,%s" % (mime, base64.b64encode(read(rel, "rb")).decode())
html = read("index.html")
css = re.sub(r'url\("\.\./(assets/[^"]+)"\)', lambda m: 'url("%s")' % data_uri(m.group(1)), read("css/styles.css"))
js = read("js/main.js")
html = re.sub(r'src="(assets/[^"]+)"', lambda m: 'src="%s"' % data_uri(m.group(1)), html)
html = html.replace('<link rel="stylesheet" href="css/styles.css">', "<style>\n" + css + "</style>")
html = html.replace('<script src="js/main.js" defer></script>', "<script>\n" + js + "</script>")
os.makedirs(os.path.join(ROOT, "dist"), exist_ok=True)
out = os.path.join(ROOT, "dist", "konstantin-design.html")
with open(out, "w", encoding="utf-8") as f:
    f.write(html)
print("OK", out, round(len(html) / 1024), "KB")

# вариант-фрагмент для публикации как claude.ai-артефакта (без doctype/html/head/body)
frag = re.sub(r'<!doctype html>\s*<html[^>]*>\s*<head>', '', html, flags=re.I)
frag = re.sub(r'<meta charset="utf-8">\s*<meta name="viewport"[^>]*>', '<meta name="claude:viewport-fit-sides" content="cover">', frag)
frag = re.sub(r'</head>\s*<body>', '', frag)
frag = re.sub(r'</body>\s*</html>\s*$', '', frag.strip())
with open(os.path.join(ROOT, "dist", "konstantin-design.artifact.html"), "w", encoding="utf-8") as f:
    f.write(frag)
print("OK artifact fragment", round(len(frag) / 1024), "KB")
