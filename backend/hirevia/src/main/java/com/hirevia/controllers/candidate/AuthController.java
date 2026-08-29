package com.hirevia.controllers.candidate;

import com.hirevia.requests.LoginUserRequest;
import com.hirevia.requests.RegistrationUserRequest;
import com.hirevia.responses.AuthResponse;
import com.hirevia.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signupHandler(@Valid @RequestBody RegistrationUserRequest request) {
        AuthResponse response = authService.registerUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginHandler(@Valid @RequestBody LoginUserRequest request) {
        AuthResponse response = authService.loginUser(request);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
