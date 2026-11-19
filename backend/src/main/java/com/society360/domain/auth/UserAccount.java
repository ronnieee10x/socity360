package com.society360.domain.auth;

import com.society360.domain.common.BaseEntity;
import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Table(name = "user_accounts")
public class UserAccount extends BaseEntity {

    @Column(name = "society_id")
    private UUID societyId;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "email", nullable = false, unique = true, length = 120)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 35)
    private Role role;

    @Column(name = "status", nullable = false, length = 25)
    private String status = "ACTIVE"; // PENDING_VERIFICATION, ACTIVE, SUSPENDED, DEACTIVATED

    @Column(name = "avatar_url", length = 255)
    private String avatarUrl;

    public UserAccount() {}

    public UserAccount(UUID societyId, String fullName, String email, String phone, String passwordHash, Role role) {
        this.societyId = societyId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.passwordHash = passwordHash;
        this.role = role;
        this.status = "ACTIVE";
    }

    public UUID getSocietyId() {
        return societyId;
    }

    public void setSocietyId(UUID societyId) {
        this.societyId = societyId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }
}
