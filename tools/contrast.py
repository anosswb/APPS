#!/usr/bin/env python3
"""WCAG contrast check for a palette file (default: templates/worlds.json).

Run:  python3 tools/contrast.py [file.json]
Rules: text and muted on bg/surface >= 4.5, onPrimary on primary >= 4.5,
primary and accent on bg >= 3 (they are used for controls and icons).
Exit code 1 if anything fails, so it can run in CI or a hook.
"""
import json, sys

def lum(hex_):
    h = hex_.lstrip("#")
    ch = [int(h[i:i + 2], 16) / 255 for i in (0, 2, 4)]
    lin = [c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4 for c in ch]
    return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]

def ratio(a, b):
    la, lb = sorted((lum(a), lum(b)), reverse=True)
    return (la + 0.05) / (lb + 0.05)

CHECKS = [("text", "bg", 4.5), ("text", "surface", 4.5), ("muted", "bg", 4.5), ("muted", "surface", 4.5),
          ("onPrimary", "primary", 4.5), ("primary", "bg", 3.0), ("accent", "bg", 3.0)]

def main():
    path = sys.argv[1] if len(sys.argv) > 1 else "templates/worlds.json"
    worlds = json.load(open(path))["worlds"]
    bad = 0
    for name, w in worlds.items():
        for mode in ("light", "dark"):
            p = w[mode]
            fails = [f"{fg}/{bg} {ratio(p[fg], p[bg]):.1f} (<{need})"
                     for fg, bg, need in CHECKS if ratio(p[fg], p[bg]) < need]
            lowest = min(ratio(p[fg], p[bg]) for fg, bg, _ in CHECKS)
            print(f"{name:14} {mode:5} {'FAIL  ' + ', '.join(fails) if fails else f'ok    lowest {lowest:.1f}'}")
            bad += len(fails)
    sys.exit(1 if bad else 0)

if __name__ == "__main__":
    main()
