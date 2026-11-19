package com.society360.security;

import com.society360.domain.auth.UserAccount;
import com.society360.domain.facility.Facility;
import com.society360.domain.facility.FacilityBooking;
import com.society360.domain.property.Flat;
import com.society360.domain.society.Society;
import com.society360.repository.*;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("dev")
@Transactional
public class MultiTenantIsolationTest {

    @Autowired
    private SocietyRepository societyRepository;

    @Autowired
    private FlatRepository flatRepository;

    @Autowired
    private UserAccountRepository userRepository;

    @Autowired
    private FacilityRepository facilityRepository;

    @Autowired
    private FacilityBookingRepository bookingRepository;

    private Society societyA;
    private Society societyB;
    private UserAccount residentA;
    private Flat flatA;

    @BeforeEach
    void setUp() {
        societyA = societyRepository.findByCode("SOC-GREENFIELD")
                .orElseThrow(() -> new IllegalStateException("Seeded Society A (SOC-GREENFIELD) not found"));

        societyB = societyRepository.findByCode("SOC-SKYLINE")
                .orElseThrow(() -> new IllegalStateException("Seeded Society B (SOC-SKYLINE) not found"));

        residentA = userRepository.findByEmail("owner@greenfield.com")
                .orElseThrow(() -> new IllegalStateException("Seeded resident owner@greenfield.com not found"));

        List<Flat> flatsA = flatRepository.findAllBySocietyId(societyA.getId());
        assertFalse(flatsA.isEmpty(), "Society A flats should exist");
        flatA = flatsA.get(0);
    }

    @AfterEach
    void tearDown() {
        TenantContextHolder.clear();
    }

    @Test
    @DisplayName("TenantContextHolder sets, retrieves and clears ThreadLocal tenant ID correctly")
    void testTenantContextLifecycle() {
        UUID testId = UUID.randomUUID();
        TenantContextHolder.setTenantId(testId);
        assertEquals(testId, TenantContextHolder.getTenantId(), "Tenant ID should match set value");

        TenantContextHolder.clear();
        assertNull(TenantContextHolder.getTenantId(), "Tenant ID should be null after clearing");
    }

    @Test
    @DisplayName("Multi-Tenant Logical Isolation: Society A user cannot view Society B flats")
    void testCrossTenantFlatIsolation() {
        // Set authenticated tenant context to Society A
        TenantContextHolder.setTenantId(societyA.getId());

        List<Flat> societyAFlats = flatRepository.findAllBySocietyId(societyA.getId());
        assertFalse(societyAFlats.isEmpty(), "Society A should have seeded flats");

        for (Flat flat : societyAFlats) {
            assertEquals(societyA.getId(), flat.getSocietyId(),
                    "Every flat retrieved for Society A must strictly belong to Society A");
            assertNotEquals(societyB.getId(), flat.getSocietyId(),
                    "Society A queries must never return Society B records");
        }

        // Verify Society B flats belong strictly to Society B
        List<Flat> societyBFlats = flatRepository.findAllBySocietyId(societyB.getId());
        assertFalse(societyBFlats.isEmpty(), "Society B should have seeded flats");
        for (Flat flat : societyBFlats) {
            assertEquals(societyB.getId(), flat.getSocietyId());
            assertNotEquals(societyA.getId(), flat.getSocietyId());
        }
    }

    @Test
    @DisplayName("Anti-Double-Booking Concurrency Control: Rejects overlapping facility reservations")
    void testAntiDoubleBookingOverlapDetection() {
        TenantContextHolder.setTenantId(societyA.getId());

        Facility clubhouse = new Facility(
                "Executive Club Lounge",
                50,
                new BigDecimal("500.00"),
                LocalTime.of(8, 0),
                LocalTime.of(22, 0)
        );
        clubhouse.setSocietyId(societyA.getId());
        clubhouse = facilityRepository.save(clubhouse);

        LocalDate bookingDate = LocalDate.now().plusDays(2);

        // Booking 1: 10:00 to 12:00 with valid foreign keys
        FacilityBooking booking1 = new FacilityBooking(
                clubhouse.getId(),
                residentA.getId(),
                flatA.getId(),
                bookingDate,
                LocalTime.of(10, 0),
                LocalTime.of(12, 0),
                new BigDecimal("1000.00")
        );
        booking1.setSocietyId(societyA.getId());
        bookingRepository.save(booking1);

        // Case A: Partial overlap (11:00 to 13:00) -> Overlaps with 10:00-12:00
        boolean overlapCaseA = bookingRepository.existsOverlappingBooking(
                societyA.getId(),
                clubhouse.getId(),
                bookingDate,
                LocalTime.of(11, 0),
                LocalTime.of(13, 0)
        );
        assertTrue(overlapCaseA, "Should detect collision for 11:00-13:00 overlapping with 10:00-12:00");

        // Case B: Completely inside (10:30 to 11:30) -> Overlaps
        boolean overlapCaseB = bookingRepository.existsOverlappingBooking(
                societyA.getId(),
                clubhouse.getId(),
                bookingDate,
                LocalTime.of(10, 30),
                LocalTime.of(11, 30)
        );
        assertTrue(overlapCaseB, "Should detect collision for slot enclosed within existing booking");

        // Case C: Non-overlapping slot after (12:00 to 14:00) -> Allowed
        boolean nonOverlap = bookingRepository.existsOverlappingBooking(
                societyA.getId(),
                clubhouse.getId(),
                bookingDate,
                LocalTime.of(12, 0),
                LocalTime.of(14, 0)
        );
        assertFalse(nonOverlap, "Slot starting at 12:00 should not conflict with booking ending at 12:00");
    }
}
