package com.society360.controller;

import com.society360.dto.complaint.AssignComplaintRequest;
import com.society360.dto.complaint.ComplaintResponseDto;
import com.society360.dto.complaint.CreateComplaintRequest;
import com.society360.dto.complaint.UpdateComplaintStatusRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.service.ComplaintService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/complaints")
@Tag(name = "Complaint & Maintenance Management", description = "Endpoints for raising complaints, assigning staff, and tracking work orders")
public class ComplaintController {

    private final ComplaintService complaintService;

    public ComplaintController(ComplaintService complaintService) {
        this.complaintService = complaintService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "File a new maintenance complaint / helpdesk ticket")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> fileComplaint(
            @Valid @RequestBody CreateComplaintRequest request) {
        ComplaintResponseDto response = complaintService.fileComplaint(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Complaint logged successfully", response));
    }

    @GetMapping("/my")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Get complaints filed by current authenticated resident")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getMyComplaints() {
        List<ComplaintResponseDto> complaints = complaintService.getMyComplaints();
        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get all complaints in the society with optional status filter")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getAllSocietyComplaints(
            @RequestParam(required = false) String status) {
        List<ComplaintResponseDto> complaints = complaintService.getAllSocietyComplaints(status);
        return ResponseEntity.ok(ApiResponse.success(complaints));
    }

    @GetMapping("/assigned")
    @PreAuthorize("hasRole('MAINTENANCE_STAFF')")
    @Operation(summary = "Get work orders assigned to current maintenance technician")
    public ResponseEntity<ApiResponse<List<ComplaintResponseDto>>> getMyAssignedTasks() {
        List<ComplaintResponseDto> tasks = complaintService.getMyAssignedTasks();
        return ResponseEntity.ok(ApiResponse.success(tasks));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get complaint breakdown statistics by status")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getComplaintStats() {
        Map<String, Long> stats = complaintService.getComplaintStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get detailed complaint information by ID")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> getComplaintById(@PathVariable UUID id) {
        ComplaintResponseDto complaint = complaintService.getComplaintById(id);
        return ResponseEntity.ok(ApiResponse.success(complaint));
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Assign complaint ticket to a maintenance technician")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> assignComplaint(
            @PathVariable UUID id,
            @Valid @RequestBody AssignComplaintRequest request) {
        ComplaintResponseDto updated = complaintService.assignComplaint(id, request);
        return ResponseEntity.ok(ApiResponse.success("Staff assigned successfully", updated));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('MAINTENANCE_STAFF', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Update complaint status and resolution notes")
    public ResponseEntity<ApiResponse<ComplaintResponseDto>> updateComplaintStatus(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateComplaintStatusRequest request) {
        ComplaintResponseDto updated = complaintService.updateStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Status updated successfully", updated));
    }
}
