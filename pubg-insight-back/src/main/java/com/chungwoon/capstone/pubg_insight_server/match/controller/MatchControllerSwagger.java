package com.chungwoon.capstone.pubg_insight_server.match.controller;

import com.chungwoon.capstone.pubg_insight_server.match.dto.MatchResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;

public interface MatchControllerSwagger {
    @Operation(
            summary = "해당 유저가 플레이한 매치 목록 가져오기",
            description = """
                    조회 방식: player 정보에 대한 api를 호출하면 자동으로 매치목록이 테이블에 등록되므로 바로 DB에서 조회 
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 매치 목록 가져오기",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = MatchResponse.class)
                            )
                    )
            }
    )
    public MatchResponse getMatch(
            @Parameter(name = "accountId", required = true, example = "account.c0e530e9b7244b358def282782f893af")
            @PathVariable String accountId);
}
