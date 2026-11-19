package com.society360.service.impl;

import com.society360.domain.audit.AuditLog;
import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.dto.request.ApproveApplicationRequest;
import com.society360.dto.request.RejectApplicationRequest;
import com.society360.dto.request.SocietyStatusUpdateRequest;
import com.society360.dto.response.SuperAdminStatsDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.AuditLogRepository;
import com.society360.repository.SocietyApplicationRepository;
import com.society360.repository.SocietyRepository;
import com.society360.repository.UserAccountRepository;
import com.society360.security.CustomUserPrincipal;
import com.society360.service.SuperAdminService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class SuperAdminServiceImpl implements SuperAdminService {

    private final SocietyApplicationRepository applicationRepository;
    private final SocietyRepository societyRepository;
    private final UserAccountRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    public SuperAdminServiceImpl(
            SocietyApplicationRepository applicationRepository,
            SocietyRepository societyRepository,
            UserAccountRepository userRepository,
            AuditLogRepository auditLogRepository,
            PasswordEncoder passwordEncoder) {
        this.applicationRepository = applicationRepository;
        this.societyRepository = societyRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private UUID getCurrentAdminId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserPrincipal p) {
            return p.getId();
        }
        return null;
    }

    private String getCurrentAdminEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof CustomUserPrincipal p) {
            return p.getUsername();
        }
        return "system-admin";
    }

    @Override
    @Transactional(readOnly = true)
    public SuperAdminStatsDto getDashboardStats() {
        List<Society> societies = societyRepository.findAll();
        List<SocietyApplication> applications = applicationRepository.findAll();

        long totalSocieties = societies.size();
        long activeSocieties = societies.stream().filter(s -> "ACTIVE".equalsIgnoreCase(s.getStatus())).count();
        long suspendedSocieties = societies.stream().filter(s -> "SUSPENDED".equalsIgnoreCase(s.getStatus())).count();

        long pendingApps = applications.stream().filter(a -> "PENDING".equalsIgnoreCase(a.getStatus())).count();
        long approvedApps = applications.stream().filter(a -> "APPROVED".equalsIgnoreCase(a.getStatus())).count();
        long rejectedApps = applications.stream().filter(a -> "REJECTED".equalsIgnoreCase(a.getStatus())).count();

        long totalUsers = userRepository.count();

        return new SuperAdminStatsDto(
                totalSocieties,
                activeSocieties,
                suspendedSocieties,
                pendingApps,
                approvedApps,
                rejectedApps,
                totalUsers
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<SocietyApplication> getApplications(String status) {
        if (status != null && !status.isBlank()) {
            return applicationRepository.findAllByStatus(status.toUpperCase().trim());
        }
        return applicationRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public SocietyApplication getApplicationById(UUID id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society application not found with ID: " + id));
    }

    @Override
    public Society approveApplication(UUID id, ApproveApplicationRequest request) {
        SocietyApplication app = getApplicationById(id);
        if ("APPROVED".equalsIgnoreCase(app.getStatus())) {
            throw new BadRequestException("Application has already been approved");
        }

        UUID adminId = getCurrentAdminId();
        String adminEmail = getCurrentAdminEmail();

        // 1. Generate unique society code
        String baseCode = "SOC-" + app.getSocietyName().replaceAll("[^a-zA-Z0-9]", "").toUpperCase();
        if (baseCode.length() > 25) {
            baseCode = baseCode.substring(0, 25);
        }
        String code = baseCode;
        int counter = 1;
        while (societyRepository.existsByCode(code)) {
            code = baseCode + "-" + counter++;
        }

        // 2. Create Society Workspace
        Society society = new Society(
                code,
                app.getSocietyName(),
                app.getRegistrationNumber(),
                app.getAddressLine(),
                app.getCity(),
                app.getState(),
                app.getPinCode()
        );
        society = societyRepository.save(society);

        // 3. Create or activate Society Admin Account
        String password = (request != null && request.getAdminPassword() != null && !request.getAdminPassword().isBlank())
                ? request.getAdminPassword()
                : "Password@123";

        String applicantEmail = app.getApplicantEmail().toLowerCase().trim();
        UserAccount adminUser = userRepository.findByEmail(applicantEmail).orElse(null);
        if (adminUser == null) {
            adminUser = new UserAccount(
                    society.getId(),
                    app.getApplicantName(),
                    applicantEmail,
                    app.getApplicantPhone(),
                    passwordEncoder.encode(password),
                    Role.SOCIETY_ADMIN
            );
            userRepository.save(adminUser);
        } else {
            adminUser.setSocietyId(society.getId());
            adminUser.setRole(Role.SOCIETY_ADMIN);
            adminUser.setStatus("ACTIVE");
            userRepository.save(adminUser);
        }

        // 4. Update Application status
        app.setStatus("APPROVED");
        app.setReviewedBy(adminId);
        app.setReviewedAt(Instant.now());
        applicationRepository.save(app);

        // 5. Emit Audit Log
        AuditLog auditLog = new AuditLog(
                society.getId(),
                adminId,
                adminEmail,
                "APPROVE_SOCIETY_APPLICATION",
                "Society",
                society.getId().toString(),
                "Approved application " + app.getRegistrationNumber() + " and provisioned society workspace: " + society.getName()
        );
        auditLogRepository.save(auditLog);

        return society;
    }

    @Override
    public SocietyApplication rejectApplication(UUID id, RejectApplicationRequest request) {
        SocietyApplication app = getApplicationById(id);
        if ("APPROVED".equalsIgnoreCase(app.getStatus())) {
            throw new BadRequestException("Cannot reject an already approved application");
        }

        UUID adminId = getCurrentAdminId();
        String adminEmail = getCurrentAdminEmail();

        app.setStatus("REJECTED");
        app.setRejectionReason(request.getReason());
        app.setReviewedBy(adminId);
        app.setReviewedAt(Instant.now());
        app = applicationRepository.save(app);

        AuditLog auditLog = new AuditLog(
                null,
                adminId,
                adminEmail,
                "REJECT_SOCIETY_APPLICATION",
                "SocietyApplication",
                app.getId().toString(),
                "Rejected application " + app.getRegistrationNumber() + ". Reason: " + request.getReason()
        );
        auditLogRepository.save(auditLog);

        return app;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Society> getAllSocieties() {
        return societyRepository.findAll();
    }

    @Override
    public Society updateSocietyStatus(UUID id, SocietyStatusUpdateRequest request) {
        Society society = societyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found with ID: " + id));

        String oldStatus = society.getStatus();
        society.setStatus(request.getStatus().toUpperCase());
        society = societyRepository.save(society);

        AuditLog auditLog = new AuditLog(
                society.getId(),
                getCurrentAdminId(),
                getCurrentAdminEmail(),
                "UPDATE_SOCIETY_STATUS",
                "Society",
                society.getId().toString(),
                "Changed society status from " + oldStatus + " to " + society.getStatus() + ". Note: " + request.getReason()
        );
        auditLogRepository.save(auditLog);

        return society;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AuditLog> getAuditLogs() {
        return auditLogRepository.findAllByOrderByCreatedAtDesc();
    }
}
