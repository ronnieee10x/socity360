package com.society360.service.payment;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.security.SecureRandom;

@Component
public class SimulatedPaymentGateway implements PaymentGateway {

    private static final Logger log = LoggerFactory.getLogger(SimulatedPaymentGateway.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final String HEX = "0123456789ABCDEF";

    @Override
    public PaymentGatewayResult processPayment(
            String invoiceNumber,
            BigDecimal amount,
            String paymentMethod,
            String paymentAccountOrVpa) {

        log.info("Processing simulated transaction for invoice={}, amount={}, method={}, account={}",
                invoiceNumber, amount, paymentMethod, paymentAccountOrVpa);

        // Generate realistic transaction reference e.g. TXN-S360-9B2F4C81
        StringBuilder sb = new StringBuilder("TXN-S360-");
        for (int i = 0; i < 8; i++) {
            sb.append(HEX.charAt(RANDOM.nextInt(HEX.length())));
        }
        String txnRef = sb.toString();

        log.info("Simulated payment SUCCESS for invoice {}: txnRef={}", invoiceNumber, txnRef);
        return new PaymentGatewayResult(true, txnRef, "Transaction approved by issuing bank");
    }
}
