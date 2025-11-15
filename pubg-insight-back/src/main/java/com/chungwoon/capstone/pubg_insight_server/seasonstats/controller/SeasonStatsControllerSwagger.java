package com.chungwoon.capstone.pubg_insight_server.seasonstats.controller;

import com.chungwoon.capstone.pubg_insight_server.rankstats.DTO.RankStatsBundle;
import com.chungwoon.capstone.pubg_insight_server.seasonstats.dto.SeasonStatsBundle;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

public interface SeasonStatsControllerSwagger {
    @Operation(
            summary = "해당 유저의 시즌 통계 가져오기",
            description = """
                    조회 방식: DB에 있나 확인 후 있으면 반환 없으면 빈 값으로 반환,
                    
                    refresh를 true로 하면 전적갱신 (PUBG에서 데이터를 가져와 DB에 저장 후 반환)
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "플레이어의 시즌 통계",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = RankStatsBundle.class)
                            )
                    )
            }
    )
    public ResponseEntity<SeasonStatsBundle> get(
            @Parameter(name = "platform", required = true, example = "steam",
                    schema = @Schema(allowableValues = {"steam", "kakao"}))
            @PathVariable String platform,

            @Parameter(name = "name", required = true, example = "WackyJacky101")
            @PathVariable String name,

            @Parameter(name = "seasonId", required = false, example = "division.bro.official.pc-2018-37", description = "현재 시즌이 아닐 경우만 입력")
            @RequestParam(required = false) String seasonId,

            @Parameter(name = "refresh", required = false, example = "false", description = "전적 갱신할 때만 true")
            @RequestParam(defaultValue = "false") boolean refresh
    );
}
