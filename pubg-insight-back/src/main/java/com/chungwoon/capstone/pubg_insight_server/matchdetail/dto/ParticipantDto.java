package com.chungwoon.capstone.pubg_insight_server.matchdetail.dto;

public record ParticipantDto(
        String type,
        String id,
        ParticipantStatsDto stats
) {

}
