package com.society360.service;

import com.society360.domain.audit.AuditLog;
import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.dto.request.ApproveApplicationRequest;
import com.society360.dto.request.RejectApplicationRequest;
import com.society360.dto.request.SocietyStatusUpdateRequest;
import com.society360.dto.response.SuperAdminStatsDto;

import java.util.List;
import java.util.UUID;

public interface SuperAdminService {
    SuperAdminStatsDto getDashboardStats();
    List<SocietyApplication> getApplications(String status);
    SocietyApplication getApplicationById(UUID id);
    Society approveApplication(UUID id, ApproveApplicationRequest request);
    SocietyApplication rejectApplication(UUID id, RejectApplicationRequest request);
    List<Society> getAllSocieties();
    Society updateSocietyStatus(UUID id, SocietyStatusUpdateRequest request);
    List<AuditLog> getAuditLogs();
}
