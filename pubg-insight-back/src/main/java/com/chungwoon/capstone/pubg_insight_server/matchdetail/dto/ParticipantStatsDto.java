package com.chungwoon.capstone.pubg_insight_server.matchdetail.dto;

public record ParticipantStatsDto(
        Integer DBNOs,
        Integer assists,
        Integer boosts,
        Double damageDealt,
        String deathType,
        Integer headshotKills,
        Integer heals,
        Integer killPlace,
        Integer killStreaks,
        Integer kills,
        Double longestKill,
        String name,
        String playerId,
        Integer revives,
        Double rideDistance,
        Integer roadKills,
        Double swimDistance,
        Integer teamKills,
        Integer timeSurvived,
        Integer vehicleDestroys,
        Double walkDistance,
        Integer weaponsAcquired,
        Integer winPlace
) {
}
