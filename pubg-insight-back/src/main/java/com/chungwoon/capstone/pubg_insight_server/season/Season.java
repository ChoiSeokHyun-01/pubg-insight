package com.chungwoon.capstone.pubg_insight_server.season;

public record Season(
        String seasonId,
        boolean isCurrent,
        boolean isOffseason
) {
}
