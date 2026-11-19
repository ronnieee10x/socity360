package com.society360.domain.finance;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "invoices")
public class Invoice extends TenantBaseEntity {

    @Column(name = "flat_id", nullable = false)
    private UUID flatId;

    @Column(name = "invoice_number", nullable = false, unique = true, length = 50)
    private String invoiceNumber;

    @Column(name = "billing_month", nullable = false, length = 20)
    private String billingMonth; // e.g. "OCT-2026", "NOV-2026"

    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @Column(name = "late_fee", nullable = false, precision = 8, scale = 2)
    private BigDecimal lateFee = BigDecimal.ZERO;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "status", nullable = false, length = 25)
    private String status = "UNPAID"; // UNPAID, PAID, OVERDUE, CANCELLED

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    public Invoice() {}

    public Invoice(UUID flatId, String invoiceNumber, String billingMonth, BigDecimal amount, LocalDate dueDate, String description) {
        this.flatId = flatId;
        this.invoiceNumber = invoiceNumber;
        this.billingMonth = billingMonth;
        this.amount = amount;
        this.lateFee = BigDecimal.ZERO;
        this.dueDate = dueDate;
        this.status = "UNPAID";
        this.description = description;
    }

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
    }

    public String getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(String invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public String getBillingMonth() {
        return billingMonth;
    }

    public void setBillingMonth(String billingMonth) {
        this.billingMonth = billingMonth;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getLateFee() {
        return lateFee;
    }

    public void setLateFee(BigDecimal lateFee) {
        this.lateFee = lateFee;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
