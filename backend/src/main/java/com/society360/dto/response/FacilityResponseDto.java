package com.society360.dto.response;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.UUID;

public class FacilityResponseDto {
    private UUID id;
    private UUID societyId;
    private String name;
    private Integer capacity;
    private BigDecimal bookingChargePerHour;
    private LocalTime openingTime;
    private LocalTime closingTime;
    private String status;

    public FacilityResponseDto() {}

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSocietyId() {
        return societyId;
    }

    public void setSocietyId(UUID societyId) {
        this.societyId = societyId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public BigDecimal getBookingChargePerHour() {
        return bookingChargePerHour;
    }

    public void setBookingChargePerHour(BigDecimal bookingChargePerHour) {
        this.bookingChargePerHour = bookingChargePerHour;
    }

    public LocalTime getOpeningTime() {
        return openingTime;
    }

    public void setOpeningTime(LocalTime openingTime) {
        this.openingTime = openingTime;
    }

    public LocalTime getClosingTime() {
        return closingTime;
    }

    public void setClosingTime(LocalTime closingTime) {
        this.closingTime = closingTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
