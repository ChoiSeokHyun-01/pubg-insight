package com.chungwoon.capstone.pubg_insight_server.historyrefresh;

import com.chungwoon.capstone.pubg_insight_server.match.MatchService;
import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class HistoryRefreshService {
    private final HistoryRefreshRepository historyRefreshRepository;
    private final MatchService matchService;

    public MatchResponse updateHistory(String platform, String name, String accountId) {
        MatchResponse refreshedMatches = matchService.updateMatch(name, platform);

        historyRefreshRepository.findByAccountId(accountId)
                .orElseGet(() -> historyRefreshCreate(accountId));

        return refreshedMatches;
    }

    private HistoryRefreshEntity historyRefreshCreate(String accountId) {
        return HistoryRefreshEntity.of(accountId);
    }
}
