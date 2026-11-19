package com.society360.service;

import com.society360.dto.request.LoginRequest;
import com.society360.dto.request.RefreshTokenRequest;
import com.society360.dto.request.RegisterRequest;
import com.society360.dto.response.AuthResponse;
import com.society360.dto.response.DemoAccountDto;
import com.society360.dto.response.UserDto;

import java.util.List;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(String refreshToken);
    UserDto getCurrentUser();
    List<DemoAccountDto> getDemoAccounts();
}
