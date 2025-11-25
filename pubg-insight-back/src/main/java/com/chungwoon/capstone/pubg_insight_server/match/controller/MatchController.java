package com.chungwoon.capstone.pubg_insight_server.match.controller;

import com.chungwoon.capstone.pubg_insight_server.match.MatchService;
import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.Table;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Match", description = "PUBG 매치 목록 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/matches")
public class MatchController implements MatchControllerSwagger {
    private final MatchService matchService;

    @Override
    @GetMapping("/{accountId}")
    public MatchResponse getMatch(
            @PathVariable String accountId){
        return matchService.getMatch(accountId);
    }
}
