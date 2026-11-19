package com.society360.dto.response;

import com.society360.domain.visitor.VisitorEntry;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

public class VisitorEntryResponseDto {

    private UUID id;
    private UUID societyId;
    private UUID flatId;
    private String flatNumber;
    private String buildingName;
    private String wingName;
    private String visitorName;
    private String phoneNumber;
    private String purpose;
    private String entryType;
    private String passCode;
    private String status;
    private Instant checkInTime;
    private Instant checkOutTime;
    private String durationString;
    private String vehicleNumber;
    private String photoUrl;
    private Instant createdAt;

    public VisitorEntryResponseDto() {}

    public VisitorEntryResponseDto(
            VisitorEntry entry,
            String flatNumber,
            String buildingName,
            String wingName) {
        this.id = entry.getId();
        this.societyId = entry.getSocietyId();
        this.flatId = entry.getFlatId();
        this.flatNumber = flatNumber;
        this.buildingName = buildingName;
        this.wingName = wingName;
        this.visitorName = entry.getVisitorName();
        this.phoneNumber = entry.getPhoneNumber();
        this.purpose = entry.getPurpose();
        this.entryType = entry.getEntryType();
        this.passCode = entry.getPassCode();
        this.status = entry.getStatus();
        this.checkInTime = entry.getCheckInTime();
        this.checkOutTime = entry.getCheckOutTime();
        this.vehicleNumber = entry.getVehicleNumber();
        this.photoUrl = entry.getPhotoUrl();
        this.createdAt = entry.getCreatedAt();

        if (entry.getCheckInTime() != null && entry.getCheckOutTime() != null) {
            long minutes = Duration.between(entry.getCheckInTime(), entry.getCheckOutTime()).toMinutes();
            this.durationString = minutes >= 60
                    ? (minutes / 60) + "h " + (minutes % 60) + "m"
                    : minutes + "m";
        }
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

    public String getVisitorName() {
        return visitorName;
    }

    public void setVisitorName(String visitorName) {
        this.visitorName = visitorName;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getPurpose() {
        return purpose;
    }

    public void setPurpose(String purpose) {
        this.purpose = purpose;
    }

    public String getEntryType() {
        return entryType;
    }

    public void setEntryType(String entryType) {
        this.entryType = entryType;
    }

    public String getPassCode() {
        return passCode;
    }

    public void setPassCode(String passCode) {
        this.passCode = passCode;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(Instant checkInTime) {
        this.checkInTime = checkInTime;
    }

    public Instant getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(Instant checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public String getDurationString() {
        return durationString;
    }

    public void setDurationString(String durationString) {
        this.durationString = durationString;
    }

    public String getVehicleNumber() {
        return vehicleNumber;
    }

    public void setVehicleNumber(String vehicleNumber) {
        this.vehicleNumber = vehicleNumber;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
