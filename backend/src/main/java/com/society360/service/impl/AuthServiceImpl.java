package com.society360.service.impl;

import com.society360.domain.auth.RefreshToken;
import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.domain.society.Society;
import com.society360.dto.request.LoginRequest;
import com.society360.dto.request.RefreshTokenRequest;
import com.society360.dto.request.RegisterRequest;
import com.society360.dto.response.AuthResponse;
import com.society360.dto.response.UserDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.DuplicateResourceException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.RefreshTokenRepository;
import com.society360.repository.SocietyRepository;
import com.society360.repository.UserAccountRepository;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.JwtTokenProvider;
import com.society360.service.AuthService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    private final UserAccountRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SocietyRepository societyRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(
            UserAccountRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            SocietyRepository societyRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.societyRepository = societyRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        UserAccount user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Invalid email or password");
        }

        if ("DEACTIVATED".equalsIgnoreCase(user.getStatus())) {
            throw new BadRequestException("Account has been deactivated. Please contact support.");
        }

        // Check if society is suspended
        String societyName = null;
        String societyCode = null;
        if (user.getSocietyId() != null) {
            Society society = societyRepository.findById(user.getSocietyId()).orElse(null);
            if (society != null) {
                if ("SUSPENDED".equalsIgnoreCase(society.getStatus()) && user.getRole() != Role.PLATFORM_SUPER_ADMIN) {
                    throw new BadRequestException("Access denied: Your residential society has been suspended by the platform administrator.");
                }
                societyName = society.getName();
                societyCode = society.getCode();
            }
        }

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshTokenStr = tokenProvider.generateRefreshToken(user);

        // Store refresh token
        RefreshToken refreshToken = new RefreshToken(user.getId(), refreshTokenStr, Instant.now().plus(7, ChronoUnit.DAYS));
        refreshTokenRepository.save(refreshToken);

        UserDto userDto = new UserDto(user, societyName, societyCode);
        return new AuthResponse(accessToken, refreshTokenStr, userDto);
    }

    @Override
    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase().trim();
        if (userRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("An account already exists with this email address");
        }

        UserAccount user = new UserAccount();
        user.setEmail(email);
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setSocietyId(request.getSocietyId());
        user.setRole(Role.TENANT); // Default pending resident role
        user.setStatus("PENDING_VERIFICATION");

        user = userRepository.save(user);

        String societyName = null;
        String societyCode = null;
        if (user.getSocietyId() != null) {
            Society s = societyRepository.findById(user.getSocietyId()).orElse(null);
            if (s != null) {
                societyName = s.getName();
                societyCode = s.getCode();
            }
        }

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshTokenStr = tokenProvider.generateRefreshToken(user);

        RefreshToken refreshToken = new RefreshToken(user.getId(), refreshTokenStr, Instant.now().plus(7, ChronoUnit.DAYS));
        refreshTokenRepository.save(refreshToken);

        UserDto userDto = new UserDto(user, societyName, societyCode);
        return new AuthResponse(accessToken, refreshTokenStr, userDto);
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(request.getRefreshToken())
                .orElseThrow(() -> new BadRequestException("Invalid refresh token"));

        if (refreshToken.isRevoked() || refreshToken.getExpiresAt().isBefore(Instant.now())) {
            throw new BadRequestException("Refresh token has expired or been revoked");
        }

        UserAccount user = userRepository.findById(refreshToken.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newAccessToken = tokenProvider.generateAccessToken(user);
        String societyName = null;
        String societyCode = null;
        if (user.getSocietyId() != null) {
            Society s = societyRepository.findById(user.getSocietyId()).orElse(null);
            if (s != null) {
                societyName = s.getName();
                societyCode = s.getCode();
            }
        }

        return new AuthResponse(newAccessToken, refreshToken.getToken(), new UserDto(user, societyName, societyCode));
    }

    @Override
    public void logout(String refreshToken) {
        if (refreshToken != null && !refreshToken.isBlank()) {
            refreshTokenRepository.findByToken(refreshToken).ifPresent(token -> {
                token.setRevoked(true);
                refreshTokenRepository.save(token);
            });
        }
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserPrincipal principal)) {
            throw new BadRequestException("No authenticated user session found");
        }

        UserAccount user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User profile not found"));

        String societyName = null;
        String societyCode = null;
        if (user.getSocietyId() != null) {
            Society s = societyRepository.findById(user.getSocietyId()).orElse(null);
            if (s != null) {
                societyName = s.getName();
                societyCode = s.getCode();
            }
        }

        return new UserDto(user, societyName, societyCode);
    }
}
