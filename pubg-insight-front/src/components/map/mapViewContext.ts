import { createContext } from "react";

export interface MapPoint {
  x: number;
  y: number;
}

export interface MapSize {
  w: number;
  h: number;
}

export interface MapViewport {
  left: number;
  top: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

export interface MapViewContextValue {
  name: string;
  zoom: number;
  z: number;
  scale: number;
  center: MapPoint;
  size: MapSize;
  viewport: MapViewport;
  worldSize: number;
  minZoom: number;
  maxZoom: number;
  setView: (view: { zoom?: number; center?: MapPoint }) => void;
  setZoom: (zoom: number) => void;
  setCenter: (center: MapPoint) => void;
  setSize: (size: MapSize) => void;
}

export const MapViewContext = createContext<MapViewContextValue | null>(null);

