package com.chungwoon.capstone.pubg_insight_server.seasonstats.repository;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.SeasonStatsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SeasonStatsJpaRepository extends JpaRepository<SeasonStatsEntity, Long> {
    Optional<SeasonStatsEntity> findByPlatformAndAccountIdAndSeasonIdAndMode(
            String platform, String accountId, String seasonId, SeasonStatsEntity.Mode mode
    );
}
