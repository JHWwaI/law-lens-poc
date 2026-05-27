package com.widea.lawlens;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class LawLensApplication {
    public static void main(String[] args) {
        SpringApplication.run(LawLensApplication.class, args);
    }
}
