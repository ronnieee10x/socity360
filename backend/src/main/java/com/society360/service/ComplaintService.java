package com.society360.service;

import com.society360.dto.complaint.AssignComplaintRequest;
import com.society360.dto.complaint.ComplaintResponseDto;
import com.society360.dto.complaint.CreateComplaintRequest;
import com.society360.dto.complaint.UpdateComplaintStatusRequest;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface ComplaintService {

    ComplaintResponseDto fileComplaint(CreateComplaintRequest request);

    ComplaintResponseDto assignComplaint(UUID complaintId, AssignComplaintRequest request);

    ComplaintResponseDto updateStatus(UUID complaintId, UpdateComplaintStatusRequest request);

    List<ComplaintResponseDto> getMyComplaints();

    List<ComplaintResponseDto> getAllSocietyComplaints(String status);

    List<ComplaintResponseDto> getMyAssignedTasks();

    ComplaintResponseDto getComplaintById(UUID complaintId);

    Map<String, Long> getComplaintStats();
}
