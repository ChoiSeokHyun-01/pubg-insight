package com.chungwoon.capstone.pubg_insight_server.player;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PubgPlayerResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.Optional;

@Component
@RequiredArgsConstructor
public class PubgPlayerClient {
    private final WebClient.Builder webClientBuilder;

    @Value("${PUBG_API_KEY}")
    private String pubgApiKey;

    public Optional<PubgPlayerResponse.PlayerData> findByName(String platform, String playerName) {
        String url = "https://api.pubg.com/shards/" + platform + "/players?filter[playerNames]=" + playerName;
        PubgPlayerResponse body = webClientBuilder.build()
                .get()
                .uri(url)
                .header("Authorization", "Bearer " + pubgApiKey)
                .header("Accept", "application/vnd.api+json")
                .exchangeToMono(res -> {
                    if (res.statusCode().value() == 404) {
                        // 404면 그냥 결과 없음
                        return Mono.empty();
                    }
                    if (res.statusCode().isError()) {
                        return res.createException().flatMap(Mono::error);
                    }
                    return res.bodyToMono(PubgPlayerResponse.class);
                })
                .block();

        if (body == null || body.data() == null || body.data().isEmpty()) return Optional.empty();
        return Optional.of(body.data().get(0)); // 첫 결과 사용
    }
}
