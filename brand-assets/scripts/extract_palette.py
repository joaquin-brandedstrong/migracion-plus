#!/usr/bin/env python3
"""Extract a 5-color palette from logo-primary.png using KMeans clustering.

Usage:
    pip install pillow scikit-learn numpy
    python brand-assets/scripts/extract_palette.py

Writes brand-assets/extracted-palette.json with the dominant, secondary,
accent, neutral_dark, and neutral_light hex codes (sorted by frequency).
"""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

try:
    from PIL import Image
    import numpy as np
except ImportError as exc:
    raise SystemExit(
        "Missing dependency. Install with:  pip install pillow numpy"
    ) from exc


def kmeans_numpy(pixels: "np.ndarray", k: int = 5, max_iter: int = 50, seed: int = 42):
    """Minimal KMeans in pure numpy. Returns (centers, labels, counts) sorted by frequency desc."""
    rng = np.random.default_rng(seed)
    # k-means++ init: pick the first center at random, subsequent ones with prob ∝ d^2.
    n = len(pixels)
    centers = np.empty((k, pixels.shape[1]), dtype=np.float64)
    centers[0] = pixels[rng.integers(0, n)]
    for c in range(1, k):
        d2 = np.min(np.sum((pixels[:, None, :] - centers[:c][None, :, :]) ** 2, axis=2), axis=1)
        probs = d2 / d2.sum() if d2.sum() > 0 else np.full(n, 1.0 / n)
        centers[c] = pixels[rng.choice(n, p=probs)]

    for _ in range(max_iter):
        # Assign each pixel to nearest center.
        dists = np.sum((pixels[:, None, :] - centers[None, :, :]) ** 2, axis=2)
        labels = np.argmin(dists, axis=1)
        new_centers = np.empty_like(centers)
        for ci in range(k):
            mask = labels == ci
            new_centers[ci] = pixels[mask].mean(axis=0) if mask.any() else centers[ci]
        if np.allclose(new_centers, centers, atol=0.5):
            centers = new_centers
            break
        centers = new_centers

    counts = np.bincount(labels, minlength=k)
    order = np.argsort(-counts)
    return centers[order], labels, counts[order]

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "source" / "logo-primary.png"
OUT = ROOT / "extracted-palette.json"


def main() -> None:
    if not SOURCE.exists():
        raise SystemExit(f"Source file not found: {SOURCE}")

    img = Image.open(SOURCE).convert("RGBA")
    arr = np.array(img)
    pixels = arr.reshape(-1, 4)
    # Keep only well-opaque pixels and drop near-white pixels (background).
    opaque = pixels[pixels[:, 3] > 200][:, :3].astype(np.float64)
    not_white = opaque[~((opaque > 240).all(axis=1))]
    if len(not_white) < 100:
        raise SystemExit("Source image has too few non-background pixels.")

    centers, _labels, counts = kmeans_numpy(not_white, k=5)
    centers = centers.astype(int)
    hex_codes = ["#{:02X}{:02X}{:02X}".format(*center) for center in centers]
    print(f"  Cluster counts: {counts.tolist()}")

    payload = {
        "dominant": hex_codes[0],
        "secondary": hex_codes[1],
        "accent": hex_codes[2],
        "neutral_dark": hex_codes[3],
        "neutral_light": hex_codes[4],
        "extracted_at": datetime.now(timezone.utc).isoformat(),
        "source": "logo-primary.png",
    }

    OUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {OUT}")
    for k, v in payload.items():
        if k.startswith("#") or k.startswith("dominant") or k.startswith("secondary") or k.startswith("accent") or k.startswith("neutral"):
            print(f"  {k:>14}: {v}")


if __name__ == "__main__":
    main()
