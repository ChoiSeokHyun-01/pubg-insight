package com.chungwoon.capstone.pubg_insight_server.match;

import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchService {
    private final MatchRepository matchRepository;

    public MatchResponse getMatch(String accountId) {
        List<MatchEntity> matches = matchRepository.findByPlayerAccountId(accountId);

        if (matches.isEmpty()) {
            throw new IllegalArgumentException("해당 유저의 최근 매치 정보가 없습니다.");
        }

        return MatchMapper.toResponse(matches);
    }
}
