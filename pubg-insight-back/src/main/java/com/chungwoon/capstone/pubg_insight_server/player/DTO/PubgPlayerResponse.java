package com.chungwoon.capstone.pubg_insight_server.player.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public record PubgPlayerResponse(
        List<PlayerData> data
) {
    @JsonIgnoreProperties(ignoreUnknown = true)
    public record PlayerData(
            String id,                 // accountId
            Attributes attributes,
            Relationships relationships
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Attributes(
            String name,
            String shardId,
            String clanId
    ) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Relationships(Matches matches) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record Matches(List<MatchRef> data) {
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public record MatchRef(String id) {
    }
}
