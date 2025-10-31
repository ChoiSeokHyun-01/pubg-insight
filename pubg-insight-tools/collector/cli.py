"""
PUBG Insight 수집기 CLI
- 플레이어 이름으로 PUBG API를 호출해 최근 매치 정보를 수집합니다.
- 결과는 JSONL 형식으로 저장합니다(한 줄 = 한 매치).
- API 키는 --api-key 인자 또는 환경변수 PUBG_API_KEY(.env 자동 로드)로 제공합니다.
"""

import argparse
import json
import os
from pathlib import Path
from typing import List, Optional

from pubg_api import PubgClient


def parse_args() -> argparse.Namespace:
    """명령행 인자를 정의/파싱합니다."""
    p = argparse.ArgumentParser(description="Fetch PUBG recent matches for players and save as JSONL")
    names = p.add_mutually_exclusive_group(required=True)
    names.add_argument("--player", help="Single player name")
    names.add_argument("--players", help="Comma-separated player names")

    p.add_argument("--shard", default="steam", choices=["steam", "kakao", "xbox", "psn", "stadia"], help="PUBG shard")
    p.add_argument("--api-key", default=None, help="PUBG API key (or set env PUBG_API_KEY)")
    p.add_argument("--max-matches", type=int, default=10, help="Max matches per player to fetch")
    p.add_argument("--out", type=Path, default=Path(__file__).parent / "out", help="Output directory for JSONL files")
    p.add_argument("--layout", choices=["jsonl", "tree"], default="tree", help="Output layout: jsonl or tree")
    p.add_argument("--overwrite", action="store_true", help="Overwrite existing output file")
    return p.parse_args()


def ensure_dir(path: Path) -> None:
    """디렉토리가 없으면 생성합니다."""
    path.mkdir(parents=True, exist_ok=True)


def names_from_args(player: Optional[str], players: Optional[str]) -> List[str]:
    """--player 또는 --players 인자에서 플레이어 이름 목록을 생성합니다."""
    if player:
        return [player]
    assert players is not None
    return [n.strip() for n in players.split(",") if n.strip()]


def save_jsonl(out_file: Path, items: List[dict], overwrite: bool) -> None:
    """매치 아이템 목록을 JSONL 파일로 저장합니다.
    - overwrite=False 이면서 파일이 이미 있으면 이어쓰기(append)합니다.
    - overwrite=True 이면 새로 씁니다.
    """
    if out_file.exists() and not overwrite:
        print(f"[info] File exists, appending: {out_file}")
        mode = "a"
    else:
        ensure_dir(out_file.parent)
        mode = "w"
    with out_file.open(mode, encoding="utf-8") as f:
        for it in items:
            f.write(json.dumps(it, ensure_ascii=False) + "\n")


def write_json(path: Path, data: dict, overwrite: bool) -> None:
    """단일 JSON 파일 저장. overwrite=False면 기존 파일이 있으면 건너뜁니다."""
    if path.exists() and not overwrite:
        return
    ensure_dir(path.parent)
    with path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)


def main() -> None:
    # 1) 명령행 인자 파싱
    args = parse_args()
    # 2) 로컬 .env 로드(있을 경우)
    # Load environment from local .env if present
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        try:
            from dotenv import load_dotenv  # type: ignore
            load_dotenv(env_path)
        except Exception:
            print("[warn] .env found but python-dotenv not available; run: pip install -r requirements.txt")
    # 3) API 키 확인(인자 우선, 없으면 환경변수)
    api_key = args.api_key or os.getenv("PUBG_API_KEY")
    if not api_key:
        raise SystemExit("PUBG API key is required. Provide --api-key or set env PUBG_API_KEY")

    # 4) 플레이어 목록 정규화 및 클라이언트 생성
    players = names_from_args(args.player, args.players)
    client = PubgClient(api_key=api_key, shard=args.shard)

    print(f"[info] Shard={args.shard} players={players} max_matches={args.max_matches} layout={args.layout}")

    # 5) 플레이어 조회 → Player 리소스 목록 수신
    lookup = client.get_players_by_names(players)
    data = lookup.get("data", [])
    # 6) 이름 → Player 객체 매핑 생성(편의용)
    by_name = {p.get("attributes", {}).get("name"): p for p in data}

    for name in players:
        player = by_name.get(name)
        if not player:
            print(f"[warn] Player not found: {name}")
            continue
        rel = (player or {}).get("relationships", {})
        matches = (rel.get("matches", {}) or {}).get("data", [])
        if not matches:
            print(f"[info] No matches for player: {name}")
            continue

        # 7) 상한선(--max-matches)만큼 매치 조회
        match_ids = [m.get("id") for m in matches if m.get("id")][: args.max_matches]
        # tree 레이아웃이면 디렉토리 구조로 저장하고 다음 플레이어로 진행
        if args.layout == "tree":
            player_id = player.get("id") or (player.get("attributes", {}).get("id") if isinstance(player, dict) else None)
            if not player_id:
                player_id = name
            base_dir = args.out / player_id
            match_dir = base_dir / "match"
            # 플레이어 조회 원문 저장
            write_json(base_dir / f"{player_id}.json", player, overwrite=args.overwrite)
            # 플레이어 조회 원문 저장
            write_json(base_dir / f"{player_id}.json", player, overwrite=args.overwrite)
            saved = 0
            for mid in match_ids:
                try:
                    m = client.get_match(mid)
                except Exception as e:
                    print(f"[warn] failed to fetch match {mid}: {e}")
                    continue
                write_json(match_dir / f"{mid}.json", m, overwrite=args.overwrite)
                saved += 1
            print(f"[ok] Saved player+{saved} matches -> {base_dir}")
            continue
        out_items = []
        for mid in match_ids:
            try:
                # 매치 상세(/matches/{id}) 호출
                m = client.get_match(mid)
            except Exception as e:
                print(f"[warn] failed to fetch match {mid}: {e}")
                continue
            # 저장 포맷: 요청 이름/샤드/매치ID 메타 + API 응답 원본
            out_items.append({
                "playerName": name,
                "matchId": mid,
                "shard": args.shard,
                "match": m,
            })

        # 8) 플레이어별 JSONL 파일로 저장
        out_file = args.out / f"{name}.jsonl"
        save_jsonl(out_file, out_items, overwrite=args.overwrite)
        print(f"[ok] Saved {len(out_items)} matches -> {out_file}")


if __name__ == "__main__":
    main()
