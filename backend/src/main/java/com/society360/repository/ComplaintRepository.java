package com.society360.repository;

import com.society360.domain.complaint.Complaint;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepository extends TenantAwareRepository<Complaint, UUID> {

    List<Complaint> findBySocietyIdOrderByCreatedAtDesc(UUID societyId);

    List<Complaint> findBySocietyIdAndCreatedByOrderByCreatedAtDesc(UUID societyId, UUID createdBy);

    List<Complaint> findBySocietyIdAndAssignedToOrderByCreatedAtDesc(UUID societyId, UUID assignedTo);

    List<Complaint> findBySocietyIdAndStatusOrderByCreatedAtDesc(UUID societyId, String status);

    Optional<Complaint> findBySocietyIdAndTicketNumber(UUID societyId, String ticketNumber);

    long countBySocietyIdAndStatus(UUID societyId, String status);

    long countBySocietyId(UUID societyId);
}
