package com.chungwoon.capstone.pubg_insight_server.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
@EnableCaching
public class CacheConfig {
    @Bean
    public CacheManager cacheManager() {
        CaffeineCacheManager cacheManager = new CaffeineCacheManager("seasonCache");
        cacheManager.setCaffeine(caffeineConfig());

        return cacheManager;
    }
    private Caffeine<Object, Object> caffeineConfig() {
        return Caffeine.newBuilder()
                .maximumSize(32) // 키 갯수를 기준으로 33번째가 들어온다면 LRU에 의해 하나 제거
                .expireAfterWrite(Duration.ofDays(60))
                .recordStats();
    }
}
