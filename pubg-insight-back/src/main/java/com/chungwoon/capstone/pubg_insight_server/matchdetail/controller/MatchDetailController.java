package com.chungwoon.capstone.pubg_insight_server.matchdetail.controller;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.MatchDetailService;
import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.MatchDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/matchdetail")
public class MatchDetailController implements MatchDetailControllerSwagger {
    private final MatchDetailService matchDetailService;

    @Override
    @GetMapping("/{platform}/{matchId}/{accountId}")
    public MatchDetailResponse getMatchDetail(
            @PathVariable String platform,
            @PathVariable String matchId,
            @PathVariable String accountId
    ) {

        return matchDetailService.getMatchDetail(platform, matchId, accountId);
    }
}
