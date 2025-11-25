package com.chungwoon.capstone.pubg_insight_server.match.dto;

import java.util.List;

public record MatchResponse(
        List<String> matchIds
) {
}
