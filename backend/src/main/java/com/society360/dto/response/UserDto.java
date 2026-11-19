package com.society360.dto.response;

import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import java.util.UUID;

public class UserDto {

    private UUID id;
    private String email;
    private String fullName;
    private String phone;
    private Role role;
    private UUID societyId;
    private String societyName;
    private String societyCode;
    private String status;
    private String avatarUrl;

    public UserDto() {}

    public UserDto(UserAccount user, String societyName, String societyCode) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.fullName = user.getFullName();
        this.phone = user.getPhone();
        this.role = user.getRole();
        this.societyId = user.getSocietyId();
        this.societyName = societyName;
        this.societyCode = societyCode;
        this.status = user.getStatus();
        this.avatarUrl = user.getAvatarUrl();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public UUID getSocietyId() {
        return societyId;
    }

    public void setSocietyId(UUID societyId) {
        this.societyId = societyId;
    }

    public String getSocietyName() {
        return societyName;
    }

    public void setSocietyName(String societyName) {
        this.societyName = societyName;
    }

    public String getSocietyCode() {
        return societyCode;
    }

    public void setSocietyCode(String societyCode) {
        this.societyCode = societyCode;
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
