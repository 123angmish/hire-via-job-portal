package com.hirevia.controllers.candidate;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.GetMapping;

@RestController
public class HealthCheckController {

    @GetMapping("/health-check")
    public String healthCheckHandler() {
        return "Everything Is Okay!";
    }

}
