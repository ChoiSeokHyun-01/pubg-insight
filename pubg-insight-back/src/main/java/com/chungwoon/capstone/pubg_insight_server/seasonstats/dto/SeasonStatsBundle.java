package com.chungwoon.capstone.pubg_insight_server.seasonstats.dto;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.SeasonStatsEntity;

public record SeasonStatsBundle(
        SeasonStatsResponse squad,
        SeasonStatsResponse duo,
        SeasonStatsResponse solo
) {
    public static SeasonStatsBundle empty() {
        return new SeasonStatsBundle(null, null, null);
    }
}
