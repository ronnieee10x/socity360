package com.society360.service;

import com.society360.dto.request.BookFacilityRequest;
import com.society360.dto.request.CreateFacilityRequest;
import com.society360.dto.response.FacilityBookingResponseDto;
import com.society360.dto.response.FacilityResponseDto;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public interface FacilityService {

    FacilityResponseDto createFacility(CreateFacilityRequest request);

    List<FacilityResponseDto> getSocietyFacilities();

    FacilityBookingResponseDto bookFacility(BookFacilityRequest request);

    List<FacilityBookingResponseDto> getFacilitySchedule(UUID facilityId, LocalDate date);

    List<FacilityBookingResponseDto> getMyBookings();

    List<FacilityBookingResponseDto> getAllSocietyBookings();

    void cancelBooking(UUID bookingId);
}
