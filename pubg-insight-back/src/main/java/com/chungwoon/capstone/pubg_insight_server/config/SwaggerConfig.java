package com.chungwoon.capstone.pubg_insight_server.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SwaggerConfig {
    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .addSecurityItem(new SecurityRequirement().addList("admin-token"))
                .components(new Components()
                        .addSecuritySchemes("admin-token",
                                new SecurityScheme()
                                        .name("X-ADMIN-TOKEN")
                                        .type(SecurityScheme.Type.APIKEY)
                        )
                )
                .info(apiInfo());
    }

    private Info apiInfo() {
        return new Info()
                .title("PUBG_INFO_HUB API")
                .description("PUBG_INFO_HUB RESTful API 명세서")
                .version("v1");
    }
}
