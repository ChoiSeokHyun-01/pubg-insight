package com.chungwoon.capstone.pubg_insight_server.player.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class PlayerNotFoundException extends RuntimeException {
    public PlayerNotFoundException(String platform, String name) {
        super(platform + " 유저 " + name + "를 찾을 수 없습니다. 대소문자를 구분하니 다시 입력해주세요.");
    }
}
