PUBG Insight Collector

간단한 Python CLI로 PUBG 공식 API를 호출해 플레이어 최근 매치 상세를 수집합니다.

구성
- cli.py: 명령행 인터페이스. 플레이어 조회 및 매치 상세를 JSONL로 저장
- pubg_api.py: PUBG API 클라이언트(간단 재시도/레이트리밋 대응)
- requirements.txt: 의존성 목록(requests)
- .env.example: 환경변수 예시(PUBG_API_KEY)

요구 사항
- Python 3.10+
- PUBG API Key (https://developer.pubg.com/)

설치
1) 가상환경(선택):
   python -m venv .venv && .venv\\Scripts\\activate  (Windows)
   source .venv/bin/activate                         (macOS/Linux)

2) 의존성 설치:
   pip install -r pubg-insight-tools/collector/requirements.txt

3) 환경 변수 설정:
   - .env.example을 참고하여 시스템 환경변수 또는 쉘에서 설정
   - Windows PowerShell 예: $Env:PUBG_API_KEY = "YOUR_KEY"

사용법 예시
- 단일 플레이어, 스팀 샤드, 최근 10경기 수집 후 JSONL 저장:
  python pubg-insight-tools/collector/cli.py --player "PLAYER_NAME" --shard steam --max-matches 10 --out out

- 복수 플레이어(콤마 구분):
  python pubg-insight-tools/collector/cli.py --players "name1,name2" --shard kakao --max-matches 5

출력
- 기본 출력 경로는 collector 폴더 하위의 out 디렉토리입니다.
- 플레이어별로 {playerName}.jsonl 생성. 각 라인은 하나의 매치 JSON입니다.

참고
- PUBG API는 최근 매치 목록을 Player 리소스의 relationships.matches에 제공합니다.
- 429(레이트리밋) 발생 시 짧게 대기 후 재시도합니다.

