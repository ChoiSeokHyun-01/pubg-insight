package com.chungwoon.capstone.pubg_insight_server.seasonstats.controller;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.PlayerService;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonService;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.SeasonStatsService;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsBundle;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "SeasonStats", description = "PUBG 시즌통계 관련 API")
@RestController
@RequestMapping("/api/seasonstats")
@RequiredArgsConstructor
public class SeasonStatsController implements SeasonStatsControllerSwagger {
    private final SeasonStatsService seasonStatsService;
    private final SeasonService seasonService;
    private final PlayerService playerService;

    @GetMapping("/{platform}/{name}")
    public ResponseEntity<SeasonStatsBundle> get(
            @PathVariable String platform,
            @PathVariable String name,
            @RequestParam(required = false) String seasonId,
            @RequestParam(defaultValue = "false") boolean refresh
    ) {
        String resolvedSeason = (seasonId == null || seasonId.isBlank())
                ? seasonService.getCurrentSeasonId(platform) : seasonId;
        PlayerResponse player = playerService.getByName(platform, name);

        SeasonStatsBundle response =
                seasonStatsService.get(platform, player.accountId(), resolvedSeason, refresh);
        return ResponseEntity.ok(response);

    }
}
