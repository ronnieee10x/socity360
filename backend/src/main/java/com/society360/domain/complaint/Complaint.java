package com.society360.domain.complaint;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "complaints")
public class Complaint extends TenantBaseEntity {

    @Column(name = "flat_id", nullable = false)
    private UUID flatId;

    @Column(name = "created_by", nullable = false)
    private UUID createdBy;

    @Column(name = "ticket_number", nullable = false, unique = true, length = 40)
    private String ticketNumber;

    @Column(name = "title", nullable = false, length = 150)
    private String title;

    @Column(name = "category", nullable = false, length = 40)
    private String category; // PLUMBING, ELECTRICAL, CARPENTRY, SECURITY, CIVIL, HOUSEKEEPING, LIFT, OTHER

    @Column(name = "priority", nullable = false, length = 20)
    private String priority = "MEDIUM"; // LOW, MEDIUM, HIGH, URGENT

    @Column(name = "description", nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "SUBMITTED"; // SUBMITTED, ASSIGNED, IN_PROGRESS, RESOLVED, CLOSED

    @Column(name = "photo_url", length = 255)
    private String photoUrl;

    @Column(name = "assigned_to")
    private UUID assignedTo;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    public Complaint() {}

    public Complaint(UUID flatId, UUID createdBy, String ticketNumber, String title, String category, String priority, String description) {
        this.flatId = flatId;
        this.createdBy = createdBy;
        this.ticketNumber = ticketNumber;
        this.title = title;
        this.category = category;
        this.priority = priority != null ? priority : "MEDIUM";
        this.description = description;
        this.status = "SUBMITTED";
    }

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UUID createdBy) {
        this.createdBy = createdBy;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public void setTicketNumber(String ticketNumber) {
        this.ticketNumber = ticketNumber;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public UUID getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(UUID assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getResolutionNotes() {
        return resolutionNotes;
    }

    public void setResolutionNotes(String resolutionNotes) {
        this.resolutionNotes = resolutionNotes;
    }

    public Instant getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(Instant resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}
