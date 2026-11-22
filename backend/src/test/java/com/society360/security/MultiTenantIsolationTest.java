package com.society360.security;

import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.domain.facility.Facility;
import com.society360.domain.facility.FacilityBooking;
import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.domain.property.Wing;
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
    private BuildingRepository buildingRepository;

    @Autowired
    private WingRepository wingRepository;

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
        // 1. Create Society A and test property hierarchy
        societyA = new Society(
                "TEST-SOC-A",
                "Test Alpha Heights",
                "REG-TEST-A-001",
                "100 Alpha Boulevard",
                "Mumbai",
                "Maharashtra",
                "400001"
        );
        societyA = societyRepository.save(societyA);

        Building buildingA = new Building("Tower Alpha", 10, "Residential tower");
        buildingA.setSocietyId(societyA.getId());
        buildingA = buildingRepository.save(buildingA);

        Wing wingA = new Wing(buildingA.getId(), "Wing A1");
        wingA.setSocietyId(societyA.getId());
        wingA = wingRepository.save(wingA);

        flatA = new Flat(buildingA.getId(), wingA.getId(), "A-101", 1, "2BHK", new BigDecimal("1100.00"));
        flatA.setSocietyId(societyA.getId());
        flatA = flatRepository.save(flatA);

        residentA = new UserAccount(
                societyA.getId(),
                "Alpha Resident",
                "residentA@test.com",
                "+91 99000 00001",
                "hashedpassword",
                Role.FLAT_OWNER
        );
        residentA = userRepository.save(residentA);

        // 2. Create Society B and test property hierarchy
        societyB = new Society(
                "TEST-SOC-B",
                "Test Beta Enclave",
                "REG-TEST-B-002",
                "200 Beta Road",
                "Pune",
                "Maharashtra",
                "411001"
        );
        societyB = societyRepository.save(societyB);

        Building buildingB = new Building("Tower Beta", 10, "Residential tower");
        buildingB.setSocietyId(societyB.getId());
        buildingB = buildingRepository.save(buildingB);

        Wing wingB = new Wing(buildingB.getId(), "Wing B1");
        wingB.setSocietyId(societyB.getId());
        wingB = wingRepository.save(wingB);

        Flat flatB = new Flat(buildingB.getId(), wingB.getId(), "B-201", 2, "3BHK", new BigDecimal("1400.00"));
        flatB.setSocietyId(societyB.getId());
        flatRepository.save(flatB);
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
