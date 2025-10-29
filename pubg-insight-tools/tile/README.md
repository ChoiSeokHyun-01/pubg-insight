Tiling tool (z/x/y.png)

Usage

- Ensure Pillow is installed (reuse upscale requirements):
  pip install -r pubg-insight-tools/upscale/requirements.txt

- Slice tiles from an existing multi-resolution folder (containing *_z1..*_z6 images):
  python pubg-insight-tools/tile/cli.py "C:\\WS\\map\\out\\erangel" "C:\\WS\\map\\tile" --map-name erangel

Output layout:

- C:\WS\map\tile\erangel\z\x\y.png
- Example: C:\WS\map\tile\erangel\6\12\23.png

Notes

- Expects images named like <prefix>_z6.png, <prefix>_z5.png, ...
- Tiles are 256x256; for z6 (16384) you get 64x64 tiles.
