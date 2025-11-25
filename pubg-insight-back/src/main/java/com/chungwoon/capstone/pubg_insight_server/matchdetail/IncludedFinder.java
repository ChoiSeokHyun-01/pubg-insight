package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class IncludedFinder {

    @SuppressWarnings("unchecked")
    public Map<String, Object> findParticipantsByAccountId(List<Map<String, Object>> included, String accountId) {
        return included.stream()
                .filter(obj -> "participant".equals(obj.get("type")))
                .filter(obj -> {
                    Map<String, Object> attributes = (Map<String, Object>) obj.get("attributes");
                    Map<String, Object> stats = (Map<String, Object>) attributes.get("stats");
                    return accountId.equals(stats.get("playerId"));
                })
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 account_id에 대한 플레이어를 찾지 못했습니다." + accountId));

    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> findRosterByParticipantId(List<Map<String, Object>> included, String participantId) {
        return included.stream()
                .filter(obj -> "roster".equals(obj.get("type")))
                .filter(obj -> {
                    Map<String, Object> relationships = (Map<String, Object>) obj.get("relationships");
                    Map<String, Object> participants = (Map<String, Object>) relationships.get("participants");
                    List<Map<String, Object>> data = (List<Map<String, Object>>) participants.get("data");
                    return data.stream().anyMatch(p -> participantId.equals(p.get("id")));
                })
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 participant_id에 대한 팀 정보를 찾지 못했습니다." + participantId));
    }
}
