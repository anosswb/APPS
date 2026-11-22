"""
Draws the spectral glow pictures (our own art, made by this script, no outside source).
Large soft ellipses in the design-system spectrum, blurred, with a clean alpha (no dark edges in light mode).

Run from the app folder:  python3 scripts/make-glow.py
Writes assets/glow/atmosphere.png (top of every screen) and assets/glow/aura.png (behind one object).
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SPECTRUM = {
    'cyan': (0, 217, 255), 'blue': (49, 91, 255), 'violet': (135, 60, 255), 'magenta': (255, 53, 184),
    'coral': (255, 90, 85), 'orange': (255, 155, 50), 'yellow': (248, 232, 74), 'green': (67, 229, 139),
}


def glow(size, blobs, blur, fade_bottom=None, peak=0.85, round_edge=False):
    w, h = size
    col = np.zeros((h, w, 3), np.float32)
    wsum = np.zeros((h, w), np.float32)
    for name, (cx, cy, rx, ry), strength in blobs:
        m = Image.new('L', size, 0)
        ImageDraw.Draw(m).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
        m = np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), np.float32) / 255 * strength
        col += m[..., None] * np.array(SPECTRUM[name], np.float32)
        wsum += m
    alpha = np.clip(wsum * 1.5, 0, 1) * peak
    rgb = col / np.maximum(wsum, 1e-4)[..., None]  # un-premultiplied colour: no black fringe
    if fade_bottom:
        y = np.linspace(0, 1, h)[:, None]
        alpha *= np.clip((1 - y) / (1 - fade_bottom), 0, 1) ** 1.4
    if round_edge:  # fade to nothing before the square edge
        yy, xx = np.mgrid[0:h, 0:w]
        r = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2))
        t = np.clip((1 - r) / 0.5, 0, 1)
        alpha *= t * t * (3 - 2 * t)  # smooth step, no visible rim
    out = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(out, 'RGBA')


atmosphere = glow(
    (600, 520),
    [
        ('cyan', (70, 90, 150, 110), 1.0),
        ('blue', (230, 150, 170, 120), 1.0),
        ('violet', (360, 110, 150, 110), 1.0),
        ('magenta', (500, 170, 140, 120), 1.0),
        ('orange', (560, 330, 110, 90), 0.8),
        ('green', (120, 320, 110, 80), 0.55),
    ],
    blur=70,
    fade_bottom=0.15,
    peak=0.9,
)
atmosphere.save('assets/glow/atmosphere.png', optimize=True)

aura = glow(
    (480, 480),
    [
        ('cyan', (150, 170, 110, 110), 1.0),
        ('violet', (250, 150, 120, 110), 1.0),
        ('magenta', (330, 260, 110, 110), 1.0),
        ('orange', (230, 340, 110, 90), 0.9),
        ('green', (130, 300, 80, 80), 0.6),
    ],
    blur=60,
    peak=1.0,
    round_edge=True,
)
aura.save('assets/glow/aura.png', optimize=True)
print('ok')
