package com.chungwoon.capstone.pubg_insight_server.rankstats.DTO;

public record RankStatsBundle(
        RankStatsResponse squad,
        RankStatsResponse duo
) {
    public static RankStatsBundle empty() {
        return new RankStatsBundle(null, null);
    }
}
