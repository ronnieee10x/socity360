package com.society360.domain.notice;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "notices")
public class Notice extends TenantBaseEntity {

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "notice_type", nullable = false, length = 30)
    private String noticeType; // GENERAL, MAINTENANCE, EMERGENCY, EVENT, BILLING

    @Column(name = "priority", nullable = false, length = 20)
    private String priority = "NORMAL"; // NORMAL, URGENT

    @Column(name = "published_by", nullable = false)
    private UUID publishedBy;

    @Column(name = "expires_at")
    private Instant expiresAt;

    public Notice() {}

    public Notice(String title, String content, String noticeType, String priority, UUID publishedBy, Instant expiresAt) {
        this.title = title;
        this.content = content;
        this.noticeType = noticeType;
        this.priority = priority != null ? priority : "NORMAL";
        this.publishedBy = publishedBy;
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

    public UUID getPublishedBy() {
        return publishedBy;
    }

    public void setPublishedBy(UUID publishedBy) {
        this.publishedBy = publishedBy;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }
}
