package com.society360.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class SimulatePaymentRequest {

    @NotNull(message = "Invoice ID is required")
    private UUID invoiceId;

    @NotBlank(message = "Payment method is required (UPI, CREDIT_CARD, NET_BANKING)")
    private String paymentMethod;

    private String paymentAccountOrVpa; // e.g. "rahul@okhdfcbank" or "4111222233334444"

    public SimulatePaymentRequest() {}

    public SimulatePaymentRequest(UUID invoiceId, String paymentMethod, String paymentAccountOrVpa) {
        this.invoiceId = invoiceId;
        this.paymentMethod = paymentMethod;
        this.paymentAccountOrVpa = paymentAccountOrVpa;
    }

    public UUID getInvoiceId() {
        return invoiceId;
    }

    public void setInvoiceId(UUID invoiceId) {
        this.invoiceId = invoiceId;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentAccountOrVpa() {
        return paymentAccountOrVpa;
    }

    public void setPaymentAccountOrVpa(String paymentAccountOrVpa) {
        this.paymentAccountOrVpa = paymentAccountOrVpa;
    }
}
