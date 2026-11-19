package com.society360.domain.facility;

import com.society360.domain.common.TenantBaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "facility_bookings")
public class FacilityBooking extends TenantBaseEntity {

    @Column(name = "facility_id", nullable = false)
    private UUID facilityId;

    @Column(name = "booked_by", nullable = false)
    private UUID bookedBy;

    @Column(name = "flat_id", nullable = false)
    private UUID flatId;

    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "status", nullable = false, length = 25)
    private String status = "CONFIRMED"; // CONFIRMED, CANCELLED

    @Column(name = "total_cost", nullable = false, precision = 8, scale = 2)
    private BigDecimal totalCost = BigDecimal.ZERO;

    public FacilityBooking() {}

    public FacilityBooking(UUID facilityId, UUID bookedBy, UUID flatId, LocalDate bookingDate, LocalTime startTime, LocalTime endTime, BigDecimal totalCost) {
        this.facilityId = facilityId;
        this.bookedBy = bookedBy;
        this.flatId = flatId;
        this.bookingDate = bookingDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.status = "CONFIRMED";
        this.totalCost = totalCost != null ? totalCost : BigDecimal.ZERO;
    }

    public UUID getFacilityId() {
        return facilityId;
    }

    public void setFacilityId(UUID facilityId) {
        this.facilityId = facilityId;
    }

    public UUID getBookedBy() {
        return bookedBy;
    }

    public void setBookedBy(UUID bookedBy) {
        this.bookedBy = bookedBy;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public BigDecimal getTotalCost() {
        return totalCost;
    }

    public void setTotalCost(BigDecimal totalCost) {
        this.totalCost = totalCost;
    }
}
