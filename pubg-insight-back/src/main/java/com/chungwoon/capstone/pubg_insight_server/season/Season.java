package com.chungwoon.capstone.pubg_insight_server.season;

import com.fasterxml.jackson.annotation.JsonProperty;

public record Season(
        String seasonId,
        boolean isCurrent,
        boolean isOffseason
) {
}
