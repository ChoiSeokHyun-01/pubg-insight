package com.chungwoon.capstone.pubg_insight_server.season;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.util.Locale;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(
        name = "seasons",
        uniqueConstraints = @UniqueConstraint(columnNames = {"season_id", "platform"}) // 복합키
)
public class SeasonEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // 내부 식별자

    @Column(name = "season_id", length = 64, nullable = false)
    private String seasonId;     // PUBG 시즌 ID (문자열)

    @Column(nullable = false)
    private boolean current;

    @Column(nullable = false)
    private boolean offseason;

    @Column(nullable = false, length = 16)
    private String platform;

    @Column(nullable = false)
    private Instant fetchedAt;

    @Builder
    // 테스트 코드 같은 곳에서 사용
    private SeasonEntity(String seasonId, Boolean current, Boolean offseason, String platform, Instant fetchedAt) {
        this.seasonId = seasonId;
        this.current = current != null ? current : false;
        this.offseason = offseason != null ? offseason : false;
        this.platform = platform != null ? platform.toLowerCase() : null;
        this.fetchedAt = fetchedAt != null ? fetchedAt : Instant.now();
    }

    // 실제 DB에 저장할 때 사용
    public static SeasonEntity of(String seasonId, String platform, boolean current, boolean offseason, Instant fetchedAt) {
        if (current && offseason) throw new IllegalArgumentException("current, offseason 동시 true 금지");
        return SeasonEntity.builder()
                .seasonId(seasonId)
                .platform(platform.toLowerCase(Locale.ROOT))
                .current(current)
                .offseason(offseason)
                .fetchedAt(fetchedAt != null ? fetchedAt : Instant.now())
                .build();
    }
}

