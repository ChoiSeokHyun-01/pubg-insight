package com.chungwoon.capstone.pubg_insight_server.match;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.DTO.PubgPlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.PlayerEntity;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public final class MatchMapper {
    private MatchMapper() {
    }

//    public static List<MatchEntity> toMatchEntity(PlayerEntity player, PlayerResponse.PlayerData playerData){
//        var matches = Optional.ofNullable(playerData.relationships())
//                .map(PlayerResponse.Relationships::matches)
//                .map(PlayerResponse.Matches::data)
//                .orElse(List.of());
//        return matches.stream()
//                .map(m -> MatchEntity.builder()
//                        .player(player)
//                        .matchId(m.id())
//                        .build())
//                .toList();
//    }

    public List<MatchEntity> fromPubg(PlayerEntity player, PubgPlayerResponse.PlayerData playerData) {
        var matches = playerData.relationships() != null && playerData.relationships().matches() != null
                ? playerData.relationships().matches().data() : Collections.<PubgPlayerResponse.MatchRef>emptyList();

        return matches.stream()
                .map(m -> MatchEntity.builder()
                        .player(player)
                        .matchId(m.id())
                        .build())
                .toList();
    }
}
