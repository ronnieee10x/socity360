package com.society360.domain.visitor;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "visitor_entries")
public class VisitorEntry extends TenantBaseEntity {

    @Column(name = "flat_id", nullable = false)
    private UUID flatId;

    @Column(name = "visitor_name", nullable = false, length = 100)
    private String visitorName;

    @Column(name = "phone_number", nullable = false, length = 20)
    private String phoneNumber;

    @Column(name = "purpose", nullable = false, length = 100)
    private String purpose; // GUEST, DELIVERY, CAB, SERVICE_REPAIR, MAINTENANCE, OTHER

    @Column(name = "entry_type", nullable = false, length = 30)
    private String entryType; // WALK_IN, PRE_APPROVED

    @Column(name = "pass_code", length = 10)
    private String passCode; // 6-digit pass code

    @Column(name = "status", nullable = false, length = 30)
    private String status = "EXPECTED"; // EXPECTED, PENDING_APPROVAL, APPROVED, CHECKED_IN, CHECKED_OUT, REJECTED

    @Column(name = "check_in_time")
    private Instant checkInTime;

    @Column(name = "check_out_time")
    private Instant checkOutTime;

    @Column(name = "guard_id")
    private UUID guardId;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "vehicle_number", length = 30)
    private String vehicleNumber;

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    public VisitorEntry() {}

    public VisitorEntry(UUID flatId, String visitorName, String phoneNumber, String purpose, String entryType) {
        this.flatId = flatId;
        this.visitorName = visitorName;
        this.phoneNumber = phoneNumber;
        this.purpose = purpose;
        this.entryType = entryType;
        this.status = "WALK_IN".equalsIgnoreCase(entryType) ? "CHECKED_IN" : "EXPECTED";
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

    public UUID getGuardId() {
        return guardId;
    }

    public void setGuardId(UUID guardId) {
        this.guardId = guardId;
    }

    public UUID getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(UUID approvedBy) {
        this.approvedBy = approvedBy;
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
