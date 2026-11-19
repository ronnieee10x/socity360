package com.society360.dto.complaint;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateComplaintRequest {

    @NotNull(message = "Flat ID is required")
    private UUID flatId;

    @NotBlank(message = "Title is required")
    @Size(max = 150, message = "Title cannot exceed 150 characters")
    private String title;

    @NotBlank(message = "Category is required")
    private String category; // PLUMBING, ELECTRICAL, CARPENTRY, SECURITY, CIVIL, HOUSEKEEPING, LIFT, OTHER

    @NotBlank(message = "Priority is required")
    private String priority; // LOW, MEDIUM, HIGH, URGENT

    @NotBlank(message = "Description is required")
    private String description;

    private String photoUrl;

    public CreateComplaintRequest() {}

    public CreateComplaintRequest(UUID flatId, String title, String category, String priority, String description, String photoUrl) {
        this.flatId = flatId;
        this.title = title;
        this.category = category;
        this.priority = priority;
        this.description = description;
        this.photoUrl = photoUrl;
    }

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
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

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }
}
