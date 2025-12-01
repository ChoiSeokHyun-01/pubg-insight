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

export type HistoryRefreshResponse = {
    seasonStatsBundle: SeasonStatsBundle;
    rankStatsBundle: RankStatsBundle;
    matchResponse: { matchIds: string[] };
};

export type MatchHistoryResponse = {
    matchIds: string[];
};

export type MatchDetailResponse = {
    type: string;
    id: string;
    matchType: string;
    seasonState: string;
    duration: number;
    mapName: string;
    isCustomMatch: boolean;
    titleId: string;
    tags: string;
    createdAt: string;
    stats: string;
    gameMode: string;
    roster: {
        type: string;
        id: string;
        rank: number;
        teamId: number;
        won: string;
        participantIds: string[];
    };
    participant: {
        type: string;
        id: string;
        stats: {
            DBNOs: number;
            assists: number;
            boosts: number;
            damageDealt: number;
            deathType: string;
            headshotKills: number;
            heals: number;
            killPlace: number;
            killStreaks: number;
            kills: number;
            longestKill: number;
            name: string;
            playerId: string;
            revives: number;
            rideDistance: number;
            roadKills: number;
            swimDistance: number;
            teamKills: number;
            timeSurvived: number;
            vehicleDestroys: number;
            walkDistance: number;
            weaponsAcquired: number;
            winPlace: number;
        };
    };
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

export async function fetchRankStats(platform: Platform, name: string, refresh = false): Promise<RankStatsBundle> {
    const res = await fetch(
        `${API_BASE}/api/rankstats/${platform}/${encodeURIComponent(name)}?refresh=${refresh}`,
        { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }
    return res.json();
}

export async function fetchSeasonStats(platform: Platform, name: string, refresh = false): Promise<SeasonStatsBundle> {
    const res = await fetch(
        `${API_BASE}/api/seasonstats/${platform}/${encodeURIComponent(name)}?refresh=${refresh}`,
        { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }
    return res.json();
}

export async function fetchMatchHistory(accountId: string): Promise<MatchHistoryResponse> {
    const res = await fetch(
        `${API_BASE}/api/matches/${encodeURIComponent(accountId)}`,
        { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }
    return res.json();
}

export async function fetchMatchDetail(platform: Platform, matchId: string, accountId: string): Promise<MatchDetailResponse> {
    const res = await fetch(
        `${API_BASE}/api/matchdetail/${platform}/${encodeURIComponent(matchId)}/${encodeURIComponent(accountId)}`,
        { headers: { Accept: "application/json" } },
    );
    if (!res.ok) {
        const isNotFound = res.status === 404;
        throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
    }
    return res.json();
}

export async function refreshHistory(platform: Platform, accountId: string, name: string): Promise<HistoryRefreshResponse> {
    try {
        const res = await fetch(
            `${API_BASE}/api/history/${platform}/${accountId}/${encodeURIComponent(name)}/refresh`,
            { headers: { Accept: "application/json" } },
        );
        if (!res.ok) {
            const isNotFound = res.status === 404;
            throw new Error(isNotFound ? "NOT_FOUND" : `HTTP_${res.status}`);
        }
        const raw = await res.json();
        // 백엔드에서 ResponseEntity를 그대로 반환해 body/statusCode 형태가 섞여 들어올 수 있어 언래핑
        const seasonStatsBundle = raw?.seasonStatsBundle?.body ?? raw?.seasonStatsBundle ?? null;
        const rankStatsBundle = raw?.rankStatsBundle?.body ?? raw?.rankStatsBundle ?? null;
        return {
            seasonStatsBundle,
            rankStatsBundle,
            matchResponse: raw?.matchResponse,
        };
    } catch (err) {
        // history 갱신 실패 시 강제 refresh 호출로 대체
        const [rankStatsBundle, seasonStatsBundle, matchResponse] = await Promise.all([
            fetchRankStats(platform, name, true).catch(() => null),
            fetchSeasonStats(platform, name, true).catch(() => null),
            fetchMatchHistory(accountId).catch(() => null),
        ]);
        return {
            rankStatsBundle: rankStatsBundle ?? { squad: null, duo: null },
            seasonStatsBundle: seasonStatsBundle ?? { squad: null, duo: null, solo: null },
            matchResponse: matchResponse ?? { matchIds: [] },
        };
    }
}
