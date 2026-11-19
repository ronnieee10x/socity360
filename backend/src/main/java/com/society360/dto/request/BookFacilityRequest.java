package com.society360.dto.request;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

public class BookFacilityRequest {

    @NotNull(message = "Facility ID is required")
    private UUID facilityId;

    @NotNull(message = "Flat ID is required")
    private UUID flatId;

    @NotNull(message = "Booking date is required")
    private LocalDate bookingDate;

    @NotNull(message = "Start time is required")
    private LocalTime startTime;

    @NotNull(message = "End time is required")
    private LocalTime endTime;

    public BookFacilityRequest() {}

    public BookFacilityRequest(UUID facilityId, UUID flatId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime) {
        this.facilityId = facilityId;
        this.flatId = flatId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public UUID getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(UUID facilityId) {
        this.facilityId = facilityId;
    }

    public UUID getFlatId() {
        return flatId;
    }

    public void setFlatId(UUID flatId) {
        this.flatId = flatId;
    }

    public LocalDate getBookingDate() {
        return bookingDate;
    }

    public void setBookingDate(LocalDate bookingDate) {
        this.bookingDate = bookingDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
}
