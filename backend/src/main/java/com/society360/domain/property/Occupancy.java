package com.society360.domain.property;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "occupancies")
public class Occupancy extends TenantBaseEntity {

    @Column(name = "flat_id", nullable = false)
    private UUID flatId;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "occupancy_type", nullable = false, length = 20)
    private String occupancyType; // OWNER, TENANT

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, UNDER_REVIEW, APPROVED, REJECTED, VACATED

    @Column(name = "document_proof_url", length = 255)
    private String documentProofUrl;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    @Column(name = "verified_by")
    private UUID verifiedBy;

    @Column(name = "verified_at")
    private Instant verifiedAt;

    public Occupancy() {}

    public Occupancy(UUID flatId, UUID userId, String occupancyType, String documentProofUrl) {
        this.flatId = flatId;
        this.userId = userId;
        this.occupancyType = occupancyType;
        this.documentProofUrl = documentProofUrl;
        this.status = "PENDING";
    }

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public UUID getVerifiedBy() {
        return verifiedBy;
    }

    public void setVerifiedBy(UUID verifiedBy) {
        this.verifiedBy = verifiedBy;
    }

    public Instant getVerifiedAt() {
        return verifiedAt;
    }

    public void setVerifiedAt(Instant verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
}
