package com.chungwoon.capstone.pubg_insight_server.match;

import com.chungwoon.capstone.pubg_insight_server.player.PlayerEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "matches",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_match", columnNames = {"player_id", "match_id"})
        })
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class MatchEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "player_id",
            referencedColumnName = "id",
            nullable = false,
            foreignKey = @ForeignKey(name = "fk_match_player"))
    private PlayerEntity player;

    @Column(name = "match_id", nullable = false, length = 40)
    private String matchId;
}
