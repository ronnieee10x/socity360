package com.society360.repository;

import com.society360.domain.visitor.VisitorEntry;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VisitorEntryRepository extends TenantAwareRepository<VisitorEntry, UUID> {
    List<VisitorEntry> findAllBySocietyIdAndStatusOrderByCreatedAtDesc(UUID societyId, String status);
    List<VisitorEntry> findAllBySocietyIdAndFlatIdOrderByCreatedAtDesc(UUID societyId, UUID flatId);
    List<VisitorEntry> findAllBySocietyIdOrderByCreatedAtDesc(UUID societyId);
    Optional<VisitorEntry> findBySocietyIdAndPassCode(UUID societyId, String passCode);
    boolean existsBySocietyIdAndPhoneNumberAndFlatIdAndStatus(UUID societyId, String phoneNumber, UUID flatId, String status);
    long countBySocietyIdAndStatus(UUID societyId, String status);
}
