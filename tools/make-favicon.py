#!/usr/bin/env python3
"""Generate assets/favicon.png (the PNG fallback) from the red label mark.

The primary favicon is the vector assets/favicon.svg (the "Logo Red" mark);
this script rasterizes a 256x256 PNG fallback for browsers that don't use SVG
icons. The mark keeps its transparent background — it's the red glyph only, so
it reads on both light and dark browser tabs. Source is assets/logo-red.png.
Run from the repo root:

    python tools/make-favicon.py

Referenced in every page's <head> after the SVG:
<link rel="icon" type="image/png" href="assets/favicon.png">.
"""
from PIL import Image

SIZE = 256          # favicon square, px
MARGIN = 1.08       # square side = longest glyph edge * MARGIN (breathing room)

src = Image.open("assets/logo-red.png").convert("RGBA")

# trim to the glyph's non-transparent bounding box
bbox = src.getbbox()
if bbox:
    src = src.crop(bbox)

# centre it in a transparent square, then downscale
side = int(max(src.width, src.height) * MARGIN)
square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
square.alpha_composite(src, ((side - src.width) // 2, (side - src.height) // 2))
square.resize((SIZE, SIZE), Image.LANCZOS).save("assets/favicon.png", optimize=True)
print("wrote assets/favicon.png", (SIZE, SIZE))
