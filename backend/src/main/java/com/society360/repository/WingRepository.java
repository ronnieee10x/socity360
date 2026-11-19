package com.society360.repository;

import com.society360.domain.property.Wing;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface WingRepository extends TenantAwareRepository<Wing, UUID> {
    List<Wing> findAllBySocietyIdAndBuildingIdOrderByNameAsc(UUID societyId, UUID buildingId);
    Optional<Wing> findByBuildingIdAndName(UUID buildingId, String name);
    boolean existsByBuildingIdAndName(UUID buildingId, String name);
}
