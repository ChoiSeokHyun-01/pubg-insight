package com.chungwoon.capstone.pubg_insight_server;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins={
  "http://localhost:5173",
  "https://pubginfohub.com",
  "https://www.pubginfohub.com",
  "https://api.pubginfohub.com"
})
public class HealthCheckController {
  @GetMapping(value="/healthcheck", produces="text/plain")
  public String healthCheck() { return "OK"; }
}
