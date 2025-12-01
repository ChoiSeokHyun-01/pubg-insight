package com.chungwoon.capstone.pubg_insight_server.historyrefresh.controller;

import com.chungwoon.capstone.pubg_insight_server.historyrefresh.dto.HistoryRefreshResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;

public interface HistoryRefreshControllerSwagger {
    @Operation(
            summary = "전적 갱신 기능",
            description = """
                    조회 방식: 시즌, 랭크 통계를 refresh를 true로 하여 갱신이 자동으로 되고, 전적은 기존 전적과 비교하여 새로운 전적이 있으면 새로운 전적까지 추가한 매치리스트 반환
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "유저의 시즌, 랭크, 전적 정보 갱신하기",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = HistoryRefreshResponse.class)
                            )
                    )
            }
    )
    public HistoryRefreshResponse refreshHistory(
            @Parameter(name = "platform", required = true, example = "steam",
                    schema = @Schema(allowableValues = {"steam", "kakao"}))

            @PathVariable String platform,

            @Parameter(name = "accountId", required = true, example = "account.c0e530e9b7244b358def282782f893af")
            @PathVariable String accountId,

            @Parameter(name = "name", required = true, example = "WackyJacky101")
            @PathVariable String name
    );
}
