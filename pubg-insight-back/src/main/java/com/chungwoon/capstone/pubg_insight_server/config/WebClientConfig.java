package com.chungwoon.capstone.pubg_insight_server.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
    @Bean
    public WebClient.Builder webClientBuilder() {
       /*
        이 부분은 응답 데이터를 버퍼에 얼마나 저장할 수 있는지(=최대 메모리 크기) 를 지정한다.
        기본값: 약 256KB
        여기서는 4MB (4 * 1024 * 1024) 로 늘림
        → 이유: PUBG API 같은 외부 API에서 응답 JSON이 커질 수 있기 때문
        만약 PUBG API가 큰 응답(JSON 수백 KB 이상)을 보내면
        기본값 256KB에서는 DataBufferLimitException이 발생할 수 있다.
        그래서 이 설정으로 완화
         */
        ExchangeStrategies strategies = ExchangeStrategies.builder()
                .codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(4 * 1024 * 1024))
                .build();
        return WebClient.builder().exchangeStrategies(strategies);
    }
}
