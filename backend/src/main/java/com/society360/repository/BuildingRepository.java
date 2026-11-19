package com.society360.repository;

import com.society360.domain.property.Building;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface BuildingRepository extends TenantAwareRepository<Building, UUID> {
    Optional<Building> findBySocietyIdAndName(UUID societyId, String name);
    boolean existsBySocietyIdAndName(UUID societyId, String name);
    List<Building> findAllBySocietyIdOrderByNameAsc(UUID societyId);
}
