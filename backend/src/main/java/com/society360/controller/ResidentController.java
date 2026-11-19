package com.society360.controller;

import com.society360.dto.request.ResidentJoinRequest;
import com.society360.dto.request.VerifyResidentRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.OccupancyResponseDto;
import com.society360.service.ResidentService;
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
@RequestMapping("/api/v1/residents")
@Tag(name = "Resident Onboarding & KYC", description = "Resident join requests, verification queue, and directory")
public class ResidentController {

    private final ResidentService residentService;

    public ResidentController(ResidentService residentService) {
        this.residentService = residentService;
    }

    @PostMapping("/join-request")
    @Operation(summary = "Submit a flat join request with proof document (Authenticated user)")
    public ResponseEntity<ApiResponse<OccupancyResponseDto>> submitJoinRequest(@Valid @RequestBody ResidentJoinRequest request) {
        OccupancyResponseDto response = residentService.submitJoinRequest(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Join request submitted. Pending Society Admin verification.", response));
    }

    @GetMapping("/verification-queue")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get resident verification queue (Society Admin / Committee only)")
    public ResponseEntity<ApiResponse<List<OccupancyResponseDto>>> getVerificationQueue(
            @RequestParam(required = false) String status) {
        List<OccupancyResponseDto> queue = residentService.getVerificationQueue(status);
        return ResponseEntity.ok(ApiResponse.success(queue));
    }

    @PostMapping("/verifications/{id}/decision")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Approve or reject resident verification (Admin / Committee only)")
    public ResponseEntity<ApiResponse<OccupancyResponseDto>> verifyResident(
            @PathVariable UUID id,
            @Valid @RequestBody VerifyResidentRequest request) {
        OccupancyResponseDto result = residentService.verifyResident(id, request);
        return ResponseEntity.ok(ApiResponse.success("Resident verification updated: " + result.getStatus(), result));
    }

    @GetMapping("/directory")
    @Operation(summary = "Get directory of approved residents in society")
    public ResponseEntity<ApiResponse<List<OccupancyResponseDto>>> getResidentDirectory() {
        List<OccupancyResponseDto> directory = residentService.getResidentDirectory();
        return ResponseEntity.ok(ApiResponse.success(directory));
    }

    @GetMapping("/my-occupancy")
    @Operation(summary = "Get current authenticated resident's flat occupancy record")
    public ResponseEntity<ApiResponse<OccupancyResponseDto>> getMyOccupancy() {
        OccupancyResponseDto occupancy = residentService.getMyOccupancy();
        return ResponseEntity.ok(ApiResponse.success(occupancy));
    }
}
