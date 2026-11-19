package com.society360.dto.response;

public class SuperAdminStatsDto {

    private long totalSocieties;
    private long activeSocieties;
    private long suspendedSocieties;
    private long pendingApplications;
    private long approvedApplications;
    private long rejectedApplications;
    private long totalPlatformUsers;

    public SuperAdminStatsDto() {}

    public SuperAdminStatsDto(long totalSocieties, long activeSocieties, long suspendedSocieties, long pendingApplications, long approvedApplications, long rejectedApplications, long totalPlatformUsers) {
        this.totalSocieties = totalSocieties;
        this.activeSocieties = activeSocieties;
        this.suspendedSocieties = suspendedSocieties;
        this.pendingApplications = pendingApplications;
        this.approvedApplications = approvedApplications;
        this.rejectedApplications = rejectedApplications;
        this.totalPlatformUsers = totalPlatformUsers;
    }

    public long getTotalSocieties() {
        return totalSocieties;
    }

    public void setTotalSocieties(long totalSocieties) {
        this.totalSocieties = totalSocieties;
    }

    public long getActiveSocieties() {
        return activeSocieties;
    }

    public void setActiveSocieties(long activeSocieties) {
        this.activeSocieties = activeSocieties;
    }

    public long getSuspendedSocieties() {
        return suspendedSocieties;
    }

    public void setSuspendedSocieties(long suspendedSocieties) {
        this.suspendedSocieties = suspendedSocieties;
    }

    public long getPendingApplications() {
        return pendingApplications;
    }

    public void setPendingApplications(long pendingApplications) {
        this.pendingApplications = pendingApplications;
    }

    public long getApprovedApplications() {
        return approvedApplications;
    }

    public void setApprovedApplications(long approvedApplications) {
        this.approvedApplications = approvedApplications;
    }

    public long getRejectedApplications() {
        return rejectedApplications;
    }

    public void setRejectedApplications(long rejectedApplications) {
        this.rejectedApplications = rejectedApplications;
    }

    public long getTotalPlatformUsers() {
        return totalPlatformUsers;
    }

    public void setTotalPlatformUsers(long totalPlatformUsers) {
        this.totalPlatformUsers = totalPlatformUsers;
    }
}
