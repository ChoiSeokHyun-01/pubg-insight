package com.chungwoon.capstone.pubg_insight_server.rankstats;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.PlayerService;
import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ranked")
@RequiredArgsConstructor
public class RankStatsController {
    private final RankStatsService rankStatsService;
    private final PlayerService playerService;
    private final SeasonService seasonService;

    @GetMapping("/{platform}/{name}")
    public ResponseEntity<RankStatsBundle> get(
            @PathVariable String platform,
            @PathVariable String name,
            @RequestParam(required = false) String seasonId,
            @RequestParam(defaultValue = "false") boolean refresh) {
        String resolvedSeason = (seasonId == null || seasonId.isBlank())
                ? seasonService.getCurrentSeasonId(platform) : seasonId;

        PlayerResponse player = playerService.getByName(platform, name);

        RankStatsBundle body = rankStatsService.get(platform, player.accountId(), resolvedSeason, refresh);
        return ResponseEntity.ok(body);
    }
}
