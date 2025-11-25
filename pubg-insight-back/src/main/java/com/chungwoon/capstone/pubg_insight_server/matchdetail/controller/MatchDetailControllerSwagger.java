package com.chungwoon.capstone.pubg_insight_server.matchdetail.controller;

import com.chungwoon.capstone.pubg_insight_server.matchdetail.dto.MatchDetailResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;

public interface MatchDetailControllerSwagger {
    @Operation(
            summary = "해당 유저의 전적 기록 가져오기",
            description = """
                    조회 방식: DB에 있나 확인 후 있으면 반환 없으면 PUBG로 요청,
                    
                    refresh를 true로 하면 전적갱신 (PUBG에서 데이터를 가져와 DB에 저장 후 반환)
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "플레이어의 매치 전적 가져오기",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = MatchDetailResponse.class)
                            )
                    )
            }
    )
    public MatchDetailResponse getMatchDetail(
            @Parameter(name = "platform", required = true, example = "steam",
                    schema = @Schema(allowableValues = {"steam", "kakao"}))
            @PathVariable String platform,

            @Parameter(name = "matchId", required = true, example = "abcd-1234-efgh-5678")
            @PathVariable String matchId,

            @Parameter(name = "accountId", required = true, example = "account.12341234")
            @PathVariable String accountId);

}
