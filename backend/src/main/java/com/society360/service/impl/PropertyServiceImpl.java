package com.society360.service.impl;

import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.domain.property.Wing;
import com.society360.dto.request.CreateBuildingRequest;
import com.society360.dto.request.CreateFlatRequest;
import com.society360.dto.request.CreateWingRequest;
import com.society360.dto.request.UpdateFlatRequest;
import com.society360.dto.response.FlatResponseDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.DuplicateResourceException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.BuildingRepository;
import com.society360.repository.FlatRepository;
import com.society360.repository.WingRepository;
import com.society360.security.TenantContextHolder;
import com.society360.service.PropertyService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class PropertyServiceImpl implements PropertyService {

    private final BuildingRepository buildingRepository;
    private final WingRepository wingRepository;
    private final FlatRepository flatRepository;

    public PropertyServiceImpl(
            BuildingRepository buildingRepository,
            WingRepository wingRepository,
            FlatRepository flatRepository) {
        this.buildingRepository = buildingRepository;
        this.wingRepository = wingRepository;
        this.flatRepository = flatRepository;
    }

    private UUID requireTenantId() {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            throw new BadRequestException("No active society tenant context found");
        }
        return tenantId;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Building> getBuildings() {
        UUID tenantId = requireTenantId();
        return buildingRepository.findAllBySocietyIdOrderByNameAsc(tenantId);
    }

    @Override
    public Building createBuilding(CreateBuildingRequest request) {
        UUID tenantId = requireTenantId();
        String name = request.getName().trim();

        if (buildingRepository.existsBySocietyIdAndName(tenantId, name)) {
            throw new DuplicateResourceException("A building with name '" + name + "' already exists in this society");
        }

        Building building = new Building(name, request.getTotalFloors(), request.getDescription());
        building.setSocietyId(tenantId);
        return buildingRepository.save(building);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Wing> getWings(UUID buildingId) {
        UUID tenantId = requireTenantId();
        return wingRepository.findAllBySocietyIdAndBuildingIdOrderByNameAsc(tenantId, buildingId);
    }

    @Override
    public Wing createWing(UUID buildingId, CreateWingRequest request) {
        UUID tenantId = requireTenantId();
        Building building = buildingRepository.findByIdAndSocietyId(buildingId, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found in current society"));

        String name = request.getName().trim();
        if (wingRepository.existsByBuildingIdAndName(buildingId, name)) {
            throw new DuplicateResourceException("A wing with name '" + name + "' already exists in this building");
        }

        Wing wing = new Wing(building.getId(), name);
        wing.setSocietyId(tenantId);
        return wingRepository.save(wing);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FlatResponseDto> getFlats(UUID buildingId, UUID wingId, String occupancyStatus) {
        UUID tenantId = requireTenantId();
        List<Flat> flats;

        if (wingId != null) {
            flats = flatRepository.findAllBySocietyIdAndWingId(tenantId, wingId);
        } else if (buildingId != null) {
            flats = flatRepository.findAllBySocietyIdAndBuildingId(tenantId, buildingId);
        } else if (occupancyStatus != null && !occupancyStatus.isBlank()) {
            flats = flatRepository.findAllBySocietyIdAndOccupancyStatus(tenantId, occupancyStatus.toUpperCase());
        } else {
            flats = flatRepository.findAllBySocietyIdOrderByFlatNumberAsc(tenantId);
        }

        // Preload building and wing maps for efficient response mapping
        Map<UUID, String> buildingNames = buildingRepository.findAllBySocietyId(tenantId)
                .stream().collect(Collectors.toMap(Building::getId, Building::getName));
        Map<UUID, String> wingNames = wingRepository.findAllBySocietyId(tenantId)
                .stream().collect(Collectors.toMap(Wing::getId, Wing::getName));

        return flats.stream()
                .map(f -> new FlatResponseDto(
                        f,
                        buildingNames.getOrDefault(f.getBuildingId(), "Unknown"),
                        wingNames.getOrDefault(f.getWingId(), "Unknown")
                ))
                .toList();
    }

    @Override
    public FlatResponseDto createFlat(CreateFlatRequest request) {
        UUID tenantId = requireTenantId();

        Building building = buildingRepository.findByIdAndSocietyId(request.getBuildingId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Building not found in current society"));

        Wing wing = wingRepository.findByIdAndSocietyId(request.getWingId(), tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Wing not found in current society"));

        if (!wing.getBuildingId().equals(building.getId())) {
            throw new BadRequestException("Specified wing does not belong to the specified building");
        }

        String flatNumber = request.getFlatNumber().trim();
        if (flatRepository.existsByWingIdAndFlatNumber(wing.getId(), flatNumber)) {
            throw new DuplicateResourceException("Flat number '" + flatNumber + "' already exists in " + wing.getName());
        }

        Flat flat = new Flat(
                building.getId(),
                wing.getId(),
                flatNumber,
                request.getFloorNumber(),
                request.getFlatType().toUpperCase(),
                request.getSquareFeet()
        );
        flat.setSocietyId(tenantId);
        flat = flatRepository.save(flat);

        return new FlatResponseDto(flat, building.getName(), wing.getName());
    }

    @Override
    @Transactional(readOnly = true)
    public FlatResponseDto getFlatById(UUID id) {
        UUID tenantId = requireTenantId();
        Flat flat = flatRepository.findByIdAndSocietyId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));

        Building building = buildingRepository.findById(flat.getBuildingId()).orElse(null);
        Wing wing = wingRepository.findById(flat.getWingId()).orElse(null);

        return new FlatResponseDto(
                flat,
                building != null ? building.getName() : "Unknown",
                wing != null ? wing.getName() : "Unknown"
        );
    }

    @Override
    public FlatResponseDto updateFlat(UUID id, UpdateFlatRequest request) {
        UUID tenantId = requireTenantId();
        Flat flat = flatRepository.findByIdAndSocietyId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));

        flat.setFlatType(request.getFlatType().toUpperCase());
        flat.setSquareFeet(request.getSquareFeet());
        flat.setOccupancyStatus(request.getOccupancyStatus().toUpperCase());

        flat = flatRepository.save(flat);

        Building building = buildingRepository.findById(flat.getBuildingId()).orElse(null);
        Wing wing = wingRepository.findById(flat.getWingId()).orElse(null);

        return new FlatResponseDto(
                flat,
                building != null ? building.getName() : "Unknown",
                wing != null ? wing.getName() : "Unknown"
        );
    }

    @Override
    public void deleteFlat(UUID id) {
        UUID tenantId = requireTenantId();
        Flat flat = flatRepository.findByIdAndSocietyId(id, tenantId)
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found"));

        if (!"VACANT".equalsIgnoreCase(flat.getOccupancyStatus())) {
            throw new BadRequestException("Cannot delete an occupied flat. Vacate residents first.");
        }

        flatRepository.delete(flat);
    }
}
