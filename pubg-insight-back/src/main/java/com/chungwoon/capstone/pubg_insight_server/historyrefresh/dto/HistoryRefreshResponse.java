package com.chungwoon.capstone.pubg_insight_server.historyrefresh.dto;

import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsBundle;
import org.springframework.http.ResponseEntity;

public record HistoryRefreshResponse(
        ResponseEntity<SeasonStatsBundle> seasonStatsBundle,
        ResponseEntity<RankStatsBundle> rankStatsBundle,
        MatchResponse matchResponse
) {
}
