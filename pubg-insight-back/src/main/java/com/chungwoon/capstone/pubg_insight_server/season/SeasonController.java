package com.chungwoon.capstone.pubg_insight_server.season;

import com.chungwoon.capstone.pubg_insight_server.season.seasonDTO.SeasonResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/seasons")
public class SeasonController {
    private final SeasonService seasonService;

    @GetMapping
    public List<SeasonResponse> fetchAll(
            @RequestParam String platform,
            @RequestParam(defaultValue = "false") boolean refresh) {

        if (refresh) seasonService.syncFromApi(platform);
        List<Season> seasons = seasonService.fetchAll(platform);

        return SeasonMapper.toSeasonResponse(seasons);
    }
}
