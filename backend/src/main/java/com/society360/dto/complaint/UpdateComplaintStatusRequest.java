package com.society360.dto.complaint;

import jakarta.validation.constraints.NotBlank;

public class UpdateComplaintStatusRequest {

    @NotBlank(message = "Status is required")
    private String status; // SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED

    private String resolutionNotes;

    public UpdateComplaintStatusRequest() {}

    public UpdateComplaintStatusRequest(String status, String resolutionNotes) {
        this.status = status;
        this.resolutionNotes = resolutionNotes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }
}
