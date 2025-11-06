package com.rsm.retailbackend.feature.auth.service;

import com.rsm.retailbackend.feature.auth.dto.AuthResponse;
import com.rsm.retailbackend.feature.auth.dto.LoginRequest;
import com.rsm.retailbackend.feature.auth.dto.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
