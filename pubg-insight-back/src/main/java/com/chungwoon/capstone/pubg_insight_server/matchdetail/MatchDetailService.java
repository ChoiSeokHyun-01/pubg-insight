package com.chungwoon.capstone.pubg_insight_server.matchdetail;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.MatchDetailResponse;
import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.ParticipantDto;
import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.RosterDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class MatchDetailService {
    private final MatchDetailFetchService matchDetailFetchService;
    private final S3MatchIncludedStorage s3MatchIncludedStorage;
    private final IncludedFinder includedFinder;

    public MatchDetailResponse getMatchDetail(String platform, String matchId, String accountId) {
        platform = platform.toLowerCase();

        MatchDetailEntity detail = matchDetailFetchService.getOrCreateMatchDetail(platform, matchId);
        List<Map<String,Object>> included = s3MatchIncludedStorage.loadIncluded(platform, matchId);

        Map<String, Object> participant = includedFinder.findParticipantsByAccountId(included, accountId);
        Map<String, Object> roster = includedFinder.findRosterByParticipantId(included, (String) participant.get("id"));

        RosterDto rosterDto = MatchDetailMapper.toRosterDto(roster);
        ParticipantDto participantDto = MatchDetailMapper.toParticipantDto(participant);

        return MatchDetailMapper.toMatchDetailResponse(detail, rosterDto, participantDto);
    }
}
