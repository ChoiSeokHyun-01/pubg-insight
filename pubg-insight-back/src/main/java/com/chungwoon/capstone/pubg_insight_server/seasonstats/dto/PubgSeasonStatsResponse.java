package com.chungwoon.capstone.pubg_insight_server.seasonstats.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PubgSeasonStatsResponse(
        SeasonStats data
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record SeasonStats(
            Attributes attributes
    ) {
        @JsonIgnoreProperties(ignoreUnknown = true)
        public record Attributes(
                GameModeStats gameModeStats
        ) {
            @JsonIgnoreProperties(ignoreUnknown = true)
            public record GameModeStats(
                    Squad squad,
                    Duo duo,
                    Solo solo
            ) {
                @JsonIgnoreProperties(ignoreUnknown = true)
                public record Squad(
                        Double damageDealt,
                        Integer headshotKills,
                        Double longestKill,
                        Integer losses,
                        Integer kills,
                        Integer roundsPlayed,
                        Integer timeSurvived,
                        Integer top10s,
                        Integer wins,
                        Integer roundMostKills
                ) {
                }

                @JsonIgnoreProperties(ignoreUnknown = true)
                public record Duo(
                        Double damageDealt,
                        Integer headshotKills,
                        Double longestKill,
                        Integer losses,
                        Integer kills,
                        Integer roundsPlayed,
                        Integer timeSurvived,
                        Integer top10s,
                        Integer wins,
                        Integer roundMostKills
                ) {
                }

                @JsonIgnoreProperties(ignoreUnknown = true)
                public record Solo(
                        Double damageDealt,
                        Integer headshotKills,
                        Double longestKill,
                        Integer losses,
                        Integer kills,
                        Integer roundsPlayed,
                        Integer timeSurvived,
                        Integer top10s,
                        Integer wins,
                        Integer roundMostKills
                ) {
                }
            }
        }
    }
}
