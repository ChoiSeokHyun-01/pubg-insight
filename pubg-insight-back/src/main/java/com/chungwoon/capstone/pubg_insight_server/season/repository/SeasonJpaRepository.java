package com.chungwoon.capstone.pubg_insight_server.season.repository;

import com.chungwoon.capstone.pubg_insight_server.season.SeasonEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SeasonJpaRepository extends JpaRepository<SeasonEntity, Long> {
    @Query("SELECT s FROM SeasonEntity s WHERE s.platform = :platform")
    List<SeasonEntity> findAllByPlatform(@Param("platform") String platform);

    @Modifying
    @Query("delete from SeasonEntity s where s.platform = :platform")
    void deleteByPlatform(@Param("platform") String platform);

   @Query("SELECT s.seasonId FROM SeasonEntity s WHERE s.current = true AND s.platform= :platform")
   Optional<String> findCurrentSeasonId(@Param("platform") String platform);
}
