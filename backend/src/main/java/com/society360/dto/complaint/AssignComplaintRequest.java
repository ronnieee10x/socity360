package com.society360.dto.complaint;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AssignComplaintRequest {

    @NotNull(message = "Assigned staff user ID is required")
    private UUID assignedToId;

    public AssignComplaintRequest() {}

    public AssignComplaintRequest(UUID assignedToId) {
        this.assignedToId = assignedToId;
    }

    public UUID getAssignedToId() {
        return assignedToId;
    }

    public void setAssignedToId(UUID assignedToId) {
        this.assignedToId = assignedToId;
    }
}
