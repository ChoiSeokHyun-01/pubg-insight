export const TILE_SIZE = 256; // individual tile edge length in pixels
export const Z_MIN = 1;
export const Z_MAX = 6;

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const tilesPerSide = (z: number) => 2 ** z;

export const tileUrl = (name: string, z: number, x: number, y: number) =>
  `/map/${encodeURIComponent(name)}/${z}/${x}/${y}.png`;

