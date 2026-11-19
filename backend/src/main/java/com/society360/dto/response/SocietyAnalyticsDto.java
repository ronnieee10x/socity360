package com.society360.dto.response;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public class SocietyAnalyticsDto {
    private long totalFlats;
    private long occupiedFlats;
    private long vacantFlats;
    private double occupancyPercentage;

    private BigDecimal totalBilled;
    private BigDecimal totalCollected;
    private BigDecimal pendingDues;
    private double collectionPercentage;

    private long totalComplaints;
    private long openComplaints;
    private long resolvedComplaints;

    private long totalVisitorsToday;
    private long activeVisitorsNow;

    private List<MonthlyFinancialPoint> financialTrend;
    private List<CategoryStatPoint> complaintCategories;
    private List<OccupancyTypePoint> occupancyDistribution;

    public SocietyAnalyticsDto() {}

    public record MonthlyFinancialPoint(String month, BigDecimal billed, BigDecimal collected) {}
    public record CategoryStatPoint(String category, long count) {}
    public record OccupancyTypePoint(String type, long count) {}

    public long getTotalFlats() {
        return totalFlats;
    }

    public void setTotalFlats(long totalFlats) {
        this.totalFlats = totalFlats;
    }

    public long getOccupiedFlats() {
        return occupiedFlats;
    }

    public void setOccupiedFlats(long occupiedFlats) {
        this.occupiedFlats = occupiedFlats;
    }

    public long getVacantFlats() {
        return vacantFlats;
    }

    public void setVacantFlats(long vacantFlats) {
        this.vacantFlats = vacantFlats;
    }

    public double getOccupancyPercentage() {
        return occupancyPercentage;
    }

    public void setOccupancyPercentage(double occupancyPercentage) {
        this.occupancyPercentage = occupancyPercentage;
    }

    public BigDecimal getTotalBilled() {
        return totalBilled;
    }

    public void setTotalBilled(BigDecimal totalBilled) {
        this.totalBilled = totalBilled;
    }

    public BigDecimal getTotalCollected() {
        return totalCollected;
    }

    public void setTotalCollected(BigDecimal totalCollected) {
        this.totalCollected = totalCollected;
    }

    public BigDecimal getPendingDues() {
        return pendingDues;
    }

    public void setPendingDues(BigDecimal pendingDues) {
        this.pendingDues = pendingDues;
    }

    public double getCollectionPercentage() {
        return collectionPercentage;
    }

    public void setCollectionPercentage(double collectionPercentage) {
        this.collectionPercentage = collectionPercentage;
    }

    public long getTotalComplaints() {
        return totalComplaints;
    }

    public void setTotalComplaints(long totalComplaints) {
        this.totalComplaints = totalComplaints;
    }

    public long getOpenComplaints() {
        return openComplaints;
    }

    public void setOpenComplaints(long openComplaints) {
        this.openComplaints = openComplaints;
    }

    public long getResolvedComplaints() {
        return resolvedComplaints;
    }

    public void setResolvedComplaints(long resolvedComplaints) {
        this.resolvedComplaints = resolvedComplaints;
    }

    public long getTotalVisitorsToday() {
        return totalVisitorsToday;
    }

    public void setTotalVisitorsToday(long totalVisitorsToday) {
        this.totalVisitorsToday = totalVisitorsToday;
    }

    public long getActiveVisitorsNow() {
        return activeVisitorsNow;
    }

    public void setActiveVisitorsNow(long activeVisitorsNow) {
        this.activeVisitorsNow = activeVisitorsNow;
    }

    public List<MonthlyFinancialPoint> getFinancialTrend() {
        return financialTrend;
    }

    public void setFinancialTrend(List<MonthlyFinancialPoint> financialTrend) {
        this.financialTrend = financialTrend;
    }

    public List<CategoryStatPoint> getComplaintCategories() {
        return complaintCategories;
    }

    public void setComplaintCategories(List<CategoryStatPoint> complaintCategories) {
        this.complaintCategories = complaintCategories;
    }

    public List<OccupancyTypePoint> getOccupancyDistribution() {
        return occupancyDistribution;
    }

    public void setOccupancyDistribution(List<OccupancyTypePoint> occupancyDistribution) {
        this.occupancyDistribution = occupancyDistribution;
    }
}
