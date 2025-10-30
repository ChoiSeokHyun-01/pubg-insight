import { useContext } from "react";
import {
  MapViewContext,
  type MapPoint,
  type MapSize,
  type MapViewport,
  type MapViewContextValue,
} from "./mapViewContext";

export function useMapView(): MapViewContextValue {
  const ctx = useContext(MapViewContext);
  if (!ctx) {
    throw new Error("useMapView must be used within a MapProvider");
  }
  return ctx;
}

export type { MapPoint, MapSize, MapViewport, MapViewContextValue };

