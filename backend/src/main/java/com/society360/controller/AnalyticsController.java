package com.society360.controller;

import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.SocietyAnalyticsDto;
import com.society360.service.AnalyticsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
@Tag(name = "Society Analytics & BI", description = "Endpoints for aggregate operations, financial trends, complaint MTTR, and footfall analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/overview")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get high-level society analytics and business intelligence telemetry")
    public ResponseEntity<ApiResponse<SocietyAnalyticsDto>> getSocietyAnalytics() {
        SocietyAnalyticsDto dto = analyticsService.getSocietyAnalytics();
        return ResponseEntity.ok(ApiResponse.success(dto));
    }
}
