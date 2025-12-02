import { useEffect, useMemo, useRef, useState } from "react";
import MapProvider from "../components/map/MapProvider";
import MapController from "../components/map/MapController";
import MapView from "../components/map/MapView";
import { useMapView } from "../components/map/useMapView";
import "../styles/pin-editor.css";

type Pin = {
    id: string;
    type: string;
    x: number; // world coordinate (0~worldSize)
    y: number;
};

const DEFAULT_TILE_SIZE = 256;

function PinOverlay({
    pins,
    setPins,
    pinType,
}: {
    pins: Pin[];
    setPins: (fn: (prev: Pin[]) => Pin[]) => void;
    pinType: string;
}) {
    const { viewport, scale, worldSize, setZoom, setCenter, size, zoom } = useMapView();
    const overlayRef = useRef<HTMLDivElement | null>(null);
    const draggingId = useRef<string | null>(null);

    const clampWorld = (v: number) => Math.max(0, Math.min(worldSize, v));

    const screenToWorld = (clientX: number, clientY: number) => {
        if (!overlayRef.current) return null;
        const rect = overlayRef.current.getBoundingClientRect();
        const px = clientX - rect.left;
        const py = clientY - rect.top;
        const wx = viewport.left + px / scale;
        const wy = viewport.top + py / scale;
        return { x: clampWorld(wx), y: clampWorld(wy) };
    };

    const addPinAt = (clientX: number, clientY: number) => {
        const w = screenToWorld(clientX, clientY);
        if (!w) return;
        setPins((prev) => [
            ...prev,
            {
                id: `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
                type: pinType,
                x: w.x,
                y: w.y,
            },
        ]);
    };

    const startDrag = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        draggingId.current = id;
        window.addEventListener("mousemove", onMove);
        window.addEventListener("mouseup", onUp);
    };

    const onMove = (e: MouseEvent) => {
        if (!draggingId.current) return;
        const w = screenToWorld(e.clientX, e.clientY);
        if (!w) return;
        setPins((prev) =>
            prev.map((p) => (p.id === draggingId.current ? { ...p, x: w.x, y: w.y } : p)),
        );
    };

    const onUp = () => {
        draggingId.current = null;
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
    };

    useEffect(() => {
        return () => {
            window.removeEventListener("mousemove", onMove);
            window.removeEventListener("mouseup", onUp);
        };
    }, []);

    const toScreen = (pin: Pin) => {
        const sx = (pin.x - viewport.left) * scale;
        const sy = (pin.y - viewport.top) * scale;
        return { sx, sy };
    };

    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        if (!overlayRef.current) return;
        const rect = overlayRef.current.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const delta = -e.deltaY / 500;
        setZoom(zoom + delta);
        // center stays consistent due to MapController logic; optionally recentre here if needed
    };

    const handleContextPan = (e: React.MouseEvent) => {
        if (e.button !== 2) return;
        e.preventDefault();
        const rect = overlayRef.current?.getBoundingClientRect();
        if (!rect) return;
        const startX = e.clientX;
        const startY = e.clientY;
        const startCenter = { ...useMapView().center }; // not ideal to call hook; avoid
    };

    const handlePinClick = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (e.ctrlKey) {
            setPins((prev) => prev.filter((p) => p.id !== id));
        }
    };

    return (
        <div
            ref={overlayRef}
            className="pin-editor__overlay"
            onWheel={handleWheel}
            onContextMenu={(e) => e.preventDefault()}
            onPointerDownCapture={(e) => {
                // 좌클릭으로 빈 공간에 핀 추가. 캡처 단계에서 컨트롤러로 전달되지 않도록 중단.
                if (e.button === 0 && !e.ctrlKey) {
                    e.stopPropagation();
                    e.preventDefault();
                    addPinAt(e.clientX, e.clientY);
                }
            }}
        >
            {pins.map((p) => {
                const { sx, sy } = toScreen(p);
                // skip rendering if far outside viewport for perf
                if (sx < -50 || sy < -50 || sx > size.w + 50 || sy > size.h + 50) return null;
                return (
                    <div
                        key={p.id}
                        className="pin-editor__pin"
                        style={{ left: `${sx}px`, top: `${sy}px` }}
                        onMouseDown={(e) => startDrag(p.id, e)}
                        onClick={(e) => handlePinClick(p.id, e)}
                        title={`${p.type}`}
                    />
                );
            })}
        </div>
    );
}

export default function PinEditorPage() {
    const [mapName, setMapName] = useState<string>("erangel");
    const [pins, setPins] = useState<Pin[]>([]);
    const [pinType, setPinType] = useState<string>("비밀의 방");
    const [hideHeader, setHideHeader] = useState<boolean>(false);

    useEffect(() => {
        if (hideHeader) {
            document.body.classList.add("pin-editor-hide-header");
        } else {
            document.body.classList.remove("pin-editor-hide-header");
        }
        return () => {
            document.body.classList.remove("pin-editor-hide-header");
        };
    }, [hideHeader]);

    const downloadJson = (worldSize: number) => {
        const pinsJson = pins.map((p, idx) => ({
            id: p.id || `pin-${idx}`,
            type: p.type,
            x: Math.round(p.x),
            y: Math.round(p.y),
            label: p.type,
            anchor: "bottom",
        }));
        const json = JSON.stringify(
            {
                version: "1",
                map: mapName,
                ref: { zBase: 6, worldSize, tileSize: DEFAULT_TILE_SIZE },
                icons: { [pinType]: "/icons/secret-room.png" },
                pins: pinsJson,
            },
            null,
            2,
        );
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "layers.json";
        a.click();
        URL.revokeObjectURL(url);
    };

    const worldSizeForDownload = useMemo(() => {
        // best-effort: use erangel size 16384 default
        return 16384;
    }, []);

    return (
        <main className={`pin-editor${hideHeader ? " pin-editor--fullscreen" : ""}`}>
            <div className="pin-editor__panel">
                <div className="pin-editor__field">
                    <label>맵 이름</label>
                    <input type="text" value={mapName} onChange={(e) => setMapName(e.target.value)} />
                </div>
                <div className="pin-editor__field pin-editor__field--inline">
                    <label>핀 타입</label>
                    <input type="text" value={pinType} onChange={(e) => setPinType(e.target.value)} />
                </div>
                <div className="pin-editor__actions">
                    <button type="button" onClick={() => setPins([])}>
                        모두 삭제
                    </button>
                    <button type="button" onClick={() => setHideHeader((v) => !v)}>
                        헤더 {hideHeader ? "표시" : "숨기기"}
                    </button>
                    <button type="button" onClick={() => downloadJson(worldSizeForDownload)}>
                        layers.json 다운로드
                    </button>
                </div>
                <div className="pin-editor__list">
                    {pins.map((p) => (
                        <div key={p.id} className="pin-editor__row">
                            <span>{p.type}</span>
                            <span>
                                x:{Math.round(p.x)} / y:{Math.round(p.y)}
                            </span>
                            <button onClick={() => setPins((prev) => prev.filter((x) => x.id !== p.id))}>삭제</button>
                        </div>
                    ))}
                </div>
            </div>

            <MapProvider name={mapName} initialZoom={2}>
                <MapController className="pin-editor__map-controller">
                    <MapView />
                    <PinOverlay pins={pins} setPins={setPins} pinType={pinType} />
                </MapController>
            </MapProvider>
        </main>
    );
}
