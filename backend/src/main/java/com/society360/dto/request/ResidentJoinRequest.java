package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.UUID;

public class ResidentJoinRequest {

    @NotNull(message = "Flat ID is required")
    private UUID flatId;

    @NotBlank(message = "Occupancy type is required")
    @Pattern(regexp = "OWNER|TENANT", message = "Occupancy type must be OWNER or TENANT")
    private String occupancyType;

    private String documentProofUrl;

    public ResidentJoinRequest() {}

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
    }

    public String getOccupancyType() {
        return occupancyType;
    }

    public void setOccupancyType(String occupancyType) {
        this.occupancyType = occupancyType;
    }

    public String getDocumentProofUrl() {
        return documentProofUrl;
    }

    public void setDocumentProofUrl(String documentProofUrl) {
        this.documentProofUrl = documentProofUrl;
    }
}
