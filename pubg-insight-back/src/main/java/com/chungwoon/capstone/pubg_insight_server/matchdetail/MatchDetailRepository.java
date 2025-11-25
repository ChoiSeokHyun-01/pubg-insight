package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface MatchDetailRepository extends JpaRepository<MatchDetailEntity, Long> {
    Optional<MatchDetailEntity> findByPlatformAndMatchId(String platform, String matchId);
}
