package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class VisitorDecisionRequest {

    @NotBlank(message = "Decision is required")
    @Pattern(regexp = "APPROVED|REJECTED", message = "Decision must be APPROVED or REJECTED")
    private String decision;

    public VisitorDecisionRequest() {}

    public VisitorDecisionRequest(String decision) {
        this.decision = decision;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }
}
