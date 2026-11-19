package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class SocietyStatusUpdateRequest {

    @NotBlank(message = "Status is required")
    @Pattern(regexp = "ACTIVE|SUSPENDED|INACTIVE", message = "Status must be ACTIVE, SUSPENDED, or INACTIVE")
    private String status;

    private String reason;

    public SocietyStatusUpdateRequest() {}

    public SocietyStatusUpdateRequest(String status, String reason) {
        this.status = status;
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
