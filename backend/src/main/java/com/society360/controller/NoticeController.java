package com.society360.controller;

import com.society360.dto.request.CreateNoticeRequest;
import com.society360.dto.response.ApiResponse;
import com.society360.dto.response.NoticeResponseDto;
import com.society360.service.NoticeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/notices")
@Tag(name = "Notice & Circular Board", description = "Endpoints for broadcasting general notices, emergency alerts, and meeting agendas")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Get all active circulars and announcements for current society")
    public ResponseEntity<ApiResponse<List<NoticeResponseDto>>> getActiveNotices() {
        List<NoticeResponseDto> notices = noticeService.getActiveNotices();
        return ResponseEntity.ok(ApiResponse.success(notices));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Publish a new official society notice or emergency broadcast")
    public ResponseEntity<ApiResponse<NoticeResponseDto>> publishNotice(
            @Valid @RequestBody CreateNoticeRequest request) {
        NoticeResponseDto notice = noticeService.publishNotice(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Notice published successfully", notice));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")
    @Operation(summary = "Archive / delete a notice from the bulletin board")
    public ResponseEntity<ApiResponse<Void>> archiveNotice(@PathVariable UUID id) {
        noticeService.archiveNotice(id);
        return ResponseEntity.ok(ApiResponse.success("Notice removed successfully", null));
    }
}
