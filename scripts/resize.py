"""Add a photo to the site: resize to -lg/-th, update manifest, print gallery HTML.

Usage:
    python scripts/resize.py <source-image> <project> <slug> "<alt text>"
    e.g. python scripts/resize.py new.jpg p05 opening-crowd "Crowd at the opening"

Requires: pip install pillow
"""
import json, os, sys
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def main():
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    src, proj, slug, alt = sys.argv[1:5]
    outdir = os.path.join(ROOT, "img", proj)
    os.makedirs(outdir, exist_ok=True)

    im = ImageOps.exif_transpose(Image.open(src))
    if im.mode != "RGB":
        im = im.convert("RGB")

    entry = {"slug": slug, "alt": alt}
    for tag, maxpx, q in (("lg", 1600, 82), ("th", 640, 78)):
        c = im.copy()
        c.thumbnail((maxpx, maxpx), Image.LANCZOS)
        out = os.path.join(outdir, f"{slug}-{tag}.jpg")
        c.save(out, "JPEG", quality=q, progressive=True, optimize=True)
        entry[tag] = {"w": c.width, "h": c.height,
                      "kb": round(os.path.getsize(out) / 1024)}

    mpath = os.path.join(ROOT, "img", "manifest.json")
    manifest = json.load(open(mpath, encoding="utf-8"))
    manifest.setdefault(proj, [])
    manifest[proj] = [e for e in manifest[proj] if e["slug"] != slug] + [entry]
    json.dump(manifest, open(mpath, "w", encoding="utf-8"), indent=1)

    th = entry["th"]
    print(f"""Saved {slug}-lg.jpg / {slug}-th.jpg — paste into the project page's .gallery:

  <a class="g" href="../img/{proj}/{slug}-lg.jpg" data-cap="{alt}">
    <img src="../img/{proj}/{slug}-th.jpg" alt="{alt}" width="{th['w']}" height="{th['h']}" loading="lazy">
  </a>""")

if __name__ == "__main__":
    main()
