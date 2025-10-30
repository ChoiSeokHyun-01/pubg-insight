import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  MapViewContext,
  type MapPoint,
  type MapSize,
  type MapViewContextValue,
} from "./mapViewContext";
import { TILE_SIZE, Z_MAX, Z_MIN, clamp, tilesPerSide } from "./tiles";

export interface MapProviderProps {
  name: string;
  children: ReactNode;
  initialZoom?: number;
  initialCenter?: MapPoint;
  minZoom?: number;
  maxZoom?: number;
}

export function MapProvider({
  name,
  children,
  initialZoom,
  initialCenter,
  minZoom = Z_MIN,
  maxZoom = Z_MAX,
}: MapProviderProps) {
  const sanitizedInitialZoom = clamp(initialZoom ?? minZoom, minZoom, maxZoom);
  const initialIntegerZoom = clamp(Math.round(sanitizedInitialZoom), minZoom, maxZoom);
  const initialScale = 2 ** (sanitizedInitialZoom - initialIntegerZoom);
  const initialWorld = TILE_SIZE * tilesPerSide(initialIntegerZoom);
  const initialCenterClamped =
    initialCenter ??
    ({
      x: initialWorld / 2,
      y: initialWorld / 2,
    } as MapPoint);

  const [zoom, setZoomState] = useState<number>(sanitizedInitialZoom);
  const [center, setCenterState] = useState<MapPoint>(() =>
    clampCenterToViewport(initialCenterClamped, initialWorld, initialScale, { w: 0, h: 0 }),
  );
  const [size, setSizeState] = useState<MapSize>({ w: 0, h: 0 });

  const z = useMemo(
    () => clamp(Math.round(zoom), minZoom, maxZoom),
    [zoom, minZoom, maxZoom],
  );
  const scale = useMemo(() => 2 ** (zoom - z), [zoom, z]);
  const tileCount = useMemo(() => tilesPerSide(z), [z]);
  const worldSize = TILE_SIZE * tileCount;

  useEffect(() => {
    setCenterState((current) => clampCenterToViewport(current, worldSize, scale, size));
  }, [worldSize, scale, size]);

  const setView = useCallback<MapViewContextValue["setView"]>(
    ({ zoom: nextZoom, center: nextCenter }) => {
      const targetZoom =
        nextZoom !== undefined ? clamp(nextZoom, minZoom, maxZoom) : zoom;
      const targetZ = clamp(Math.round(targetZoom), minZoom, maxZoom);
      const targetScale = 2 ** (targetZoom - targetZ);
      const targetWorld = TILE_SIZE * tilesPerSide(targetZ);

      if (nextZoom !== undefined && targetZoom !== zoom) {
        setZoomState(targetZoom);
      }

      if (nextCenter) {
        setCenterState(clampCenterToViewport(nextCenter, targetWorld, targetScale, size));
      } else if (nextZoom !== undefined && targetZoom !== zoom) {
        setCenterState((current) =>
          clampCenterToViewport(current, targetWorld, targetScale, size),
        );
      }
    },
    [minZoom, maxZoom, size, zoom],
  );

  const setCenter = useCallback<MapViewContextValue["setCenter"]>(
    (next) => {
      setView({ center: next });
    },
    [setView],
  );

  const setSize = useCallback<MapViewContextValue["setSize"]>(
    (next) => {
      setSizeState(next);
      setCenterState((current) => clampCenterToViewport(current, worldSize, scale, next));
    },
    [worldSize, scale],
  );

  const setZoom = useCallback<MapViewContextValue["setZoom"]>(
    (nextZoom) => {
      setView({ zoom: nextZoom });
    },
    [setView],
  );

  const viewport = useMemo(() => {
    const left = center.x - (size.w / 2) / scale;
    const top = center.y - (size.h / 2) / scale;
    const right = center.x + (size.w / 2) / scale;
    const bottom = center.y + (size.h / 2) / scale;
    const buffer = 1;
    const x0 = clamp(Math.floor(left / TILE_SIZE) - buffer, 0, tileCount - 1);
    const x1 = clamp(Math.floor(right / TILE_SIZE) + buffer, 0, tileCount - 1);
    const y0 = clamp(Math.floor(top / TILE_SIZE) - buffer, 0, tileCount - 1);
    const y1 = clamp(Math.floor(bottom / TILE_SIZE) + buffer, 0, tileCount - 1);
    return { left, top, x0, x1, y0, y1 };
  }, [center, size, scale, tileCount]);

  const value = useMemo<MapViewContextValue>(
    () => ({
      name,
      zoom,
      z,
      scale,
      center,
      size,
      viewport,
      worldSize,
      minZoom,
      maxZoom,
      setView,
      setZoom,
      setCenter,
      setSize,
    }),
    [
      name,
      zoom,
      z,
      scale,
      center,
      size,
      viewport,
      worldSize,
      minZoom,
      maxZoom,
      setView,
      setZoom,
      setCenter,
      setSize,
    ],
  );

  return <MapViewContext.Provider value={value}>{children}</MapViewContext.Provider>;
}

export default MapProvider;

function clampCenterToViewport(
  center: MapPoint,
  world: number,
  scale: number,
  size: MapSize,
): MapPoint {
  const halfW = size.w / 2 / scale;
  const halfH = size.h / 2 / scale;
  const minX = halfW;
  const maxX = world - halfW;
  const minY = halfH;
  const maxY = world - halfH;
  const x = minX > maxX ? world / 2 : clamp(center.x, minX, maxX);
  const y = minY > maxY ? world / 2 : clamp(center.y, minY, maxY);
  return { x, y };
}

