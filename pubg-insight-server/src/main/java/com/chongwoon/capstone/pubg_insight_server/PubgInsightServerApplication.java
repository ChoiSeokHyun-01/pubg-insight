package com.chongwoon.capstone.pubg_insight_server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(exclude = {org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration.class})
public class PubgInsightServerApplication {

	public static void main(String[] args) {
		SpringApplication.run(PubgInsightServerApplication.class, args);
	}

}
