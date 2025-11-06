package com.chungwoon.capstone.pubg_insight_server.rankstats.repository;

import com.chungwoon.capstone.pubg_insight_server.rankstats.RankStatsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface RankStatsJpaRepository extends JpaRepository<RankStatsEntity, Long> {
    Optional<RankStatsEntity> findByPlatformAndAccountIdAndSeasonIdAndMode(
            String platform, String accountId, String seasonId, RankStatsEntity.Mode mode
    );
}
