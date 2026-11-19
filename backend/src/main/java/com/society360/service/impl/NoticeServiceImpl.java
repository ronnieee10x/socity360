package com.society360.service.impl;

import com.society360.domain.auth.UserAccount;
import com.society360.domain.notice.Notice;
import com.society360.dto.request.CreateNoticeRequest;
import com.society360.dto.response.NoticeResponseDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.NoticeRepository;
import com.society360.repository.UserAccountRepository;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.TenantContextHolder;
import com.society360.service.NoticeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class NoticeServiceImpl implements NoticeService {

    private static final Logger log = LoggerFactory.getLogger(NoticeServiceImpl.class);

    private final NoticeRepository noticeRepository;
    private final UserAccountRepository userRepository;

    public NoticeServiceImpl(NoticeRepository noticeRepository, UserAccountRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
    }

    private UUID requireTenantId() {
        UUID tenantId = TenantContextHolder.getTenantId();
        if (tenantId == null) {
            throw new BadRequestException("No active society tenant context found");
        }
        return tenantId;
    }

    private UserAccount getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !(auth.getPrincipal() instanceof CustomUserPrincipal p)) {
            throw new BadRequestException("No authenticated user found");
        }
        return userRepository.findById(p.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    @Override
    public NoticeResponseDto publishNotice(CreateNoticeRequest request) {
        UUID societyId = requireTenantId();
        UserAccount publisher = getCurrentUser();

        Notice notice = new Notice(
                request.getTitle(),
                request.getContent(),
                request.getNoticeType().toUpperCase(),
                request.getPriority() != null ? request.getPriority().toUpperCase() : "NORMAL",
                publisher.getId(),
                request.getExpiresAt()
        );
        notice.setSocietyId(societyId);

        Notice saved = noticeRepository.save(notice);
        log.info("Notice published: '{}' (type={}) in society={}", saved.getTitle(), saved.getNoticeType(), societyId);

        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeResponseDto> getActiveNotices() {
        UUID societyId = requireTenantId();
        return noticeRepository.findBySocietyIdOrderByCreatedAtDesc(societyId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void archiveNotice(UUID noticeId) {
        UUID societyId = requireTenantId();
        Notice notice = noticeRepository.findById(noticeId)
                .filter(n -> n.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found"));

        noticeRepository.delete(notice);
        log.info("Notice {} deleted/archived from society {}", noticeId, societyId);
    }

    private NoticeResponseDto toDto(Notice n) {
        UserAccount publisher = userRepository.findById(n.getPublishedBy()).orElse(null);

        NoticeResponseDto dto = new NoticeResponseDto();
        dto.setId(n.getId());
        dto.setSocietyId(n.getSocietyId());
        dto.setTitle(n.getTitle());
        dto.setContent(n.getContent());
        dto.setNoticeType(n.getNoticeType());
        dto.setPriority(n.getPriority());
        dto.setPublishedById(n.getPublishedBy());
        dto.setPublishedByName(publisher != null ? publisher.getFullName() : "Society Administration");
        dto.setPublishedByRole(publisher != null ? publisher.getRole().name() : "ADMIN");
        dto.setExpiresAt(n.getExpiresAt());
        dto.setCreatedAt(n.getCreatedAt());
        return dto;
    }
}
