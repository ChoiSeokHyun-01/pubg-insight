package com.chungwoon.capstone.pubg_insight_server.historyrefresh;

import com.chungwoon.capstone.pubg_insight_server.match.MatchService;
import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class HistoryRefreshService {
    private final HistoryRefreshRepository historyRefreshRepository;
    private final MatchService matchService;

    @Transactional
    public MatchResponse updateHistory(String platform, String name, String accountId) {
        MatchResponse refreshedMatches = matchService.updateMatch(name, platform, accountId);


        historyRefreshRepository.findByAccountId(accountId)
                .map(e -> {
                    e.updateLastRefreshedAt();
                    return e;
                })
                .orElseGet(() -> {
                            HistoryRefreshEntity newEntity = historyRefreshCreate(accountId);
                            return historyRefreshRepository.save(newEntity);
                        }
                );

        return refreshedMatches;
    }

    @Transactional
    public LocalDateTime getLastRefreshedAt(String accountId) {
        return historyRefreshRepository.findByAccountId(accountId)
                .map(HistoryRefreshEntity::getLastRefreshedAt)
                .orElse(null); // 없으면 null 내려도 되고, 예외 던져도 되고 정책에 맞게
    }

    private HistoryRefreshEntity historyRefreshCreate(String accountId) {
        return HistoryRefreshEntity.of(accountId);
    }
}
