package com.chungwoon.capstone.pubg_insight_server.seasonstats;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.PubgSeasonStatsResponse;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "season_stats",
        uniqueConstraints = @UniqueConstraint(columnNames = {"platform", "season_id", "account_id", "mode"}))
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Builder
public class SeasonStatsEntity {
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

    private Double damageDealt;
    private Integer headshotKills;
    private Double longestKill;
    private Integer losses;
    private Integer kills;
    private Integer roundsPlayed;
    private Integer timeSurvived;
    private Integer top10s;
    private Integer wins;
    private Integer roundMostKills;

    public static SeasonStatsEntity of(
            String platform, String accountId, String seasonId, Mode mode,
            Double damageDealt, Integer headshotKills, Double longestKill, Integer losses, Integer kills,
            Integer roundsPlayed, Integer timeSurvived, Integer top10s, Integer wins, Integer roundMostKills
    ) {
        return SeasonStatsEntity.builder()
                .platform(platform)
                .accountId(accountId)
                .seasonId(seasonId)
                .mode(mode)
                .damageDealt(damageDealt)
                .headshotKills(headshotKills)
                .longestKill(longestKill)
                .losses(losses)
                .kills(kills)
                .roundsPlayed(roundsPlayed)
                .timeSurvived(timeSurvived)
                .top10s(top10s)
                .wins(wins)
                .roundMostKills(roundMostKills)
                .build();
    }

    public void updateSquad(PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Squad newSquadData) {
        this.damageDealt = newSquadData.damageDealt();
        this.headshotKills = newSquadData.headshotKills();
        this.longestKill = newSquadData.longestKill();
        this.losses = newSquadData.losses();
        this.kills = newSquadData.kills();
        this.roundsPlayed = newSquadData.roundsPlayed();
        this.timeSurvived = newSquadData.timeSurvived();
        this.top10s = newSquadData.top10s();
        this.wins = newSquadData.wins();
        this.roundMostKills = newSquadData.roundMostKills();
    }

    public void updateDuo(PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Duo newDuoData) {
        this.damageDealt = newDuoData.damageDealt();
        this.headshotKills = newDuoData.headshotKills();
        this.longestKill = newDuoData.longestKill();
        this.losses = newDuoData.losses();
        this.kills = newDuoData.kills();
        this.roundsPlayed = newDuoData.roundsPlayed();
        this.timeSurvived = newDuoData.timeSurvived();
        this.top10s = newDuoData.top10s();
        this.wins = newDuoData.wins();
        this.roundMostKills = newDuoData.roundMostKills();
    }

    public void updateSolo(PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Solo newSoloData) {
        this.damageDealt = newSoloData.damageDealt();
        this.headshotKills = newSoloData.headshotKills();
        this.longestKill = newSoloData.longestKill();
        this.losses = newSoloData.losses();
        this.kills = newSoloData.kills();
        this.roundsPlayed = newSoloData.roundsPlayed();
        this.timeSurvived = newSoloData.timeSurvived();
        this.top10s = newSoloData.top10s();
        this.wins = newSoloData.wins();
        this.roundMostKills = newSoloData.roundMostKills();
    }

    public enum Mode {SOLO, DUO, SQUAD}
}
