package com.society360.controller;

import com.society360.dto.request.LoginRequest;
import com.society360.dto.request.RefreshTokenRequest;
import com.society360.dto.request.RegisterRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.AuthResponse;
import com.society360.dto.response.DemoAccountDto;
import com.society360.dto.response.UserDto;
import com.society360.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/auth")
@Tag(name = "Authentication & Identity", description = "Endpoints for login, registration, token refresh, and demo accounts")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT access and refresh tokens")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Authentication successful", response));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new resident user account (creates pending verification profile)")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest request) {
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Registration successful. Account awaiting resident verification.", response));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Rotate refresh token and retrieve a fresh JWT access token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        AuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", response));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke active refresh token and end session")
    public ResponseEntity<ApiResponse<Void>> logout(@RequestBody(required = false) RefreshTokenRequest request) {
        if (request != null) {
            authService.logout(request.getRefreshToken());
        }
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Get current authenticated profile and tenant membership")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        UserDto user = authService.getCurrentUser();
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @GetMapping("/demo-accounts")
    @Operation(summary = "Get pre-seeded demo accounts across all 7 roles for instant viva demonstration")
    public ResponseEntity<ApiResponse<List<DemoAccountDto>>> getDemoAccounts() {
        List<DemoAccountDto> accounts = authService.getDemoAccounts();
        return ResponseEntity.ok(ApiResponse.success(accounts));
    }
}
