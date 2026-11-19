package com.society360.service.impl;

import com.society360.domain.audit.AuditLog;
import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.domain.property.Occupancy;
import com.society360.domain.property.Wing;
import com.society360.dto.request.ResidentJoinRequest;
import com.society360.dto.request.VerifyResidentRequest;
import com.society360.dto.response.OccupancyResponseDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.*;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.TenantContextHolder;
import com.society360.service.ResidentService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ResidentServiceImpl implements ResidentService {

    private final OccupancyRepository occupancyRepository;
    private final FlatRepository flatRepository;
    private final BuildingRepository buildingRepository;
    private final WingRepository wingRepository;
    private final UserAccountRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    public ResidentServiceImpl(
            OccupancyRepository occupancyRepository,
            FlatRepository flatRepository,
            BuildingRepository buildingRepository,
            WingRepository wingRepository,
            UserAccountRepository userRepository,
            AuditLogRepository auditLogRepository) {
        this.occupancyRepository = occupancyRepository;
        this.flatRepository = flatRepository;
        this.buildingRepository = buildingRepository;
        this.wingRepository = wingRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
    }

    private UserAccount getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserPrincipal p)) {
            throw new BadRequestException("No authenticated user found");
        }
        return userRepository.findById(p.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UUID requireTenantId() {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            throw new BadRequestException("No active society tenant context found");
        }
        return tenantId;
    }

    @Override
    public OccupancyResponseDto submitJoinRequest(ResidentJoinRequest request) {
        UserAccount user = getCurrentUser();

        Flat flat = flatRepository.findById(request.getFlatId())
                .orElseThrow(() -> new ResourceNotFoundException("Specified flat not found"));

        UUID societyId = flat.getSocietyId();

        // Check if there is already an active occupancy for this flat
        if ("OWNER".equalsIgnoreCase(request.getOccupancyType()) && occupancyRepository.existsByFlatIdAndStatus(flat.getId(), "APPROVED")) {
            // Already owned
        }

        Occupancy occupancy = new Occupancy(
                flat.getId(),
                user.getId(),
                request.getOccupancyType().toUpperCase(),
                request.getDocumentProofUrl()
        );
        occupancy.setSocietyId(societyId);
        occupancy.setStatus("PENDING");
        occupancy = occupancyRepository.save(occupancy);

        user.setSocietyId(societyId);
        user.setStatus("PENDING_VERIFICATION");
        userRepository.save(user);

        Building building = buildingRepository.findById(flat.getBuildingId()).orElse(null);
        Wing wing = wingRepository.findById(flat.getWingId()).orElse(null);

        return new OccupancyResponseDto(
                occupancy,
                flat.getFlatNumber(),
                building != null ? building.getName() : "Unknown",
                wing != null ? wing.getName() : "Unknown",
                user.getFullName(),
                user.getEmail(),
                user.getPhone()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<OccupancyResponseDto> getVerificationQueue(String status) {
        UUID tenantId = requireTenantId();
        List<Occupancy> occupancies = (status != null && !status.isBlank())
                ? occupancyRepository.findAllBySocietyIdAndStatus(tenantId, status.toUpperCase())
                : occupancyRepository.findAllBySocietyIdOrderByCreatedAtDesc(tenantId);

        List<OccupancyResponseDto> dtos = new ArrayList<>();
        for (Occupancy occ : occupancies) {
            Flat flat = flatRepository.findById(occ.getFlatId()).orElse(null);
            UserAccount user = userRepository.findById(occ.getUserId()).orElse(null);
            Building building = flat != null ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;
            Wing wing = flat != null ? wingRepository.findById(flat.getWingId()).orElse(null) : null;

            dtos.add(new OccupancyResponseDto(
                    occ,
                    flat != null ? flat.getFlatNumber() : "Unknown",
                    building != null ? building.getName() : "Unknown",
                    wing != null ? wing.getName() : "Unknown",
                    user != null ? user.getFullName() : "Unknown",
                    user != null ? user.getEmail() : "Unknown",
                    user != null ? user.getPhone() : "Unknown"
            ));
        }
        return dtos;
    }

    @Override
    public OccupancyResponseDto verifyResident(UUID occupancyId, VerifyResidentRequest request) {
        UUID tenantId = requireTenantId();
        UserAccount admin = getCurrentUser();

        Occupancy occupancy = occupancyRepository.findByIdAndSocietyId(occupancyId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Resident verification record not found"));

        Flat flat = flatRepository.findById(occupancy.getFlatId())
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));

        UserAccount resident = userRepository.findById(occupancy.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Resident account not found"));

        if ("APPROVED".equalsIgnoreCase(request.getDecision())) {
            occupancy.setStatus("APPROVED");
            occupancy.setVerifiedBy(admin.getId());
            occupancy.setVerifiedAt(Instant.now());

            // Set flat occupancy status
            if ("OWNER".equalsIgnoreCase(occupancy.getOccupancyType())) {
                flat.setOccupancyStatus("OWNER_OCCUPIED");
                resident.setRole(Role.FLAT_OWNER);
            } else {
                flat.setOccupancyStatus("TENANT_OCCUPIED");
                resident.setRole(Role.TENANT);
            }
            flatRepository.save(flat);

            resident.setStatus("ACTIVE");
            resident.setSocietyId(tenantId);
            userRepository.save(resident);

            AuditLog log = new AuditLog(
                    tenantId,
                    admin.getId(),
                    admin.getEmail(),
                    "APPROVE_RESIDENT_KYC",
                    "Occupancy",
                    occupancy.getId().toString(),
                    "Approved resident " + resident.getFullName() + " for Flat " + flat.getFlatNumber() + " as " + occupancy.getOccupancyType()
            );
            auditLogRepository.save(log);

        } else {
            occupancy.setStatus("REJECTED");
            occupancy.setRejectionReason(request.getRejectionReason());
            occupancy.setVerifiedBy(admin.getId());
            occupancy.setVerifiedAt(Instant.now());

            AuditLog log = new AuditLog(
                    tenantId,
                    admin.getId(),
                    admin.getEmail(),
                    "REJECT_RESIDENT_KYC",
                    "Occupancy",
                    occupancy.getId().toString(),
                    "Rejected resident verification for " + resident.getFullName() + ". Reason: " + request.getRejectionReason()
            );
            auditLogRepository.save(log);
        }

        occupancy = occupancyRepository.save(occupancy);

        Building building = buildingRepository.findById(flat.getBuildingId()).orElse(null);
        Wing wing = wingRepository.findById(flat.getWingId()).orElse(null);

        return new OccupancyResponseDto(
                occupancy,
                flat.getFlatNumber(),
                building != null ? building.getName() : "Unknown",
                wing != null ? wing.getName() : "Unknown",
                resident.getFullName(),
                resident.getEmail(),
                resident.getPhone()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<OccupancyResponseDto> getResidentDirectory() {
        UUID tenantId = requireTenantId();
        List<Occupancy> approved = occupancyRepository.findAllBySocietyIdAndStatus(tenantId, "APPROVED");

        List<OccupancyResponseDto> dtos = new ArrayList<>();
        for (Occupancy occ : approved) {
            Flat flat = flatRepository.findById(occ.getFlatId()).orElse(null);
            UserAccount user = userRepository.findById(occ.getUserId()).orElse(null);
            Building building = flat != null ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;
            Wing wing = flat != null ? wingRepository.findById(flat.getWingId()).orElse(null) : null;

            String maskedPhone = user != null && user.getPhone() != null && user.getPhone().length() > 6
                    ? user.getPhone().substring(0, 4) + "******"
                    : "Hidden";

            dtos.add(new OccupancyResponseDto(
                    occ,
                    flat != null ? flat.getFlatNumber() : "Unknown",
                    building != null ? building.getName() : "Unknown",
                    wing != null ? wing.getName() : "Unknown",
                    user != null ? user.getFullName() : "Unknown",
                    user != null ? user.getEmail() : "Unknown",
                    maskedPhone
            ));
        }
        return dtos;
    }

    @Override
    @Transactional(readOnly = true)
    public OccupancyResponseDto getMyOccupancy() {
        UserAccount user = getCurrentUser();
        Occupancy occ = occupancyRepository.findByUserIdAndStatus(user.getId(), "APPROVED")
                .orElseGet(() -> occupancyRepository.findFirstByUserIdOrderByCreatedAtDesc(user.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("No occupancy record found for current resident")));

        Flat flat = flatRepository.findById(occ.getFlatId()).orElse(null);
        Building building = flat != null ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;
        Wing wing = flat != null ? wingRepository.findById(flat.getWingId()).orElse(null) : null;

        return new OccupancyResponseDto(
                occ,
                flat != null ? flat.getFlatNumber() : "Unknown",
                building != null ? building.getName() : "Unknown",
                wing != null ? wing.getName() : "Unknown",
                user.getFullName(),
                user.getEmail(),
                user.getPhone()
        );
    }
}
