package com.chungwoon.capstone.pubg_insight_server.player.DTO;

public record PlayerResponse(
        String accountId,
        String name,
        String shardId,
        String clanId
) {}
