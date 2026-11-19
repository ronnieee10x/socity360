package com.society360.repository.base;

import com.society360.domain.common.TenantBaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@NoRepositoryBean
public interface TenantAwareRepository<T extends TenantBaseEntity, ID> extends JpaRepository<T, ID> {

    List<T> findAllBySocietyId(UUID societyId);

    Optional<T> findByIdAndSocietyId(ID id, UUID societyId);

    boolean existsByIdAndSocietyId(ID id, UUID societyId);

    void deleteByIdAndSocietyId(ID id, UUID societyId);
}
