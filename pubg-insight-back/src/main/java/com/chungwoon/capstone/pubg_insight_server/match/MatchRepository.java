package com.chungwoon.capstone.pubg_insight_server.match;

import com.chungwoon.capstone.pubg_insight_server.player.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<MatchEntity, Long> {
    boolean existsByPlayerAndMatchId(PlayerEntity player, String matchId);
    List<MatchEntity> findByPlayerAccountId(String accountId);
    List<MatchEntity> findByPlayer(PlayerEntity player);
}
