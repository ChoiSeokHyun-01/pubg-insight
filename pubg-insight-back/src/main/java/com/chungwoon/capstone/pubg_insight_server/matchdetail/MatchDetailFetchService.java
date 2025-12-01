package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.PubgMatchDetailResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
@RequiredArgsConstructor
public class MatchDetailFetchService {
    private final PubgMatchDetailClient pubgMatchDetailClient;
    private final MatchDetailRepository matchDetailRepository;
    private final S3MatchIncludedStorage s3MatchIncludedStorage;

    public MatchDetailEntity getOrCreateMatchDetail(String platform, String matchId) {
        String platformLowerCase = platform.toLowerCase(Locale.ROOT);

        return matchDetailRepository.findByPlatformAndMatchId(platformLowerCase, matchId)
                .orElseGet(() -> fetchAndStore(platformLowerCase, matchId));
    }

    private MatchDetailEntity fetchAndStore(String platform, String matchId) {
        PubgMatchDetailResponse response = pubgMatchDetailClient.fetch(platform, matchId);

        String shardId = response.data().attributes().shardId();

        if (!shardId.equals(platform)) {
            throw new IllegalArgumentException("요청한 플랫폼과 실제 응답 데이터의 플랫폼이 일치하지 않습니다.");
        }
        s3MatchIncludedStorage.saveIncluded(platform, matchId, response.included());
        String includedS3key = s3MatchIncludedStorage.buildKey(platform, matchId);

        return matchDetailRepository.save(MatchDetailMapper.fromPubgData(platform, response.data(), includedS3key));
    }
}
