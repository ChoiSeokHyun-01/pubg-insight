package com.chungwoon.capstone.pubg_insight_server.historyrefresh.controller;

import com.chungwoon.capstone.pubg_insight_server.historyrefresh.HistoryRefreshMapper;
import com.chungwoon.capstone.pubg_insight_server.historyrefresh.dto.HistoryRefreshResponse;
import com.chungwoon.capstone.pubg_insight_server.historyrefresh.HistoryRefreshService;
import com.chungwoon.capstone.pubg_insight_server.rankstats.controller.RankStatsController;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.controller.SeasonStatsController;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@Tag(name = "HistoryRefresh", description = "PUBG 전적갱신 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class HistoryRefreshController implements HistoryRefreshControllerSwagger {
    private final SeasonStatsController seasonStatsController;
    private final RankStatsController rankStatsController;
    private final HistoryRefreshService historyRefreshService;

    @Override
    @GetMapping("/{platform}/{accountId}/{name}/refresh")
    public HistoryRefreshResponse refreshHistory(
            @PathVariable String platform,
            @PathVariable String accountId,
            @PathVariable String name
    ) {
        var refreshedSeasonStats = seasonStatsController.get(platform, name, null, true);
        var refreshedRankStats = rankStatsController.get(platform, name, null, true);
        var refreshedMatches = historyRefreshService.updateHistory(platform, name, accountId);

        LocalDateTime lastRefreshedAt = historyRefreshService.getLastRefreshedAt(accountId);

        return HistoryRefreshMapper.toResponse(refreshedSeasonStats, refreshedRankStats, refreshedMatches, lastRefreshedAt);
    }
}
