package com.society360.domain.facility;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalTime;

@Entity
@Table(name = "facilities")
public class Facility extends TenantBaseEntity {

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "booking_charge_per_hour", nullable = false, precision = 8, scale = 2)
    private BigDecimal bookingChargePerHour = BigDecimal.ZERO;

    @Column(name = "opening_time", nullable = false)
    private LocalTime openingTime;

    @Column(name = "closing_time", nullable = false)
    private LocalTime closingTime;

    @Column(name = "status", nullable = false, length = 20)
    private String status = "ACTIVE"; // ACTIVE, MAINTENANCE, INACTIVE

    public Facility() {}

    public Facility(String name, Integer capacity, BigDecimal bookingChargePerHour, LocalTime openingTime, LocalTime closingTime) {
        this.name = name;
        this.capacity = capacity;
        this.bookingChargePerHour = bookingChargePerHour != null ? bookingChargePerHour : BigDecimal.ZERO;
        this.openingTime = openingTime;
        this.closingTime = closingTime;
        this.status = "ACTIVE";
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
