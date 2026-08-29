package com.hirevia.service;

import com.hirevia.requests.LoginUserRequest;
import com.hirevia.requests.RegistrationUserRequest;
import com.hirevia.responses.AuthResponse;

public interface AuthService {
    AuthResponse registerUser(RegistrationUserRequest request);

    AuthResponse loginUser(LoginUserRequest request);
}
