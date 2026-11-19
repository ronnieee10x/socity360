package com.society360.controller;

import com.society360.domain.property.Building;
import com.society360.domain.property.Wing;
import com.society360.dto.request.CreateBuildingRequest;
import com.society360.dto.request.CreateFlatRequest;
import com.society360.dto.request.CreateWingRequest;
import com.society360.dto.request.UpdateFlatRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.FlatResponseDto;
import com.society360.service.PropertyService;
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
@RequestMapping("/api/v1")
@Tag(name = "Property & Units Management", description = "Endpoints for managing Buildings, Wings, and Flats within a Society")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    @GetMapping("/buildings")
    @Operation(summary = "List all buildings in current society")
    public ResponseEntity<ApiResponse<List<Building>>> getBuildings() {
        List<Building> buildings = propertyService.getBuildings();
        return ResponseEntity.ok(ApiResponse.success(buildings));
    }

    @PostMapping("/buildings")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Add a new building to the society (Admin only)")
    public ResponseEntity<ApiResponse<Building>> createBuilding(@Valid @RequestBody CreateBuildingRequest request) {
        Building building = propertyService.createBuilding(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Building added successfully", building));
    }

    @GetMapping("/buildings/{id}/wings")
    @Operation(summary = "List all wings associated with a building")
    public ResponseEntity<ApiResponse<List<Wing>>> getWings(@PathVariable UUID id) {
        List<Wing> wings = propertyService.getWings(id);
        return ResponseEntity.ok(ApiResponse.success(wings));
    }

    @PostMapping("/buildings/{id}/wings")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Add a wing to a building (Admin only)")
    public ResponseEntity<ApiResponse<Wing>> createWing(
            @PathVariable UUID id,
            @Valid @RequestBody CreateWingRequest request) {
        Wing wing = propertyService.createWing(id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Wing created successfully", wing));
    }

    @GetMapping("/flats")
    @Operation(summary = "List flats in current society with optional building, wing, and occupancy filters")
    public ResponseEntity<ApiResponse<List<FlatResponseDto>>> getFlats(
            @RequestParam(required = false) UUID buildingId,
            @RequestParam(required = false) UUID wingId,
            @RequestParam(required = false) String occupancyStatus) {
        List<FlatResponseDto> flats = propertyService.getFlats(buildingId, wingId, occupancyStatus);
        return ResponseEntity.ok(ApiResponse.success(flats));
    }

    @PostMapping("/flats")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Register a new flat/unit with unique number check (Admin only)")
    public ResponseEntity<ApiResponse<FlatResponseDto>> createFlat(@Valid @RequestBody CreateFlatRequest request) {
        FlatResponseDto flat = propertyService.createFlat(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Flat registered successfully", flat));
    }

    @GetMapping("/flats/{id}")
    @Operation(summary = "Get specific flat details by ID")
    public ResponseEntity<ApiResponse<FlatResponseDto>> getFlatById(@PathVariable UUID id) {
        FlatResponseDto flat = propertyService.getFlatById(id);
        return ResponseEntity.ok(ApiResponse.success(flat));
    }

    @PutMapping("/flats/{id}")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Update flat parameters (Admin only)")
    public ResponseEntity<ApiResponse<FlatResponseDto>> updateFlat(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateFlatRequest request) {
        FlatResponseDto flat = propertyService.updateFlat(id, request);
        return ResponseEntity.ok(ApiResponse.success("Flat updated successfully", flat));
    }

    @DeleteMapping("/flats/{id}")
    @PreAuthorize("hasRole('SOCIETY_ADMIN')")
    @Operation(summary = "Delete flat (Admin only, must be VACANT)")
    public ResponseEntity<ApiResponse<Void>> deleteFlat(@PathVariable UUID id) {
        propertyService.deleteFlat(id);
        return ResponseEntity.ok(ApiResponse.success("Flat deleted successfully", null));
    }
}
