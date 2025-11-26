package com.chungwoon.capstone.pubg_insight_server.player;

import com.chungwoon.capstone.pubg_insight_server.match.MatchMapper;
import com.chungwoon.capstone.pubg_insight_server.match.MatchRepository;
import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.exception.PlayerNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class PlayerService {
    private final PlayerRepository playerRepository;
    private final MatchRepository matchRepository;
    private final PlayerMapper playerMapper;
    private final MatchMapper matchMapper;
    private final PubgPlayerClient pubgPlayerClient;

    @Transactional
    public PlayerResponse getByName(String platform, String name) {
        return playerRepository.findByShardIdAndName(platform.toLowerCase(), name)
                .map(playerMapper::toResponse)
                .orElseGet(() -> fetchNewDataOrThrow(platform, name));
    }

    @Transactional
    protected PlayerResponse fetchNewDataOrThrow(String platform, String name) {
        var apiPlayer = pubgPlayerClient
                .findByName(platform, name)
                .orElseThrow(() -> new PlayerNotFoundException(platform, name));

        PlayerEntity newPlayer = playerRepository.save(playerMapper.fromPubg(apiPlayer));

        for (var match : matchMapper.fromPubg(newPlayer, apiPlayer)) {
            if (!matchRepository.existsByPlayerAndMatchId(newPlayer, match.getMatchId())) {
                matchRepository.save(match);
            }
        }
        return playerMapper.toResponse(newPlayer);
    }
}
