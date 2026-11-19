package com.society360.service;

import com.society360.domain.property.Building;
import com.society360.domain.property.Wing;
import com.society360.dto.request.CreateBuildingRequest;
import com.society360.dto.request.CreateFlatRequest;
import com.society360.dto.request.CreateWingRequest;
import com.society360.dto.request.UpdateFlatRequest;
import com.society360.dto.response.FlatResponseDto;

import java.util.List;
import java.util.UUID;

public interface PropertyService {
    List<Building> getBuildings();
    Building createBuilding(CreateBuildingRequest request);
    List<Wing> getWings(UUID buildingId);
    Wing createWing(UUID buildingId, CreateWingRequest request);
    List<FlatResponseDto> getFlats(UUID buildingId, UUID wingId, String occupancyStatus);
    FlatResponseDto createFlat(CreateFlatRequest request);
    FlatResponseDto getFlatById(UUID id);
    FlatResponseDto updateFlat(UUID id, UpdateFlatRequest request);
    void deleteFlat(UUID id);
}
