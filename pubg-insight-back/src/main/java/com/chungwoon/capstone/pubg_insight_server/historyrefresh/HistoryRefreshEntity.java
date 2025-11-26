package com.chungwoon.capstone.pubg_insight_server.historyrefresh;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Table(name = "history_refresh",
        uniqueConstraints = @UniqueConstraint(columnNames = {"account_id"}))
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class HistoryRefreshEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id", nullable = false, length = 64)
    private String accountId;

    private LocalDateTime lastRefreshedAt;

    @Builder
    public HistoryRefreshEntity(String accountId) {
        this.accountId = accountId;
        this.lastRefreshedAt = LocalDateTime.now();
    }

    public static HistoryRefreshEntity of(String accountId) {
        return HistoryRefreshEntity.builder()
                .accountId(accountId)
                .build();
    }

    public void updateLastRefreshedAt() {
        this.lastRefreshedAt = LocalDateTime.now();
    }
}
