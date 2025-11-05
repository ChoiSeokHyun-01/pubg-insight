package com.chungwoon.capstone.pubg_insight_server.player;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/players")

public class PlayerController {
    private final PlayerService playerService;

    @GetMapping("/{platform}/{name}")
    public PlayerResponse getByName(@PathVariable String platform, @PathVariable String name) {
        return playerService.getByName(platform, name);
    }

}
