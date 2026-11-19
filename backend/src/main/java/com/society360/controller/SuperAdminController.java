package com.society360.controller;

import com.society360.domain.audit.AuditLog;
import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.dto.request.ApproveApplicationRequest;
import com.society360.dto.request.RejectApplicationRequest;
import com.society360.dto.request.SocietyStatusUpdateRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.SuperAdminStatsDto;
import com.society360.service.SuperAdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/super-admin")
@PreAuthorize("hasRole('PLATFORM_SUPER_ADMIN')")
@Tag(name = "Platform Super Admin", description = "Global SaaS administration, society approvals, and platform audit logs")
public class SuperAdminController {

    private final SuperAdminService superAdminService;

    public SuperAdminController(SuperAdminService superAdminService) {
        this.superAdminService = superAdminService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide aggregated governance statistics")
    public ResponseEntity<ApiResponse<SuperAdminStatsDto>> getDashboardStats() {
        SuperAdminStatsDto stats = superAdminService.getDashboardStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/applications")
    @Operation(summary = "List society onboarding applications (optional filter: PENDING, APPROVED, REJECTED)")
    public ResponseEntity<ApiResponse<List<SocietyApplication>>> getApplications(
            @RequestParam(required = false) String status) {
        List<SocietyApplication> applications = superAdminService.getApplications(status);
        return ResponseEntity.ok(ApiResponse.success(applications));
    }

    @GetMapping("/applications/{id}")
    @Operation(summary = "Get specific society onboarding application details")
    public ResponseEntity<ApiResponse<SocietyApplication>> getApplicationById(@PathVariable UUID id) {
        SocietyApplication app = superAdminService.getApplicationById(id);
        return ResponseEntity.ok(ApiResponse.success(app));
    }

    @PostMapping("/applications/{id}/approve")
    @Operation(summary = "Approve society application, provision isolated workspace, and create Society Admin account")
    public ResponseEntity<ApiResponse<Society>> approveApplication(
            @PathVariable UUID id,
            @RequestBody(required = false) ApproveApplicationRequest request) {
        Society society = superAdminService.approveApplication(id, request);
        return ResponseEntity.ok(ApiResponse.success("Society approved and workspace provisioned successfully", society));
    }

    @PostMapping("/applications/{id}/reject")
    @Operation(summary = "Reject society application with explanation note")
    public ResponseEntity<ApiResponse<SocietyApplication>> rejectApplication(
            @PathVariable UUID id,
            @Valid @RequestBody RejectApplicationRequest request) {
        SocietyApplication app = superAdminService.rejectApplication(id, request);
        return ResponseEntity.ok(ApiResponse.success("Society application rejected", app));
    }

    @GetMapping("/societies")
    @Operation(summary = "List all registered societies on the platform")
    public ResponseEntity<ApiResponse<List<Society>>> getAllSocieties() {
        List<Society> list = superAdminService.getAllSocieties();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @PatchMapping("/societies/{id}/status")
    @Operation(summary = "Suspend or reactivate a society workspace with immediate access restriction")
    public ResponseEntity<ApiResponse<Society>> updateSocietyStatus(
            @PathVariable UUID id,
            @Valid @RequestBody SocietyStatusUpdateRequest request) {
        Society society = superAdminService.updateSocietyStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Society status updated to " + society.getStatus(), society));
    }

    @GetMapping("/audit-logs")
    @Operation(summary = "View global platform audit logs for sensitive operations")
    public ResponseEntity<ApiResponse<List<AuditLog>>> getAuditLogs() {
        List<AuditLog> logs = superAdminService.getAuditLogs();
        return ResponseEntity.ok(ApiResponse.success(logs));
    }
}
