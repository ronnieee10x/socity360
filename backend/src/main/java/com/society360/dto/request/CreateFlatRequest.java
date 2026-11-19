package com.society360.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.UUID;

public class CreateFlatRequest {

    @NotNull(message = "Building ID is required")
    private UUID buildingId;

    @NotNull(message = "Wing ID is required")
    private UUID wingId;

    @NotBlank(message = "Flat number is required")
    private String flatNumber;

    @NotNull(message = "Floor number is required")
    private Integer floorNumber;

    @NotBlank(message = "Flat type is required")
    private String flatType; // STUDIO, 1BHK, 2BHK, 3BHK, 4BHK, PENTHOUSE, VILLA

    @NotNull(message = "Square feet is required")
    @DecimalMin(value = "50.0", message = "Square feet must be at least 50")
    private BigDecimal squareFeet;

    public CreateFlatRequest() {}

    public UUID getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(UUID buildingId) {
        this.buildingId = buildingId;
    }

    public UUID getWingId() {
        return wingId;
    }

    public void setWingId(UUID wingId) {
        this.wingId = wingId;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public Integer getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(Integer floorNumber) {
        this.floorNumber = floorNumber;
    }

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
}
