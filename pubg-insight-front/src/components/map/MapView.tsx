import { useMemo, useState } from "react";
import { useMapView } from "./useMapView";
import { TILE_SIZE, tileUrl as defaultTileUrl } from "./tiles";

export interface MapViewProps {
  tileUrl?: (name: string, z: number, x: number, y: number) => string;
  onTileError?: (info: { name: string; z: number; x: number; y: number }) => void;
}

interface TileRender {
  key: string;
  x: number;
  y: number;
  left: number;
  top: number;
  sizePx: number;
  src: string;
}

export function MapView({ tileUrl = defaultTileUrl, onTileError }: MapViewProps) {
  const { name, viewport, scale, z } = useMapView();
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  const tiles = useMemo<TileRender[]>(() => {
    const list: TileRender[] = [];
    for (let x = viewport.x0; x <= viewport.x1; x += 1) {
      for (let y = viewport.y0; y <= viewport.y1; y += 1) {
        const left = (x * TILE_SIZE - viewport.left) * scale;
        const top = (y * TILE_SIZE - viewport.top) * scale;
        const sizePx = TILE_SIZE * scale;
        const key = `${z}-${x}-${y}`;
        list.push({
          key,
          x,
          y,
          left,
          top,
          sizePx,
          src: tileUrl(name, z, x, y),
        });
      }
    }
    return list;
  }, [name, viewport, scale, z, tileUrl]);

  return (
    <>
      {tiles.map(({ key, x, y, left, top, sizePx, src }) => {
        const hasFailed = failed[key];
        return (
          <div
            key={key}
            className="map-tile"
            style={{ left, top, width: sizePx, height: sizePx }}
          >
            {hasFailed ? (
              <div className="map-tile-failed">
                {x},{y}
              </div>
            ) : (
              <img
                src={src}
                alt=""
                className="map-tile-img"
                loading="lazy"
                draggable={false}
                onError={() => {
                  setFailed((prev) => ({ ...prev, [key]: true }));
                  onTileError?.({ name, z, x, y });
                }}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default MapView;

