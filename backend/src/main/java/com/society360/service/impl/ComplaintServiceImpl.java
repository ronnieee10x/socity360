package com.society360.service.impl;

import com.society360.domain.auth.UserAccount;
import com.society360.domain.complaint.Complaint;
import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.dto.complaint.AssignComplaintRequest;
import com.society360.dto.complaint.ComplaintResponseDto;
import com.society360.dto.complaint.CreateComplaintRequest;
import com.society360.dto.complaint.UpdateComplaintStatusRequest;
import com.society360.exception.BadRequestException;
import com.society360.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import com.society360.repository.BuildingRepository;
import com.society360.repository.ComplaintRepository;
import com.society360.repository.FlatRepository;
import com.society360.repository.UserAccountRepository;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.TenantContextHolder;
import com.society360.service.ComplaintService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class ComplaintServiceImpl implements ComplaintService {

    private static final Logger log = LoggerFactory.getLogger(ComplaintServiceImpl.class);

    private final ComplaintRepository complaintRepository;
    private final FlatRepository flatRepository;
    private final BuildingRepository buildingRepository;
    private final UserAccountRepository userAccountRepository;

    private static final String ALPHANUMERIC = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    private final SecureRandom random = new SecureRandom();

    public ComplaintServiceImpl(
            ComplaintRepository complaintRepository,
            FlatRepository flatRepository,
            BuildingRepository buildingRepository,
            UserAccountRepository userAccountRepository) {
        this.complaintRepository = complaintRepository;
        this.flatRepository = flatRepository;
        this.buildingRepository = buildingRepository;
        this.userAccountRepository = userAccountRepository;
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
        return userAccountRepository.findById(p.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public ComplaintResponseDto fileComplaint(CreateComplaintRequest request) {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        Flat flat = flatRepository.findById(request.getFlatId())
                .filter(f -> f.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found in your society"));

        String ticketNumber = "TKT-" + generateTicketCode(8);

        Complaint complaint = new Complaint(
                flat.getId(),
                user.getId(),
                ticketNumber,
                request.getTitle(),
                request.getCategory().toUpperCase(),
                request.getPriority() != null ? request.getPriority().toUpperCase() : "MEDIUM",
                request.getDescription()
        );
        complaint.setSocietyId(societyId);
        complaint.setPhotoUrl(request.getPhotoUrl());
        complaint.setStatus("SUBMITTED");

        Complaint saved = complaintRepository.save(complaint);
        log.info("Complaint filed: ticket={} for society={} by user={}", ticketNumber, societyId, user.getId());

        return mapToDto(saved);
    }

    @Override
    public ComplaintResponseDto assignComplaint(UUID complaintId, AssignComplaintRequest request) {
        UUID societyId = requireTenantId();

        Complaint complaint = complaintRepository.findById(complaintId)
                .filter(c -> c.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found in this society"));

        UserAccount staff = userAccountRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new ResourceNotFoundException("Staff user not found"));

        if (!societyId.equals(staff.getSocietyId())) {
            throw new AccessDeniedException("Staff member does not belong to this society");
        }

        complaint.setAssignedTo(staff.getId());
        if ("SUBMITTED".equalsIgnoreCase(complaint.getStatus())) {
            complaint.setStatus("ASSIGNED");
        }

        Complaint updated = complaintRepository.save(complaint);
        log.info("Complaint {} assigned to staff {} ({})", complaint.getTicketNumber(), staff.getFullName(), staff.getId());

        return mapToDto(updated);
    }

    @Override
    public ComplaintResponseDto updateStatus(UUID complaintId, UpdateComplaintStatusRequest request) {
        UUID societyId = requireTenantId();

        Complaint complaint = complaintRepository.findById(complaintId)
                .filter(c -> c.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found in this society"));

        String newStatus = request.getStatus().toUpperCase();
        complaint.setStatus(newStatus);

        if (request.getResolutionNotes() != null && !request.getResolutionNotes().isBlank()) {
            complaint.setResolutionNotes(request.getResolutionNotes());
        }

        if ("RESOLVED".equalsIgnoreCase(newStatus) || "CLOSED".equalsIgnoreCase(newStatus)) {
            if (complaint.getResolvedAt() == null) {
                complaint.setResolvedAt(Instant.now());
            }
        }

        Complaint updated = complaintRepository.save(complaint);
        log.info("Complaint {} status updated to {} by user", complaint.getTicketNumber(), newStatus);

        return mapToDto(updated);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponseDto> getMyComplaints() {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        return complaintRepository.findBySocietyIdAndCreatedByOrderByCreatedAtDesc(societyId, user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponseDto> getAllSocietyComplaints(String status) {
        UUID societyId = requireTenantId();

        List<Complaint> list;
        if (status != null && !status.isBlank() && !"ALL".equalsIgnoreCase(status)) {
            list = complaintRepository.findBySocietyIdAndStatusOrderByCreatedAtDesc(societyId, status.toUpperCase());
        } else {
            list = complaintRepository.findBySocietyIdOrderByCreatedAtDesc(societyId);
        }

        return list.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ComplaintResponseDto> getMyAssignedTasks() {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        return complaintRepository.findBySocietyIdAndAssignedToOrderByCreatedAtDesc(societyId, user.getId())
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ComplaintResponseDto getComplaintById(UUID complaintId) {
        UUID societyId = requireTenantId();

        Complaint complaint = complaintRepository.findById(complaintId)
                .filter(c -> c.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Complaint not found"));

        return mapToDto(complaint);
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Long> getComplaintStats() {
        UUID societyId = requireTenantId();

        Map<String, Long> stats = new HashMap<>();
        stats.put("total", complaintRepository.countBySocietyId(societyId));
        stats.put("submitted", complaintRepository.countBySocietyIdAndStatus(societyId, "SUBMITTED"));
        stats.put("assigned", complaintRepository.countBySocietyIdAndStatus(societyId, "ASSIGNED"));
        stats.put("inProgress", complaintRepository.countBySocietyIdAndStatus(societyId, "IN_PROGRESS"));
        stats.put("resolved", complaintRepository.countBySocietyIdAndStatus(societyId, "RESOLVED"));
        stats.put("closed", complaintRepository.countBySocietyIdAndStatus(societyId, "CLOSED"));

        return stats;
    }

    private ComplaintResponseDto mapToDto(Complaint c) {
        Flat flat = flatRepository.findById(c.getFlatId()).orElse(null);
        Building building = (flat != null) ? buildingRepository.findById(flat.getBuildingId()).orElse(null) : null;
        UserAccount creator = userAccountRepository.findById(c.getCreatedBy()).orElse(null);
        UserAccount assignee = (c.getAssignedTo() != null) ? userAccountRepository.findById(c.getAssignedTo()).orElse(null) : null;

        ComplaintResponseDto dto = new ComplaintResponseDto();
        dto.setId(c.getId());
        dto.setSocietyId(c.getSocietyId());
        dto.setFlatId(c.getFlatId());
        dto.setFlatNumber(flat != null ? flat.getFlatNumber() : "N/A");
        dto.setBuildingName(building != null ? building.getName() : "N/A");
        dto.setCreatedById(c.getCreatedBy());
        dto.setCreatedByName(creator != null ? creator.getFullName() : "N/A");
        dto.setCreatedByPhone(creator != null ? creator.getPhone() : "N/A");
        dto.setTicketNumber(c.getTicketNumber());
        dto.setTitle(c.getTitle());
        dto.setCategory(c.getCategory());
        dto.setPriority(c.getPriority());
        dto.setDescription(c.getDescription());
        dto.setStatus(c.getStatus());
        dto.setPhotoUrl(c.getPhotoUrl());
        dto.setAssignedToId(c.getAssignedTo());
        dto.setAssignedToName(assignee != null ? assignee.getFullName() : null);
        dto.setResolutionNotes(c.getResolutionNotes());
        dto.setResolvedAt(c.getResolvedAt());
        dto.setCreatedAt(c.getCreatedAt());
        dto.setUpdatedAt(c.getUpdatedAt());
        return dto;
    }

    private String generateTicketCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHANUMERIC.charAt(random.nextInt(ALPHANUMERIC.length())));
        }
        return sb.toString();
    }
}
