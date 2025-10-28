package com.chungwoon.capstone.pubg_insight_server.season;

import com.chungwoon.capstone.pubg_insight_server.season.repository.SeasonJpaRepository;
import com.chungwoon.capstone.pubg_insight_server.season.repository.SeasonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SeasonService {
    private final SeasonRepository seasonRepository;
    private final SeasonJpaRepository seasonJpaRepository;

    @Cacheable(cacheNames = "seasonCache",
            key = "'season:list:' + #platform",
            unless = "#result == null || #result.isEmpty()")
    public List<Season> fetchAll(String platform) {
        var platformLower = platform.toLowerCase();
        return seasonJpaRepository.findAllByPlatform(platformLower).stream().map(SeasonMapper::toDomain).toList();
    }

    @Transactional
    @CacheEvict(cacheNames = "seasonCache", key = "'season:list:' + #platform")
    public void syncFromApi(String platform) {
        var p = platform.toLowerCase();
        var api = seasonRepository.fetchAll(p);
        seasonJpaRepository.deleteByPlatform(p);
        var entities = api.stream().map(s -> SeasonMapper.toEntity(s, p)).toList();
        seasonJpaRepository.saveAll(entities);
    }
}
