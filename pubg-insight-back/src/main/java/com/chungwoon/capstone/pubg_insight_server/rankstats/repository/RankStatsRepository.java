package com.chungwoon.capstone.pubg_insight_server.rankstats.repository;

import com.chungwoon.capstone.pubg_insight_server.rankstats.RankStatsEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class RankStatsRepository {
    private final RankStatsJpaRepository rankStatsJpaRepository;

    public Optional<RankStatsEntity> find(String platform, String accountId, String seasonId, RankStatsEntity.Mode mode){
        return rankStatsJpaRepository
                .findByPlatformAndAccountIdAndSeasonIdAndMode(platform, accountId, seasonId, mode );
    }

    public RankStatsEntity save(RankStatsEntity e){
        return rankStatsJpaRepository.save(e);
    }
}
