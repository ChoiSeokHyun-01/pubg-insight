package com.chungwoon.capstone.pubg_insight_server.season.controller;

import com.chungwoon.capstone.pubg_insight_server.season.DTO.SeasonResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface SeasonControllerSwagger {
    @Operation(
            summary = "사용자용 전체 시즌 목록 조회",
            description = """
                    조회 우선순위: 캐시 → DB → 필요 시 PUBG API.
                    - refresh=false(기본): 캐시/DB 반환
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "시즌 목록",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = SeasonResponse.class))
                            )
                    )
            }
    )
    List<SeasonResponse> fetchAll(
            @Parameter(
                    name = "platform", required = true, example = "steam",
                    schema = @Schema(allowableValues = {"steam", "kakao"})
            )
            @PathVariable String platform,

            @Parameter(name = "refresh", description = "사용자용은 항상 false", example = "false")
            @RequestParam(defaultValue = "false") boolean refresh
    );

    @Operation(
            summary = "어드민용 전체 시즌 목록 조회",
            description = """
                    조회 우선순위: 캐시 → DB → 필요 시 PUBG API.
                    - refresh=true: 어드민용 토큰입력 후 -> 초기 부트스트랩/강제 최신화. API → DB·캐시 저장 후 반환
                    """,
            responses = {
                    @ApiResponse(responseCode = "200", description = "시즌 목록",
                            content = @Content(
                                    mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = SeasonResponse.class))
                            )
                    )
            }
    )
    List<SeasonResponse> fetchAllForAdmin(
            @Parameter(
                    name = "platform", required = true, example = "steam",
                    schema = @Schema(allowableValues = {"steam", "kakao"})
            )
            @PathVariable String platform,

            @Parameter(name = "refresh", description = "어드민용 초기/강제 동기화 시 true", example = "true")
            @RequestParam(defaultValue = "true") boolean refresh,

            @Parameter(name = "X-ADMIN-TOKEN", description = "어드민 전용 토큰")
            @RequestHeader(defaultValue = "X-ADMIN_TOKEN") String adminToken

    );
}
