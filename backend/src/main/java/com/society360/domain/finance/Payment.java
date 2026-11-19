package com.society360.domain.finance;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "payments")
public class Payment extends TenantBaseEntity {

    @Column(name = "invoice_id", nullable = false)
    private UUID invoiceId;

    @Column(name = "paid_by", nullable = false)
    private UUID paidBy;

    @Column(name = "receipt_number", nullable = false, unique = true, length = 50)
    private String receiptNumber;

    @Column(name = "amount_paid", nullable = false, precision = 10, scale = 2)
    private BigDecimal amountPaid;

    @Column(name = "payment_method", nullable = false, length = 30)
    private String paymentMethod; // UPI, CREDIT_CARD, DEBIT_CARD, NET_BANKING, NEFT

    @Column(name = "transaction_reference", nullable = false, unique = true, length = 100)
    private String transactionReference;

    @Column(name = "payment_status", nullable = false, length = 25)
    private String paymentStatus = "SUCCESS"; // SUCCESS, PENDING, FAILED

    @Column(name = "paid_at", nullable = false)
    private Instant paidAt = Instant.now();

    public Payment() {}

    public Payment(UUID invoiceId, UUID paidBy, String receiptNumber, BigDecimal amountPaid, String paymentMethod, String transactionReference) {
        this.invoiceId = invoiceId;
        this.paidBy = paidBy;
        this.receiptNumber = receiptNumber;
        this.amountPaid = amountPaid;
        this.paymentMethod = paymentMethod;
        this.transactionReference = transactionReference;
        this.paymentStatus = "SUCCESS";
        this.paidAt = Instant.now();
    }

    public UUID getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(UUID invoiceId) {
        this.invoiceId = invoiceId;
    }

    public UUID getPaidBy() {
        return paidBy;
    }

    public void setPaidBy(UUID paidBy) {
        this.paidBy = paidBy;
    }

    public String getReceiptNumber() {
        return receiptNumber;
    }

    public void setReceiptNumber(String receiptNumber) {
        this.receiptNumber = receiptNumber;
    }

    public BigDecimal getAmountPaid() {
        return amountPaid;
    }

    public void setAmountPaid(BigDecimal amountPaid) {
        this.amountPaid = amountPaid;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Instant getPaidAt() {
        return paidAt;
    }

    public void setPaidAt(Instant paidAt) {
        this.paidAt = paidAt;
    }
}
