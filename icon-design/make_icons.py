"""Wayling icon set. Concept: the walker with its marigold scarf, standing on a strip of turf.
Drawn at 8x, downsampled with LANCZOS. Run: python3 icon-design/make_icons.py"""
import os
from PIL import Image, ImageDraw

PEAT = (23, 18, 15); LOAM = (38, 29, 23); CHALK = (236, 233, 225)
MARI = (255, 180, 31); DIRT = (154, 98, 56); GRASS = (107, 176, 74)
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'icons')


def scene(size, scale, bg=True, simple=False):
    """Draw on a size x size canvas; `scale` shrinks the artwork around the centre."""
    S = size
    im = Image.new('RGBA', (S, S), PEAT + (255,) if bg else (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    u = S * scale / 100.0           # 1 unit = 1% of the artwork box
    ox = S * (1 - scale) / 2
    oy = S * (1 - scale) / 2
    P = lambda x, y: (ox + x * u, oy + y * u)
    # ground: dirt block with grass lip
    d.rounded_rectangle([*P(6, 72), *P(94, 94)], radius=3 * u, fill=DIRT)
    d.rounded_rectangle([*P(6, 72), *P(94, 79)], radius=3 * u, fill=GRASS)
    # scarf (behind body), trailing to the left
    # swallow-tail scarf streaming behind (left)
    d.polygon([P(40, 36), P(10, 30), P(20, 41), P(9, 53), P(40, 46)], fill=MARI)
    # body: rounded capsule
    d.rounded_rectangle([*P(36, 40), *P(64, 72)], radius=11 * u, fill=CHALK)
    # head
    d.ellipse([*P(34, 10), *P(68, 44)], fill=CHALK)
    # scarf knot band over neck
    d.rounded_rectangle([*P(36, 36), *P(66, 46)], radius=4 * u, fill=MARI)
    # eye (looks right)
    ex, ey = P(58, 26)
    r = (4.2 if not simple else 5.5) * u
    d.ellipse([ex - r, ey - r, ex + r, ey + r], fill=PEAT)
    if not simple:
        pr = 1.4 * u
        d.ellipse([ex + 1.2 * u - pr, ey - 1.2 * u - pr, ex + 1.2 * u + pr, ey - 1.2 * u + pr], fill=CHALK)
    # feet
    d.rounded_rectangle([*P(38, 66), *P(50, 73)], radius=3 * u, fill=CHALK)
    d.rounded_rectangle([*P(52, 66), *P(66, 73)], radius=3 * u, fill=CHALK)
    return im


def make(size, scale, name, simple=False, bg=True):
    big = scene(size * 8, scale, bg, simple)
    out = big.resize((size, size), Image.LANCZOS)
    out.convert('RGBA').save(os.path.join(OUT, name))
    return out


os.makedirs(OUT, exist_ok=True)
make(192, 0.86, 'icon-192.png')
make(512, 0.86, 'icon-512.png')
make(512, 0.62, 'icon-512-maskable.png')   # content inside the central safe zone
make(180, 0.80, 'apple-touch-icon.png')
make(32, 0.94, 'favicon-32.png', simple=True)
print('ok')
