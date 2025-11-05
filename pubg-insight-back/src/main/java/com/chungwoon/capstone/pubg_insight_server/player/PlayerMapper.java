package com.chungwoon.capstone.pubg_insight_server.player;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.DTO.PubgPlayerResponse;
import org.springframework.stereotype.Component;

import java.util.Locale;

@Component
public final class PlayerMapper {
    private PlayerMapper() {}

    public PlayerEntity fromPubg(PubgPlayerResponse.PlayerData playerData) {
        var a = playerData.attributes();
        return PlayerEntity.builder()
                .accountId(playerData.id())
                .name(a.name())
                .shardId(a.shardId().toLowerCase(Locale.ROOT))
                .clanId(a.clanId())
                .build();
    }

    public PlayerEntity merge(PlayerEntity exiting, PubgPlayerResponse.PlayerData playerData){
        var a = playerData.attributes();
        return PlayerEntity.builder()
                .id(exiting.getId())
                .accountId(exiting.getAccountId())
                .name(a.name())
                .shardId(exiting.getShardId())
                .clanId(a.clanId())
                .build();
    }

    public PlayerResponse toResponse(PlayerEntity entity){
        return new PlayerResponse(entity.getAccountId(), entity.getName(), entity.getShardId(), entity.getClanId());
    }
}
