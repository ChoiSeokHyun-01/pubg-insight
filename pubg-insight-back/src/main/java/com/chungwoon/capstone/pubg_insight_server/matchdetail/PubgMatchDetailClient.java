package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.PubgMatchDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@RequiredArgsConstructor
@Component
public class PubgMatchDetailClient {
    private final WebClient.Builder webClientBuilder;

    @Value("${PUBG_API_KEY}")
    private String pubgApiKey;

    public PubgMatchDetailResponse fetch(String platform, String matchId) {
        WebClient webClient = webClientBuilder
                .baseUrl("https://api.pubg.com/shards/" + platform)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + pubgApiKey)
                .defaultHeader("Accept", "application/vnd.api+json")
                .build();

        String path = String.format(("/matches/%s"), matchId);

        return webClient.get()
                .uri(path)
                .retrieve()
                .onStatus(HttpStatusCode::isError, r ->
                        r.bodyToMono(String.class)
                                .map(msg -> new IllegalStateException("PUBG error " + r.statusCode() + ": " + msg)))
                .bodyToMono(PubgMatchDetailResponse.class)
                .block();
    }
}
