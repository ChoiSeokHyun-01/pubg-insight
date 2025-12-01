import { useEffect, useRef, useState } from "react";
import "../styles/pin-editor.css";

type Pin = {
    id: string;
    type: string;
    x: number; // px relative to image natural width
    y: number; // px relative to image natural height
};

const DEFAULT_WORLD_SIZE = 16384;
const DEFAULT_TILE_SIZE = 256;

export default function PinEditorPage() {
    const [bgUrl, setBgUrl] = useState<string>("/PUBG/map/erangel/0/0.png");
    const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 750, h: 740 });
    const [pins, setPins] = useState<Pin[]>([]);
    const [pinType, setPinType] = useState<string>("비밀의 방");
    const [worldSize, setWorldSize] = useState<number>(DEFAULT_WORLD_SIZE);
    const [scale, setScale] = useState<number>(1);
    const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const panStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
    const [hideHeader, setHideHeader] = useState<boolean>(false);
    const mapRef = useRef<HTMLDivElement | null>(null);
    const draggingId = useRef<string | null>(null);
    const draggingMove = useRef<boolean>(false);
    const suppressClick = useRef<boolean>(false);

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

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (isPanning && panStart.current) {
                const dx = e.clientX - panStart.current.x;
                const dy = e.clientY - panStart.current.y;
                setOffset({ x: panStart.current.ox + dx, y: panStart.current.oy + dy });
                return;
            }
            if (!draggingId.current || !mapRef.current) return;
            draggingMove.current = true;
            const rect = mapRef.current.getBoundingClientRect();
            const x = Math.max(0, Math.min((e.clientX - rect.left - offset.x) / scale, rect.width / scale));
            const y = Math.max(0, Math.min((e.clientY - rect.top - offset.y) / scale, rect.height / scale));
            setPins((prev) =>
                prev.map((p) =>
                    p.id === draggingId.current
                        ? {
                              ...p,
                              x: (x / rect.width) * naturalSize.w,
                              y: (y / rect.height) * naturalSize.h,
                          }
                        : p,
                ),
            );
        };
        const upHandler = () => {
            if (draggingMove.current) {
                suppressClick.current = true;
            }
            if (isPanning) {
                suppressClick.current = true;
            }
            draggingMove.current = false;
            draggingId.current = null;
            setIsPanning(false);
            panStart.current = null;
        };
        window.addEventListener("mousemove", handler);
        window.addEventListener("mouseup", upHandler);
        return () => {
            window.removeEventListener("mousemove", handler);
            window.removeEventListener("mouseup", upHandler);
        };
    }, [naturalSize, isPanning, offset, scale]);

    const addPin = (e: React.MouseEvent) => {
        if (!mapRef.current) return;
        if (suppressClick.current) {
            suppressClick.current = false;
            return;
        }
        const rect = mapRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min((e.clientX - rect.left - offset.x) / scale, rect.width / scale));
        const y = Math.max(0, Math.min((e.clientY - rect.top - offset.y) / scale, rect.height / scale));
        const px = (x / rect.width) * naturalSize.w;
        const py = (y / rect.height) * naturalSize.h;
        const id = `pin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        setPins((prev) => [...prev, { id, type: pinType, x: px, y: py }]);
    };

    const startDrag = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        draggingId.current = id;
    };

    const removePin = (id: string) => {
        setPins((prev) => prev.filter((p) => p.id !== id));
    };

    const downloadJson = () => {
        const pinsJson = pins.map((p, idx) => ({
            id: p.id || `pin-${idx}`,
            type: p.type,
            x: Math.round((p.x / naturalSize.w) * worldSize),
            y: Math.round((p.y / naturalSize.h) * worldSize),
            label: p.type,
            anchor: "bottom",
        }));
        const json = JSON.stringify(
            {
                version: "1",
                map: "custom",
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

    return (
        <main className={`pin-editor${hideHeader ? " pin-editor--fullscreen" : ""}`}>
            <div className="pin-editor__panel">
                <div className="pin-editor__field">
                    <label>배경 이미지 URL</label>
                    <input
                        type="text"
                        value={bgUrl}
                        onChange={(e) => setBgUrl(e.target.value)}
                        placeholder="/PUBG/map/erangel/0/0.png"
                    />
                </div>
                <div className="pin-editor__field pin-editor__field--inline">
                    <label>핀 타입</label>
                    <input type="text" value={pinType} onChange={(e) => setPinType(e.target.value)} />
                </div>
                <div className="pin-editor__field pin-editor__field--inline">
                    <label>월드 크기</label>
                    <input
                        type="number"
                        min={1}
                        value={worldSize}
                        onChange={(e) => setWorldSize(Number(e.target.value) || DEFAULT_WORLD_SIZE)}
                    />
                </div>
                <div className="pin-editor__actions">
                    <button type="button" onClick={() => setPins([])}>
                        모두 삭제
                    </button>
                    <button type="button" onClick={() => setHideHeader((v) => !v)}>
                        헤더 {hideHeader ? "표시" : "숨기기"}
                    </button>
                    <button type="button" onClick={() => setScale((s) => Math.min(3, s + 0.1))}>확대 +</button>
                    <button type="button" onClick={() => setScale((s) => Math.max(0.2, s - 0.1))}>축소 -</button>
                    <button type="button" onClick={downloadJson}>
                        layers.json 다운로드
                    </button>
                </div>
                <div className="pin-editor__list">
                    {pins.map((p) => (
                        <div key={p.id} className="pin-editor__row">
                            <span>{p.type}</span>
                            <span>
                                x:{Math.round((p.x / naturalSize.w) * worldSize)} / y:
                                {Math.round((p.y / naturalSize.h) * worldSize)}
                            </span>
                            <button onClick={() => removePin(p.id)}>삭제</button>
                        </div>
                    ))}
                </div>
            </div>
            <div
                className="pin-editor__canvas"
                ref={mapRef}
                onClick={(e) => {
                    if (e.ctrlKey) return; // ctrl+click은 삭제용으로 예약
                    addPin(e);
                }}
                onWheel={(e) => {
                    e.preventDefault();
                    if (!mapRef.current) return;
                    const rect = mapRef.current.getBoundingClientRect();
                    const worldNormX = (e.clientX - rect.left - offset.x) / (scale * rect.width);
                    const worldNormY = (e.clientY - rect.top - offset.y) / (scale * rect.height);
                    const delta = e.deltaY > 0 ? -0.1 : 0.1;
                    const nextScale = Math.min(3, Math.max(0.2, scale + delta));
                    const nextOffsetX = e.clientX - rect.left - worldNormX * nextScale * rect.width;
                    const nextOffsetY = e.clientY - rect.top - worldNormY * nextScale * rect.height;
                    setScale(nextScale);
                    setOffset({ x: nextOffsetX, y: nextOffsetY });
                }}
                onMouseDown={(e) => {
                    if (e.button === 2) {
                        e.preventDefault();
                        setIsPanning(true);
                        panStart.current = { x: e.clientX, y: e.clientY, ox: offset.x, oy: offset.y };
                    }
                }}
                onContextMenu={(e) => e.preventDefault()}
                onMouseLeave={() => {
                    setIsPanning(false);
                    panStart.current = null;
                }}
            >
                <div
                    className="pin-editor__canvas-inner"
                    style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`, transformOrigin: "0 0" }}
                >
                    <img
                        src={bgUrl}
                        alt="map"
                        className="pin-editor__img"
                        draggable={false}
                        onLoad={(e) =>
                            setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })
                        }
                    />
                    {pins.map((p) => {
                        const left = (p.x / naturalSize.w) * 100;
                        const top = (p.y / naturalSize.h) * 100;
                        return (
                            <div
                                key={p.id}
                                className="pin-editor__pin"
                                style={{ left: `${left}%`, top: `${top}%` }}
                                onMouseDown={(e) => startDrag(p.id, e)}
                                onClick={(e) => {
                                    if (e.ctrlKey) {
                                        e.stopPropagation();
                                        removePin(p.id);
                                    }
                                }}
                                title={`${p.type}`}
                            />
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
