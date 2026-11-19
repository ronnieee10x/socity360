package com.society360.dto.response;

import com.society360.domain.property.Flat;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

public class FlatResponseDto {

    private UUID id;
    private UUID societyId;
    private UUID buildingId;
    private String buildingName;
    private UUID wingId;
    private String wingName;
    private String flatNumber;
    private int floorNumber;
    private String flatType;
    private BigDecimal squareFeet;
    private String occupancyStatus;
    private Instant createdAt;

    public FlatResponseDto() {}

    public FlatResponseDto(Flat flat, String buildingName, String wingName) {
        this.id = flat.getId();
        this.societyId = flat.getSocietyId();
        this.buildingId = flat.getBuildingId();
        this.buildingName = buildingName;
        this.wingId = flat.getWingId();
        this.wingName = wingName;
        this.flatNumber = flat.getFlatNumber();
        this.floorNumber = flat.getFloorNumber();
        this.flatType = flat.getFlatType();
        this.squareFeet = flat.getSquareFeet();
        this.occupancyStatus = flat.getOccupancyStatus();
        this.createdAt = flat.getCreatedAt();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSocietyId() {
        return societyId;
    }

    public void setSocietyId(UUID societyId) {
        this.societyId = societyId;
    }

    public UUID getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(UUID buildingId) {
        this.buildingId = buildingId;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public UUID getWingId() {
        return wingId;
    }

    public void setWingId(UUID wingId) {
        this.wingId = wingId;
    }

    public String getWingName() {
        return wingName;
    }

    public void setWingName(String wingName) {
        this.wingName = wingName;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public int getFloorNumber() {
        return floorNumber;
    }

    public void setFloorNumber(int floorNumber) {
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

    public String getOccupancyStatus() {
        return occupancyStatus;
    }

    public void setOccupancyStatus(String occupancyStatus) {
        this.occupancyStatus = occupancyStatus;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
