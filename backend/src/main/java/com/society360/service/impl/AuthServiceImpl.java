package com.society360.service.impl;

import com.society360.domain.auth.RefreshToken;
import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.domain.society.Society;
import com.society360.dto.request.LoginRequest;
import com.society360.dto.request.RefreshTokenRequest;
import com.society360.dto.request.RegisterRequest;
import com.society360.dto.response.AuthResponse;
import com.society360.dto.response.DemoAccountDto;
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

    @Override
    @Transactional(readOnly = true)
    public List<DemoAccountDto> getDemoAccounts() {
        List<DemoAccountDto> accounts = new ArrayList<>();
        accounts.add(new DemoAccountDto(
                "Platform Super Admin",
                "superadmin@society360.io",
                "Password@123",
                Role.PLATFORM_SUPER_ADMIN,
                "Global Platform",
                "Full SaaS governance: approve societies, suspend tenants, global audit logs"
        ));
        accounts.add(new DemoAccountDto(
                "Society Admin (President)",
                "admin@greenfield.com",
                "Password@123",
                Role.SOCIETY_ADMIN,
                "Greenfield Heights",
                "Manage buildings, wings, flats, resident verifications, billing & staff"
        ));
        accounts.add(new DemoAccountDto(
                "Committee Member (Treasurer)",
                "treasurer@greenfield.com",
                "Password@123",
                Role.COMMITTEE_MEMBER,
                "Greenfield Heights",
                "Review financial collections, outstanding dues, audit records & approvals"
        ));
        accounts.add(new DemoAccountDto(
                "Flat Owner (Resident)",
                "owner@greenfield.com",
                "Password@123",
                Role.FLAT_OWNER,
                "Greenfield Heights (Flat A-502)",
                "Pay maintenance bills, pre-approve visitors, raise complaints, book amenities"
        ));
        accounts.add(new DemoAccountDto(
                "Resident Tenant",
                "tenant@greenfield.com",
                "Password@123",
                Role.TENANT,
                "Greenfield Heights (Flat B-201)",
                "Approve visitors at gate, submit maintenance tickets, view notices"
        ));
        accounts.add(new DemoAccountDto(
                "Security Guard (Main Gate)",
                "guard@greenfield.com",
                "Password@123",
                Role.SECURITY_GUARD,
                "Greenfield Heights Gate 1",
                "Log visitor entry/exit, verify pre-approved PINs, deliveries check-in"
        ));
        accounts.add(new DemoAccountDto(
                "Maintenance Technician",
                "staff@greenfield.com",
                "Password@123",
                Role.MAINTENANCE_STAFF,
                "Greenfield Heights Facilities",
                "Work orders queue, update complaint status, log resolution notes"
        ));
        return accounts;
    }
}
