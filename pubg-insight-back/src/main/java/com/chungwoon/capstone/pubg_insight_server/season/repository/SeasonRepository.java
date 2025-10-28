package com.chungwoon.capstone.pubg_insight_server.season.repository;

import com.chungwoon.capstone.pubg_insight_server.season.Season;

import java.util.List;

public interface SeasonRepository {
    List<Season> fetchAll(String platform);
}
