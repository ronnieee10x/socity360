package com.society360.controller;

import com.society360.dto.request.PreApproveVisitorRequest;
import com.society360.dto.request.VisitorCheckInRequest;
import com.society360.dto.request.VisitorDecisionRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.VisitorEntryResponseDto;
import com.society360.service.VisitorSecurityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/visitors")
@Tag(name = "Gate Security & Visitor Management", description = "Endpoints for guard gate operations, pre-approved passes, and check-in/out")
public class VisitorSecurityController {

    private final VisitorSecurityService visitorSecurityService;

    public VisitorSecurityController(VisitorSecurityService visitorSecurityService) {
        this.visitorSecurityService = visitorSecurityService;
    }

    @PostMapping("/pre-approve")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Generate 6-digit visitor pass for expected guest (Resident only)")
    public ResponseEntity<ApiResponse<VisitorEntryResponseDto>> preApproveVisitor(
            @Valid @RequestBody PreApproveVisitorRequest request) {
        VisitorEntryResponseDto pass = visitorSecurityService.preApproveVisitor(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Pre-approved visitor pass generated successfully", pass));
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasAnyRole('SECURITY_GUARD', 'SOCIETY_ADMIN')")
    @Operation(summary = "Record visitor entry via 6-digit pass code or walk-in registration (Guard only)")
    public ResponseEntity<ApiResponse<VisitorEntryResponseDto>> checkIn(
            @RequestBody VisitorCheckInRequest request) {
        VisitorEntryResponseDto entry = visitorSecurityService.checkIn(request);
        return ResponseEntity.ok(ApiResponse.success("Visitor checked in successfully", entry));
    }

    @PostMapping("/{id}/check-out")
    @PreAuthorize("hasAnyRole('SECURITY_GUARD', 'SOCIETY_ADMIN')")
    @Operation(summary = "Record visitor departure and calculate duration (Guard only)")
    public ResponseEntity<ApiResponse<VisitorEntryResponseDto>> checkOut(@PathVariable UUID id) {
        VisitorEntryResponseDto exit = visitorSecurityService.checkOut(id);
        return ResponseEntity.ok(ApiResponse.success("Visitor check-out recorded", exit));
    }

    @PostMapping("/{id}/decision")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Approve or reject walk-in gate visitor request (Host resident only)")
    public ResponseEntity<ApiResponse<VisitorEntryResponseDto>> residentDecision(
            @PathVariable UUID id,
            @Valid @RequestBody VisitorDecisionRequest request) {
        VisitorEntryResponseDto entry = visitorSecurityService.residentDecision(id, request);
        return ResponseEntity.ok(ApiResponse.success("Visitor request " + entry.getStatus(), entry));
    }

    @GetMapping("/active")
    @PreAuthorize("hasAnyRole('SECURITY_GUARD', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "List all visitors currently active inside premises")
    public ResponseEntity<ApiResponse<List<VisitorEntryResponseDto>>> getActiveVisitors() {
        List<VisitorEntryResponseDto> list = visitorSecurityService.getActiveVisitors();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/expected")
    @PreAuthorize("hasAnyRole('SECURITY_GUARD', 'SOCIETY_ADMIN')")
    @Operation(summary = "List pre-approved expected visitors for today")
    public ResponseEntity<ApiResponse<List<VisitorEntryResponseDto>>> getExpectedVisitors() {
        List<VisitorEntryResponseDto> list = visitorSecurityService.getExpectedVisitors();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/history")
    @PreAuthorize("hasAnyRole('SECURITY_GUARD', 'SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Full society visitor entry and exit history")
    public ResponseEntity<ApiResponse<List<VisitorEntryResponseDto>>> getVisitorHistory(
            @RequestParam(required = false) UUID flatId) {
        List<VisitorEntryResponseDto> history = visitorSecurityService.getVisitorHistory(flatId);
        return ResponseEntity.ok(ApiResponse.success(history));
    }

    @GetMapping("/my-visitors")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "List visitor logs and passes for caller's flat")
    public ResponseEntity<ApiResponse<List<VisitorEntryResponseDto>>> getMyVisitors(
            @RequestParam(required = false) UUID flatId) {
        List<VisitorEntryResponseDto> list = visitorSecurityService.getVisitorHistory(flatId);
        return ResponseEntity.ok(ApiResponse.success(list));
    }
}
