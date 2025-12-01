import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import "../styles/map.css";
import { MapProvider } from "../components/map/MapProvider";
import MapController from "../components/map/MapController";
import MapView from "../components/map/MapView";
import PinLayer, { type PinTypeInfo } from "../components/map/PinLayer";
import { TILE_SIZE, Z_MAX, Z_MIN, clamp, tilesPerSide } from "../components/map/tiles";
import type { MapPoint } from "../components/map/useMapView";

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

  return useMemo(() => new URL(href), [href]);
}

const FRAME_STYLE: CSSProperties = {
  width: "100%",
  height: "100vh",
  overflow: "hidden",
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "#050505",
  boxShadow: "0 20px 45px rgba(0, 0, 0, 0.35)",
  position: "fixed",
  top: "0",
  left: "0",
};

const CONTROLLER_STYLE: CSSProperties = {
  width: "100%",              
  height: "100%",
};

function resolveInitialCenter(zoom: number, explicitX?: number, explicitY?: number): MapPoint {
  const integerZ = clamp(Math.round(zoom), Z_MIN, Z_MAX);
  const world = TILE_SIZE * tilesPerSide(integerZ);
  const fallback = world / 2;
  return {
    x: Number.isFinite(explicitX ?? NaN) ? (explicitX as number) : fallback,
    y: Number.isFinite(explicitY ?? NaN) ? (explicitY as number) : fallback,
  };
}

export default function MapFramePage() {
  const url = useLocationParams();
  const [pinTypes, setPinTypes] = useState<PinTypeInfo[]>([]);
  const [typeVisibility, setTypeVisibility] = useState<Record<string, boolean>>({});
  const [filterOpen, setFilterOpen] = useState<boolean>(true);

  const pathParts = url.pathname.split("/").filter(Boolean);
  const nameFromPath = pathParts[0] === "map" && pathParts[1] ? pathParts[1] : undefined;
  const name = (url.searchParams.get("name") || nameFromPath || "default").trim();

  const zoomParam = Number(url.searchParams.get("zoom"));
  const zParamFallback = Number(url.searchParams.get("z"));
  const initialZoom = clamp(
    Number.isFinite(zoomParam) ? zoomParam : zParamFallback || 1,
    Z_MIN,
    Z_MAX,
  );

  const initialCenter = resolveInitialCenter(
    initialZoom,
    Number(url.searchParams.get("cx")) || undefined,
    Number(url.searchParams.get("cy")) || undefined,
  );

  useEffect(() => {
    const u = new URL(window.location.href);
    const before = u.search;
    u.searchParams.delete("zoom");
    u.searchParams.delete("z");
    u.searchParams.delete("cx");
    u.searchParams.delete("cy");
    if (u.search !== before) {
      window.history.replaceState({}, "", u.toString());
    }
  }, []);

  const handleTypesChange = useCallback((types: PinTypeInfo[]) => {
    setPinTypes(types);
    setTypeVisibility((prev) => {
      const next: Record<string, boolean> = {};
      types.forEach(({ type }) => {
        next[type] = prev[type] ?? true;
      });
      return next;
    });
  }, []);

  const toggleType = useCallback((type: string) => {
    setTypeVisibility((prev) => {
      const current = prev[type] ?? true;
      return { ...prev, [type]: !current };
    });
  }, []);

  const setAllTypes = useCallback((value: boolean) => {
    setTypeVisibility(() => {
      const next: Record<string, boolean> = {};
      pinTypes.forEach(({ type }) => {
        next[type] = value;
      });
      return next;
    });
  }, [pinTypes]);

  const visibleTypes = useMemo(() => {
    if (pinTypes.length === 0) return undefined;
    const selected = pinTypes.filter(({ type }) => typeVisibility[type] ?? true);
    if (selected.length === pinTypes.length) return undefined;
    return selected.map(({ type }) => type);
  }, [pinTypes, typeVisibility]);

  return (
    <MapProvider name={name} initialZoom={initialZoom} initialCenter={initialCenter}>
      <div style={FRAME_STYLE}>
        <MapController style={CONTROLLER_STYLE}>
          <MapView />
          <PinLayer
            source={`/PUBG/map/${name}/layers.json`}
            visibleTypes={visibleTypes}
            onTypesChange={handleTypesChange}
          />
        </MapController>
        {pinTypes.length > 0 ? (
          <div className={`map-type-filter${filterOpen ? "" : " map-type-filter--collapsed"}`}>
            <div className="map-type-filter-header">
              <span className="map-type-filter-title">핀 필터</span>
              <div className="map-type-filter-actions">
                <button type="button" onClick={() => setFilterOpen((v) => !v)}>
                  {filterOpen ? "접기" : "펼치기"}
                </button>
                <button type="button" onClick={() => setAllTypes(true)}>
                  전체
                </button>
                <button type="button" onClick={() => setAllTypes(false)}>
                  없음
                </button>
              </div>
            </div>
            {filterOpen && (
              <ul className="map-type-filter-list">
                {pinTypes.map(({ type, color, count }) => {
                  const checked = typeVisibility[type] ?? true;
                  return (
                    <li key={type}>
                      <label className="map-type-filter-item">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleType(type)}
                        />
                        <span
                          className="map-type-filter-color"
                          style={{ backgroundColor: color }}
                        />
                        <span className="map-type-filter-label">{type}</span>
                        <span className="map-type-filter-count">{count}</span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </MapProvider>
  );
}
