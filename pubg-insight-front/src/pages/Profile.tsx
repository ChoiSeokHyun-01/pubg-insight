import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import type {
    Platform,
    PlayerResponse,
    RankStatsBundle,
    SeasonStatsBundle,
} from "../config/playerApi";
import { fetchPlayer, fetchRankStats, fetchSeasonStats } from "../config/playerApi";
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
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const loadAll = async (selectedPlatform: Platform, nickname: string) => {
        setPlayerState("loading");
        setRankState("loading");
        setSeasonState("loading");
        setPlayerError(null);
        setRankError(null);
        setSeasonError(null);
        setPlayer(null);
        setRankStats(null);
        setSeasonStats(null);

        try {
            const playerData = await fetchPlayer(selectedPlatform, nickname);
            setPlayer(playerData);
            setPlayerState("success");
        } catch (err) {
            setPlayerError("플레이어를 찾을 수 없습니다.");
            setPlayerState("error");
        }

        try {
            const rankData = await fetchRankStats(selectedPlatform, nickname);
            setRankStats(rankData);
            setRankState("success");
        } catch (err) {
            setRankError("랭크 정보를 불러오지 못했습니다.");
            setRankState("error");
        }

        try {
            const seasonData = await fetchSeasonStats(selectedPlatform, nickname);
            setSeasonStats(seasonData);
            setSeasonState("success");
        } catch (err) {
            setSeasonError("일반 전적 정보를 불러오지 못했습니다.");
            setSeasonState("error");
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

    const handleRefresh = () => {
        if (platform && name) {
            loadAll(platform, name);
        }
    };

    const renderRankCard = (mode: "duo" | "squad") => {
        const data = rankMeta[mode];
        const title = mode === "duo" ? "듀오" : "스쿼드";
        const tier = data?.tier ?? "Unranked";
        const subTier = data?.subTier ?? "";
        const rp = data?.currentRankPoint;
        const iconName = tier ? tier.toLowerCase() : "unranked";
        const iconSrc = `/insignias/${iconName}.png`;

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
            </div>
        </main>
    );
}
