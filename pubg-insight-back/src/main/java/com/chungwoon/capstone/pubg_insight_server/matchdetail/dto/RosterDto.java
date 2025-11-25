package com.chungwoon.capstone.pubg_insight_server.matchdetail.dto;

import java.util.List;

public record RosterDto(
        String type,
        String id,
        Integer rank,
        Integer teamId,
        String won,
        List<String> participantIds
) {
}
