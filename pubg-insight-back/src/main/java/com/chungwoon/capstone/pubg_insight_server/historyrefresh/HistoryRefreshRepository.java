package com.chungwoon.capstone.pubg_insight_server.historyrefresh;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HistoryRefreshRepository extends JpaRepository<HistoryRefreshEntity, Long> {
    Optional<HistoryRefreshEntity> findByAccountId(String accountId);
}
