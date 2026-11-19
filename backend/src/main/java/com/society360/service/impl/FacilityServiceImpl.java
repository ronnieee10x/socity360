package com.society360.service.impl;

import com.society360.domain.auth.UserAccount;
import com.society360.domain.facility.Facility;
import com.society360.domain.facility.FacilityBooking;
import com.society360.domain.property.Flat;
import com.society360.dto.request.BookFacilityRequest;
import com.society360.dto.request.CreateFacilityRequest;
import com.society360.dto.response.FacilityBookingResponseDto;
import com.society360.dto.response.FacilityResponseDto;
import com.society360.exception.BadRequestException;
import com.society360.exception.DoubleBookingException;
import com.society360.exception.ResourceNotFoundException;
import com.society360.repository.FacilityBookingRepository;
import com.society360.repository.FacilityRepository;
import com.society360.repository.FlatRepository;
import com.society360.repository.UserAccountRepository;
import com.society360.security.CustomUserPrincipal;
import com.society360.security.TenantContextHolder;
import com.society360.service.FacilityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class FacilityServiceImpl implements FacilityService {

    private static final Logger log = LoggerFactory.getLogger(FacilityServiceImpl.class);

    private final FacilityRepository facilityRepository;
    private final FacilityBookingRepository bookingRepository;
    private final FlatRepository flatRepository;
    private final UserAccountRepository userRepository;

    public FacilityServiceImpl(
            FacilityRepository facilityRepository,
            FacilityBookingRepository bookingRepository,
            FlatRepository flatRepository,
            UserAccountRepository userRepository) {
        this.facilityRepository = facilityRepository;
        this.bookingRepository = bookingRepository;
        this.flatRepository = flatRepository;
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
    public FacilityResponseDto createFacility(CreateFacilityRequest request) {
        UUID societyId = requireTenantId();

        if (request.getOpeningTime().isAfter(request.getClosingTime())) {
            throw new BadRequestException("Opening time must be before closing time");
        }

        Facility facility = new Facility(
                request.getName(),
                request.getCapacity(),
                request.getBookingChargePerHour(),
                request.getOpeningTime(),
                request.getClosingTime()
        );
        facility.setSocietyId(societyId);

        Facility saved = facilityRepository.save(facility);
        log.info("Created facility: {} for society={}", saved.getName(), societyId);

        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityResponseDto> getSocietyFacilities() {
        UUID societyId = requireTenantId();
        return facilityRepository.findBySocietyIdOrderByNameAsc(societyId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public FacilityBookingResponseDto bookFacility(BookFacilityRequest request) {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        Facility facility = facilityRepository.findById(request.getFacilityId())
                .filter(f -> f.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found in your society"));

        if (!"ACTIVE".equalsIgnoreCase(facility.getStatus())) {
            throw new BadRequestException("This facility is currently unavailable for booking");
        }

        Flat flat = flatRepository.findById(request.getFlatId())
                .filter(f -> f.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Flat not found in your society"));

        if (!request.getStartTime().isBefore(request.getEndTime())) {
            throw new BadRequestException("Booking start time must be before end time");
        }

        if (request.getStartTime().isBefore(facility.getOpeningTime()) ||
            request.getEndTime().isAfter(facility.getClosingTime())) {
            throw new BadRequestException("Requested booking slot is outside facility operational hours (" +
                    facility.getOpeningTime() + " - " + facility.getClosingTime() + ")");
        }

        if (request.getBookingDate().isBefore(LocalDate.now())) {
            throw new BadRequestException("Cannot book facility slots for dates in the past");
        }

        // Critical Concurrency Check: Anti-Double-Booking Protection
        boolean hasOverlap = bookingRepository.existsOverlappingBooking(
                societyId,
                facility.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime()
        );

        if (hasOverlap) {
            throw new DoubleBookingException(
                    "Conflict detected: The requested slot (" + request.getStartTime() + " to " +
                    request.getEndTime() + ") for '" + facility.getName() + "' is already reserved by another resident.");
        }

        // Calculate hours and cost
        long minutes = Duration.between(request.getStartTime(), request.getEndTime()).toMinutes();
        double hours = Math.max(1.0, minutes / 60.0);
        BigDecimal totalCost = facility.getBookingChargePerHour().multiply(BigDecimal.valueOf(hours));

        FacilityBooking booking = new FacilityBooking(
                facility.getId(),
                user.getId(),
                flat.getId(),
                request.getBookingDate(),
                request.getStartTime(),
                request.getEndTime(),
                totalCost
        );
        booking.setSocietyId(societyId);

        FacilityBooking saved = bookingRepository.save(booking);
        log.info("Facility {} booked for date={}, time={}-{} by user={}",
                facility.getName(), request.getBookingDate(), request.getStartTime(), request.getEndTime(), user.getId());

        return toBookingDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityBookingResponseDto> getFacilitySchedule(UUID facilityId, LocalDate date) {
        UUID societyId = requireTenantId();
        return bookingRepository.findBySocietyIdAndFacilityIdAndBookingDateAndStatus(
                societyId, facilityId, date, "CONFIRMED")
                .stream()
                .map(this::toBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityBookingResponseDto> getMyBookings() {
        UUID societyId = requireTenantId();
        UserAccount user = getCurrentUser();

        return bookingRepository.findBySocietyIdAndBookedByOrderByBookingDateDesc(societyId, user.getId())
                .stream()
                .map(this::toBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<FacilityBookingResponseDto> getAllSocietyBookings() {
        UUID societyId = requireTenantId();
        return bookingRepository.findBySocietyIdOrderByBookingDateDesc(societyId)
                .stream()
                .map(this::toBookingDto)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelBooking(UUID bookingId) {
        UUID societyId = requireTenantId();
        FacilityBooking booking = bookingRepository.findById(bookingId)
                .filter(b -> b.getSocietyId().equals(societyId))
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        booking.setStatus("CANCELLED");
        bookingRepository.save(booking);
        log.info("Booking {} for facility {} cancelled", bookingId, booking.getFacilityId());
    }

    private FacilityResponseDto toDto(Facility f) {
        FacilityResponseDto dto = new FacilityResponseDto();
        dto.setId(f.getId());
        dto.setSocietyId(f.getSocietyId());
        dto.setName(f.getName());
        dto.setCapacity(f.getCapacity());
        dto.setBookingChargePerHour(f.getBookingChargePerHour());
        dto.setOpeningTime(f.getOpeningTime());
        dto.setClosingTime(f.getClosingTime());
        dto.setStatus(f.getStatus());
        return dto;
    }

    private FacilityBookingResponseDto toBookingDto(FacilityBooking b) {
        Facility facility = facilityRepository.findById(b.getFacilityId()).orElse(null);
        UserAccount user = userRepository.findById(b.getBookedBy()).orElse(null);
        Flat flat = flatRepository.findById(b.getFlatId()).orElse(null);

        FacilityBookingResponseDto dto = new FacilityBookingResponseDto();
        dto.setId(b.getId());
        dto.setFacilityId(b.getFacilityId());
        dto.setFacilityName(facility != null ? facility.getName() : "Unknown Facility");
        dto.setBookedById(b.getBookedBy());
        dto.setBookedByName(user != null ? user.getFullName() : "Resident");
        dto.setFlatId(b.getFlatId());
        dto.setFlatNumber(flat != null ? flat.getFlatNumber() : "N/A");
        dto.setBookingDate(b.getBookingDate());
        dto.setStartTime(b.getStartTime());
        dto.setEndTime(b.getEndTime());
        dto.setStatus(b.getStatus());
        dto.setTotalCost(b.getTotalCost());
        dto.setCreatedAt(b.getCreatedAt());
        return dto;
    }
}
