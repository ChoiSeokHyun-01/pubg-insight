import { useEffect, useMemo, useRef, useState } from "react";

// Simple URL helpers (no react-router-dom dependency)
function useLocationParams() {
  const [href, setHref] = useState(() => window.location.href);
  useEffect(() => {
    const onPop = () => setHref(window.location.href);
    window.addEventListener("popstate", onPop);
    window.addEventListener("hashchange", onPop);
    return () => {
      window.removeEventListener("popstate", onPop);
      window.removeEventListener("hashchange", onPop);
    };
  }, []);

  const url = useMemo(() => new URL(href), [href]);
  return url;
}

const TILE = 256; // 256x256 tiles
const Z_MIN = 0;
const Z_MAX = 7;

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Tiles per side follows 2^z (z: 0..7)
const tilesPerSide = (z: number) => 2 ** z;

const tileUrl = (name: string, z: number, x: number, y: number) =>
  `/map/${encodeURIComponent(name)}/${z}/${x}/${y}.png`;

export default function MapPage() {
  const url = useLocationParams();

  // Extract name from pathname: allow formats like /map/<name> or ?name=<name>
  const pathParts = url.pathname.split("/").filter(Boolean);
  const nameFromPath = pathParts[0] === "map" && pathParts[1] ? pathParts[1] : undefined;
  const name = (url.searchParams.get("name") || nameFromPath || "default").trim();

  // Initial state from query params
  const initialZ = clamp(Number(url.searchParams.get("z")) || 1, Z_MIN, Z_MAX);
  const initialCx = Number(url.searchParams.get("cx")) || 256 * initialZ;
  const initialCy = Number(url.searchParams.get("cy")) || 256 * initialZ;

  const [zoom, setZoom] = useState<number>(initialZ);
  const [center, setCenter] = useState<{ x: number; y: number }>({ x: initialCx, y: initialCy });
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [failed, setFailed] = useState<Record<string, boolean>>({});

  // Live refs to avoid re-binding listeners on every state change
  const centerRef = useRef(center);
  const zoomRef = useRef(zoom);
  const zRef = useRef(0);
  const scaleRef = useRef(1);
  const sizeRef = useRef(size);
  useEffect(() => { centerRef.current = center; }, [center]);
  useEffect(() => { zoomRef.current = zoom; }, [zoom]);
  useEffect(() => { sizeRef.current = size; }, [size]);
  // Active pointers and pinch session
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchRef = useRef<{ d0: number; zoom0: number } | null>(null);
  const capturedIdRef = useRef<number | null>(null);

  // Resize observer to track viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const e = entries[0];
      if (e) setSize({ w: e.contentRect.width, h: e.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Stop syncing z/cx/cy to the URL; clean them once on mount if present
  useEffect(() => {
    const u = new URL(window.location.href);
    const before = u.search;
    u.searchParams.delete("z");
    u.searchParams.delete("cx");
    u.searchParams.delete("cy");
    if (u.search !== before) {
      window.history.replaceState({}, "", u.toString());
    }
  }, []);

  // Derived zoom level used for tile selection
  const z = clamp(Math.round(zoom), Z_MIN, Z_MAX);
  const scale = 2 ** (zoom - z);
  useEffect(() => { zRef.current = z; }, [z]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  const n = tilesPerSide(z);

  // Keep center within world bounds
  useEffect(() => {
    // When z (n) or container size changes implicitly, re-clamp center to keep map in view
    const world = TILE * n;
    const scaleNow = scaleRef.current;
    const sizeNow = sizeRef.current;
    setCenter((c) => clampCenterToViewport(c, world, scaleNow, sizeNow));
  }, [n]);

  // Interaction: pan (pointer) and zoom (wheel)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let dragging = false;
    let start = { x: 0, y: 0 };
    let startCenter = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      // Track pointer
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (pointersRef.current.size === 1) {
        // Start panning with a single pointer
        dragging = true;
        start = { x: e.clientX, y: e.clientY };
        startCenter = { ...centerRef.current };
        (el as HTMLElement).style.cursor = "grabbing";
        // Capture only in single-pointer pan
        (el as HTMLElement).setPointerCapture?.(e.pointerId);
        capturedIdRef.current = e.pointerId;
        pinchRef.current = null;
      } else if (pointersRef.current.size === 2) {
        // Start pinch
        dragging = false;
        // Release any previous capture to allow multi-touch to flow
        if (capturedIdRef.current !== null) {
          try {
            (el as HTMLElement).releasePointerCapture?.(capturedIdRef.current);
          } catch (err) {
            void err; // ignore unsupported browsers
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
      // Update tracked pointer position
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // Pinch zoom when two pointers are active
      if (pointersRef.current.size === 2 && pinchRef.current) {
        const elRect = el.getBoundingClientRect();
        const it = Array.from(pointersRef.current.values());
        const midX = (it[0].x + it[1].x) / 2 - elRect.left;
        const midY = (it[0].y + it[1].y) / 2 - elRect.top;
        const dx = it[0].x - it[1].x;
        const dy = it[0].y - it[1].y;
        const d = Math.max(1, Math.hypot(dx, dy));
        const { d0, zoom0 } = pinchRef.current;
        const nextZoom = clamp(zoom0 + Math.log2(d / d0), Z_MIN, Z_MAX);

        const scaleNow = scaleRef.current;
        const sizeNow = sizeRef.current;
        const centerNow = centerRef.current;
        const left = centerNow.x - (sizeNow.w / 2) / scaleNow;
        const top = centerNow.y - (sizeNow.h / 2) / scaleNow;
        const wx = left + midX / scaleNow;
        const wy = top + midY / scaleNow;

        const zNowInt = zRef.current;
        const zNextInt = clamp(Math.round(nextZoom), Z_MIN, Z_MAX);
        const scaleNext = 2 ** (nextZoom - zNextInt);
        const unitFactor = 2 ** (zNextInt - zNowInt);
        const wxNext = wx * unitFactor;
        const wyNext = wy * unitFactor;
        const leftNext = wxNext - midX / scaleNext;
        const topNext = wyNext - midY / scaleNext;
        const cxNext = leftNext + (sizeNow.w / 2) / scaleNext;
        const cyNext = topNext + (sizeNow.h / 2) / scaleNext;
        const worldNext = TILE * tilesPerSide(zNextInt);
        const clamped = clampCenterToViewport({ x: cxNext, y: cyNext }, worldNext, scaleNext, sizeNow);
        setZoom(nextZoom);
        setCenter(clamped);
        return;
      }

      // Single-pointer pan
      if (dragging) {
        const s = scaleRef.current;
        const dx = (e.clientX - start.x) / s;
        const dy = (e.clientY - start.y) / s;
        const zNow = zRef.current;
        const world = TILE * tilesPerSide(zNow);
        const sizeNow = sizeRef.current;
        const next = { x: startCenter.x - dx, y: startCenter.y - dy };
        setCenter(clampCenterToViewport(next, world, s, sizeNow));
      }
    };
    const onPointerUp = (e: PointerEvent) => {
      (e.currentTarget as Element | undefined)?.releasePointerCapture?.(e.pointerId);
      // Remove pointer
      pointersRef.current.delete(e.pointerId);
      if (capturedIdRef.current === e.pointerId) {
        capturedIdRef.current = null;
      }
      pinchRef.current = null;

      if (pointersRef.current.size === 1) {
        // Continue panning with remaining pointer
        const [remId, only] = Array.from(pointersRef.current.entries())[0];
        dragging = true;
        start = { x: only.x, y: only.y };
        startCenter = { ...centerRef.current };
        (el as HTMLElement).style.cursor = "grabbing";
        // Re-capture remaining pointer for stable pan
        try {
          (el as HTMLElement).setPointerCapture?.(remId);
          capturedIdRef.current = remId;
        } catch (err) {
          void err; // ignore unsupported browsers
        }
      } else {
        dragging = false;
        (el as HTMLElement).style.cursor = "grab";
      }
    };
    const onPointerCancel = onPointerUp;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY;
      const zoomNow = zoomRef.current;
      const nextZoom = clamp(zoomNow + (-delta / 500), Z_MIN, Z_MAX);

      // Zoom around the cursor (convert screen to world before/after)
      const rect = el.getBoundingClientRect();
      const px = e.clientX - rect.left;
      const py = e.clientY - rect.top;

      // world coords before zoom (current z units)
      const scaleNow = scaleRef.current;
      const sizeNow = sizeRef.current;
      const centerNow = centerRef.current;
      const left = centerNow.x - (sizeNow.w / 2) / scaleNow;
      const top = centerNow.y - (sizeNow.h / 2) / scaleNow;
      const wx = left + px / scaleNow;
      const wy = top + py / scaleNow;

      const zNowInt = zRef.current;
      const zNextInt = clamp(Math.round(nextZoom), Z_MIN, Z_MAX);
      const scaleNext = 2 ** (nextZoom - zNextInt);

      // convert world point to next z's units to keep cursor-anchored zoom
      const unitFactor = 2 ** (zNextInt - zNowInt);
      const wxNext = wx * unitFactor;
      const wyNext = wy * unitFactor;

      const leftNext = wxNext - px / scaleNext;
      const topNext = wyNext - py / scaleNext;
      const cxNext = leftNext + (sizeNow.w / 2) / scaleNext;
      const cyNext = topNext + (sizeNow.h / 2) / scaleNext;

      const worldNext = TILE * tilesPerSide(zNextInt);
      const clamped = clampCenterToViewport({ x: cxNext, y: cyNext }, worldNext, scaleNext, sizeNow);
      setZoom(nextZoom);
      setCenter(clamped);
    };

    // Block native dragstart early (capture) so it can't steal the stream
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
  }, []);

  const viewport = useMemo(() => {
    const left = center.x - (size.w / 2) / scale;
    const top = center.y - (size.h / 2) / scale;
    const right = center.x + (size.w / 2) / scale;
    const bottom = center.y + (size.h / 2) / scale;
    const buf = 1;
    const x0 = clamp(Math.floor(left / TILE) - buf, 0, tilesPerSide(z) - 1);
    const x1 = clamp(Math.floor(right / TILE) + buf, 0, tilesPerSide(z) - 1);
    const y0 = clamp(Math.floor(top / TILE) - buf, 0, tilesPerSide(z) - 1);
    const y1 = clamp(Math.floor(bottom / TILE) + buf, 0, tilesPerSide(z) - 1);
    return { left, top, x0, x1, y0, y1 };
  }, [center, size, scale, z]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000",
        touchAction: "none",
        cursor: "grab",
        userSelect: "none",
      }}
      onMouseDown={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    >
      {Array.from({ length: viewport.x1 - viewport.x0 + 1 }, (_, ix) => viewport.x0 + ix).map((x) =>
        Array.from({ length: viewport.y1 - viewport.y0 + 1 }, (_, iy) => viewport.y0 + iy).map((y) => {
          const left = (x * TILE - viewport.left) * scale;
          const top = (y * TILE - viewport.top) * scale;
          const sizePx = TILE * scale;
          const key = `${z}-${x}-${y}`;
          const hasFailed = failed[key];
          return (
            <div
              key={key}
              style={{
                position: "absolute",
                left,
                top,
                width: sizePx,
                height: sizePx,
                overflow: "hidden",
              }}
            >
              {hasFailed ? (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#888",
                    background: "#111",
                    border: "1px dashed #333",
                    fontSize: 12,
                    userSelect: "none",
                    pointerEvents: "none",
                  }}
                >
                  {x},{y}
                </div>
              ) : (
                <img
                  src={tileUrl(name, z, x, y)}
                  alt=""
                  style={{
                    width: "100%",
                    height: "100%",
                    imageRendering: "auto",
                    userSelect: "none",
                    pointerEvents: "none",
                    display: "block",
                  }}
                  loading="lazy"
                  draggable={false}
                  onError={() => setFailed((prev) => ({ ...prev, [key]: true }))}
                />
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
  // Helper: clamp center so that the viewport never shows outside the world
  const clampCenterToViewport = (
    c: { x: number; y: number },
    world: number,
    scaleNow: number,
    sizeNow: { w: number; h: number },
  ) => {
    const halfW = sizeNow.w / 2 / scaleNow;
    const halfH = sizeNow.h / 2 / scaleNow;
    // If viewport is larger than world on any axis, lock to middle on that axis
    const minX = halfW;
    const maxX = world - halfW;
    const minY = halfH;
    const maxY = world - halfH;
    const x = minX > maxX ? world / 2 : clamp(c.x, minX, maxX);
    const y = minY > maxY ? world / 2 : clamp(c.y, minY, maxY);
    return { x, y };
  };
