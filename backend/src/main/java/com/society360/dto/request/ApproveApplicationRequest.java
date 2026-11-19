package com.society360.dto.request;

public class ApproveApplicationRequest {
    private String adminPassword; // Optional, if empty system generates default password

    public ApproveApplicationRequest() {}

    public ApproveApplicationRequest(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    public String getAdminPassword() {
        return adminPassword;
    }

    public void setAdminPassword(String adminPassword) {
        this.adminPassword = adminPassword;
    }
}
