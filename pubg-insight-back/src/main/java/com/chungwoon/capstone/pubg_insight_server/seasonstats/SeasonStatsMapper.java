package com.chungwoon.capstone.pubg_insight_server.seasonstats;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.PubgSeasonStatsResponse;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsResponse;

public final class SeasonStatsMapper {
    private SeasonStatsMapper() {
    }

    public static void updateFromSquad(
            SeasonStatsEntity target,
            PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Squad newSquadData) {
        target.updateSquad(newSquadData);
    }

    public static void updateFromDuo(
            SeasonStatsEntity target,
            PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Duo newDuoData) {
        target.updateDuo(newDuoData);
    }

    public static void updateFromSolo(
            SeasonStatsEntity target,
            PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Solo newSoloData) {
        target.updateSolo(newSoloData);
    }

    public static SeasonStatsEntity toEntitySquad(
            String platform,
            String accountId,
            String seasonId,
            PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Squad squadData
    ) {
        return SeasonStatsEntity.of(
                platform, accountId, seasonId,
                SeasonStatsEntity.Mode.SQUAD,
                squadData.damageDealt(),
                squadData.headshotKills(),
                squadData.longestKill(),
                squadData.losses(),
                squadData.kills(),
                squadData.roundsPlayed(),
                squadData.timeSurvived(),
                squadData.top10s(),
                squadData.wins(),
                squadData.roundMostKills()
        );
    }

    public static SeasonStatsEntity toEntityDuo(
            String platform,
            String accountId,
            String seasonId,
            PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Duo duoData
    ) {
        return SeasonStatsEntity.of(
                platform, accountId, seasonId,
                SeasonStatsEntity.Mode.DUO,
                duoData.damageDealt(),
                duoData.headshotKills(),
                duoData.longestKill(),
                duoData.losses(),
                duoData.kills(),
                duoData.roundsPlayed(),
                duoData.timeSurvived(),
                duoData.top10s(),
                duoData.wins(),
                duoData.roundMostKills()
        );
    }

    public static SeasonStatsEntity toEntitySolo(
            String platform,
            String accountId,
            String seasonId,
            PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats.Solo soloData
    ) {
        return SeasonStatsEntity.of(
                platform, accountId, seasonId,
                SeasonStatsEntity.Mode.SOLO,
                soloData.damageDealt(),
                soloData.headshotKills(),
                soloData.longestKill(),
                soloData.losses(),
                soloData.kills(),
                soloData.roundsPlayed(),
                soloData.timeSurvived(),
                soloData.top10s(),
                soloData.wins(),
                soloData.roundMostKills()
        );
    }

    public static SeasonStatsResponse toResponse(SeasonStatsEntity e) {
        return new SeasonStatsResponse(
                e.getDamageDealt(),
                e.getHeadshotKills(),
                e.getLongestKill(),
                e.getLosses(),
                e.getKills(),
                e.getRoundsPlayed(),
                e.getTimeSurvived(),
                e.getTop10s(),
                e.getWins(),
                e.getRoundMostKills()
        );
    }

    public static SeasonStatsBundle toBundle(
            SeasonStatsEntity squad, SeasonStatsEntity duo, SeasonStatsEntity solo) {
        return new SeasonStatsBundle(
                squad == null ? null : toResponse(squad),
                duo == null ? null : toResponse(duo),
                solo == null ? null : toResponse(solo)
        );
    }
}
