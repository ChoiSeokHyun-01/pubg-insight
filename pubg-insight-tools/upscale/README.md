Upscale + Pyramid (z1–z6)

Overview
- Input: a square map image (commonly 8192x8192)
- Output: an upscaled 16384x16384 image (z6) and downscaled images for z1–z5: 512, 1024, 2048, 4096, 8192, 16384

Install
1) Create venv (optional)
2) Install Pillow:
   pip install -r pubg-insight-tools/upscale/requirements.txt

Usage
   python pubg-insight-tools/upscale/cli.py <input> <output_dir> [--format png|jpg|webp|tif] [--prefix map] [--skip-existing] [--force]

Examples
- From 8192x8192 to full pyramid:
  python pubg-insight-tools/upscale/cli.py src/map_8192.png out/tiles --format png --prefix erangel

Notes
- If input is already 16384x16384, it will be used as z6 without upscaling.
- If input is not exactly 8192 or 16384, the longest side is scaled to 16384 and centered on a square canvas.
- For downscaling by 2x, BOX resampling is used; otherwise LANCZOS.

