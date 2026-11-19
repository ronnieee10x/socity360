package com.society360.dto.response;

import java.time.Instant;
import java.util.UUID;

public class NoticeResponseDto {
    private UUID id;
    private UUID societyId;
    private String title;
    private String content;
    private String noticeType;
    private String priority;
    private UUID publishedById;
    private String publishedByName;
    private String publishedByRole;
    private Instant expiresAt;
    private Instant createdAt;

    public NoticeResponseDto() {}

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

    public UUID getPublishedById() {
        return publishedById;
    }

    public void setPublishedById(UUID publishedById) {
        this.publishedById = publishedById;
    }

    public String getPublishedByName() {
        return publishedByName;
    }

    public void setPublishedByName(String publishedByName) {
        this.publishedByName = publishedByName;
    }

    public String getPublishedByRole() {
        return publishedByRole;
    }

    public void setPublishedByRole(String publishedByRole) {
        this.publishedByRole = publishedByRole;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
