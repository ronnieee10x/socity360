package com.society360.service.impl;

import com.society360.domain.audit.AuditLog;
import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.dto.request.SocietyRegistrationRequest;
import com.society360.exception.DuplicateResourceException;
import com.society360.repository.AuditLogRepository;
import com.society360.repository.SocietyApplicationRepository;
import com.society360.repository.SocietyRepository;
import com.society360.service.SocietyOnboardingService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SocietyOnboardingServiceImpl implements SocietyOnboardingService {

    private final SocietyApplicationRepository applicationRepository;
    private final SocietyRepository societyRepository;
    private final AuditLogRepository auditLogRepository;

    public SocietyOnboardingServiceImpl(
            SocietyApplicationRepository applicationRepository,
            SocietyRepository societyRepository,
            AuditLogRepository auditLogRepository) {
        this.applicationRepository = applicationRepository;
        this.societyRepository = societyRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Override
    public SocietyApplication submitApplication(SocietyRegistrationRequest request) {
        String regNo = request.getRegistrationNumber().trim();
        if (societyRepository.existsByRegistrationNumber(regNo) || applicationRepository.existsByRegistrationNumber(regNo)) {
            throw new DuplicateResourceException("An application or society is already registered with registration number: " + regNo);
        }

        SocietyApplication app = new SocietyApplication();
        app.setSocietyName(request.getSocietyName().trim());
        app.setRegistrationNumber(regNo);
        app.setAddressLine(request.getAddressLine().trim());
        app.setCity(request.getCity().trim());
        app.setState(request.getState().trim());
        app.setPinCode(request.getPinCode().trim());
        app.setBuildingCount(request.getBuildingCount());
        app.setFlatCount(request.getFlatCount());
        app.setApplicantName(request.getApplicantName().trim());
        app.setApplicantEmail(request.getApplicantEmail().toLowerCase().trim());
        app.setApplicantPhone(request.getApplicantPhone().trim());
        app.setDocumentUrl(request.getDocumentUrl());
        app.setStatus("PENDING");

        app = applicationRepository.save(app);

        // Audit log event
        AuditLog log = new AuditLog(
                null,
                null,
                request.getApplicantEmail(),
                "SUBMIT_SOCIETY_APPLICATION",
                "SocietyApplication",
                app.getId().toString(),
                "New onboarding application submitted for " + app.getSocietyName()
        );
        auditLogRepository.save(log);

        return app;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Society> getPublicActiveSocieties() {
        return societyRepository.findAll().stream()
                .filter(s -> "ACTIVE".equalsIgnoreCase(s.getStatus()))
                .toList();
    }
}
