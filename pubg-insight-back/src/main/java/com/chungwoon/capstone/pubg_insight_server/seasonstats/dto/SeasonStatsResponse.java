package com.chungwoon.capstone.pubg_insight_server.seasonstats.dto;

public record SeasonStatsResponse(
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
