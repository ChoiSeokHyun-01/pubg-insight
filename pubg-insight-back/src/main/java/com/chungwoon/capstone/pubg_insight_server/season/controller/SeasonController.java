package com.chungwoon.capstone.pubg_insight_server.season.controller;

import com.chungwoon.capstone.pubg_insight_server.season.DTO.SeasonResponse;
import com.chungwoon.capstone.pubg_insight_server.season.Season;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonMapper;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Tag(name = "Season", description = "PUBG 시즌 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SeasonController implements SeasonControllerSwagger {

    private final SeasonService seasonService;

    @Value("${season.refresh.admin-token}")
    private String adminToken;

    @Override
    @GetMapping("{platform}/season")
    public List<SeasonResponse> fetchAll(
            @PathVariable("platform") String platform,
            @RequestParam(defaultValue = "false") boolean refresh
    ) {
        List<Season> seasons = seasonService.fetchAll(platform);
        return SeasonMapper.toSeasonResponse(seasons);
    }

    @Override
    @PostMapping("internal/{platform}/season")
    public List<SeasonResponse> fetchAllForAdmin(
            @PathVariable("platform") String platform,
            @RequestParam(defaultValue = "false") boolean refresh,
            @RequestHeader(name = "X-ADMIN-TOKEN", required = false) String adminToken
    ) {
        if (refresh) {
            if (adminToken == null || !adminToken.equals(this.adminToken)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "관리자 전용 기능입니다.");
            }
            seasonService.syncFromApi(platform);
        }
        List<Season> seasons = seasonService.fetchAll(platform);
        return SeasonMapper.toSeasonResponse(seasons);
    }
}
