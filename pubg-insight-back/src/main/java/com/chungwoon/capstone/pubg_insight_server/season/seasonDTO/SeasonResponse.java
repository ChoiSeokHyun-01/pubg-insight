package com.chungwoon.capstone.pubg_insight_server.season.seasonDTO;

import com.fasterxml.jackson.annotation.JsonProperty;

public record SeasonResponse(
        String seasonId,
        boolean isCurrent,
        boolean isOffseason
) {
}
