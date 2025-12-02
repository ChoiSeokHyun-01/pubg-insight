"""
PUBG vehicle spawn aggregator.

Reads match included.json from S3, follows telemetry URL, aggregates early vehicle ride
locations, and merges counts into map/<MapName>/layers.json for the viewer.

External deps: boto3, requests. Everything else is stdlib.

python main.py --platforms steam kakao --max-seconds 120 --cell-size 64
"""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
import os
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple
from datetime import datetime, timezone

import boto3
import requests

BUCKET = "pubginfohub-match-record-bucket"
WORLD_SIZE = 16384
CELL_SIZE_DEFAULT = 32
DEFAULT_TILE_SIZE = 256

MAP_ALIAS = {
    "Erangel_Main": "erangel",
    "Baltic_Main": "erangel",
    "Desert_Main": "miramar",
    "Savage_Main": "sanhok",
    "Vikendi_Main": "vikendi",
    "Tiger_Main": "taego",
    "Kiki_Main": "deston",
    "Chimera_Main": "paramo",
    "Summerland_Main": "karakin",
    "Neon_Main": "rondo",
    "Heaven_Main": "haven",
    "Range_Main": "camp jackal",
}

MAP_MAX = {
    "Erangel_Main": 816000,
    "Baltic_Main": 816000,
    "Desert_Main": 816000,
    "Savage_Main": 408000,      # 4x4
    "Vikendi_Main": 816000,
    "Tiger_Main": 816000,
    "Kiki_Main": 816000,
    "Chimera_Main": 307200,     # Paramo 3x3 (3km * 102400)
    "Summerland_Main": 204800,  # Karakin 2x2 (2km * 102400)
    "Neon_Main": 816000,
    "Heaven_Main": 816000,      # Haven은 소형 맵이나 기본 좌표를 8km 맵으로 간주
    "Range_Main": 816000,       # Camp Jackal: 원본은 소형 훈련장, 필요 시 별도 값 조정
}

ICONS = {
    "차량": "/icons/vehicle-ground.png",
    "글라이더": "/icons/vehicle-glider.png",
    "보트": "/icons/vehicle-boat.png",
}


def load_json(path: Path, default: Any) -> Any:
    if not path.exists():
        return default
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        print(f"[WARN] Failed to read {path}: {e}")
        return default


def save_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def load_env(path: Path) -> None:
    """
    Minimal .env loader (KEY=VALUE per line, # comment supported).
    Does not override existing env vars.
    """
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        os.environ.setdefault(key, value)


def load_completion_list(base: Path, platform: str) -> Dict[str, List[str]]:
    """Load completion_list.json for a platform."""
    path = base / platform / "completion_list.json"
    return load_json(path, {"completed": []})


def save_completion_list(base: Path, platform: str, data: Dict[str, List[str]]) -> None:
    """Persist completion_list.json."""
    path = base / platform / "completion_list.json"
    save_json(path, data)


def list_included_keys_from_s3(s3_client, platform: str) -> Iterable[str]:
    """Yield S3 object keys that are included.json for the platform."""
    prefix = f"matches/{platform}/"
    paginator = s3_client.get_paginator("list_objects_v2")
    for page in paginator.paginate(Bucket=BUCKET, Prefix=prefix):
        for obj in page.get("Contents", []):
            key = obj["Key"]
            if key.endswith("included.json"):
                yield key


def download_included_from_s3(s3_client, key: str) -> List[dict] | None:
    """Download and parse included.json from S3."""
    try:
        resp = s3_client.get_object(Bucket=BUCKET, Key=key)
        body = resp["Body"].read()
        return json.loads(body)
    except Exception as e:  # noqa: BLE001
        print(f"[WARN] Failed to download {key}: {e}")
        return None


def extract_telemetry_url_from_included(included: List[dict]) -> str | None:
    """Find telemetry asset URL in included array."""
    for item in included:
        if item.get("type") == "asset":
            attr = item.get("attributes") or {}
            if attr.get("name") == "telemetry":
                return attr.get("URL")
    return None


def download_telemetry(url: str) -> List[dict] | None:
    """Download telemetry JSON from URL."""
    try:
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        return resp.json()
    except Exception as e:  # noqa: BLE001
        print(f"[WARN] Failed to download telemetry {url}: {e}")
        return None


def extract_map_name_from_telemetry(events: List[dict]) -> str | None:
    """Return mapName from LogMatchStart."""
    for ev in events:
        if ev.get("_T") == "LogMatchStart":
            return ev.get("mapName")
    return None


def parse_iso_ts(ts: str) -> datetime | None:
    """Parse PUBG telemetry timestamp (_D)."""
    try:
        if ts.endswith("Z"):
            ts = ts[:-1] + "+00:00"
        return datetime.fromisoformat(ts).astimezone(timezone.utc)
    except Exception:
        return None


def classify_vehicle_category(vehicle: dict) -> str:
    """
    Categorize vehicle into 차량/보트/글라이더.
    통계는 Floating Vehicle(해상), Flying Vehicle(공중), Wheeled Vehicle(지상)만 포함.
    나머지(Emergency Pickup, Mortar, Transport Aircraft, rubberboat 등)는 무시.
    """
    vtype = (vehicle.get("vehicleType") or "").lower()
    if not vtype:
        return None  # skip unknown
    # 제외 목록
    if "transportaircraft" in vtype or "aircraft" in vtype:
        return None
    if "emergency" in vtype:
        return None
    if "mortar" in vtype:
        return None
    if "rubberboat" in vtype:
        return None

    # 허용된 타입만 집계
    if "floating vehicle" in vtype or "floating" in vtype:
        return "보트"
    if "flying vehicle" in vtype or "flying" in vtype or "glider" in vtype or "plane" in vtype:
        return "글라이더"
    if "wheeled vehicle" in vtype or "wheeled" in vtype:
        return "차량"
    return None  # 모호한 타입은 건너뛴다


def world_to_viewer(x_cm: float, y_cm: float, map_name: str) -> Tuple[int, int]:
    """Convert PUBG world coords(cm) to viewer coords (0~WORLD_SIZE)."""
    max_coord = MAP_MAX[map_name]
    scale = WORLD_SIZE / max_coord
    return int(x_cm * scale), int(y_cm * scale)


def snap_to_grid(x: int, y: int, cell_size: int) -> Tuple[int, int]:
    """Snap coordinates to grid."""
    return round(x / cell_size) * cell_size, round(y / cell_size) * cell_size


def collect_vehicle_spawns_from_telemetry(
    events: List[dict],
    max_seconds: float,
    cell_size: int,
    vehicle_types: set[str],
) -> Tuple[str, Dict[Tuple[str, int, int], int]]:
    """
    Parse telemetry and return (map_display_name, counts dict).

    counts key: (category, x, y) with snapped viewer coords.
    """
    map_name = extract_map_name_from_telemetry(events)
    if not map_name or map_name not in MAP_ALIAS:
        raise ValueError("Unsupported or missing mapName")

    match_start_ts = None
    for ev in events:
        if ev.get("_T") == "LogMatchStart" and "_D" in ev:
            match_start_ts = parse_iso_ts(ev["_D"])
            break

    rides = [ev for ev in events if ev.get("_T") == "LogVehicleRide"]

    def compute_elapsed(ev: dict) -> float:
        common = ev.get("common") or {}
        if "elapsedTime" in common and common["elapsedTime"] is not None:
            return float(common["elapsedTime"])
        if match_start_ts and "_D" in ev:
            ts = parse_iso_ts(ev["_D"])
            if ts:
                return (ts - match_start_ts).total_seconds()
        return 1e9

    rides.sort(key=compute_elapsed)

    seen_account: set[str] = set()
    counts: Dict[Tuple[str, int, int], int] = defaultdict(int)

    for ev in rides:
        elapsed = compute_elapsed(ev)
        if elapsed > max_seconds:
            continue
        char = ev.get("character") or {}
        acc = char.get("accountId")
        if not acc or acc in seen_account:
            continue
        loc = char.get("location") or {}
        vx = loc.get("x")
        vy = loc.get("y")
        if vx is None or vy is None:
            continue
        vehicle = ev.get("vehicle") or {}
        vtype_raw = vehicle.get("vehicleType") or ""
        vehicle_types.add(vtype_raw)
        category = classify_vehicle_category(vehicle)
        if category is None:
            continue
        # only driver seat (seatIndex == 0). Default to 0 if missing.
        seat_idx = (
            ev.get("seatIndex")
            if "seatIndex" in ev
            else (ev.get("ride") or {}).get("seatIndex")
            if isinstance(ev.get("ride"), dict)
            else vehicle.get("seatIndex")
        )
        if seat_idx is None:
            seat_idx = 0
        try:
            seat_idx_int = int(seat_idx)
        except Exception:
            seat_idx_int = 0
        if seat_idx_int != 0:
            continue
        seen_account.add(acc)
        x_view, y_view = world_to_viewer(vx, vy, map_name)
        sx, sy = snap_to_grid(x_view, y_view, cell_size)
        counts[(category, sx, sy)] += 1

    return MAP_ALIAS[map_name], counts


def load_layers(map_dir: Path, map_display: str) -> dict:
    """Load existing layers.json or create new."""
    path = map_dir / map_display / "layers.json"
    if path.exists():
        return load_json(path, {})
    return {
        "version": "1",
        "map": map_display,
        "ref": {"zBase": 6, "worldSize": WORLD_SIZE, "tileSize": DEFAULT_TILE_SIZE},
        "icons": ICONS,
        "pins": [],
        "meta": {"matches": 0},
    }


def merge_counts_to_layers(
    layers: dict, map_display: str, counts: Dict[Tuple[str, int, int], int], match_increment: int = 1
) -> dict:
    """Merge aggregated counts into layers dict and bump match counter."""
    pins = {(p["type"], p["x"], p["y"]): p for p in layers.get("pins", [])}
    for (category, x, y), cnt in counts.items():
        key = (category, x, y)
        if key in pins:
            pins[key]["count"] = pins[key].get("count", 0) + cnt
        else:
            pins[key] = {
                "id": f"{map_display}-{category}-{x}-{y}",
                "type": category,
                "x": x,
                "y": y,
                "label": category,
                "anchor": "bottom",
                "count": cnt,
            }
    layers["pins"] = list(pins.values())
    layers.setdefault("icons", ICONS)
    layers.setdefault("ref", {"zBase": 6, "worldSize": WORLD_SIZE, "tileSize": DEFAULT_TILE_SIZE})
    meta = layers.get("meta") or {}
    meta["matches"] = int(meta.get("matches", 0)) + match_increment
    layers["meta"] = meta
    layers["map"] = map_display
    layers["version"] = layers.get("version", "1")
    return layers


def process_match(
    s3_client,
    match_key: str,
    platform: str,
    matches_dir: Path,
    maps_dir: Path,
    max_seconds: float,
    cell_size: int,
    vehicle_types: set[str],
) -> str | None:
    """Process single match; return matchId if completed, else None."""
    match_id = match_key.split("/")[-2]
    included = download_included_from_s3(s3_client, match_key)
    if not included:
        return None
    telemetry_url = extract_telemetry_url_from_included(included)
    if not telemetry_url:
        print(f"[WARN] No telemetry asset in {match_id}")
        return None
    telemetry = download_telemetry(telemetry_url)
    if not telemetry:
        return None
    try:
        map_display, counts = collect_vehicle_spawns_from_telemetry(telemetry, max_seconds, cell_size, vehicle_types)
    except Exception as e:  # noqa: BLE001
        print(f"[WARN] Skip match {match_id}: {e}")
        return None

    layers = load_layers(maps_dir, map_display)
    layers = merge_counts_to_layers(layers, map_display, counts, match_increment=1)
    save_json(maps_dir / map_display / "layers.json", layers)
    print(f"[INFO] Updated layers for {map_display} with {len(counts)} cells (match {match_id})")
    return match_id


def main() -> None:
    parser = argparse.ArgumentParser(description="PUBG vehicle spawn aggregator (telemetry to layers.json)")
    parser.add_argument("--platforms", nargs="+", default=["steam", "kakao"], help="platform list (default: steam kakao)")
    parser.add_argument("--max-seconds", type=float, default=180.0, help="max elapsedTime for first ride")
    parser.add_argument("--cell-size", type=int, default=CELL_SIZE_DEFAULT, help="grid snap cell size")
    args = parser.parse_args()

    # Load .env if present (does not override existing environment)
    load_env(Path(__file__).resolve().parent.parent / ".env")

    s3 = boto3.client("s3")
    matches_dir = Path("matches")
    maps_dir = Path("map")
    vehicle_types: set[str] = set()

    for platform in args.platforms:
        completed_data = load_completion_list(matches_dir, platform)
        completed = set(completed_data.get("completed", []))
        keys = list(list_included_keys_from_s3(s3, platform))
        print(f"[INFO] {platform}: found {len(keys)} included.json objects")
        updated = False
        for key in keys:
            match_id = key.split("/")[-2]
            if match_id in completed:
                continue
            done = process_match(
                s3,
                key,
                platform,
                matches_dir,
                maps_dir,
                args.max_seconds,
                args.cell_size,
                vehicle_types,
            )
            if done:
                completed.add(done)
                updated = True
                completed_data["completed"] = sorted(completed)
                save_completion_list(matches_dir, platform, completed_data)
        if not updated:
            print(f"[INFO] {platform}: no new matches processed")

    if vehicle_types:
        print("[INFO] Observed vehicleType values:")
        for v in sorted(vehicle_types):
            print(f"  - {v}")


if __name__ == "__main__":
    main()
