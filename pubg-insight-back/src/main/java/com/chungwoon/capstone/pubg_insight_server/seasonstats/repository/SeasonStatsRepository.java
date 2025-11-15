package com.chungwoon.capstone.pubg_insight_server.seasonstats.repository;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.SeasonStatsEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class SeasonStatsRepository {
    private final SeasonStatsJpaRepository seasonStatsJpaRepository;

    public Optional<SeasonStatsEntity> find(
            String platform, String accountId, String seasonId, SeasonStatsEntity.Mode mode
    ) {
        return seasonStatsJpaRepository
                .findByPlatformAndAccountIdAndSeasonIdAndMode(platform, accountId, seasonId, mode);
    }

    public SeasonStatsEntity save(SeasonStatsEntity e){
        return seasonStatsJpaRepository.save(e);
    }
}
