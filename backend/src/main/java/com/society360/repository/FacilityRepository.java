package com.society360.repository;

import com.society360.domain.facility.Facility;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface FacilityRepository extends TenantAwareRepository<Facility, UUID> {

    List<Facility> findBySocietyIdAndStatus(UUID societyId, String status);

    List<Facility> findBySocietyIdOrderByNameAsc(UUID societyId);
}
