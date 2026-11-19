package com.society360.repository;

import com.society360.domain.property.Flat;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FlatRepository extends TenantAwareRepository<Flat, UUID> {
    List<Flat> findAllBySocietyIdOrderByFlatNumberAsc(UUID societyId);
    List<Flat> findAllBySocietyIdAndBuildingId(UUID societyId, UUID buildingId);
    List<Flat> findAllBySocietyIdAndWingId(UUID societyId, UUID wingId);
    List<Flat> findAllBySocietyIdAndOccupancyStatus(UUID societyId, String occupancyStatus);
    Optional<Flat> findByWingIdAndFlatNumber(UUID wingId, String flatNumber);
    boolean existsByWingIdAndFlatNumber(UUID wingId, String flatNumber);
    long countBySocietyId(UUID societyId);
    long countBySocietyIdAndOccupancyStatus(UUID societyId, String occupancyStatus);
}
