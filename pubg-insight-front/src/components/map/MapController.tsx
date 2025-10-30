import { useCallback, useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useMapView } from "./useMapView";
import type { MapViewContextValue } from "./useMapView";
import { clamp } from "./tiles";

interface PointerPosition {
  x: number;
  y: number;
}

export interface MapControllerProps {
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  onViewChange?: (
    view: Pick<MapViewContextValue, "center" | "zoom" | "z" | "scale" | "size" | "viewport">
  ) => void;
}

export function MapController({ className, style, children, onViewChange }: MapControllerProps) {
  const { zoom, z, scale, center, size, viewport, setView, setSize, minZoom, maxZoom } = useMapView();

  const containerRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);
  const zRef = useRef(z);
  const scaleRef = useRef(scale);
  const sizeRef = useRef(size);

  const pointersRef = useRef<Map<number, PointerPosition>>(new Map());
  const pinchRef = useRef<{ d0: number; zoom0: number } | null>(null);
  const capturedIdRef = useRef<number | null>(null);

  useEffect(() => {
    centerRef.current = center;
  }, [center]);
  useEffect(() => {
    zoomRef.current = zoom;
  }, [zoom]);
  useEffect(() => {
    zRef.current = z;
  }, [z]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    sizeRef.current = size;
  }, [size]);

  useEffect(() => {
    if (!onViewChange) return;
    onViewChange({ center, zoom, z, scale, size, viewport });
  }, [onViewChange, center, zoom, z, scale, size, viewport]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSize({ w: rect.width, h: rect.height });

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === el) {
          const { width, height } = entry.contentRect;
          setSize({ w: width, h: height });
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [setSize]);

  const applyZoomAt = useCallback(
    (px: number, py: number, desiredZoom: number) => {
      const clampedZoom = clamp(desiredZoom, minZoom, maxZoom);
      const sizeNow = sizeRef.current;

      if (sizeNow.w === 0 && sizeNow.h === 0) {
        setView({ zoom: clampedZoom });
        return;
      }

      const scaleNow = scaleRef.current;
      const centerNow = centerRef.current;
      const left = centerNow.x - (sizeNow.w / 2) / scaleNow;
      const top = centerNow.y - (sizeNow.h / 2) / scaleNow;
      const wx = left + px / scaleNow;
      const wy = top + py / scaleNow;

      const zNowInt = zRef.current;
      const zNextInt = clamp(Math.round(clampedZoom), minZoom, maxZoom);
      const scaleNext = 2 ** (clampedZoom - zNextInt);
      const unitFactor = 2 ** (zNextInt - zNowInt);
      const wxNext = wx * unitFactor;
      const wyNext = wy * unitFactor;
      const leftNext = wxNext - px / scaleNext;
      const topNext = wyNext - py / scaleNext;
      const cxNext = leftNext + (sizeNow.w / 2) / scaleNext;
      const cyNext = topNext + (sizeNow.h / 2) / scaleNext;

      setView({ zoom: clampedZoom, center: { x: cxNext, y: cyNext } });
    },
    [minZoom, maxZoom, setView],
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dragging = false;
    let start = { x: 0, y: 0 };
    let startCenter = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 1) {
        dragging = true;
        start = { x: e.clientX, y: e.clientY };
        startCenter = { ...centerRef.current };
        (el as HTMLElement).style.cursor = "grabbing";
        (el as HTMLElement).setPointerCapture?.(e.pointerId);
        capturedIdRef.current = e.pointerId;
        pinchRef.current = null;
      } else if (pointersRef.current.size === 2) {
        dragging = false;
        if (capturedIdRef.current !== null) {
          try {
            (el as HTMLElement).releasePointerCapture?.(capturedIdRef.current);
          } catch (err) {
            void err;
          }
          capturedIdRef.current = null;
        }
        const it = Array.from(pointersRef.current.values());
        const dx = it[0].x - it[1].x;
        const dy = it[0].y - it[1].y;
        const d0 = Math.hypot(dx, dy) || 1;
        pinchRef.current = { d0, zoom0: zoomRef.current };
        (el as HTMLElement).style.cursor = "grab";
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      if (pointersRef.current.size === 2 && pinchRef.current) {
        const rect = el.getBoundingClientRect();
        const it = Array.from(pointersRef.current.values());
        const midX = (it[0].x + it[1].x) / 2 - rect.left;
        const midY = (it[0].y + it[1].y) / 2 - rect.top;
        const dx = it[0].x - it[1].x;
        const dy = it[0].y - it[1].y;
        const distance = Math.max(1, Math.hypot(dx, dy));
        const { d0, zoom0 } = pinchRef.current;
        const nextZoom = zoom0 + Math.log2(distance / d0);
        applyZoomAt(midX, midY, nextZoom);
        return;
      }

      if (dragging) {
        const scaleNow = scaleRef.current;
        const dx = (e.clientX - start.x) / scaleNow;
        const dy = (e.clientY - start.y) / scaleNow;
        const next = { x: startCenter.x - dx, y: startCenter.y - dy };
        setView({ center: next });
      }
    };

    const finishPointer = (e: PointerEvent) => {
      (e.currentTarget as Element | undefined)?.releasePointerCapture?.(e.pointerId);
      pointersRef.current.delete(e.pointerId);
      if (capturedIdRef.current === e.pointerId) {
        capturedIdRef.current = null;
      }
      pinchRef.current = null;

      if (pointersRef.current.size === 1) {
        const [remId, only] = Array.from(pointersRef.current.entries())[0];
        dragging = true;
        start = { x: only.x, y: only.y };
        startCenter = { ...centerRef.current };
        (el as HTMLElement).style.cursor = "grabbing";
        try {
          (el as HTMLElement).setPointerCapture?.(remId);
          capturedIdRef.current = remId;
        } catch (err) {
          void err;
        }
      } else {
        dragging = false;
        (el as HTMLElement).style.cursor = "grab";
      }
    };

    const onPointerUp = finishPointer;
    const onPointerCancel = finishPointer;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      const delta = e.deltaY;
      const zoomNow = zoomRef.current;
      const nextZoom = zoomNow + -delta / 500;
      applyZoomAt(px, py, nextZoom);
    };

    const preventDrag = (ev: DragEvent) => ev.preventDefault();
    const dragOpts: AddEventListenerOptions & EventListenerOptions = { capture: true };
    el.addEventListener("dragstart", preventDrag, dragOpts);
    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerCancel);
    el.addEventListener("pointerleave", onPointerUp);
    el.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      el.removeEventListener("dragstart", preventDrag, dragOpts);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerCancel);
      el.removeEventListener("pointerleave", onPointerUp);
      el.removeEventListener("wheel", onWheel as EventListener);
    };
  }, [applyZoomAt, setView, minZoom, maxZoom]);

  const combinedClassName = className
    ? `map-container ${className}`
    : "map-container";

  return (
    <div
      ref={containerRef}
      className={combinedClassName}
      style={style}
      onMouseDown={(event) => event.preventDefault()}
      onDragStart={(event) => event.preventDefault()}
    >
      {children}
    </div>
  );
}

export default MapController;
