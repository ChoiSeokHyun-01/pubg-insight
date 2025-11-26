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
            summary = "해당 유저가 플레이한 매치에 대한 상세 정보 가져오기",
            description = """
                    조회 방식: DB에 있나 확인 후 있으면 반환 없으면 PUBG로 요청 전적갱신에는 포함하지 않음, 매치리스트가 없으면 전적 갱신을 애초에 안해도 됨
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

            @Parameter(name = "accountId", required = true, example = "account.c0e530e9b7244b358def282782f893af")
            @PathVariable String accountId);

}
