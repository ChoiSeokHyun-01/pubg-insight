package com.chungwoon.capstone.pubg_insight_server.seasonstats;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.PubgSeasonStatsResponse;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.repository.SeasonStatsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SeasonStatsService {
    private final SeasonStatsRepository seasonStatsRepository;
    private final PubgSeasonStatsClient pubgSeasonStatsClient;

    /*
     * DB에서 검색 후 있으면 리턴 없으면 pubg 요청 후 응답 받은 다음 디비에 저장 후 리턴
     */

    public SeasonStatsBundle get(String platform, String accountId, String seasonId, boolean refresh) {
        if (!refresh) {
            Optional<SeasonStatsEntity> squad = seasonStatsRepository
                    .find(platform, accountId, seasonId, SeasonStatsEntity.Mode.SQUAD);
            Optional<SeasonStatsEntity> duo = seasonStatsRepository
                    .find(platform, accountId, seasonId, SeasonStatsEntity.Mode.DUO);
            Optional<SeasonStatsEntity> solo = seasonStatsRepository
                    .find(platform, accountId, seasonId, SeasonStatsEntity.Mode.SOLO);
            return SeasonStatsMapper.toBundle(squad.orElse(null), duo.orElse(null), solo.orElse(null));
        }
        return refreshAndGet(platform, accountId, seasonId);
    }

    public SeasonStatsBundle refreshAndGet(String platform, String accountId, String seasonId) {
        PubgSeasonStatsResponse response = pubgSeasonStatsClient.fetch(platform, accountId, seasonId);

        if (response == null || response.data() == null) {
            return SeasonStatsBundle.empty();
        }

        PubgSeasonStatsResponse.SeasonStats.Attributes attributes = response.data().attributes();
        if (attributes == null || attributes.gameModeStats() == null) {
            return SeasonStatsBundle.empty();
        }

        PubgSeasonStatsResponse.SeasonStats.Attributes.GameModeStats modes
                = attributes.gameModeStats();

        SeasonStatsEntity squadEntity = null;
        SeasonStatsEntity duoEntity = null;
        SeasonStatsEntity soloEntity = null;

        if (modes.squad() != null) {
            squadEntity = seasonStatsRepository.find(platform, accountId, seasonId, SeasonStatsEntity.Mode.SQUAD)
                    .map(e -> {
                        SeasonStatsMapper.updateFromSquad(e, modes.squad());
                        return e;
                    })
                    .orElseGet(() -> seasonStatsRepository.save(
                            SeasonStatsMapper.toEntitySquad(platform, accountId, seasonId, modes.squad())
                    ));
        }

        if (modes.duo() != null) {
            duoEntity = seasonStatsRepository.find(platform, accountId, seasonId, SeasonStatsEntity.Mode.DUO)
                    .map(e -> {
                        SeasonStatsMapper.updateFromDuo(e, modes.duo());
                        return e;
                    })
                    .orElseGet(() -> seasonStatsRepository.save(
                            SeasonStatsMapper.toEntityDuo(platform, accountId, seasonId, modes.duo())
                    ));
        }
        if (modes.solo() != null) {
            soloEntity = seasonStatsRepository.find(platform, accountId, seasonId, SeasonStatsEntity.Mode.SOLO)
                    .map(e -> {
                        SeasonStatsMapper.updateFromSolo(e, modes.solo());
                        return e;
                    })
                    .orElseGet(() -> seasonStatsRepository.save(
                            SeasonStatsMapper.toEntitySolo(platform, accountId, seasonId, modes.solo())
                    ));
        }
        return SeasonStatsMapper.toBundle(squadEntity, duoEntity, soloEntity);
    }
}
