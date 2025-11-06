package com.chungwoon.capstone.pubg_insight_server.player.controller;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.PlayerService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Player", description = "PUBG 플레이어 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/players")
public class PlayerController implements PlayerControllerSwagger {

    private final PlayerService playerService;

    @Override
    @GetMapping("/{platform}/{name}")
    public PlayerResponse getByName(@PathVariable String platform, @PathVariable String name) {
        return playerService.getByName(platform, name);
    }
}
