package com.chungwoon.capstone.pubg_insight_server.season.controller;

import com.chungwoon.capstone.pubg_insight_server.season.Season;
import com.chungwoon.capstone.pubg_insight_server.season.SeasonMapper;
import com.chungwoon.capstone.pubg_insight_server.season.seasonDTO.SeasonResponse;
//import com.chungwoon.capstone.pubg_insight_server.season.service.RankStatsService;
import com.chungwoon.capstone.pubg_insight_server.season.service.SeasonService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Season", description = "PUBG 시즌 관련 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class SeasonController implements SeasonControllerSwagger {

    private final SeasonService seasonService;
//    private final RankStatsService rankStatsService;


    @Override
    @GetMapping("{platform}/season")
    public List<SeasonResponse> fetchAll(
            @PathVariable("platform") String platform,
            @RequestParam(defaultValue = "false") boolean refresh) {
        if (refresh) seasonService.syncFromApi(platform);
        List<Season> seasons = seasonService.fetchAll(platform);
        return SeasonMapper.toSeasonResponse(seasons);
    }

//    @GetMapping("{platform}/player/{accountId}/season/{seasonId}/ranked")
//    public RankedStatsResponse getRankedStats(
//            @PathVariable String platform,
//            @PathVariable String accountId,
//            @PathVariable(required = false) String seasonId,
//            @RequestParam(defaultValue = "false") boolean refresh
//    ) {
//        String resolvedSeasonId = seasonId == null ? seasonService.getCurrentSeasonId(platform) : seasonId;
//        return rankStatsService.getRankedStats(platform, accountId, resolvedSeasonId, refresh);
//    }
}
