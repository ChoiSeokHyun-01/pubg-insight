package com.chungwoon.capstone.pubg_insight_server.season.repository;


import com.chungwoon.capstone.pubg_insight_server.season.Season;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Repository;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Locale;

@Repository
@RequiredArgsConstructor
public class PubgSeasonRepository implements SeasonRepository {

    private final WebClient.Builder webClientBuilder;

    @Value("${PUBG_API_KEY}")
    private String pubgApiKey;

    @Override
    public List<Season> fetchAll(String platform) {
        platform = platform.toLowerCase(Locale.ROOT);

        WebClient webClient = webClientBuilder
                .baseUrl("https://api.pubg.com/shards/" + platform)
                .defaultHeader("Authorization", "Bearer " + pubgApiKey)
                .defaultHeader("Accept", "application/vnd.api+json")
                .build();

        PubgSeasonResponse response = webClient.get()
                .uri("/seasons")
                .retrieve()
                .onStatus(HttpStatusCode::isError, r ->
                        r.bodyToMono(String.class).map(msg -> new IllegalStateException("PUBG error " + r.statusCode() + ": " + msg)))
                .bodyToMono(PubgSeasonResponse.class)
                .block();

        if (response == null || response.data() == null) return List.of();

        return response.data().stream()
                .map(d -> new Season(d.id(), d.attributes().isCurrent(), d.attributes().isOffseason()))
                .toList();
    }

    // 외부 응답(PUBG API) 매핑용 내부 레코드
    private record PubgSeasonResponse(List<Data> data) {
        private record Data(String id, Attr attributes) {
        }

        private record Attr(
                @JsonProperty("isCurrentSeason") boolean isCurrent,
                @JsonProperty("isOffseason") boolean isOffseason) {
        }
    }


}
