package com.society360.domain.property;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "flats", uniqueConstraints = {
        @UniqueConstraint(name = "uq_wing_flat", columnNames = {"wing_id", "flat_number"})
})
public class Flat extends TenantBaseEntity {

    @Column(name = "building_id", nullable = false)
    private UUID buildingId;

    @Column(name = "wing_id", nullable = false)
    private UUID wingId;

    @Column(name = "flat_number", nullable = false, length = 30)
    private String flatNumber;

    @Column(name = "floor_number", nullable = false)
    private int floorNumber;

    @Column(name = "flat_type", nullable = false, length = 30)
    private String flatType; // STUDIO, 1BHK, 2BHK, 3BHK, 4BHK, PENTHOUSE, VILLA

    @Column(name = "square_feet", nullable = false, precision = 8, scale = 2)
    private BigDecimal squareFeet;

    @Column(name = "occupancy_status", nullable = false, length = 30)
    private String occupancyStatus = "VACANT"; // VACANT, OWNER_OCCUPIED, TENANT_OCCUPIED

    public Flat() {}

    public Flat(UUID buildingId, UUID wingId, String flatNumber, int floorNumber, String flatType, BigDecimal squareFeet) {
        this.buildingId = buildingId;
        this.wingId = wingId;
        this.flatNumber = flatNumber;
        this.floorNumber = floorNumber;
        this.flatType = flatType;
        this.squareFeet = squareFeet;
        this.occupancyStatus = "VACANT";
    }

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
}
