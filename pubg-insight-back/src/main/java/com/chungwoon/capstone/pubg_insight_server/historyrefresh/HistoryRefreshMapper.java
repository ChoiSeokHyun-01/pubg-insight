package com.chungwoon.capstone.pubg_insight_server.historyrefresh;

import com.chungwoon.capstone.pubg_insight_server.historyrefresh.dto.HistoryRefreshResponse;
import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsBundle;
import org.springframework.http.ResponseEntity;

import java.time.LocalDateTime;

public class HistoryRefreshMapper {
    private HistoryRefreshMapper() {
    }

    public static HistoryRefreshResponse toResponse(
            ResponseEntity<SeasonStatsBundle> refreshedSeasonStatsBundle,
            ResponseEntity<RankStatsBundle> refreshedRankStatsBundle,
            MatchResponse refreshedMatchResponse,
            LocalDateTime lastRefreshedAt
    ) {
        return new HistoryRefreshResponse(
                refreshedSeasonStatsBundle,
                refreshedRankStatsBundle,
                refreshedMatchResponse,
                lastRefreshedAt
        );
    }
}
