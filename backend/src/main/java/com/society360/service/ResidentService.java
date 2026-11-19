package com.society360.service;

import com.society360.dto.request.ResidentJoinRequest;
import com.society360.dto.request.VerifyResidentRequest;
import com.society360.dto.response.OccupancyResponseDto;

import java.util.List;
import java.util.UUID;

public interface ResidentService {
    OccupancyResponseDto submitJoinRequest(ResidentJoinRequest request);
    List<OccupancyResponseDto> getVerificationQueue(String status);
    OccupancyResponseDto verifyResident(UUID occupancyId, VerifyResidentRequest request);
    List<OccupancyResponseDto> getResidentDirectory();
    OccupancyResponseDto getMyOccupancy();
}
