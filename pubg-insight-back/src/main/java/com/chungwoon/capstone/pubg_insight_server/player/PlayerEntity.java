package com.chungwoon.capstone.pubg_insight_server.player;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "players",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_player_platform", columnNames = {"account_id", "shard_id"})
        })
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class PlayerEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_id", nullable = false, length = 64)
    private String accountId;

    @Column(nullable = false, length = 32)
    private String name;

    @Column(name = "shard_id", nullable = false, length = 16)
    private String shardId;

    @Column(length = 64)
    private String clanId;
}
