package com.society360.service;

import com.society360.dto.request.PreApproveVisitorRequest;
import com.society360.dto.request.VisitorCheckInRequest;
import com.society360.dto.request.VisitorDecisionRequest;
import com.society360.dto.response.VisitorEntryResponseDto;

import java.util.List;
import java.util.UUID;

public interface VisitorSecurityService {
    VisitorEntryResponseDto preApproveVisitor(PreApproveVisitorRequest request);
    VisitorEntryResponseDto checkIn(VisitorCheckInRequest request);
    VisitorEntryResponseDto checkOut(UUID visitorId);
    VisitorEntryResponseDto residentDecision(UUID visitorId, VisitorDecisionRequest request);
    List<VisitorEntryResponseDto> getActiveVisitors();
    List<VisitorEntryResponseDto> getExpectedVisitors();
    List<VisitorEntryResponseDto> getVisitorHistory(UUID flatId);
}
