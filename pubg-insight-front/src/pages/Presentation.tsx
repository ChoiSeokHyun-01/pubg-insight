import { useEffect, useRef, useState } from "react";
import MermaidDiagram from "../components/MermaidDiagram";
import "../styles/presentation.css";

const chartArch = `
graph LR
  subgraph PublicSubnet["Public Subnet"]
        ALB["ALB<br>(80/443 → 8080)"]
  end

  subgraph PrivateSubnet["Private Subnet EC2 Only"]
        EC2["EC2 Backend<br>Spring Boot<br>Private IP Only"]
  end

  subgraph VPC["VPC"]
    direction TB
        PublicSubnet
        PrivateSubnet
        S3Endpoint["S3 Gateway Endpoint"]
        CloudWatchEndpoint["CloudWatch Logs Endpoint"]
  end

    UserBrowser["사용자 브라우저<br>(React / CloudFront)"] -- HTTPS --> CloudFront["CloudFront CDN<br>정적 파일 배포"]
    CloudFront -- 정적 파일 조회 --> S3Front["S3 Bucket<br>프론트엔드 빌드파일"]
    CloudFront -- API 요청 --> ALB
    ALB -- 포워딩 --> EC2
    EC2 -- JDBC 3306 --> RDS["RDS MySQL<br>pubginfohub"]
    EC2 -- PutObject / GetObject --> S3Match["S3 Bucket<br>match-included JSON"]
    EC2 --> S3Endpoint & CloudWatchEndpoint

    PubgApi["PUBG Official API<br>api.pubg.com"]
    EC2 -- HTTPS (PUBG API 요청) --> PubgApi
    PubgApi -- JSON 응답 --> EC2
`;

const chartUsecase = `
flowchart LR
  %% 사용자 영역
  subgraph UserLane["사용자"]
    User["사용자"]
    Viewer["맵 뷰어"]
    Profile["전적/랭크 API"]
  end

  %% 시스템 영역
  subgraph SystemLane["시스템"]
    CloudFront["CloudFront"]
    API["Spring API<br>(EC2/ALB)"]

    codeBulidBack["back 빌더"]
    codeBulidFront["front 빌더"]
    
    RDS[("RDS MySQL")]
    S3CF[("S3 CloudFront")]
    S3Match[("S3 matches")]
    S3BakcDeploy[("S3BakcDeploy")]
  end

  %% 외부
  PUBG["PUBG API"]
  Git["GIT"]

  %% 개발/운영 영역
  subgraph DevLane["개발/운영"]
    Admin["운영자/개발자"]
  end

  %% 흐름
  User --> Viewer
  User --> Profile

  Viewer -- /map/{맵 이름} --> CloudFront 
  CloudFront -- 호스팅 --- S3CF

  Profile --> API
  API -- 플레이어 <br/> 매치기록조회 --- RDS
  API -- 매치상세 <br/> 정보로드 --- S3Match
  API -- DB에 없으면 PUBG에 조회 --- PUBG

  Admin -- 코드 push --> Git
  Admin --> codeBulidBack
  Admin --> codeBulidFront
  codeBulidBack -- main 브랜치 로드 --- Git
  codeBulidFront -- main 브랜치 로드 --- Git
  codeBulidBack -- 빌드 후 s3 갱신 --> S3BakcDeploy
  codeBulidFront -- 빌드 후 s3 갱신 --> S3CF
  codeBulidFront -- CloudFront 무효화 <br/> (캐시 초기화 명령) --> CloudFront

  %% 레인 순서 유지를 위한 숨은 링크
  %% UserLane --- SystemLane
  %% SystemLane --- DevLane

  %% 스타일
  style UserLane fill:#111723,stroke:#1e2a3b,stroke-width:1px
  style SystemLane fill:#111723,stroke:#1e2a3b,stroke-width:1px
  style DevLane fill:#111723,stroke:#1e2a3b,stroke-width:1px
`;

const chartSequence = `
sequenceDiagram
  autonumber
  participant User as 사용자
  participant Web as 브라우저
  participant CF as CloudFront
  participant FrontS3 as S3 정적파일
  participant API as Spring API (ALB/EC2)
  participant RDS as RDS MySQL
  participant MatchS3 as S3 matches

  participant PUBG 

  CF->>FrontS3: 파일 요청
  FrontS3-->CF: 빌드 파일, <br/> layers.json, <br/> 타일화된 이미지
  CF->>CF: 캐싱

  API->>PUBG: 시즌ID 조회
  PUBG-->API: 결과 반환
  API->>RDS: 결과 기록 
  RDS-->API: 기록 완료
  API->>API : 시즌ID 캐싱

  User->>CF: 정적 파일 요청
  CF-->>User: 빌드 파일 (HTML/JS/CSS)

  User->>Web: 전적검색
  Web->>API: /api/players/{플렛폼}/{닉네임}
  API->>RDS: players테이블에 요청 값과<br/> 일치하는 컬럼 조회
  RDS-->API: 결과 반환
  API->>PUBG: (검색 결과가 없을 때) <br/> /players/{플렛폼}/{닉네임}
  PUBG-->API: 결과 반환
  API->>RDS: 결과 기록
  API-->Web: 결과 반환
  Web->>API: /api/rankstats/{플렛폼}/{닉네임}?refresh=false<br/>/api/seasonstats/{플렛폼}/{닉네임}?refresh=false<br/>/api/matches/{계정_ID}refresh=false
  API->>RDS: 각 태이블에 요청 값과<br/> 일치하는 컬럼 조회
  RDS-->API: 결과반환
  API-->Web: 결과 반환

  Web->>API: (반환이 null 이라면)<br/>api/history/{플렛폼}/{계정_ID}/{닉네임}/refresh
  API->>PUBG: /players/{계정_ID}/seasons/{시즌_ID}/ranked <br/>/players/{계정_ID}/seasons/{시즌_ID}/ranked <br/>/players/{계정_ID}/seasons/{시즌_ID}/ranked
  PUBG-->API: 결과 반환
  API->>RDS: 결과 기록
  API-->Web: 결과 반환

  Web->>API: 매치상세 요청
  API->>MatchS3: 조회
  API->>PUBG: (매치상세가 없다면) 매치상세 조회
  PUBG-->API: 결과 반환
  API->>MatchS3: 결과 기록

  MatchS3-->API : 매치상세 파일
  API->>API: 해당 유저 정보만 추출
  API-->Web: 결과 반환이
  Web-->User: 화면 렌더

  User->>Web:전적 갱신
  Web->>API:api/history/{플렛폼}/{계정_ID}/{닉네임}/refresh 
  API->>PUBG: /players/{계정_ID}/seasons/{시즌_ID}/ranked <br/>/players/{계정_ID}/seasons/{시즌_ID}/ranked <br/>/players/{계정_ID}/seasons/{시즌_ID}/ranked
  PUBG-->API: 결과 반환
  API->>RDS: 결과 기록
  API-->Web: 결과 반환

  Web->>API: 매치상세 요청
  API->>MatchS3: 조회

  MatchS3-->API : 매치상세 파일
  API->>API: 해당 유저 정보만 추출
  API-->Web: 결과 반환이
  Web-->User: 화면 렌더

  User->>Web: 맵 정보 요청
  Web->>CF: 맵 정보 요청
  CF-->Web: 캐싱된 데이터 전송(layers.json)
  Web->>Web: 브라우저에서 필요한 타일 계산
  Web->>Web: 브라우저단에서 해당 URL 호출한적 있는지 확인
  Web->>Web: 있다면 캐싱된 타일 사용
  Web->>CF: 없다면 타일 요구
  CF-->Web: 타일 반환
  Web-->User:맵 랜더링
`;

export default function PresentationPage() {
    const deckRef = useRef<HTMLDivElement | null>(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const sections = Array.from(deckRef.current?.querySelectorAll(".presentation-section") ?? []);
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("active");
                    } else {
                        entry.target.classList.remove("active");
                    }
                });
            },
            { threshold: 0.4 },
        );
        sections.forEach((sec) => observer.observe(sec));
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        const deckEl = deckRef.current;
        if (!deckEl) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = deckEl;
            const ratio = scrollHeight > clientHeight ? scrollTop / (scrollHeight - clientHeight) : 0;
            setProgress(Math.min(100, Math.max(0, ratio * 100)));
        };

        handleScroll();
        deckEl.addEventListener("scroll", handleScroll, { passive: true });
        return () => deckEl.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="deck" ref={deckRef}>
            <section id="title" className="presentation-section active">
                <h1>PUBG Info Hub</h1>
                <p>PUBG 데이터 파이프라인과 시각화 기능을 하나의 스크롤 흐름에 담은 인터랙티브 데크</p>
                <p className="presentation-team">
                    20200563 최석현 · 20221282 염윤정 · 20221105 이지웅 <br/>
                    20221024 최주영 · 20220401 박지은 · 20220181 박건오 <br/>
                    20210744 양정우 · 20201313 곽승우 · 20201209 육태빈 <br/> 
                    20200599 양혜원 · 20200224 이현준 · 20200167 박준서 <br/>
                </p>
            </section>

            <section id="intro" className="presentation-section">
                <div className="slide-card">
                    <h2>프로젝트 소개</h2>
                    <div className="grid">
                        <div className="mini">
                            <h3>목표</h3>
                            <p>
                                PUBG 전적·텔레메트리·맵 정보를 한 화면에 통합하고 <br />
                                초반 동선 인사이트(차량 스폰·낙하·생존/킬 패턴)에 집중하며 <br />
                                최신 전적을 즉시 조회.
                            </p>
                        </div>
                        <div className="mini">
                            <h3>프론트</h3>
                            <p>
                                React + TypeScript SPA. <br />
                                타일 맵 위 차량/전투 핀 오버레이(카운트·히트맵) <br />
                                전적·랭크·매치 상세를 한 프로필 스크롤에 배치.
                            </p>
                        </div>
                        <div className="mini">
                            <h3>백엔드</h3>
                            <p>
                                Spring Boot 3 (Java 17). <br />
                                PUBG 공식 API로 시즌/랭크/매치/텔레메트리 수집 <br />
                                RDS에 요약 저장, match-included 대용량 JSON은 S3에 분리. <br />
                                /refresh로 강제 갱신, API 분리·캐싱으로 응답 최적화.
                            </p>
                        </div>
                        <div className="mini">
                            <h3>인프라</h3>
                            <p>
                                CloudFront+S3 정적 호스팅<br />
                                ALB→EC2→RDS/S3 <br />
                                VPC 엔드포인트로 NAT 없이 match JSON I/O<br />
                                CodeBuild가 main 빌드→S3 배포→CloudFront 무효화.
                            </p>
                        </div>
                        <div className="mini">
                            <h3>툴즈</h3>
                            <p>
                                차량/탈것 스폰 집계(boto3/requests)<br />
                                맵 업스케일·타일링 스크립트로 고해상도 타일 생성.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="arch" className="presentation-section">
                <div className="slide-card">
                    <h2>클라우드 아키텍처</h2>
                    <MermaidDiagram chart={chartArch} />
                </div>
            </section>

            <section id="usecase" className="presentation-section">
                <div className="slide-card">
                    <h2>유스케이스</h2>
                    <MermaidDiagram chart={chartUsecase} />
                </div>
            </section>

            <section id="sequence" className="presentation-section">
                <div className="slide-card">
                    <h2>시퀀스</h2>
                    <MermaidDiagram chart={chartSequence} />
                </div>
            </section>

            <section id="search" className="presentation-section">
                <div className="slide-card">
                    <h2>전적 검색 시연</h2>
                    <p>실제 홈/검색 화면을 직접 보여줍니다.</p>
                    <iframe src="/" title="search-demo" />
                </div>
            </section>

            <section id="mapdemo" className="presentation-section">
                <div className="slide-card">
                    <h2>맵 뷰어 시연</h2>
                    <p>실제 맵 리스트/맵 뷰어를 직접 보여줍니다.</p>
                    <iframe src="/maps" title="map-demo" />
                </div>
            </section>

            <section id="conclusion" className="presentation-section">
                <div className="slide-card">
                    <h2>결론</h2>
                    <div className="grid">
                        <div className="mini">
                            <h3>성과</h3>
                            <p>전적·랭크·매치·텔레메트리·맵 데이터를 하나로 통합하고, S3+CloudFront+타일맵으로 PUBG 전용 맵 인사이트 뷰어를 구현.</p>
                            <p>RDS와 S3 분리 설계로 대형 JSON을 안전히 처리하고 캐싱/갱신 전략을 정립, AWS 인프라와 배포 파이프라인을 직접 설계·운영.</p>
                        </div>
                        <div className="mini">
                            <h3>향후 계획</h3>
                            <p>차량 외 킬존·교전 핫스팟·자기장 패턴 등 이벤트 확장, 좌표 정밀도 보정과 맵/모드 필터링 강화.</p>
                            <p>관리자 대시보드로 집계 스크립트 모니터링/재처리, 친구·팀 비교와 시즌별 리포트 같은 유저 중심 기능 확장.</p>
                        </div>
                    </div>
                </div>
            </section>

            <div className="presentation-progress">
                <div className="presentation-progress__track" />
                <div className="presentation-progress__bar" style={{ width: `${progress}%` }} />
            </div>
        </div>
    );
}
