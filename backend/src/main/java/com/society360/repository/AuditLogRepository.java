package com.society360.repository;

import com.society360.domain.audit.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, UUID> {
    List<AuditLog> findAllByOrderByCreatedAtDesc();
    List<AuditLog> findAllBySocietyIdOrderByCreatedAtDesc(UUID societyId);
}
