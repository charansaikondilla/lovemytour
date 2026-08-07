"""
One-off: convert the oversized RGBA PNG destination photos (~2MB each,
1376-1408x768) to compressed JPEGs (~80-180KB), matching the size of the
site's already-correct .jpg destination images. These PNGs were the primary
cause of slow/failed image loads on iOS Safari's stricter per-tab memory
budget in the Global Safari and Continents marquee sections.

Originals are left in place (untouched) — this only writes new .jpg files
alongside them. Reference updates happen separately in the JS/HTML source.
"""
from PIL import Image
import os

FILES = [
    'assets/packages-images/thailand.png',
    'assets/images/singapore.png',
    'assets/images/malyasia.png',
    'assets/images/dubai.png',
    'assets/packages-images/bali.png',
    'assets/packages-images/Andaman.png',
    'assets/packages-images/maldives.png',
    'assets/images/turkey.png',
    'assets/images/egypt.png',
    'assets/images/zimbabwe.png',
    'assets/packages-images/mauritius.png',
    'assets/packages-images/seychelles.png',
    'assets/images/spain.png',
    'assets/images/syndey.png',
    'assets/images/melbourne.png',
    'assets/images/antarctic-peninsula.png',
    'assets/images/south-shetland-islands.png',
]

total_before = 0
total_after = 0

for src in FILES:
    before = os.path.getsize(src)
    dest = os.path.splitext(src)[0] + '.jpg'
    im = Image.open(src).convert('RGB')
    im.save(dest, 'JPEG', quality=82, optimize=True, progressive=True)
    after = os.path.getsize(dest)
    total_before += before
    total_after += after
    print(f"{src} -> {dest}: {before/1024:.0f}KB -> {after/1024:.0f}KB ({100*(1-after/before):.0f}% smaller)")

print(f"\nTotal: {total_before/1024/1024:.1f}MB -> {total_after/1024/1024:.1f}MB")
