#!/usr/bin/env python3
"""Build the board thumbnails used by the catalog and board pages.

Reads `imageMap` from src/config.js, and for every board photo in public/images:
  - scales it to fit 560px,
  - removes a plain white / light-grey background by flood-filling from the edges,
    then trims the transparent margin,
  - writes public/boards/<slug>.webp,
and records each result in src/boardImages.json as {src, kind}:
  alpha  the source already had a transparent background
  cut    a plain background was removed here
  photo  a real photo background that cannot be removed; shown full-bleed

Run it again after adding or changing a board photo:
    pip install 'pillow>=11.3' numpy     # 11.3+ reads the .avif sources
    python3 scripts/prepare-board-images.py
"""
import json
import re
from collections import deque
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC_IMAGES = ROOT / "public" / "images"
OUT_DIR = ROOT / "public" / "boards"
OUT_JSON = ROOT / "src" / "boardImages.json"
MAX_SIDE = 560
BG_TOLERANCE = 22  # max per-channel distance from the background colour


def slug(name):
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")


def image_map():
    src = (ROOT / "src" / "config.js").read_text()
    m = re.search(r"export const imageMap = \{(.*?)\n\};", src, re.S)
    if not m:
        raise SystemExit("imageMap not found in src/config.js")
    block = m.group(1)
    return re.findall(r"""['"]([^'"]+)['"]\s*:\s*['"]/images/([^'"]+)['"]""", block)


def edge_fill(passable):
    """Mark every passable pixel connected to the image border."""
    h, w = passable.shape
    mask = np.zeros((h, w), bool)
    q = deque()
    for y in range(h):
        for x in (0, w - 1):
            if passable[y, x] and not mask[y, x]:
                mask[y, x] = True
                q.append((y, x))
    for x in range(w):
        for y in (0, h - 1):
            if passable[y, x] and not mask[y, x]:
                mask[y, x] = True
                q.append((y, x))
    while q:
        y, x = q.popleft()
        for ny, nx in ((y + 1, x), (y - 1, x), (y, x + 1), (y, x - 1)):
            if 0 <= ny < h and 0 <= nx < w and passable[ny, nx] and not mask[ny, nx]:
                mask[ny, nx] = True
                q.append((ny, nx))
    return mask


def process(path):
    im = Image.open(path).convert("RGBA")
    im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
    a = np.array(im).astype(int)
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])

    if (border[:, 3] < 20).mean() > 0.3:
        return im, "alpha"

    opaque = border[border[:, 3] > 200]
    plain = len(opaque) and opaque[:, :3].mean() > 200 and opaque[:, :3].std(axis=0).max() < 14
    if not plain:
        return im, "photo"

    bg = np.median(opaque[:, :3], axis=0)
    dist = np.abs(a[:, :, :3] - bg).max(axis=2)
    mask = edge_fill((dist <= BG_TOLERANCE) | (a[:, :, 3] < 20))
    if mask.mean() > 0.97:  # nothing left but background: treat as a photo
        return im, "photo"

    keep = Image.fromarray(((~mask) * 255).astype("uint8")).filter(ImageFilter.GaussianBlur(0.8))
    a[:, :, 3] = np.minimum(np.array(keep), a[:, :, 3])
    out = Image.fromarray(a.astype("uint8"))
    return out.crop(out.getbbox()), "cut"


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    result = {}
    written = set()
    for name, file in image_map():
        path = SRC_IMAGES / file
        if not path.exists():
            print(f"skip  {name}: {file} not found")
            continue
        im, kind = process(path)
        target = OUT_DIR / f"{slug(name)}.webp"
        if target.name in written:
            raise SystemExit(f"two boards map to {target.name}; rename one of them in imageMap")
        written.add(target.name)
        im.save(target, "WEBP", quality=80, method=6)
        result[name] = {"src": f"/boards/{target.name}", "kind": kind}
        print(f"{kind:6} {name}")
    for stale in OUT_DIR.glob("*.webp"):
        if stale.name not in written:
            stale.unlink()
            print(f"removed {stale.name} (no longer in imageMap)")
    OUT_JSON.write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n")
    print(f"wrote {len(result)} images to {OUT_DIR.relative_to(ROOT)} and {OUT_JSON.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
