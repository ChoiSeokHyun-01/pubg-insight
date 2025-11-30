export type Platform = "steam" | "kakao";

export type PlayerResponse = {
    accountId: string;
    name: string;
    shardId: string;
    clanId?: string | null;
};

export type RankStatsResponse = {
    tier: string;
    subTier: string;
    currentRankPoint: number;
    roundsPlayed: number;
    avgRank: number;
    top10Ratio: number;
    winRatio: number;
    wins: number;
    kda: number;
    damageDealt: number;
};

export type RankStatsBundle = {
    squad?: RankStatsResponse | null;
    duo?: RankStatsResponse | null;
};

export type SeasonStatsResponse = {
    damageDealt: number;
    headshotKills: number;
    longestKill: number;
    losses: number;
    kills: number;
    roundsPlayed: number;
    timeSurvived: number;
    top10s: number;
    wins: number;
    roundMostKills: number;
};

export type SeasonStatsBundle = {
    squad?: SeasonStatsResponse | null;
    duo?: SeasonStatsResponse | null;
    solo?: SeasonStatsResponse | null;
};

export const API_BASE = "https://api.pubginfohub.com";

export async function fetchPlayer(platform: Platform, name: string): Promise<PlayerResponse> {
    const res = await fetch(
        `${API_BASE}/api/players/${platform}/${encodeURIComponent(name)}`,
        {
            headers: { Accept: "application/json" },
        },
    );

    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }

    return res.json();
}

export async function fetchRankStats(platform: Platform, name: string): Promise<RankStatsBundle> {
    const res = await fetch(
        `${API_BASE}/api/rankstats/${platform}/${encodeURIComponent(name)}`,
        { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }
    return res.json();
}

export async function fetchSeasonStats(platform: Platform, name: string): Promise<SeasonStatsBundle> {
    const res = await fetch(
        `${API_BASE}/api/seasonstats/${platform}/${encodeURIComponent(name)}`,
        { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }
    return res.json();
}
