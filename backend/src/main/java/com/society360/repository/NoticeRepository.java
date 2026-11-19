package com.society360.repository;

import com.society360.domain.notice.Notice;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NoticeRepository extends TenantAwareRepository<Notice, UUID> {

    List<Notice> findBySocietyIdOrderByCreatedAtDesc(UUID societyId);

    List<Notice> findBySocietyIdAndPriorityOrderByCreatedAtDesc(UUID societyId, String priority);
}
