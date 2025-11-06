package com.chungwoon.capstone.pubg_insight_server.rankstats.DTO;

public record RankStatsResponse(
        String tier,
        String subTier,
        Integer currentRankPoint,
        Integer roundsPlayed,
        Double avgRank,
        Double top10Ratio,
        Double winRatio,
        Integer wins,
        Double kda,
        Double damageDealt
) {
}
