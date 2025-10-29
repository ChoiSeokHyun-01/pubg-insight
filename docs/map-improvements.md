# 맵 기능 개선 계획 (Map Feature Improvement Plan)

## 개요
- 맵을 역할별 컴포넌트로 분리하고, 공통 뷰 상태를 훅/컨텍스트로 공유하여 타일/핀 레이어를 정확히 동기화합니다.
- JSON 기반 다중 핀 타입을 지원하고, 뷰포트/줌 필터링으로 성능을 확보합니다.

## 현재 상태
- 타일러 CLI 추가: `pubg-insight-tools/tile/cli.py` (16384×16384 지원, `z/x/y.png` 생성)
- 맵 스타일 분리: `pubg-insight-front/src/styles/map.css` (페이지에서 import)
- 샘플 핀 JSON: `pubg-insight-front/public/map/erangel/layers.json` (8×8 그리드, 8종 핀)

## 목표 아키텍처
- MapController: 팬/휠/리사이즈 이벤트 처리 → 뷰 상태 업데이트
- MapView: 현재 뷰에 필요한 타일만 렌더링(가시 타일 컬링)
- PinLayer: JSON 로드 → 좌표 정규화 → 뷰포트/줌 필터 → 화면 투영 → 핀 렌더
- Pin: 아이콘/라벨/앵커 표시 (프리젠테이셔널 컴포넌트)
- MapProvider/useMapView: 공통 뷰 상태와 좌표 변환 유틸 제공

### 제안 파일 구조
- `src/components/map/useMapView.ts`
- `src/components/map/MapProvider.tsx`
- `src/components/map/MapController.tsx`
- `src/components/map/MapView.tsx`
- `src/components/map/PinLayer.tsx`
- `src/components/map/Pin.tsx`
- `src/components/map/tiles.ts` (tileUrl, tilesPerSide 등 유틸)
- 페이지 조합: `src/pages/MapFrame.tsx` (Provider로 감싸고 Controller + MapView + PinLayer 배치)

## 공유 뷰 상태(Provider/Hook)
- 상태: `zoom, z, scale, center{x,y}, size{w,h}`
- 메서드: `setZoom, setCenter`
- 투영: `worldToScreen({x,y})`, `screenToWorld({px,py})`
- 뷰포트: `{x0,x1,y0,y1,left,top}` (타일/핀 컬링에 사용)

## 타일 규칙/경로
- 입력 폴더: `C:\WS\map\out\<mapName>` (z1…z6 이미지)
- 출력 폴더: `C:\WS\map\tile\<mapName>\z\x\y.png`
- 프론트 URL: `/map/<name>/<z>/<x>/<y>.png`
- CLI 사용: `python pubg-insight-tools/tile/cli.py "C:\\WS\\map\\out\\erangel" "C:\\WS\\map\\tile" --map-name erangel`
- 타일 크기: 256, 한 변 타일 수: `2^z`

## 핀 JSON 스키마(v1)
- 파일: `/map/<name>/layers.json` (정적 서비스; `public` 아래에 위치)
- 좌표계: `{ zBase:6, worldSize:16384, tileSize:256 }` 기준(월드 픽셀)
- 전역 필드: `version, map, ref, icons{ [type]: url }, pins[]`
- 핀 필드: `{ id, type, x, y, label?, anchor?, minZoom?, maxZoom?, zIndex?, meta?, zAt? }`
- 샘플: `pubg-insight-front/public/map/erangel/layers.json`

### 좌표 정규화
- 소스가 다른 z에서 왔다면 `zAt` 제공 → `factor = 2^(zBase - zAt)`로 변환
- `x' = x * factor`, `y' = y * factor`

## PinLayer 동작
1) JSON 로드 → `ref` 확인 → 좌표 정규화(zAt 처리)
2) 뷰포트 바운딩 박스 + `minZoom/maxZoom`으로 필터링
3) `world→screen` 투영: 
   - `left = center.x - (size.w/2)/scale`, `top = center.y - (size.h/2)/scale`
   - `px = (x - left)*scale`, `py = (y - top)*scale`
4) Pin 컴포넌트에 `{type, iconUrl: icons[type], px, py, label, anchor}` 전달

## 컴포넌트 API 스케치
- MapController(props)
  - `className?`, `style?`, `onViewChange?(state)`
- MapView(props)
  - `name`, `tileUrl?(name,z,x,y)`, `onTileError?`
- PinLayer(props)
  - `source: string | { ref, icons, pins }`
  - `visibleTypes?: string[]`, `renderPin?`, `onPinClick?`
- Pin(props)
  - `x, y, iconUrl, label?, anchor?, selected?`

## 성능 고려사항
- 뷰포트 컬링 + 줌 레벨 필터로 DOM 최소화
- `requestAnimationFrame`로 뷰 업데이트 디바운스
- 데이터 커지면 레이어 분할 로드(인덱스 JSON + 개별 레이어)
- 매우 큰 데이터는 그리드/쿼드키 샤딩 고려

## 마이그레이션 순서
1) `useMapView`/`MapProvider` 생성 → 기존 `Map.tsx`의 상태/투영 로직 이전
2) 이벤트 바인딩 로직을 `MapController`로 이동
3) 타일 렌더링을 `MapView`로 분리 (기능 동일 유지)
4) `PinLayer` 추가 → 샘플 `layers.json` 오버레이 렌더

## 검증 체크리스트
- 기존 맵 팬/줌 동작 유지, 경계 클램프 정상
- 타일 컬링/로딩 정상, 오류 타일 핸들링 동작
- 핀: 팬/줌에 정확히 추종, 오프스크린 컬링 정상
- `min/maxZoom` 적용, 아이콘/앵커 배치 정상

## 후속 작업(선택)
- 아이콘 스프라이트/이미지 최적화, HiDPI 대응
- 키보드/버튼 기반 컨트롤러 추가(줌 인/아웃, 리셋)
- Pin 상호작용(hover/click)과 포커스 상태 스타일링
- 대용량 데이터 인덱싱(셀/쿼드키) 및 지연 로드

