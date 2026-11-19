package com.society360;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class Society360Application {

    public static void main(String[] args) {
        SpringApplication.run(Society360Application.class, args);
    }
}
