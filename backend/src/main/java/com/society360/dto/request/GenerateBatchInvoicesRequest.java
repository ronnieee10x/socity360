package com.society360.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class GenerateBatchInvoicesRequest {

    @NotBlank(message = "Billing month is required (e.g. NOV-2026)")
    private String billingMonth;

    @NotNull(message = "Base maintenance amount is required")
    @DecimalMin(value = "1.00", message = "Amount must be at least 1.00")
    private BigDecimal baseAmount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    private String description;

    private UUID buildingId; // Optional: filter by building, or null for all society flats

    public GenerateBatchInvoicesRequest() {}

    public GenerateBatchInvoicesRequest(String billingMonth, BigDecimal baseAmount, LocalDate dueDate, String description, UUID buildingId) {
        this.billingMonth = billingMonth;
        this.baseAmount = baseAmount;
        this.dueDate = dueDate;
        this.description = description;
        this.buildingId = buildingId;
    }

    public String getBillingMonth() {
        return billingMonth;
    }

    public void setBillingMonth(String billingMonth) {
        this.billingMonth = billingMonth;
    }

    public BigDecimal getBaseAmount() {
        return baseAmount;
    }

    public void setBaseAmount(BigDecimal baseAmount) {
        this.baseAmount = baseAmount;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public UUID getBuildingId() {
        return buildingId;
    }

    public void setBuildingId(UUID buildingId) {
        this.buildingId = buildingId;
    }
}
