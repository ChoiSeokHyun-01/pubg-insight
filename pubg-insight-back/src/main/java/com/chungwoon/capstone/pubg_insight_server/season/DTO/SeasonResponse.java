package com.chungwoon.capstone.pubg_insight_server.season.DTO;

public record SeasonResponse(
        String seasonId,
        boolean isCurrent,
        boolean isOffseason
) {
}
