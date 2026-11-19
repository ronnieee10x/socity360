package com.society360.service.payment;

import java.math.BigDecimal;

public interface PaymentGateway {

    PaymentGatewayResult processPayment(
            String invoiceNumber,
            BigDecimal amount,
            String paymentMethod,
            String paymentAccountOrVpa);

    record PaymentGatewayResult(
            boolean successful,
            String transactionReference,
            String gatewayMessage
    ) {}
}
