package com.hirevia.controllers.candidate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class HealthCheckController {

    @GetMapping({"/", "/health-check"})
    public ResponseEntity<Map<String, Object>> healthCheckHandler() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Hire Via REST API is running successfully on Render Cloud!");
        response.put("version", "1.0.0");
        return ResponseEntity.ok(response);
    }
}
