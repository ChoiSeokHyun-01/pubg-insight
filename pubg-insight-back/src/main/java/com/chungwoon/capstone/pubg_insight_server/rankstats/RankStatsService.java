package com.chungwoon.capstone.pubg_insight_server.rankstats;

import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.PubgRankStatsResponse;
import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.rankstats.repository.RankStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RankStatsService {

    private final RankStatsRepository rankStatsRepository;
    private final PubgRankStatsClient pubgRankStatsClient;

    @Transactional
    public RankStatsBundle get(String platform, String accountId, String seasonId, boolean refresh) {
        if (!refresh) {
            Optional<RankStatsEntity> squad = rankStatsRepository
                    .find(platform, accountId, seasonId, RankStatsEntity.Mode.SQUAD);
            Optional<RankStatsEntity> duo = rankStatsRepository
                    .find(platform, accountId, seasonId, RankStatsEntity.Mode.DUO);
            return RankStatsMapper.toBundle(squad.orElse(null), duo.orElse(null));
        }
        return refreshAndGet(platform, accountId, seasonId);
    }

    @Transactional
    public RankStatsBundle refreshAndGet(String platform, String accountId, String seasonId) {
        PubgRankStatsResponse response = pubgRankStatsClient.fetch(platform, accountId, seasonId);
        if (response == null || response.data() == null) return RankStatsBundle.empty();

        var attributes = response.data().attributes();
        if (attributes == null || attributes.rankedGameModeStats() == null) return RankStatsBundle.empty();

        var modes = attributes.rankedGameModeStats();

        RankStatsEntity squadEntity = null;
        RankStatsEntity duoEntity = null;

        if (modes.squad() != null) {
            squadEntity = rankStatsRepository.find(platform, accountId, seasonId, RankStatsEntity.Mode.SQUAD)
                    .map(e -> {
                        RankStatsMapper.updateFromSquad(e, modes.squad());
                        return e;
                    })
                    .orElseGet(() -> rankStatsRepository.save(
                            RankStatsMapper.toEntitySquad(platform, accountId, seasonId, modes.squad())
                    ));
        }
        if (modes.duo() != null) {
            duoEntity = rankStatsRepository.find(platform, accountId, seasonId, RankStatsEntity.Mode.DUO)
                    .map(e -> {
                        RankStatsMapper.updateFromDuo(e, modes.duo());
                        return e;
                    })
                    .orElseGet(() -> rankStatsRepository.save(
                            RankStatsMapper.toEntityDuo(platform, accountId, seasonId, modes.duo())
                    ));
        }
        return RankStatsMapper.toBundle(squadEntity, duoEntity);
    }
}
