package com.chungwoon.capstone.pubg_insight_server.historyrefresh.controller;

import com.chungwoon.capstone.pubg_insight_server.historyrefresh.HistoryRefreshService;
import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import com.chungwoon.capstone.pubg_insight_server.rankstats.controller.RankStatsController;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.controller.SeasonStatsController;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class HistoryRefreshController {
    private final SeasonStatsController seasonStatsController;
    private final RankStatsController rankStatsController;
    private final HistoryRefreshService historyRefreshService;

    @GetMapping("/{platform}/{accountId}/{name}/refresh")
    public MatchResponse refreshHistory(
            @PathVariable String platform,
            @PathVariable String accountId,
            @PathVariable String name
    ) {
        seasonStatsController.get(platform, name, null, true);
        rankStatsController.get(platform, name, null, true);
        return historyRefreshService.updateHistory(platform, name, accountId);
    }
}
