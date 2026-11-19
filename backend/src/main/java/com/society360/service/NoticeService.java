package com.society360.service;

import com.society360.dto.request.CreateNoticeRequest;
import com.society360.dto.response.NoticeResponseDto;

import java.util.List;
import java.util.UUID;

public interface NoticeService {

    NoticeResponseDto publishNotice(CreateNoticeRequest request);

    List<NoticeResponseDto> getActiveNotices();

    void archiveNotice(UUID noticeId);
}
