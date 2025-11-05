package com.chungwoon.capstone.pubg_insight_server.player;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PlayerRepository extends JpaRepository<PlayerEntity, Long> {
    Optional<PlayerEntity> findByShardIdAndName(String shardId, String name);
}
