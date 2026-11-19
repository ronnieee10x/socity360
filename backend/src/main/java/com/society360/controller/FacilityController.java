package com.society360.controller;

import com.society360.dto.request.BookFacilityRequest;
import com.society360.dto.request.CreateFacilityRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.FacilityBookingResponseDto;
import com.society360.dto.response.FacilityResponseDto;
import com.society360.service.FacilityService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/facilities")
@Tag(name = "Facility & Amenity Management", description = "Endpoints for clubhouse, pool, sports courts booking with anti-double-booking concurrency control")
public class FacilityController {

    private final FacilityService facilityService;

    public FacilityController(FacilityService facilityService) {
        this.facilityService = facilityService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "List all amenities and facilities in the current society")
    public ResponseEntity<ApiResponse<List<FacilityResponseDto>>> getSocietyFacilities() {
        List<FacilityResponseDto> facilities = facilityService.getSocietyFacilities();
        return ResponseEntity.ok(ApiResponse.success(facilities));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Create a new facility or amenity (Clubhouse, Gym, Swimming Pool, Banquet Hall)")
    public ResponseEntity<ApiResponse<FacilityResponseDto>> createFacility(
            @Valid @RequestBody CreateFacilityRequest request) {
        FacilityResponseDto created = facilityService.createFacility(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Facility created successfully", created));
    }

    @PostMapping("/bookings")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Reserve a facility time slot (Protected with anti-double-booking conflict detection)")
    public ResponseEntity<ApiResponse<FacilityBookingResponseDto>> bookFacility(
            @Valid @RequestBody BookFacilityRequest request) {
        FacilityBookingResponseDto booking = facilityService.bookFacility(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Facility slot reserved successfully", booking));
    }

    @GetMapping("/{id}/schedule")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get daily schedule and reserved slots for a facility")
    public ResponseEntity<ApiResponse<List<FacilityBookingResponseDto>>> getFacilitySchedule(
            @PathVariable UUID id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<FacilityBookingResponseDto> schedule = facilityService.getFacilitySchedule(id, date);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }

    @GetMapping("/bookings/my")
    @PreAuthorize("hasAnyRole('FLAT_OWNER', 'TENANT')")
    @Operation(summary = "Get current resident's active and past facility reservations")
    public ResponseEntity<ApiResponse<List<FacilityBookingResponseDto>>> getMyBookings() {
        List<FacilityBookingResponseDto> bookings = facilityService.getMyBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @GetMapping("/bookings")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Get all facility bookings across the society")
    public ResponseEntity<ApiResponse<List<FacilityBookingResponseDto>>> getAllBookings() {
        List<FacilityBookingResponseDto> bookings = facilityService.getAllSocietyBookings();
        return ResponseEntity.ok(ApiResponse.success(bookings));
    }

    @DeleteMapping("/bookings/{id}")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Cancel a facility reservation")
    public ResponseEntity<ApiResponse<Void>> cancelBooking(@PathVariable UUID id) {
        facilityService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", null));
    }
}
