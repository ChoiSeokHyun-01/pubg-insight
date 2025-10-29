import argparse
import re
from pathlib import Path
from typing import List, Optional

try:
    from PIL import Image
except ImportError as e:
    raise SystemExit("Pillow is required. Install with: pip install -r pubg-insight-tools/upscale/requirements.txt") from e

# python pubg-insight-tools/tile/cli.py "C:\WS\map\out\erangel" "C:\WS\map\map\erangel"

# Allow very large images (e.g., 16384x16384) without Pillow raising DecompressionBombError
Image.MAX_IMAGE_PIXELS = None

Z_LEVELS: List[int] = [1, 2, 3, 4, 5, 6]
TILE_SIZE = 256
IMG_EXTS = {".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff"}


def parse_args() -> argparse.Namespace:
    p = argparse.ArgumentParser(
        description="Slice z1..z6 images into 256x256 tiles saved as z/x/y.png.",
    )
    p.add_argument("input_dir", type=Path, help="Directory containing z-level images (e.g., *_z1.png .. *_z6.png)")
    p.add_argument("output_dir", type=Path, help="Directory to write tiles (z/x/y.png under this root)")
    p.add_argument("--map-name", default=None, help="Optional map name subfolder under output_dir (outputs to output_dir/map-name)")
    p.add_argument("--format", choices=["png"], default="png", help="Tile output format (png)")
    p.add_argument("--skip-existing", action="store_true", help="Skip tiles that already exist")
    p.add_argument("--force", action="store_true", help="Overwrite tiles even if they exist")
    return p.parse_args()


def find_level_image(inp_dir: Path, level: int) -> Optional[Path]:
    pattern = re.compile(rf"(^|[_\-])z{level}(?=\.|$)", flags=re.IGNORECASE)
    candidates: List[Path] = []
    for p in inp_dir.iterdir():
        if not p.is_file():
            continue
        if p.suffix.lower() not in IMG_EXTS:
            continue
        name_wo_ext = p.stem
        if pattern.search(name_wo_ext):
            candidates.append(p)
    if candidates:
        return sorted(candidates)[0]
    return None


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def tile_image(src_img: Image.Image, out_root: Path, z: int, fmt: str, skip_existing: bool, overwrite: bool) -> None:
    w, h = src_img.size
    if w != h:
        print(f"[warn] z{z}: input is not square: {w}x{h}")
    if w % TILE_SIZE != 0 or h % TILE_SIZE != 0:
        print(f"[warn] z{z}: dimensions not multiple of {TILE_SIZE}; tiles may be truncated")
    tiles_x = w // TILE_SIZE
    tiles_y = h // TILE_SIZE
    for y in range(tiles_y):
        for x in range(tiles_x):
            out_dir = out_root / str(z) / str(x)
            ensure_dir(out_dir)
            out_path = out_dir / f"{y}.{fmt}"
            if out_path.exists():
                if skip_existing and not overwrite:
                    continue
                if overwrite:
                    out_path.unlink()
            left = x * TILE_SIZE
            upper = y * TILE_SIZE
            right = left + TILE_SIZE
            lower = upper + TILE_SIZE
            tile = src_img.crop((left, upper, right, lower))
            tile.save(out_path, format=fmt.upper())


def main() -> None:
    args = parse_args()
    out_root = args.output_dir
    if args.map_name:
        out_root = out_root / args.map_name
    ensure_dir(out_root)

    processed_any = False
    for z in Z_LEVELS:
        level_img_path = find_level_image(args.input_dir, z)
        if not level_img_path:
            print(f"[info] No image found for z{z} in {args.input_dir}")
            continue
        with Image.open(level_img_path) as img:
            img = img.convert("RGB")
            tile_image(img, out_root, z, args.format.lower(), args.skip_existing, args.force)
            processed_any = True
    if not processed_any:
        raise SystemExit(f"No z-level images found in {args.input_dir}. Expected patterns like *_z1.png .. *_z6.png")


if __name__ == "__main__":
    main()
