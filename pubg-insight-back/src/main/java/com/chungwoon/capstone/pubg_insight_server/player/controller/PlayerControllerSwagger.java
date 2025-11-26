package com.chungwoon.capstone.pubg_insight_server.player.controller;

import com.chungwoon.capstone.pubg_insight_server.player.DTO.PlayerResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;

public interface PlayerControllerSwagger {
    @Operation(
            summary = "닉네임으로 해당 플레이어 정보 조회",
            description = """
                    조회 우선순위: DB -> 있으면 반환 없으면 -> PUBG API -> 있으면 DB 저장 후 반환 없으면 존재하지 않는 사용자
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "플레이어 정보",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = PlayerResponse.class)
                            )
                    )
            }
    )
    PlayerResponse getByName(
            @Parameter(name = "platform", required = true, example = "steam",
                    schema = @Schema(allowableValues = {"steam", "kakao"}))
            @PathVariable String platform,

            @Parameter(name = "name", description = "대소문자 구분", example = "WackyJacky101")
            @PathVariable String name
    );
}
