package com.society360.repository;

import com.society360.domain.property.Occupancy;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface OccupancyRepository extends TenantAwareRepository<Occupancy, UUID> {
    List<Occupancy> findAllBySocietyIdAndStatus(UUID societyId, String status);
    List<Occupancy> findAllBySocietyIdOrderByCreatedAtDesc(UUID societyId);
    List<Occupancy> findAllByUserId(UUID userId);
    Optional<Occupancy> findByUserIdAndStatus(UUID userId, String status);
    Optional<Occupancy> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);
    boolean existsByFlatIdAndStatus(UUID flatId, String status);
    List<Occupancy> findAllByFlatId(UUID flatId);
}
