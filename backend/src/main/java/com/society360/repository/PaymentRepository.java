package com.society360.repository;

import com.society360.domain.finance.Payment;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface PaymentRepository extends TenantAwareRepository<Payment, UUID> {

    List<Payment> findBySocietyIdOrderByPaidAtDesc(UUID societyId);

    Optional<Payment> findBySocietyIdAndReceiptNumber(UUID societyId, String receiptNumber);

    Optional<Payment> findBySocietyIdAndInvoiceId(UUID societyId, UUID invoiceId);
}
