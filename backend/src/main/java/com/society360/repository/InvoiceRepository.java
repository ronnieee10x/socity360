package com.society360.repository;

import com.society360.domain.finance.Invoice;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface InvoiceRepository extends TenantAwareRepository<Invoice, UUID> {

    List<Invoice> findBySocietyIdOrderByCreatedAtDesc(UUID societyId);

    List<Invoice> findBySocietyIdAndFlatIdOrderByCreatedAtDesc(UUID societyId, UUID flatId);

    List<Invoice> findBySocietyIdAndStatusOrderByDueDateAsc(UUID societyId, String status);

    Optional<Invoice> findBySocietyIdAndInvoiceNumber(UUID societyId, String invoiceNumber);

    boolean existsBySocietyIdAndFlatIdAndBillingMonth(UUID societyId, UUID flatId, String billingMonth);

    long countBySocietyIdAndStatus(UUID societyId, String status);
}
