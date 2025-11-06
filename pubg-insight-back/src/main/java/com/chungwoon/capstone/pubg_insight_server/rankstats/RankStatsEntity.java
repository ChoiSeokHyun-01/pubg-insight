package com.chungwoon.capstone.pubg_insight_server.rankstats;

import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.PubgRankStatsResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "rank_stats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"platform", "account_id", "season_id", "mode"}))
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RankStatsEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 16)
    private String platform;
    @Column(name = "account_id", nullable = false, length = 64)
    private String accountId;
    @Column(name = "season_id", nullable = false, length = 64)
    private String seasonId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 8)
    private Mode mode;

    private String tier;
    private String subTier;
    private Integer currentRankPoint;
    private Integer roundsPlayed;
    private Double avgRank;
    private Double top10Ratio;
    private Double winRatio;
    private Integer wins;
    private Double kda;
    private Double damageDealt;

    public static RankStatsEntity of(
            String platform, String accountId, String seasonId, Mode mode,
            String tier, String subTier,
            Integer currentRankPoint, Integer roundsPlayed,
            Double avgRank, Double top10Ratio, Double winRatio, Integer wins, Double kda, Double damageDealt
    ) {
        return RankStatsEntity.builder()
                .platform(platform)
                .accountId(accountId)
                .seasonId(seasonId)
                .mode(mode)
                .tier(tier)
                .subTier(subTier)
                .currentRankPoint(currentRankPoint)
                .roundsPlayed(roundsPlayed)
                .avgRank(avgRank)
                .top10Ratio(top10Ratio)
                .winRatio(winRatio)
                .wins(wins)
                .kda(kda)
                .damageDealt(damageDealt)
                .build();
    }

    public void applySquad(PubgRankStatsResponse.RankStats.Attributes.RankedGameModeStats.Squad s) {
        this.tier = s.currentTier() == null ? null : s.currentTier().tier();
        this.subTier = s.currentTier() == null ? null : s.currentTier().subTier();
        this.currentRankPoint = s.currentRankPoint();
        this.roundsPlayed = s.roundsPlayed();
        this.avgRank = s.avgRank();
        this.top10Ratio = s.top10Ratio();
        this.winRatio = s.winRatio();
        this.wins = s.wins();
        this.kda = s.kda();
        this.damageDealt = s.damageDealt();
    }

    public void applyDuo(PubgRankStatsResponse.RankStats.Attributes.RankedGameModeStats.Duo d) {
        this.tier = d.currentTier() == null ? null : d.currentTier().tier();
        this.subTier = d.currentTier() == null ? null : d.currentTier().subTier();
        this.currentRankPoint = d.currentRankPoint();
        this.roundsPlayed = d.roundsPlayed();
        this.avgRank = d.avgRank();
        this.top10Ratio = d.top10Ratio();
        this.winRatio = d.winRatio();
        this.wins = d.wins();
        this.kda = d.kda();
        this.damageDealt = d.damageDealt();
    }

    public enum Mode {SQUAD, DUO}
}
