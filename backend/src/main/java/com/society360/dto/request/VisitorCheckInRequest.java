package com.society360.dto.request;

import java.util.UUID;

public class VisitorCheckInRequest {

    private String passCode; // If verifying pre-approved 6-digit PIN

    // Or for walk-in entry:
    private UUID flatId;
    private String visitorName;
    private String phoneNumber;
    private String purpose; // GUEST, DELIVERY, CAB, SERVICE_REPAIR, OTHER
    private String vehicleNumber;
    private String photoUrl;

    public VisitorCheckInRequest() {}

    public String getPassCode() {
        return passCode;
    }

    public void setPassCode(String passCode) {
        this.passCode = passCode;
    }

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
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
}
