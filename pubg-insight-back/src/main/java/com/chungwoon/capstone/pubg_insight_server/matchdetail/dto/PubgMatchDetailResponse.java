package com.chungwoon.capstone.pubg_insight_server.matchdetail.dto;

import java.util.List;
import java.util.Map;

public record PubgMatchDetailResponse(
        PubgMatchDetailData data,
        List<Map<String, Object>> included
) {
    public record PubgMatchDetailData(
            String type,
            String id,
            Attributes attributes
    ) {
        public record Attributes(
                String matchType,
                String seasonState,
                Integer duration,
                String mapName,
                Boolean isCustomMatch,
                String titleId,
                String shardId,
                Object tags,
                String createdAt,
                Object stats,
                String gameMode
        ) {
        }
    }
}
