package com.chungwoon.capstone.pubg_insight_server.seasonstats;

import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.PubgSeasonStatsResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
public class PubgSeasonStatsClient {
    private final WebClient.Builder webClientBuilder;

    @Value("${PUBG_API_KEY}")
    private String pubgApiKey;

    public PubgSeasonStatsResponse fetch(String platform, String accountId, String seasonId) {
        WebClient webClient = webClientBuilder
                .baseUrl("https://api.pubg.com/shards/" + platform)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + pubgApiKey)
                .defaultHeader("Accept", "application/vnd.api+json")
                .build();

        String path = String.format("/players/%s/seasons/%s", accountId, seasonId);

        return webClient.get()
                .uri(path)
                .retrieve()
                .onStatus(HttpStatusCode::isError, r ->
                        r.bodyToMono(String.class)
                                .map(msg -> new IllegalStateException("PUBG error " + r.statusCode() + ": " + msg)))
                .bodyToMono(PubgSeasonStatsResponse.class)
                .block();
    }

}
