package com.society360.dto.response;

import com.society360.domain.auth.Role;

public class DemoAccountDto {

    private String label;
    private String email;
    private String password;
    private Role role;
    private String societyName;
    private String description;

    public DemoAccountDto() {}

    public DemoAccountDto(String label, String email, String password, Role role, String societyName, String description) {
        this.label = label;
        this.email = email;
        this.password = password;
        this.role = role;
        this.societyName = societyName;
        this.description = description;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public String getSocietyName() {
        return societyName;
    }

    public void setSocietyName(String societyName) {
        this.societyName = societyName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
