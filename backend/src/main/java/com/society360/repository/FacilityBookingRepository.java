package com.society360.repository;

import com.society360.domain.facility.FacilityBooking;
import com.society360.repository.base.TenantAwareRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface FacilityBookingRepository extends TenantAwareRepository<FacilityBooking, UUID> {

    List<FacilityBooking> findBySocietyIdAndFacilityIdAndBookingDateAndStatus(
            UUID societyId, UUID facilityId, LocalDate bookingDate, String status);

    List<FacilityBooking> findBySocietyIdAndBookedByOrderByBookingDateDesc(UUID societyId, UUID bookedBy);

    List<FacilityBooking> findBySocietyIdOrderByBookingDateDesc(UUID societyId);

    @Query("SELECT COUNT(b) > 0 FROM FacilityBooking b WHERE b.societyId = :societyId " +
           "AND b.facilityId = :facilityId " +
           "AND b.bookingDate = :bookingDate " +
           "AND b.status = 'CONFIRMED' " +
           "AND b.startTime < :endTime AND b.endTime > :startTime")
    boolean existsOverlappingBooking(
            @Param("societyId") UUID societyId,
            @Param("facilityId") UUID facilityId,
            @Param("bookingDate") LocalDate bookingDate,
            @Param("startTime") LocalTime startTime,
            @Param("endTime") LocalTime endTime);
}
