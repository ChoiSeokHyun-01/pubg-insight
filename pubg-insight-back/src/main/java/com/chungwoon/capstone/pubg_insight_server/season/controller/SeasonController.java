package com.chungwoon.capstone.pubg_insight_server.season.controller;

import com.chungwoon.capstone.pubg_insight_server.season.Season;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonMapper;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonService;
import com.chungwoon.capstone.pubg_insight_server.season.seasonDTO.SeasonResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Season", description = "PUBG 시즌 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seasons")
public class SeasonController implements SeasonControllerSwagger {

    private final SeasonService seasonService;

    @Override
    @GetMapping("/{platform}")
    public List<SeasonResponse> fetchAll(
            @PathVariable("platform") String platform,
            @RequestParam(defaultValue = "false") boolean refresh) {
        if (refresh) seasonService.syncFromApi(platform);
        List<Season> seasons = seasonService.fetchAll(platform);
        return SeasonMapper.toSeasonResponse(seasons);
    }
}
