package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.*;

import java.util.List;
import java.util.Map;

public class MatchDetailMapper {
    private MatchDetailMapper() {
    }

    public static MatchDetailEntity fromPubgData(
            String platform,
            PubgMatchDetailResponse.PubgMatchDetailData data,
            String includedS3key
    ) {
        return MatchDetailEntity.of(platform, data, includedS3key);
    }

    @SuppressWarnings("unchecked")
    public static RosterDto toRosterDto(Map<String, Object> roster) {
        String roster_id = roster.get("id").toString();

        Map<String, Object> attributes = (Map<String, Object>) roster.get("attributes");
        String won = (String) attributes.get("won");

        Map<String, Object> stats = (Map<String, Object>) attributes.get("stats");
        Integer rank = (Integer) stats.get("rank");
        Integer teamId = (Integer) stats.get("teamId");

        Map<String, Object> relationships = (Map<String, Object>) roster.get("relationships");

        Map<String, Object> participants = (Map<String, Object>) relationships.get("participants");

        List<Map<String, Object>> data = (List<Map<String, Object>>) participants.get("data");
        List<String> participantIds = data.stream().map(p -> p.get("id").toString()).toList();

        return new RosterDto(
                "roster",
                roster_id,
                rank,
                teamId,
                won,
                participantIds
        );
    }

    @SuppressWarnings("unchecked")
    public static ParticipantDto toParticipantDto(Map<String, Object> participant) {
        String participant_id = (String) participant.get("id");
        Map<String, Object> attributes = (Map<String, Object>) participant.get("attributes");
        Map<String, Object> stats = (Map<String, Object>) attributes.get("stats");

        return new ParticipantDto(
                "participants",
                participant_id,
                toParticipantStatsDto(stats)
        );
    }

    public static MatchDetailResponse toMatchDetailResponse(
            MatchDetailEntity detail,
            RosterDto rosterDto,
            ParticipantDto participantDto) {
        return new MatchDetailResponse(
                "match",
                detail.getMatchId(),
                detail.getMatchType(),
                detail.getSeasonState(),
                detail.getDuration(),
                detail.getMapName(),
                detail.getIsCustomMatch(),
                detail.getTitleId(),
                null,
                detail.getCreatedAt(),
                null,
                detail.getGameMode(),
                rosterDto,
                participantDto
        );
    }

    private static ParticipantStatsDto toParticipantStatsDto(Map<String, Object> stats) {
        return new ParticipantStatsDto(
                (Integer) stats.get("DBNOs"),
                (Integer) stats.get("assists"),
                (Integer) stats.get("boosts"),
                toDouble(stats.get("damageDealt")),
                (String) stats.get("deathType"),
                (Integer) stats.get("headshotKills"),
                (Integer) stats.get("heals"),
                (Integer) stats.get("killPlace"),
                (Integer) stats.get("killStreaks"),
                (Integer) stats.get("kills"),
                toDouble(stats.get("longestKill")),
                (String) stats.get("name"),
                (String) stats.get("playerId"),
                (Integer) stats.get("revives"),
                toDouble(stats.get("rideDistance")),
                (Integer) stats.get("roadKills"),
                toDouble(stats.get("swimDistance")),
                (Integer) stats.get("teamKills"),
                (Integer) stats.get("timeSurvived"),
                (Integer) stats.get("vehicleDestroys"),
                toDouble(stats.get("weaponsAcquired")),
                (Integer) stats.get("weaponsAcquired"),
                (Integer) stats.get("winPlace")
        );
    }

    private static Double toDouble(Object value) {
        if (value == null) return null;
        if (value instanceof Number n) return n.doubleValue();
        return Double.valueOf(value.toString());
    }


}
