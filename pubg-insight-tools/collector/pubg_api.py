"""
PUBG API 클라이언트
- PUBG 공식 REST API 호출을 캡슐화합니다.
- 인증 헤더 구성, 레이트리밋(429) 재시도, 엔드포인트별 편의 메서드를 제공합니다.
"""

import time
from typing import Any, Dict, List, Optional

import requests


class PubgClient:
    """PUBG API 호출을 담당하는 간단한 클라이언트.

    매개변수
    - api_key: PUBG Developer API 키
    - shard: 조회할 샤드(steam/kakao/xbox/psn/stadia 등)
    - base_url: API 베이스 URL(기본값: https://api.pubg.com)
    """

    def __init__(self, api_key: str, shard: str = "steam", base_url: str = "https://api.pubg.com") -> None:
        self.api_key = api_key
        self.shard = shard
        self.base_url = base_url.rstrip("/")

    @property
    def _headers(self) -> Dict[str, str]:
        """공통 요청 헤더 구성.

        - Authorization: Bearer 토큰
        - Accept: JSON:API 포맷
        """
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Accept": "application/vnd.api+json",
        }

    def _request(self, method: str, path: str, params: Optional[Dict[str, Any]] = None, retries: int = 3) -> Dict[str, Any]:
        """HTTP 요청 공통 처리.

        - 200이면 JSON 반환
        - 429(레이트리밋)은 짧게 대기하며 재시도(지수 백오프)
        - 그 외 4xx/5xx는 간단한 메시지로 예외 발생
        """
        url = f"{self.base_url}{path}"
        backoff = 1.0
        last_err: Optional[requests.Response] = None
        for attempt in range(retries):
            resp = requests.request(method=method, url=url, headers=self._headers, params=params, timeout=30)
            if resp.status_code == 200:
                return resp.json()
            if resp.status_code == 429:
                # 응답 헤더의 재시도 힌트 사용, 없으면 지수 백오프
                reset_after = resp.headers.get("Retry-After") or resp.headers.get("X-RateLimit-Reset")
                sleep_for = float(reset_after) if reset_after else backoff
                time.sleep(min(sleep_for, 10.0))
                backoff = min(backoff * 2, 10.0)
                last_err = resp
                continue
            # 그 외 4xx/5xx는 상세 내용을 최대한 포함해 에러로 전달
            try:
                detail = resp.json()
            except Exception:
                detail = {"message": resp.text}
            raise RuntimeError(f"PUBG API error {resp.status_code}: {detail}")
        # 재시도 소진
        if last_err is not None:
            raise RuntimeError(f"PUBG API rate limit (429). Tried {retries} times.")
        raise RuntimeError("PUBG API request failed without response.")

    # Players
    def get_players_by_names(self, names: List[str]) -> Dict[str, Any]:
        """플레이어 이름 목록으로 Player 리소스를 조회.

        - 엔드포인트: /shards/{shard}/players?filter[playerNames]=name1,name2
        - 반환: JSON:API 응답 전체
        """
        names_joined = ",".join(n.strip() for n in names if n and n.strip())
        if not names_joined:
            raise ValueError("No valid player names provided")
        path = f"/shards/{self.shard}/players"
        params = {"filter[playerNames]": names_joined}
        return self._request("GET", path, params=params)

    def get_player_by_name(self, name: str) -> Optional[Dict[str, Any]]:
        """단일 이름으로 Player 리소스를 조회하고, 가능한 경우 정확 일치 항목을 반환."""
        data = self.get_players_by_names([name])
        players = data.get("data", [])
        if not players:
            return None
        # 응답에 여러 후보가 올 수 있어 정확히 일치하는 항목을 우선 선택
        exact = [p for p in players if p.get("attributes", {}).get("name") == name]
        return (exact or players)[0]

    # Matches
    def get_match(self, match_id: str) -> Dict[str, Any]:
        """매치 ID로 매치 상세를 조회.

        - 엔드포인트: /shards/{shard}/matches/{match_id}
        - 반환: JSON:API 응답 전체
        """
        path = f"/shards/{self.shard}/matches/{match_id}"
        return self._request("GET", path)
