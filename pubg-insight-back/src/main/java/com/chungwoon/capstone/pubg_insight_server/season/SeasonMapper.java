package com.chungwoon.capstone.pubg_insight_server.season;

import com.chungwoon.capstone.pubg_insight_server.season.seasonDTO.SeasonResponse;

import java.time.Instant;
import java.util.List;

public final class SeasonMapper {
    private SeasonMapper() {
    }

    // 단일 Season -> SeasonResponse 변환
    public static SeasonResponse toSeasonResponse(Season s) {
        return new SeasonResponse(s.seasonId(), s.isCurrent(), s.isOffseason());
    }

    // 여러 Season -> SeasonResponse 리스트 변환
    public static List<SeasonResponse> toSeasonResponse(List<Season> seasonList) {
        return seasonList
                .stream()
                .map(SeasonMapper::toSeasonResponse)
                .toList();
    }

    // 외부 API로 받은 Season -> DB 저장용 SeasonEntity 변환
    public static SeasonEntity toEntity(Season s, String platform) {
        return SeasonEntity.of(
                s.seasonId(),
                platform,
                s.isCurrent(),
                s.isOffseason(),
                Instant.now()
        );
    }

    // DB SeasonEntity -> 내부 도메인 Season 변환
    public static Season toDomain(SeasonEntity e) {
        return new Season(
                e.getSeasonId(),
                e.isCurrent(),
                e.isOffseason()
        );
    }
}
