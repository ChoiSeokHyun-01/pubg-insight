import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type {
  Platform,
  PlayerResponse,
  RankStatsBundle,
  SeasonStatsBundle,
  MatchHistoryResponse,
  MatchDetailResponse,
} from "../config/playerApi";
import {
  fetchPlayer,
  fetchRankStats,
  fetchSeasonStats,
  fetchMatchHistory,
  fetchMatchDetail,
  refreshHistory,
} from "../config/playerApi";
import "../styles/profile.css";

type LoadState = "idle" | "loading" | "error" | "success";

type StatEntry = {
  label: string;
  value: string;
};

function formatPercent(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return `${(value * 100).toFixed(1)}%`;
}

function formatNumber(value?: number | null, fraction = 1) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return value.toFixed(fraction);
}

function formatInt(value?: number | null) {
  if (value === undefined || value === null || Number.isNaN(value)) return "—";
  return value.toString();
}

function safeDivide(numer?: number | null, denom?: number | null) {
  if (!denom || denom === 0 || numer === undefined || numer === null) return undefined;
  return numer / denom;
}

function formatSurvival(seconds?: number | null) {
  if (!seconds || Number.isNaN(seconds)) return "—";
  const minutes = seconds / 60;
  return `${minutes.toFixed(1)}분`;
}

function formatDistance(meters?: number | null) {
  if (meters === undefined || meters === null || Number.isNaN(meters)) return "—";
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)}km`;
  return `${meters.toFixed(0)}m`;
}

const MAP_NAME_DICT: Record<string, string> = {
  Baltic_Main: "Erangel (Remastered)",
  Chimera_Main: "Paramo",
  Desert_Main: "Miramar",
  DihorOtok_Main: "Vikendi",
  Erangel_Main: "Erangel",
  Heaven_Main: "Haven",
  Kiki_Main: "Deston",
  Range_Main: "Camp Jackal",
  Savage_Main: "Sanhok",
  Summerland_Main: "Karakin",
  Tiger_Main: "Taego",
  Neon_Main: "Rondo",
};

function mapNameLabel(mapName?: string | null) {
  if (!mapName) return "맵 정보 없음";
  return MAP_NAME_DICT[mapName] ?? mapName;
}

export default function Profile() {
  const { platform, name } = useParams<{ platform: Platform; name: string }>();

  const [playerState, setPlayerState] = useState<LoadState>("idle");
  const [rankState, setRankState] = useState<LoadState>("idle");
  const [seasonState, setSeasonState] = useState<LoadState>("idle");

  const [playerError, setPlayerError] = useState<string | null>(null);
  const [rankError, setRankError] = useState<string | null>(null);
  const [seasonError, setSeasonError] = useState<string | null>(null);

  const [player, setPlayer] = useState<PlayerResponse | null>(null);
  const [rankStats, setRankStats] = useState<RankStatsBundle | null>(null);
  const [seasonStats, setSeasonStats] = useState<SeasonStatsBundle | null>(null);
  const [matchHistory, setMatchHistory] = useState<MatchHistoryResponse | null>(null);
  const [matchDetails, setMatchDetails] = useState<Record<string, MatchDetailResponse>>({});
  const [matchDetailState, setMatchDetailState] = useState<LoadState>("idle");
  const [matchDetailError, setMatchDetailError] = useState<string | null>(null);
  const [matchLimit, setMatchLimit] = useState<number>(5);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [matchState, setMatchState] = useState<LoadState>("idle");
  const [matchError, setMatchError] = useState<string | null>(null);
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);

  const fetchMatchDetails = async (ids: string[], accountId: string) => {
    if (ids.length === 0) {
      setMatchDetails({});
      return;
    }
    setMatchDetailState("loading");
    setMatchDetailError(null);
    try {
      const responses = await Promise.all(
        ids.map((id) => fetchMatchDetail(platform ?? "kakao", id, accountId).catch(() => null)),
      );
      const mapped: Record<string, MatchDetailResponse> = {};
      ids.forEach((id, idx) => {
        if (responses[idx]) mapped[id] = responses[idx] as MatchDetailResponse;
      });
      setMatchDetails((prev) => ({ ...prev, ...mapped }));
      setMatchDetailState("success");
    } catch (err) {
      setMatchDetailError("매치 상세 정보를 불러오지 못했습니다.");
      setMatchDetailState("error");
    }
  };

  const loadAll = async (selectedPlatform: Platform, nickname: string) => {
    setPlayerState("loading");
    setRankState("loading");
    setSeasonState("loading");
    setMatchState("loading");
    setPlayerError(null);
    setRankError(null);
    setSeasonError(null);
    setMatchError(null);
    setMatchDetailError(null);
    setPlayer(null);
    setRankStats(null);
    setSeasonStats(null);
    setMatchHistory(null);
    setMatchDetails({});
    setMatchLimit(5);

    let loadedPlayer: PlayerResponse | null = null;

    try {
      const playerData = await fetchPlayer(selectedPlatform, nickname);
      setPlayer(playerData);
      setPlayerState("success");
      loadedPlayer = playerData;
    } catch (err) {
      setPlayerError("플레이어를 찾을 수 없습니다.");
      setPlayerState("error");
    }

    if (!loadedPlayer) {
      setLastUpdated(new Date());
      return;
    }

    try {
      const rankData = await fetchRankStats(selectedPlatform, nickname, false);
      setRankStats(rankData);
      setRankState("success");
    } catch (err) {
      setRankError("랭크 정보를 불러오지 못했습니다.");
      setRankState("error");
    }

    let seasonDataLocal: SeasonStatsBundle | null = null;
    try {
      const seasonData = await fetchSeasonStats(selectedPlatform, nickname, false);
      setSeasonStats(seasonData);
      setSeasonState("success");
      seasonDataLocal = seasonData;
    } catch (err) {
      setSeasonError("일반 전적 정보를 불러오지 못했습니다.");
      setSeasonState("error");
    }

    try {
      const matches = await fetchMatchHistory(loadedPlayer.accountId);
      setMatchHistory(matches);
      setMatchState("success");
      const initialIds = matches.matchIds.slice(0, 5);
      fetchMatchDetails(initialIds, loadedPlayer.accountId);
    } catch (err) {
      setMatchError("매치 기록을 불러오지 못했습니다.");
      setMatchState("error");
    }

    // 시즌 전적이 모두 비었으면 한 번만 갱신 시도
    const isSeasonEmpty = (bundle: SeasonStatsBundle | null) =>
      !bundle?.squad && !bundle?.duo && !bundle?.solo;
    if (isSeasonEmpty(seasonDataLocal)) {
      try {
        const refreshed = await refreshHistory(selectedPlatform, loadedPlayer.accountId, nickname);
        if (refreshed.rankStatsBundle) {
          setRankStats(refreshed.rankStatsBundle);
          setRankState("success");
        }
        if (refreshed.seasonStatsBundle) {
          setSeasonStats(refreshed.seasonStatsBundle);
          setSeasonState("success");
        }
        if (refreshed.matchResponse) {
          setMatchHistory(refreshed.matchResponse);
          setMatchDetails({});
          setMatchLimit(5);
          fetchMatchDetails(refreshed.matchResponse.matchIds.slice(0, 5), loadedPlayer.accountId);
          setMatchState("success");
        }
      } catch (err) {
        // 이미 한 번 기본 요청을 했으므로 추가 에러는 노트만 남김
        setSeasonError((prev) => prev ?? "일반 전적 정보를 갱신하지 못했습니다.");
      }
    }

    setLastUpdated(new Date());
  };

  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!platform || !name) return;
    const key = `${platform}-${name}`;
    if (import.meta.env.DEV && lastKeyRef.current === key) return; // prevent double-fetch in React StrictMode dev
    lastKeyRef.current = key;
    loadAll(platform, name);
  }, [platform, name]);

  const rankMeta = useMemo(() => {
    const duo = rankStats?.duo;
    const squad = rankStats?.squad;
    return { duo, squad };
  }, [rankStats]);

  const normalMeta = useMemo(() => {
    const solo = seasonStats?.solo;
    const duo = seasonStats?.duo;
    const squad = seasonStats?.squad;
    return { solo, duo, squad };
  }, [seasonStats]);

  const formattedUpdatedAt = useMemo(() => {
    if (!lastUpdated) return "갱신 대기";
    return `${lastUpdated.toLocaleDateString()} ${lastUpdated.toLocaleTimeString()}`;
  }, [lastUpdated]);

  const matchList = useMemo(() => {
    return (matchHistory?.matchIds ?? []).slice(0, matchLimit);
  }, [matchHistory, matchLimit]);

  const handleRefresh = async () => {
    if (!platform || !name || !player?.accountId) return;
    setRankState("loading");
    setSeasonState("loading");
    setMatchState("loading");
    setRankError(null);
    setSeasonError(null);
    setMatchError(null);
    setMatchDetailError(null);
    try {
      const refreshed = await refreshHistory(platform, player.accountId, name);
      setRankStats(refreshed.rankStatsBundle);
      setSeasonStats(refreshed.seasonStatsBundle);
      if (refreshed.matchResponse) {
        setMatchHistory(refreshed.matchResponse);
        setMatchDetails({});
        setMatchLimit(5);
        fetchMatchDetails(refreshed.matchResponse.matchIds.slice(0, 5), player.accountId);
      }
      setRankState("success");
      setSeasonState("success");
      setMatchState("success");
    } catch (err) {
      setRankError("랭크 정보를 갱신하지 못했습니다.");
      setSeasonError("일반 전적 정보를 갱신하지 못했습니다.");
      setRankState("error");
      setSeasonState("error");
      setMatchError("매치 기록을 갱신하지 못했습니다.");
      setMatchState("error");
      setMatchDetailError("매치 상세 정보를 갱신하지 못했습니다.");
      setMatchDetailState("error");
    }


    setLastUpdated(new Date());
  };

  const handleLoadMoreMatches = () => {
    if (!matchHistory || !player?.accountId) return;
    const newLimit = matchLimit + 5;
    const idsToFetch = matchHistory.matchIds.slice(matchLimit, newLimit);
    setMatchLimit(newLimit);
    if (idsToFetch.length > 0) {
      fetchMatchDetails(idsToFetch, player.accountId);
    }
  };

  const renderRankCard = (mode: "duo" | "squad") => {
    const data = rankMeta[mode];
    const title = mode === "duo" ? "듀오" : "스쿼드";
    const tier = data?.tier ?? "Unranked";
    const subTier = data?.subTier;
    const rp = data?.currentRankPoint;
    // 정식 배지 파일은 public/Insignias에 Tier/SubTier가 대소문자 포함 그대로 들어있음
    const iconName = subTier ? `${tier}-${subTier}` : tier;
    const iconSrc = `/PUBG/Insignias/${iconName}.png`;

    const entries: StatEntry[] = [
      { label: "KDA", value: formatNumber(data?.kda, 2) },
      { label: "승률", value: formatPercent(data?.winRatio) },
      { label: "Top10", value: formatPercent(data?.top10Ratio) },
      { label: "평균 딜량", value: formatNumber(safeDivide(data?.damageDealt, data?.roundsPlayed), 0) },
      { label: "게임 수", value: formatInt(data?.roundsPlayed) },
      { label: "평균 등수", value: formatNumber(data?.avgRank, 1) },
    ];

    return (
      <div className="profile-card profile-card--rank">
        <div className="profile-card__head">
          <div className="profile-card__mode">{title}</div>
          <div className="profile-card__tier">
            <img src={iconSrc} alt={`${tier} 배지`} onError={(e) => (e.currentTarget.style.display = "none")} />
            <div>
              <div className="profile-card__tier-name">{tier}</div>
              <div className="profile-card__tier-sub">{subTier}</div>
            </div>
          </div>
          <div className="profile-card__point">{rp ? `${rp} RP` : "—"}</div>
        </div>
        <div className="profile-card__stats">
          {entries.map((item) => (
            <div key={`${mode}-${item.label}`} className="profile-card__stat">
              <div className="profile-card__stat-label">{item.label}</div>
              <div className="profile-card__stat-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderNormalCard = (mode: "solo" | "duo" | "squad") => {
    const data = normalMeta[mode];
    const title = mode === "solo" ? "솔로" : mode === "duo" ? "듀오" : "스쿼드";
    const games = data?.roundsPlayed ?? 0;
    const kd = safeDivide(data?.kills, data?.losses);
    const winRate = safeDivide(data?.wins, data?.roundsPlayed);
    const top10 = safeDivide(data?.top10s, data?.roundsPlayed);
    const avgDamage = safeDivide(data?.damageDealt, data?.roundsPlayed);
    const headshotRatio = safeDivide(data?.headshotKills, data?.kills);
    const survival = safeDivide(data?.timeSurvived, data?.roundsPlayed);

    const entries: StatEntry[] = [
      { label: "K/D", value: formatNumber(kd, 2) },
      { label: "승률", value: formatPercent(winRate) },
      { label: "Top10", value: formatPercent(top10) },
      { label: "평균 딜량", value: formatNumber(avgDamage, 0) },
      { label: "게임 수", value: formatInt(games) },
      { label: "최다 킬", value: formatInt(data?.roundMostKills) },
      { label: "헤드샷", value: formatPercent(headshotRatio) },
      { label: "최장 저격", value: data?.longestKill ? `${data.longestKill.toFixed(1)}m` : "—" },
      { label: "평균 생존", value: survival ? `${(survival / 60).toFixed(1)}분` : "—" },
    ];

    return (
      <div className="profile-card profile-card--normal">
        <div className="profile-card__head profile-card__head--compact">
          <div className="profile-card__mode">{title}</div>
        </div>
        <div className="profile-card__stats profile-card__stats--grid3">
          {entries.map((item) => (
            <div key={`${mode}-${item.label}`} className="profile-card__stat">
              <div className="profile-card__stat-label">{item.label}</div>
              <div className="profile-card__stat-value">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <main className="profile-page">
      <div className="profile-page__container">
        <section className="profile-hero">
          <div className="profile-hero__top">
            <div className="profile-hero__seasons">
              <label htmlFor="season-select">시즌</label>
              <select id="season-select" className="profile-hero__season-select" disabled>
                <option>최신 시즌</option>
              </select>
            </div>
            <button className="profile-hero__refresh" onClick={handleRefresh} disabled={playerState === "loading"}>
              전적 갱신
            </button>
          </div>

          <div className="profile-hero__main">
            <div className="profile-hero__avatar" aria-hidden="true">
              {name?.slice(0, 1).toUpperCase()}
            </div>
            <div className="profile-hero__info">
              <div className="profile-hero__name">{name}</div>
              <div className="profile-hero__meta">
                <span className="profile-hero__chip">{platform}</span>
                <span className="profile-hero__chip profile-hero__chip--muted">
                  {formattedUpdatedAt}
                </span>
              </div>
              {playerError && <div className="profile-hero__error">{playerError}</div>}
            </div>
          </div>
        </section>

        <section className="profile-section">
          <header className="profile-section__header">
            <h2>경쟁전</h2>
            {rankState === "loading" && <span className="profile-section__note">불러오는 중...</span>}
            {rankError && <span className="profile-section__note profile-section__note--error">{rankError}</span>}
          </header>
          <div className="profile-section__grid profile-section__grid--two">
            {renderRankCard("duo")}
            {renderRankCard("squad")}
          </div>
        </section>

        <section className="profile-section">
          <header className="profile-section__header">
            <h2>일반 전적</h2>
            {seasonState === "loading" && <span className="profile-section__note">불러오는 중...</span>}
            {seasonError && (
              <span className="profile-section__note profile-section__note--error">{seasonError}</span>
            )}
          </header>
          <div className="profile-section__grid profile-section__grid--three">
            {renderNormalCard("solo")}
            {renderNormalCard("duo")}
            {renderNormalCard("squad")}
          </div>
        </section>

        <section className="profile-section">
          <header className="profile-section__header">
            <h2>매치 히스토리</h2>
            {matchState === "loading" && <span className="profile-section__note">불러오는 중...</span>}
            {matchError && <span className="profile-section__note profile-section__note--error">{matchError}</span>}
            {matchDetailState === "error" && (
              <span className="profile-section__note profile-section__note--error">{matchDetailError}</span>
            )}
          </header>
          <div className="profile-section__list">
            {matchList.length === 0 && matchState !== "loading" ? (
              <div className="profile-card profile-card--normal">최근 매치 기록이 없습니다.</div>
            ) : (
              <div className="match-list">
                {matchList.map((id) => {
                  const detail = matchDetails[id];
                  const stats = detail?.participant?.stats;
                  const isExpanded = expandedMatchId === id;
                  const travel =
                    (stats?.walkDistance ?? 0) +
                    (stats?.rideDistance ?? 0) +
                    (stats?.swimDistance ?? 0);
                  return (
                    <div key={id} className={`match-row ${isExpanded ? "match-row--expanded" : ""}`}>
                      <div className="match-row__left">
                        <div className="match-row__main">
                          <div className="match-row__mode">
                            {detail?.gameMode ?? "게임 모드 불명"} · {mapNameLabel(detail?.mapName)}
                          </div>
                          <div className="match-row__meta">
                            <span>{detail?.createdAt ? new Date(detail.createdAt).toLocaleString() : "—"}</span>
                          </div>
                        </div>
                        <div className="match-row__actions">
                          <button
                            className="match-row__toggle"
                            onClick={() => setExpandedMatchId(isExpanded ? null : id)}
                          >
                            {isExpanded ? "접기" : "상세"}
                          </button>
                        </div>
                      </div>
                      <div className="match-row__details">
                        <div className="match-row__stat">
                          <div className="label">킬</div>
                          <div className="value">{stats?.kills ?? "—"}</div>
                        </div>
                        <div className="match-row__stat">
                          <div className="label">딜량</div>
                          <div className="value">{formatNumber(stats?.damageDealt, 0)}</div>
                        </div>
                        <div className="match-row__stat">
                          <div className="label">DBNOs</div>
                          <div className="value">{stats?.DBNOs ?? "—"}</div>
                        </div>
                        <div className="match-row__stat">
                          <div className="label">이동 거리</div>
                          <div className="value">{formatDistance(travel)}</div>
                        </div>
                        <div className="match-row__stat">
                          <div className="label">생존 시간</div>
                          <div className="value">{formatSurvival(stats?.timeSurvived)}</div>
                        </div>
                        <div className="match-row__stat">
                          <div className="label">팀 순위</div>
                          <div className="value">#{detail?.roster?.rank ?? "—"}</div>
                        </div>
                      </div>
                      {isExpanded && stats && (
                        <div className="match-row__details">
                          <div className="match-row__stat">
                            <div className="label">헤드샷</div>
                            <div className="value">{stats.headshotKills ?? "—"}</div>
                          </div>
                          <div className="match-row__stat">
                            <div className="label">어시스트</div>
                            <div className="value">{stats.assists ?? "—"}</div>
                          </div>
                          <div className="match-row__stat">
                            <div className="label">부활</div>
                            <div className="value">{stats.revives ?? "—"}</div>
                          </div>
                          <div className="match-row__stat">
                            <div className="label">최장 저격</div>
                            <div className="value">
                              {stats.longestKill ? `${stats.longestKill.toFixed(1)}m` : "—"}
                            </div>
                          </div>
                          <div className="match-row__stat">
                            <div className="label">팀킬</div>
                            <div className="value">{stats.teamKills ?? "—"}</div>
                          </div>
                          <div className="match-row__stat">
                            <div className="label">무기 획득</div>
                            <div className="value">{stats.weaponsAcquired ?? "—"}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          {matchHistory && matchLimit < matchHistory.matchIds.length && (
            <button className="match-row__more" onClick={handleLoadMoreMatches} disabled={matchDetailState === "loading"}>
              매치 정보 더 보기
            </button>
          )}
        </section>
      </div>
    </main>
  );
}
