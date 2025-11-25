package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.PubgMatchDetailResponse;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "match_details",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_match_detail_platform_match_id",
                columnNames = {"match_id", "platform"}
        )
)
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class MatchDetailEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "match_id", nullable = false, length = 40)
    private String matchId;

    @Column(nullable = false, length = 16)
    private String platform;

    @Column(name = "match_type", length = 32)
    private String matchType;

    @Column(name = "season_state", length = 32)
    private String seasonState;

    @Column(name = "duration_seconds")
    private Integer duration;

    @Column(name = "map_name", length = 64)
    private String mapName;

    @Column(name = "is_custom_match")
    private Boolean isCustomMatch;

    @Column(name = "title_id", length = 64)
    private String titleId;

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "game_mode", length = 32)
    private String gameMode;

    // included JSON 저장한 S3 key
    @Column(name = "included_s3_key")
    private String includedS3Key;

    @Builder
    private MatchDetailEntity(
            String matchId,
            String platform,
            String matchType,
            String seasonState,
            Integer duration,
            String mapName,
            Boolean isCustomMatch,
            String titleId,
            Instant createdAt,
            String gameMode,
            String includedS3Key
    ){
        this.matchId = matchId;
        this.platform = platform;
        this.matchType = matchType;
        this.seasonState = seasonState;
        this.duration = duration;
        this.mapName = mapName;
        this.isCustomMatch = isCustomMatch;
        this.titleId = titleId;
        this.createdAt = createdAt;
        this.gameMode = gameMode;
        this.includedS3Key = includedS3Key;
    }

    public static MatchDetailEntity of(
            String platform,
            PubgMatchDetailResponse.PubgMatchDetailData data,
            String includedS3Key) {

        PubgMatchDetailResponse.PubgMatchDetailData.Attributes attributes = data.attributes();

        return MatchDetailEntity.builder()
                .matchId(data.id())
                .platform(platform)
                .matchType(attributes.matchType())
                .seasonState(attributes.seasonState())
                .duration(attributes.duration())
                .mapName(attributes.mapName())
                .isCustomMatch(attributes.isCustomMatch())
                .titleId(attributes.titleId())
                .createdAt(Instant.parse(attributes.createdAt()))
                .gameMode(attributes.gameMode())
                .includedS3Key(includedS3Key)
                .build();
    }
}
