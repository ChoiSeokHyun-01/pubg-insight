package com.chungwoon.capstone.pubg_insight_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;

@SpringBootApplication
@EnableCaching
public class PubgInsightServerApplication {
	public static void main(String[] args) {
		SpringApplication.run(PubgInsightServerApplication.class, args);
	}
}
