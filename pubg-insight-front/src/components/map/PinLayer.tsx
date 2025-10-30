import { Fragment, useEffect, useMemo, useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import { useMapView, type MapPoint } from "./useMapView";
import Pin, { type PinAnchor } from "./Pin";
import { Z_MAX, Z_MIN } from "./tiles";

const COLOR_PALETTE = [
  "#ff5555",
  "#ff9f1c",
  "#ffd23f",
  "#2ec4b6",
  "#3a86ff",
  "#8338ec",
  "#ff006e",
  "#8ac926",
];

const OFFSCREEN_BUFFER = 64; // px buffer to keep pins slightly outside viewport

export interface PinTypeInfo {
  type: string;
  color: string;
  count: number;
}

export interface PinLayerProps {
  source: string | PinSourceData;
  visibleTypes?: string[];
  renderPin?: (pin: ProjectedPin) => ReactNode;
  onPinClick?: (pin: ProjectedPin, event: MouseEvent<HTMLDivElement>) => void;
  onTypesChange?: (types: PinTypeInfo[]) => void;
  className?: string;
}

export interface PinRecord {
  id: string;
  type: string;
  x: number;
  y: number;
  label?: string;
  anchor?: PinAnchor;
  minZoom?: number;
  maxZoom?: number;
  zIndex?: number;
  meta?: unknown;
  zAt?: number;
}

export interface PinSourceData {
  version: string;
  map: string;
  ref: {
    zBase: number;
    worldSize: number;
    tileSize: number;
  };
  icons?: Record<string, string>;
  pins: PinRecord[];
}

interface NormalizedPin extends Omit<PinRecord, "x" | "y"> {
  x: number;
  y: number;
}

interface NormalizedData {
  ref: PinSourceData["ref"];
  icons: Record<string, string>;
  pins: NormalizedPin[];
}

export interface ProjectedPin extends NormalizedPin {
  px: number;
  py: number;
  color: string;
  world: MapPoint;
}

export function PinLayer({
  source,
  visibleTypes,
  renderPin,
  onPinClick,
  onTypesChange,
  className,
}: PinLayerProps) {
  const [data, setData] = useState<NormalizedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { viewport, scale, size, zoom, z } = useMapView();

  useEffect(() => {
    let cancelled = false;
    const applyData = (raw: PinSourceData) => {
      if (cancelled) return;
      setData(normalizePinSource(raw));
      setError(null);
    };
    const handleError = (err: unknown) => {
      if (cancelled) return;
      setData(null);
      setError(err instanceof Error ? err.message : "Failed to load pin source");
    };

    if (typeof source === "string") {
      const url = source;
      fetch(url)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`Failed to load pins (${res.status})`);
          }
          return res.json() as Promise<PinSourceData>;
        })
        .then(applyData)
        .catch(handleError);
    } else {
      try {
        applyData(source);
      } catch (err) {
        handleError(err);
      }
    }

    return () => {
      cancelled = true;
    };
  }, [source]);

  const typeInfo = useMemo<PinTypeInfo[]>(() => {
    if (!data) return [];
    const counts = new Map<string, number>();
    data.pins.forEach((pin) => {
      counts.set(pin.type, (counts.get(pin.type) ?? 0) + 1);
    });
    const orderedTypes = Array.from(counts.keys()).sort();
    return orderedTypes.map((type, index) => ({
      type,
      color: COLOR_PALETTE[index % COLOR_PALETTE.length],
      count: counts.get(type) ?? 0,
    }));
  }, [data]);

  useEffect(() => {
    if (!onTypesChange) return;
    onTypesChange(typeInfo);
  }, [typeInfo, onTypesChange]);

  const colorByType = useMemo(() => {
    const map = new Map<string, string>();
    typeInfo.forEach(({ type, color }) => map.set(type, color));
    return map;
  }, [typeInfo]);

  const projectedPins = useMemo(() => {
    if (!data) return [];
    const typeFilter = visibleTypes ? new Set(visibleTypes) : null;
    const { pins, ref } = data;
    const width = size.w;
    const height = size.h;
    const unitFactor = Math.pow(2, z - ref.zBase);

    const worldLeft = viewport.left - OFFSCREEN_BUFFER / scale;
    const worldRight = viewport.left + (width + OFFSCREEN_BUFFER) / scale;
    const worldTop = viewport.top - OFFSCREEN_BUFFER / scale;
    const worldBottom = viewport.top + (height + OFFSCREEN_BUFFER) / scale;

    return pins
      .filter((pin) => {
        if (typeFilter && !typeFilter.has(pin.type)) return false;
        if (pin.minZoom !== undefined && zoom < pin.minZoom) return false;
        if (pin.maxZoom !== undefined && zoom > pin.maxZoom) return false;
        const scaledX = pin.x * unitFactor;
        const scaledY = pin.y * unitFactor;
        if (scaledX < worldLeft || scaledX > worldRight) return false;
        if (scaledY < worldTop || scaledY > worldBottom) return false;
        return true;
      })
      .map<ProjectedPin>((pin) => {
        const scaledX = pin.x * unitFactor;
        const scaledY = pin.y * unitFactor;
        const px = (scaledX - viewport.left) * scale;
        const py = (scaledY - viewport.top) * scale;
        const color = colorByType.get(pin.type) ?? COLOR_PALETTE[0];
        return {
          ...pin,
          px,
          py,
          color,
          world: { x: scaledX, y: scaledY },
        };
      })
      .sort((a, b) => {
        const zA = a.zIndex ?? 0;
        const zB = b.zIndex ?? 0;
        if (zA !== zB) return zA - zB;
        return a.id.localeCompare(b.id);
      });
  }, [data, visibleTypes, zoom, viewport, scale, size, z, colorByType]);

  if (!data || error) {
    return null;
  }

  return (
    <div className={className ? `map-pin-layer ${className}` : "map-pin-layer"}>
      {projectedPins.map((pin) => {
        if (renderPin) {
          const rendered = renderPin(pin);
          return <Fragment key={pin.id}>{rendered}</Fragment>;
        }
        return (
          <Pin
            key={pin.id}
            id={pin.id}
            type={pin.type}
            x={pin.px}
            y={pin.py}
            label={pin.label}
            anchor={pin.anchor}
            color={pin.color}
            onClick={(event) => onPinClick?.(pin, event)}
          />
        );
      })}
    </div>
  );
}

function normalizePinSource(source: PinSourceData): NormalizedData {
  const { ref, pins, icons = {} } = source;
  const normalizedPins = pins.map<NormalizedPin>((pin) => {
    const factor =
      typeof pin.zAt === "number" ? Math.pow(2, ref.zBase - pin.zAt) : 1;
    return {
      ...pin,
      x: pin.x * factor,
      y: pin.y * factor,
      minZoom: pin.minZoom ?? Z_MIN,
      maxZoom: pin.maxZoom ?? Z_MAX,
    };
  });
  return { ref, icons, pins: normalizedPins };
}

export default PinLayer;

