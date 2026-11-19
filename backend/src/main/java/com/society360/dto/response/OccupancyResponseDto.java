package com.society360.dto.response;

import com.society360.domain.property.Occupancy;
import java.time.Instant;
import java.util.UUID;

public class OccupancyResponseDto {

    private UUID id;
    private UUID societyId;
    private UUID flatId;
    private String flatNumber;
    private String buildingName;
    private String wingName;
    private UUID userId;
    private String userName;
    private String userEmail;
    private String userPhone;
    private String occupancyType;
    private String status;
    private String documentProofUrl;
    private String rejectionReason;
    private Instant createdAt;

    public OccupancyResponseDto() {}

    public OccupancyResponseDto(
            Occupancy occupancy,
            String flatNumber,
            String buildingName,
            String wingName,
            String userName,
            String userEmail,
            String userPhone) {
        this.id = occupancy.getId();
        this.societyId = occupancy.getSocietyId();
        this.flatId = occupancy.getFlatId();
        this.flatNumber = flatNumber;
        this.buildingName = buildingName;
        this.wingName = wingName;
        this.userId = occupancy.getUserId();
        this.userName = userName;
        this.userEmail = userEmail;
        this.userPhone = userPhone;
        this.occupancyType = occupancy.getOccupancyType();
        this.status = occupancy.getStatus();
        this.documentProofUrl = occupancy.getDocumentProofUrl();
        this.rejectionReason = occupancy.getRejectionReason();
        this.createdAt = occupancy.getCreatedAt();
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

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
    }

    public String getFlatNumber() {
        return flatNumber;
    }

    public void setFlatNumber(String flatNumber) {
        this.flatNumber = flatNumber;
    }

    public String getBuildingName() {
        return buildingName;
    }

    public void setBuildingName(String buildingName) {
        this.buildingName = buildingName;
    }

    public String getWingName() {
        return wingName;
    }

    public void setWingName(String wingName) {
        this.wingName = wingName;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getUserPhone() {
        return userPhone;
    }

    public void setUserPhone(String userPhone) {
        this.userPhone = userPhone;
    }

    public String getOccupancyType() {
        return occupancyType;
    }

    public void setOccupancyType(String occupancyType) {
        this.occupancyType = occupancyType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDocumentProofUrl() {
        return documentProofUrl;
    }

    public void setDocumentProofUrl(String documentProofUrl) {
        this.documentProofUrl = documentProofUrl;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
