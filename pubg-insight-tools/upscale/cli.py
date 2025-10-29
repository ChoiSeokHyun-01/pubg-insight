import argparse
from pathlib import Path
from typing import List, Tuple

try:
    from PIL import Image
except ImportError as e:
    raise SystemExit("Pillow is required. Install with: pip install -r pubg-insight-tools/upscale/requirements.txt") from e


Z_LEVELS = [
    (1, 512),
    (2, 1024),
    (3, 2048),
    (4, 4096),
    (5, 8192),
    (6, 16384),
]


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Upscale to 16384 and generate multi-resolution images (z1–z6).",
    )
    p.add_argument("input", type=Path, help="Input image path (expected ~8192x8192)")
    p.add_argument("output_dir", type=Path, help="Output directory for z-level images")
    p.add_argument(
        "--format",
        choices=["png", "jpg", "jpeg", "webp", "tif", "tiff"],
        default="png",
        help="Output image format",
    )
    p.add_argument(
        "--prefix",
        default="map",
        help="Output filename prefix (e.g., 'map' -> map_z6.png)",
    )
    p.add_argument(
        "--quality",
        type=int,
        default=95,
        help="Quality for lossy formats (jpg/webp)",
    )
    p.add_argument(
        "--skip-existing",
        action="store_true",
        help="Skip writing files that already exist",
    )
    p.add_argument(
        "--force",
        action="store_true",
        help="Overwrite outputs even if they exist",
    )
    return p.parse_args()


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def save_image(img: Image.Image, path: Path, fmt: str, quality: int) -> None:
    params = {}
    if fmt in {"jpg", "jpeg"}:
        params.update({"quality": quality, "subsampling": 1, "optimize": True})
    elif fmt == "webp":
        params.update({"quality": quality, "method": 6})
    elif fmt in {"tif", "tiff"}:
        params.update({"compression": "tiff_lzw"})
    img.save(path, format=fmt.upper(), **params)


def upscale_to_16384(img: Image.Image) -> Image.Image:
    target = 16384
    if img.width == target and img.height == target:
        return img
    # Use high-quality upscaling
    return img.resize((target, target), resample=Image.Resampling.LANCZOS)


def generate_pyramid(img_16384: Image.Image, levels: List[Tuple[int, int]], out_dir: Path, prefix: str, fmt: str, quality: int, skip_existing: bool, overwrite: bool) -> None:
    # Save z6 first (may already be 16384 from input)
    level_map = {z: s for z, s in levels}
    current = img_16384
    for z in sorted(level_map.keys(), reverse=True):
        size = level_map[z]
        out_path = out_dir / f"{prefix}_z{z}.{fmt}"
        if out_path.exists() and skip_existing and not overwrite:
            # Skip without touching
            continue
        if current.width != size:
            # Progressive downscale by halves where possible for speed/quality
            # If exact half, use BOX; otherwise, do a direct LANCZOS resize.
            if current.width // 2 == size and current.width % 2 == 0:
                current = current.resize((size, size), resample=Image.Resampling.BOX)
            else:
                current = current.resize((size, size), resample=Image.Resampling.LANCZOS)
        if out_path.exists() and overwrite:
            out_path.unlink()
        save_image(current, out_path, fmt, quality)


def main() -> None:
    args = parse_args()
    ensure_dir(args.output_dir)

    with Image.open(args.input) as src:
        src = src.convert("RGB")  # normalize mode for consistent output
        w, h = src.size
        if w != h:
            print(f"[warn] Input is not square: {w}x{h}. Proceeding with aspect-preserving resize to square outputs.")
        # If source is 8192, upscale by 2x; if 16384, use as-is; else rescale proportionally to 16384 by longer edge
        if max(w, h) == 16384:
            base_16384 = src
        elif max(w, h) == 8192:
            base_16384 = upscale_to_16384(src)
        else:
            # Scale longest side to 16384, keep aspect ratio, then center-crop/pad to square
            scale = 16384 / float(max(w, h))
            new_w, new_h = int(round(w * scale)), int(round(h * scale))
            resized = src.resize((new_w, new_h), resample=Image.Resampling.LANCZOS)
            # Paste onto a square canvas
            canvas = Image.new("RGB", (16384, 16384), (0, 0, 0))
            off_x = (16384 - new_w) // 2
            off_y = (16384 - new_h) // 2
            canvas.paste(resized, (off_x, off_y))
            base_16384 = canvas

        generate_pyramid(
            base_16384,
            Z_LEVELS,
            args.output_dir,
            args.prefix,
            args.format.lower(),
            args.quality,
            skip_existing=args.skip_existing,
            overwrite=args.force,
        )


if __name__ == "__main__":
    main()

