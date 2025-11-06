package com.chungwoon.capstone.pubg_insight_server.rankstats;

import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.PubgRankStatsResponse;
import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsResponse;

public final class RankStatsMapper {
    private RankStatsMapper() {
    }

    public static RankStatsEntity toEntitySquad(String platform, String accountId, String seasonId,
                                                PubgRankStatsResponse.RankStats.Attributes.RankedGameModeStats.Squad squad) {

        String tier = squad.currentTier() == null ? null : squad.currentTier().tier();
        String subTier = squad.currentTier() == null ? null : squad.currentTier().subTier();

        return RankStatsEntity.of(platform, accountId, seasonId, RankStatsEntity.Mode.SQUAD,
                tier, subTier, squad.currentRankPoint(), squad.roundsPlayed(), squad.avgRank(), squad.top10Ratio(),
                squad.winRatio(), squad.wins(), squad.kda(), squad.damageDealt()
        );
    }

    public static RankStatsEntity toEntityDuo(String platform, String accountId, String seasonId,
                                              PubgRankStatsResponse.RankStats.Attributes.RankedGameModeStats.Duo duo) {
        return RankStatsEntity.builder()
                .platform(platform).accountId(accountId).seasonId(seasonId)
                .mode(RankStatsEntity.Mode.DUO)
                .tier(duo.currentTier().tier())
                .subTier(duo.currentTier().subTier())
                .currentRankPoint(duo.currentRankPoint())
                .roundsPlayed(duo.roundsPlayed())
                .avgRank(duo.avgRank())
                .top10Ratio(duo.top10Ratio())
                .winRatio(duo.winRatio())
                .wins(duo.wins())
                .kda(duo.kda())
                .damageDealt(duo.damageDealt())
                .build();
    }

    public static void updateFromSquad(
            RankStatsEntity target, PubgRankStatsResponse.RankStats.Attributes.RankedGameModeStats.Squad squad) {
        target.applySquad(squad);
    }

    public static void updateFromDuo(
            RankStatsEntity target, PubgRankStatsResponse.RankStats.Attributes.RankedGameModeStats.Duo duo) {
        target.applyDuo(duo);
    }

    public static RankStatsResponse toResponse(RankStatsEntity e) {
        return new RankStatsResponse(
                e.getTier(),
                e.getSubTier(),
                e.getCurrentRankPoint(),
                e.getRoundsPlayed(),
                e.getAvgRank(),
                e.getTop10Ratio(),
                e.getWinRatio(),
                e.getWins(),
                e.getKda(),
                e.getDamageDealt()
        );
    }

    public static RankStatsBundle toBundle(RankStatsEntity squad, RankStatsEntity duo) {
        return new RankStatsBundle(
                squad != null ? toResponse(squad) : null,
                duo != null ? toResponse(duo) : null
        );
    }
}

