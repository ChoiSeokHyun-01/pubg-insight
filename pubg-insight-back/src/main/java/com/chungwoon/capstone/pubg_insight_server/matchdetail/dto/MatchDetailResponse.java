package com.chungwoon.capstone.pubg_insight_server.matchdetail.dto;

import java.time.Instant;

public record MatchDetailResponse(
        String type,
        String id,
        String matchType,
        String seasonState,
        Integer duration,
        String mapName,
        Boolean isCustomMatch,
        String titleId,
        Object tags,
        Instant createdAt,
        Object stats,
        String gameMode,

        RosterDto roster,
        ParticipantDto participant
) {
}
