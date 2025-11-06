package com.rsm.retailbackend.feature.auth.controller;

import com.rsm.retailbackend.feature.auth.dto.AuthResponse;
import com.rsm.retailbackend.feature.auth.dto.LoginRequest;
import com.rsm.retailbackend.feature.auth.dto.RegisterRequest;
import com.rsm.retailbackend.feature.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
