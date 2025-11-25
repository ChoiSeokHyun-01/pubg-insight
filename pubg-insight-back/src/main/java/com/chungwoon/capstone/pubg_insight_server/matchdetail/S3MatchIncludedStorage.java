package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import software.amazon.awssdk.core.ResponseInputStream;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@RequiredArgsConstructor
@Component
public class S3MatchIncludedStorage {

    private final S3Client amazonS3;
    private final ObjectMapper objectMapper;

    @Value("${app.s3.match-bucket}")
    private String bucket;

    public void saveIncluded(String platform, String matchId, List<Map<String, Object>> included) {
        String key = buildKey(platform, matchId);

        try {
            String json = objectMapper.writeValueAsString(included);

            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .build();

            amazonS3.putObject(request, RequestBody.fromString(json));

        } catch (IOException e) {
            throw new RuntimeException("Included 배열 직렬화에 실패했습니다.", e);
        }
    }

    public List<Map<String, Object>> loadIncluded(String platform, String matchId) {
        String key = buildKey(platform, matchId);

        GetObjectRequest request = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        try (ResponseInputStream<?> s3is = amazonS3.getObject(request)) {
            return objectMapper.readValue(s3is, new TypeReference<List<Map<String, Object>>>() {
            });
        } catch (NoSuchKeyException e) {
            return null;
        } catch (IOException e) {
            throw new RuntimeException("included.json 역직렬화 실패: " + key, e);
        }
    }

    protected String buildKey(String platform, String matchId) {
        return String.format("matches/%s/%s/included.json", platform.toLowerCase(Locale.ROOT), matchId);
    }
}
