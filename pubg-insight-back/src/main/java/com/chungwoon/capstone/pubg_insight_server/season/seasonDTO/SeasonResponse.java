package com.chungwoon.capstone.pubg_insight_server.season.seasonDTO;

public record SeasonResponse(
        String seasonId,
        boolean isCurrent,
        boolean isOffseason
) {
}
