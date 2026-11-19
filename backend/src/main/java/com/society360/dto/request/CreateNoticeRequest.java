package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.Instant;

public class CreateNoticeRequest {

    @NotBlank(message = "Notice title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    private String title;

    @NotBlank(message = "Content is required")
    private String content;

    @NotBlank(message = "Notice type is required (GENERAL, MAINTENANCE, EMERGENCY, EVENT)")
    private String noticeType;

    private String priority = "NORMAL"; // NORMAL, URGENT

    private Instant expiresAt;

    public CreateNoticeRequest() {}

    public CreateNoticeRequest(String title, String content, String noticeType, String priority, Instant expiresAt) {
        this.title = title;
        this.content = content;
        this.noticeType = noticeType;
        this.priority = priority != null ? priority : "NORMAL";
        this.expiresAt = expiresAt;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getNoticeType() {
        return noticeType;
    }

    public void setNoticeType(String noticeType) {
        this.noticeType = noticeType;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
