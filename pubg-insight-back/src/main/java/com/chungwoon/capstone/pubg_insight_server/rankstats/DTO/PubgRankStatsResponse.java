package com.chungwoon.capstone.pubg_insight_server.rankstats.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PubgRankStatsResponse(
        RankStats data
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record RankStats(
            Attributes attributes
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Attributes(
                RankedGameModeStats rankedGameModeStats
        ) {
            @JsonIgnoreProperties(ignoreUnknown = true)
            public record RankedGameModeStats(
                    Squad squad,
                    Duo duo
            ) {
                @JsonIgnoreProperties(ignoreUnknown = true)
                public record Squad(
                        CurrentTier currentTier,
                        Integer currentRankPoint,
                        Integer roundsPlayed,
                        Double avgRank,
                        Double top10Ratio,
                        Double winRatio,
                        Integer wins,
                        Double kda,
                        Double damageDealt
                ) {
                    @JsonIgnoreProperties(ignoreUnknown = true)
                    public record CurrentTier(
                            String tier,
                            String subTier
                    ) {
                    }
                }

                @JsonIgnoreProperties(ignoreUnknown = true)
                public record Duo(
                        CurrentTier currentTier,
                        Integer currentRankPoint,
                        Integer roundsPlayed,
                        Double avgRank,
                        Double top10Ratio,
                        Double winRatio,
                        Integer wins,
                        Double kda,
                        Double damageDealt
                ) {
                    @JsonIgnoreProperties(ignoreUnknown = true)
                    public record CurrentTier(
                            String tier,
                            String subTier
                    ) {
                    }
                }
            }
        }
    }
}


