package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;

public class RejectApplicationRequest {

    @NotBlank(message = "Rejection reason is required")
    private String reason;

    public RejectApplicationRequest() {}

    public RejectApplicationRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
