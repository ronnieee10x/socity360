package com.society360.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalTime;

public class CreateFacilityRequest {

    @NotBlank(message = "Facility name is required")
    private String name;

    @NotNull(message = "Capacity is required")
    @Min(value = 1, message = "Capacity must be at least 1 person")
    private Integer capacity;

    @NotNull(message = "Booking charge per hour is required")
    @DecimalMin(value = "0.00", message = "Charge cannot be negative")
    private BigDecimal bookingChargePerHour;

    @NotNull(message = "Opening time is required")
    private LocalTime openingTime;

    @NotNull(message = "Closing time is required")
    private LocalTime closingTime;

    public CreateFacilityRequest() {}

    public CreateFacilityRequest(String name, Integer capacity, BigDecimal bookingChargePerHour, LocalTime openingTime, LocalTime closingTime) {
        this.name = name;
        this.capacity = capacity;
        this.bookingChargePerHour = bookingChargePerHour;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
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
}
