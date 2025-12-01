package com.chungwoon.capstone.pubg_insight_server.match;

import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import com.chungwoon.capstone.pubg_insight_server.player.DTO.PubgPlayerResponse;
import com.chungwoon.capstone.pubg_insight_server.player.PlayerEntity;
import com.chungwoon.capstone.pubg_insight_server.player.PlayerRepository;
import com.chungwoon.capstone.pubg_insight_server.player.PubgPlayerClient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;
    private final PlayerRepository playerRepository;
    private final PubgPlayerClient pubgPlayerClient;
    private final MatchMapper matchMapper;


    public MatchResponse getMatch(String accountId) {
        List<MatchEntity> matches = matchRepository.findByPlayerAccountId(accountId);

        if (matches.isEmpty()) {
            throw new IllegalArgumentException("해당 유저의 최근 매치 정보가 없습니다.");
        }

        return MatchMapper.toResponse(matches);
    }

    public MatchResponse updateMatch(String name, String platform, String accountId) {
        platform = platform.toLowerCase();

        PlayerEntity player = playerRepository.findByAccountIdAndShardId(accountId, platform)
                .orElseThrow(() -> new IllegalArgumentException("해당 유저가 존재하지 않습니다."));

        PubgPlayerResponse.PlayerData newPlayerData = pubgPlayerClient.findByName(platform, name)
                .orElseThrow(() -> new IllegalArgumentException("해당 닉네임을 가진 유저가 존재하지 않습니다."));

        List<MatchEntity> fetchedMatches = matchMapper.fromPubg(player, newPlayerData);

        List<MatchEntity> newMatches = fetchedMatches.stream()
                .filter(m -> !matchRepository.existsByPlayerAndMatchId(player, m.getMatchId()))
                .toList();

        if (!newMatches.isEmpty()) {
            matchRepository.saveAll(newMatches);
        }

        List<MatchEntity> refreshedMatches = matchRepository.findByPlayer(player);

        return MatchMapper.toResponse(refreshedMatches);
    }
}
