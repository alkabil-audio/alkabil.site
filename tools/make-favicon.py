#!/usr/bin/env python3
"""Generate assets/favicon.png from the label mark (assets/logo-white.png).

The source logo is a white mark on transparency; browser tabs are shown on
both light and dark chrome, so we composite it onto a solid black square so it
is always visible. Run from the repo root:

    python tools/make-favicon.py

Outputs a 256x256 PNG. Referenced in every page's <head> as
<link rel="icon" type="image/png" href="assets/favicon.png">.
"""
from PIL import Image

SIZE = 256          # favicon square, px
PAD = 26            # transparent padding inside the square, px
BG = (0, 0, 0, 255) # black background

src = Image.open("assets/logo-white.png").convert("RGBA")

# scale the mark to fit the padded box, preserving aspect
box = SIZE - 2 * PAD
scale = min(box / src.width, box / src.height)
mark = src.resize((round(src.width * scale), round(src.height * scale)), Image.LANCZOS)

out = Image.new("RGBA", (SIZE, SIZE), BG)
out.alpha_composite(mark, ((SIZE - mark.width) // 2, (SIZE - mark.height) // 2))
out.save("assets/favicon.png")
print("wrote assets/favicon.png", out.size)
