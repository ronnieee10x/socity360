package com.society360.controller;

import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.dto.request.SocietyRegistrationRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.SocietyRepository;
import com.society360.security.TenantContextHolder;
import com.society360.service.SocietyOnboardingService;
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
@RequestMapping("/api/v1/societies")
@Tag(name = "Societies & Onboarding", description = "Public onboarding registration and society profile management")
public class SocietyController {

    private final SocietyOnboardingService onboardingService;
    private final SocietyRepository societyRepository;

    public SocietyController(
            SocietyOnboardingService onboardingService,
            SocietyRepository societyRepository) {
        this.onboardingService = onboardingService;
        this.societyRepository = societyRepository;
    }

    @PostMapping("/apply")
    @Operation(summary = "Submit a new society onboarding application (Public)")
    public ResponseEntity<ApiResponse<SocietyApplication>> apply(@Valid @RequestBody SocietyRegistrationRequest request) {
        SocietyApplication app = onboardingService.submitApplication(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Society onboarding application submitted successfully. Pending Super Admin verification.", app));
    }

    @GetMapping("/public-list")
    @Operation(summary = "List all active societies for public resident registration dropdowns")
    public ResponseEntity<ApiResponse<List<Society>>> getPublicActiveSocieties() {
        List<Society> list = onboardingService.getPublicActiveSocieties();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/current")
    @Operation(summary = "Get the current authenticated society workspace details")
    public ResponseEntity<ApiResponse<Society>> getCurrentSociety() {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            throw new ResourceNotFoundException("No active society tenant context found");
        }
        Society society = societyRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found"));
        return ResponseEntity.ok(ApiResponse.success(society));
    }

    @PutMapping("/current")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Update society details (Society Admin only)")
    public ResponseEntity<ApiResponse<Society>> updateCurrentSociety(@RequestBody Map<String, Object> updates) {
        UUID tenantId = TenantContextHolder.getTenantId();
        Society society = societyRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found"));

        if (updates.containsKey("name")) society.setName((String) updates.get("name"));
        if (updates.containsKey("addressLine")) society.setAddressLine((String) updates.get("addressLine"));
        if (updates.containsKey("city")) society.setCity((String) updates.get("city"));
        if (updates.containsKey("state")) society.setState((String) updates.get("state"));
        if (updates.containsKey("pinCode")) society.setPinCode((String) updates.get("pinCode"));

        society = societyRepository.save(society);
        return ResponseEntity.ok(ApiResponse.success("Society updated successfully", society));
    }

    @PutMapping("/current/settings")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Update society operational settings (Society Admin only)")
    public ResponseEntity<ApiResponse<Society>> updateSettings(@RequestBody Map<String, Object> settings) {
        UUID tenantId = TenantContextHolder.getTenantId();
        Society society = societyRepository.findById(tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Society not found"));

        society.setSettings(settings.toString());
        society = societyRepository.save(society);
        return ResponseEntity.ok(ApiResponse.success("Society settings updated successfully", society));
    }
}
