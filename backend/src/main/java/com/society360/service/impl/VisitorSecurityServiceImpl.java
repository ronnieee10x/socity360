package com.society360.service.impl;

import com.society360.domain.auth.UserAccount;
import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.domain.property.Wing;
import com.society360.domain.visitor.VisitorEntry;
import com.society360.dto.request.PreApproveVisitorRequest;
import com.society360.dto.request.VisitorCheckInRequest;
import com.society360.dto.request.VisitorDecisionRequest;
import com.society360.dto.response.VisitorEntryResponseDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.DuplicateResourceException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.BuildingRepository;
import com.society360.repository.FlatRepository;
import com.society360.repository.UserAccountRepository;
import com.society360.repository.VisitorEntryRepository;
import com.society360.repository.WingRepository;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.TenantContextHolder;
import com.society360.service.VisitorSecurityService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class VisitorSecurityServiceImpl implements VisitorSecurityService {

    private final VisitorEntryRepository visitorRepository;
    private final FlatRepository flatRepository;
    private final BuildingRepository buildingRepository;
    private final WingRepository wingRepository;
    private final UserAccountRepository userRepository;

    private final SecureRandom random = new SecureRandom();

    public VisitorSecurityServiceImpl(
            VisitorEntryRepository visitorRepository,
            FlatRepository flatRepository,
            BuildingRepository buildingRepository,
            WingRepository wingRepository,
            UserAccountRepository userRepository) {
        this.visitorRepository = visitorRepository;
        this.flatRepository = flatRepository;
        this.buildingRepository = buildingRepository;
        this.wingRepository = wingRepository;
        this.userRepository = userRepository;
    }

    private UUID requireTenantId() {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            throw new BadRequestException("No active society tenant context found");
        }
        return tenantId;
    }

    private UserAccount getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserPrincipal p)) {
            throw new BadRequestException("No authenticated user found");
        }
        return userRepository.findById(p.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private VisitorEntryResponseDto toDto(VisitorEntry entry) {
        Flat flat = flatRepository.findById(entry.getFlatId()).orElse(null);
        Building building = flat != null ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;
        Wing wing = flat != null ? wingRepository.findById(flat.getWingId()).orElse(null) : null;

        return new VisitorEntryResponseDto(
                entry,
                flat != null ? flat.getFlatNumber() : "Unknown",
                building != null ? building.getName() : "Unknown",
                wing != null ? wing.getName() : "Unknown"
        );
    }

    @Override
    public VisitorEntryResponseDto preApproveVisitor(PreApproveVisitorRequest request) {
        UUID tenantId = requireTenantId();
        UserAccount resident = getCurrentUser();

        Flat flat = flatRepository.findByIdAndSocietyId(request.getFlatId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found in current society"));

        // Generate a 6-digit numeric PIN
        String passCode = String.format("%06d", random.nextInt(1000000));

        VisitorEntry entry = new VisitorEntry();
        entry.setSocietyId(tenantId);
        entry.setFlatId(flat.getId());
        entry.setVisitorName(request.getVisitorName().trim());
        entry.setPhoneNumber(request.getPhoneNumber().trim());
        entry.setPurpose(request.getPurpose().toUpperCase().trim());
        entry.setVehicleNumber(request.getVehicleNumber());
        entry.setEntryType("PRE_APPROVED");
        entry.setPassCode(passCode);
        entry.setStatus("APPROVED");
        entry.setApprovedBy(resident.getId());

        entry = visitorRepository.save(entry);
        return toDto(entry);
    }

    @Override
    public VisitorEntryResponseDto checkIn(VisitorCheckInRequest request) {
        UUID tenantId = requireTenantId();
        UserAccount guard = getCurrentUser();

        // Mode 1: Verifying pre-approved 6-digit pass code
        if (request.getPassCode() != null && !request.getPassCode().isBlank()) {
            VisitorEntry entry = visitorRepository.findBySocietyIdAndPassCode(tenantId, request.getPassCode().trim())
                    .orElseThrow(() -> new BadRequestException("Invalid or non-existent 6-digit pass code"));

            if ("CHECKED_IN".equalsIgnoreCase(entry.getStatus())) {
                throw new BadRequestException("Visitor is already checked in on premises");
            }

            entry.setStatus("CHECKED_IN");
            entry.setCheckInTime(Instant.now());
            entry.setGuardId(guard.getId());
            if (request.getVehicleNumber() != null) entry.setVehicleNumber(request.getVehicleNumber());
            entry = visitorRepository.save(entry);
            return toDto(entry);
        }

        // Mode 2: Walk-in visitor entry
        if (request.getFlatId() == null || request.getVisitorName() == null || request.getPhoneNumber() == null) {
            throw new BadRequestException("Flat, visitor name, and contact phone are required for walk-in entry");
        }

        Flat flat = flatRepository.findByIdAndSocietyId(request.getFlatId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Host flat not found in current society"));

        String phone = request.getPhoneNumber().trim();
        // Concurrency / Anti-duplication check: prevent multiple active entries for identical visitor
        if (visitorRepository.existsBySocietyIdAndPhoneNumberAndFlatIdAndStatus(tenantId, phone, flat.getId(), "CHECKED_IN")) {
            throw new DuplicateResourceException("Visitor with phone " + phone + " is already checked in for Flat " + flat.getFlatNumber());
        }

        VisitorEntry entry = new VisitorEntry(
                flat.getId(),
                request.getVisitorName().trim(),
                phone,
                request.getPurpose() != null ? request.getPurpose().toUpperCase().trim() : "GUEST",
                "WALK_IN"
        );
        entry.setSocietyId(tenantId);
        entry.setCheckInTime(Instant.now());
        entry.setGuardId(guard.getId());
        entry.setVehicleNumber(request.getVehicleNumber());
        entry.setPhotoUrl(request.getPhotoUrl());

        entry = visitorRepository.save(entry);
        return toDto(entry);
    }

    @Override
    public VisitorEntryResponseDto checkOut(UUID visitorId) {
        UUID tenantId = requireTenantId();

        VisitorEntry entry = visitorRepository.findByIdAndSocietyId(visitorId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor record not found"));

        if (!"CHECKED_IN".equalsIgnoreCase(entry.getStatus())) {
            throw new BadRequestException("Cannot check out visitor: Visitor is currently marked as " + entry.getStatus());
        }

        entry.setStatus("CHECKED_OUT");
        entry.setCheckOutTime(Instant.now());
        entry = visitorRepository.save(entry);

        return toDto(entry);
    }

    @Override
    public VisitorEntryResponseDto residentDecision(UUID visitorId, VisitorDecisionRequest request) {
        UUID tenantId = requireTenantId();
        UserAccount resident = getCurrentUser();

        VisitorEntry entry = visitorRepository.findByIdAndSocietyId(visitorId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Visitor record not found"));

        if ("APPROVED".equalsIgnoreCase(request.getDecision())) {
            entry.setStatus("APPROVED");
            entry.setApprovedBy(resident.getId());
        } else {
            entry.setStatus("REJECTED");
        }

        entry = visitorRepository.save(entry);
        return toDto(entry);
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorEntryResponseDto> getActiveVisitors() {
        UUID tenantId = requireTenantId();
        return visitorRepository.findAllBySocietyIdAndStatusOrderByCreatedAtDesc(tenantId, "CHECKED_IN")
                .stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorEntryResponseDto> getExpectedVisitors() {
        UUID tenantId = requireTenantId();
        List<VisitorEntryResponseDto> result = new ArrayList<>();
        result.addAll(visitorRepository.findAllBySocietyIdAndStatusOrderByCreatedAtDesc(tenantId, "EXPECTED").stream().map(this::toDto).toList());
        result.addAll(visitorRepository.findAllBySocietyIdAndStatusOrderByCreatedAtDesc(tenantId, "APPROVED").stream().map(this::toDto).toList());
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public List<VisitorEntryResponseDto> getVisitorHistory(UUID flatId) {
        UUID tenantId = requireTenantId();
        if (flatId != null) {
            return visitorRepository.findAllBySocietyIdAndFlatIdOrderByCreatedAtDesc(tenantId, flatId)
                    .stream().map(this::toDto).toList();
        }
        return visitorRepository.findAllBySocietyIdOrderByCreatedAtDesc(tenantId)
                .stream().map(this::toDto).toList();
    }
}
