"""Generate small derivatives of the marquee card images.

WHY THIS EXISTS
---------------
The marquee cards are displayed at roughly 190x230 CSS px on a phone and
240x280 on a desktop, but the source files behind them are 1000x1250 and
1408x768. A browser stores a decoded bitmap at the image's INTRINSIC size,
not its display size — 4 bytes per pixel, regardless of how small the card
is. Measured in a real browser, the Continents page held 155 MB of decoded
image data across 62 unique images.

iOS Safari has a hard per-tab memory ceiling well below that, and its
response to crossing it is to discard decoded images and composited layer
backing stores. A row whose backing store has been dropped keeps its layout
height and keeps animating, but paints as nothing — which is exactly the
"row is blank / rows take turns disappearing" bug on iPhone.

This script writes width-capped copies to assets/card-thumbs/ and leaves
every original untouched, so any other page still using the full-size file
is unaffected. Re-runnable at any time.
"""

import os
import glob
import sys
from collections import Counter
from PIL import Image

MAX_WIDTH = 480          # ~2.5x DPR for a 190px mobile card, ~2x for 240px desktop
QUALITY = 82
OUT_DIR = os.path.join("assets", "card-thumbs")


def continent_card_images():
    """Every non-remote `image:` path inside continentsData in packagesData.js."""
    import re
    src = open("packagesData.js", encoding="utf-8").read()
    start = src.find("continentsData")
    if start == -1:
        sys.exit("could not find continentsData in packagesData.js")
    found = re.findall(r"""image:\s*["']([^"']+)["']""", src[start:])
    return [p for p in found if not p.startswith("http")]


def main():
    paths = continent_card_images() + sorted(glob.glob("assets/safari-cards/*.jpg"))
    paths = sorted({p.replace(os.sep, "/") for p in paths})

    # Mirror each source's path under the thumb root rather than flattening to
    # basenames: assets/images/kenya.jpg and assets/safari-cards/kenya.jpg are
    # different photos, and flattening silently overwrote one with the other.
    def thumb_for(path):
        rel = path[len("assets/"):] if path.startswith("assets/") else path
        return os.path.join(OUT_DIR, rel.replace("/", os.sep))

    collisions = {k: v for k, v in Counter(thumb_for(p) for p in paths).items() if v > 1}
    if collisions:
        sys.exit(f"thumb path collision: {collisions}")

    os.makedirs(OUT_DIR, exist_ok=True)
    before = after = 0.0
    written = missing = 0

    for path in paths:
        if not os.path.exists(path):
            print(f"  missing, skipped: {path}")
            missing += 1
            continue
        with Image.open(path) as im:
            w, h = im.size
            before += w * h * 4 / 1048576
            im = im.convert("RGB")
            if w > MAX_WIDTH:
                im = im.resize((MAX_WIDTH, round(h * MAX_WIDTH / w)), Image.LANCZOS)
            nw, nh = im.size
            after += nw * nh * 4 / 1048576
            dest = thumb_for(path)
            os.makedirs(os.path.dirname(dest), exist_ok=True)
            im.save(dest, "JPEG", quality=QUALITY, optimize=True, progressive=True)
            written += 1

    print(f"inputs {len(paths)}, written {written}, missing {missing} -> {OUT_DIR}/")
    print(f"decoded before : {before:7.1f} MB")
    print(f"decoded after  : {after:7.1f} MB")
    if before:
        print(f"saving         : {before - after:7.1f} MB  ({(before - after) / before * 100:.0f}%)")


if __name__ == "__main__":
    main()
