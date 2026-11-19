package com.society360.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class UpdateFlatRequest {

    @NotBlank(message = "Flat type is required")
    private String flatType;

    @NotNull(message = "Square feet is required")
    @DecimalMin(value = "50.0")
    private BigDecimal squareFeet;

    @NotBlank(message = "Occupancy status is required")
    private String occupancyStatus; // VACANT, OWNER_OCCUPIED, TENANT_OCCUPIED

    public UpdateFlatRequest() {}

    public String getFlatType() {
        return flatType;
    }

    public void setFlatType(String flatType) {
        this.flatType = flatType;
    }

    public BigDecimal getSquareFeet() {
        return squareFeet;
    }

    public void setSquareFeet(BigDecimal squareFeet) {
        this.squareFeet = squareFeet;
    }

    public String getOccupancyStatus() {
        return occupancyStatus;
    }

    public void setOccupancyStatus(String occupancyStatus) {
        this.occupancyStatus = occupancyStatus;
    }
}
