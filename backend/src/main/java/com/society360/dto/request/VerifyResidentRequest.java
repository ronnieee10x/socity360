package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class VerifyResidentRequest {

    @NotBlank(message = "Decision is required")
    @Pattern(regexp = "APPROVED|REJECTED", message = "Decision must be APPROVED or REJECTED")
    private String decision;

    private String rejectionReason;

    public VerifyResidentRequest() {}

    public VerifyResidentRequest(String decision, String rejectionReason) {
        this.decision = decision;
        this.rejectionReason = rejectionReason;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}
