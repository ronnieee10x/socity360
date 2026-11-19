package com.society360.config;

import com.society360.domain.auth.Role;
import com.society360.domain.auth.UserAccount;
import com.society360.domain.complaint.Complaint;
import com.society360.domain.facility.Facility;
import com.society360.domain.finance.Invoice;
import com.society360.domain.finance.Payment;
import com.society360.domain.notice.Notice;
import com.society360.domain.property.Building;
import com.society360.domain.property.Flat;
import com.society360.domain.property.Wing;
import com.society360.domain.society.Society;
import com.society360.domain.society.SocietyApplication;
import com.society360.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;

@Component
public class DemoSeedDataLoader implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DemoSeedDataLoader.class);

    private final SocietyRepository societyRepository;
    private final SocietyApplicationRepository applicationRepository;
    private final UserAccountRepository userRepository;
    private final BuildingRepository buildingRepository;
    private final WingRepository wingRepository;
    private final FlatRepository flatRepository;
    private final ComplaintRepository complaintRepository;
    private final InvoiceRepository invoiceRepository;
    private final PaymentRepository paymentRepository;
    private final FacilityRepository facilityRepository;
    private final NoticeRepository noticeRepository;
    private final PasswordEncoder passwordEncoder;

    public DemoSeedDataLoader(
            SocietyRepository societyRepository,
            SocietyApplicationRepository applicationRepository,
            UserAccountRepository userRepository,
            BuildingRepository buildingRepository,
            WingRepository wingRepository,
            FlatRepository flatRepository,
            ComplaintRepository complaintRepository,
            InvoiceRepository invoiceRepository,
            PaymentRepository paymentRepository,
            FacilityRepository facilityRepository,
            NoticeRepository noticeRepository,
            PasswordEncoder passwordEncoder) {
        this.societyRepository = societyRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.buildingRepository = buildingRepository;
        this.wingRepository = wingRepository;
        this.flatRepository = flatRepository;
        this.complaintRepository = complaintRepository;
        this.invoiceRepository = invoiceRepository;
        this.paymentRepository = paymentRepository;
        this.facilityRepository = facilityRepository;
        this.noticeRepository = noticeRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Demo database already contains seed data. Skipping initial seeding.");
            return;
        }

        logger.info("Seeding initial multi-tenant societies, properties, and 7-role demo accounts...");

        // 1. Seed Sample Society A: Greenfield Heights
        Society societyA = new Society(
                "SOC-GREENFIELD",
                "Greenfield Heights Co-operative Housing Society",
                "REG-MH-PUN-2024-0012",
                "Survey No. 42, Baner Road",
                "Pune",
                "Maharashtra",
                "411045"
        );
        societyA = societyRepository.save(societyA);

        // 2. Seed Sample Society B: Skyline Residency (Demonstrating multi-tenant isolation)
        Society societyB = new Society(
                "SOC-SKYLINE",
                "Skyline Residency Owners Association",
                "REG-KA-BLR-2024-0098",
                "Outer Ring Road, Bellandur",
                "Bengaluru",
                "Karnataka",
                "560103"
        );
        societyB = societyRepository.save(societyB);

        // Seed a sample Pending Application for Super Admin demo showcase
        SocietyApplication pendingApp = new SocietyApplication();
        pendingApp.setSocietyName("Silver Oak Enclave");
        pendingApp.setRegistrationNumber("REG-DL-2026-904");
        pendingApp.setAddressLine("Plot 14, Sector 21, Dwarka");
        pendingApp.setCity("New Delhi");
        pendingApp.setState("Delhi");
        pendingApp.setPinCode("110075");
        pendingApp.setBuildingCount(3);
        pendingApp.setFlatCount(75);
        pendingApp.setApplicantName("Manish Malhotra");
        pendingApp.setApplicantEmail("manish@silveroak.org");
        pendingApp.setApplicantPhone("+91 98111 22334");
        pendingApp.setDocumentUrl("https://docs.society360.io/silver-oak-deed.pdf");
        pendingApp.setStatus("PENDING");
        applicationRepository.save(pendingApp);

        String defaultHashedPassword = passwordEncoder.encode("Password@123");

        // 3. Seed 7 Roles
        // Role 1: Platform Super Admin
        UserAccount superAdmin = new UserAccount(
                null,
                "Alexander Vance",
                "superadmin@society360.io",
                "+91 98000 00001",
                defaultHashedPassword,
                Role.PLATFORM_SUPER_ADMIN
        );
        userRepository.save(superAdmin);

        // Role 2: Society Admin (Greenfield Heights)
        UserAccount societyAdminA = new UserAccount(
                societyA.getId(),
                "Rajesh Sharma",
                "admin@greenfield.com",
                "+91 98000 00002",
                defaultHashedPassword,
                Role.SOCIETY_ADMIN
        );
        userRepository.save(societyAdminA);

        // Role 3: Committee Member (Treasurer)
        UserAccount committeeMemberA = new UserAccount(
                societyA.getId(),
                "Priya Kulkarni",
                "treasurer@greenfield.com",
                "+91 98000 00003",
                defaultHashedPassword,
                Role.COMMITTEE_MEMBER
        );
        userRepository.save(committeeMemberA);

        // Role 4: Flat Owner
        UserAccount flatOwnerA = new UserAccount(
                societyA.getId(),
                "Vikram Malhotra",
                "owner@greenfield.com",
                "+91 98000 00004",
                defaultHashedPassword,
                Role.FLAT_OWNER
        );
        userRepository.save(flatOwnerA);

        // Role 5: Tenant
        UserAccount tenantA = new UserAccount(
                societyA.getId(),
                "Neha Sen",
                "tenant@greenfield.com",
                "+91 98000 00005",
                defaultHashedPassword,
                Role.TENANT
        );
        userRepository.save(tenantA);

        // Role 6: Security Guard
        UserAccount guardA = new UserAccount(
                societyA.getId(),
                "Ramesh Singh",
                "guard@greenfield.com",
                "+91 98000 00006",
                defaultHashedPassword,
                Role.SECURITY_GUARD
        );
        userRepository.save(guardA);

        // Role 7: Maintenance Staff
        UserAccount staffA = new UserAccount(
                societyA.getId(),
                "Sunil Jadhav",
                "staff@greenfield.com",
                "+91 98000 00007",
                defaultHashedPassword,
                Role.MAINTENANCE_STAFF
        );
        userRepository.save(staffA);

        // Society B Admin (For cross-tenant testing)
        UserAccount societyAdminB = new UserAccount(
                societyB.getId(),
                "Karthik Narayanan",
                "admin@skyline.com",
                "+91 98000 00099",
                defaultHashedPassword,
                Role.SOCIETY_ADMIN
        );
        userRepository.save(societyAdminB);

        // 4. Seed Property Hierarchy for Society A (Greenfield Heights)
        // Tower A
        Building towerA = new Building("Tower A", 10, "Residential High-Rise Block A");
        towerA.setSocietyId(societyA.getId());
        towerA = buildingRepository.save(towerA);

        Wing wingA1 = new Wing(towerA.getId(), "East Wing");
        wingA1.setSocietyId(societyA.getId());
        wingA1 = wingRepository.save(wingA1);

        Wing wingA2 = new Wing(towerA.getId(), "West Wing");
        wingA2.setSocietyId(societyA.getId());
        wingA2 = wingRepository.save(wingA2);

        // Tower B
        Building towerB = new Building("Tower B", 8, "Residential Block B");
        towerB.setSocietyId(societyA.getId());
        towerB = buildingRepository.save(towerB);

        Wing wingB1 = new Wing(towerB.getId(), "North Wing");
        wingB1.setSocietyId(societyA.getId());
        wingB1 = wingRepository.save(wingB1);

        // Seed 14 Flats in Greenfield Heights
        Flat flatA101 = seedFlat(societyA.getId(), towerA.getId(), wingA1.getId(), "A-101", 1, "2BHK", new BigDecimal("1150.00"), "OWNER_OCCUPIED");
        seedFlat(societyA.getId(), towerA.getId(), wingA1.getId(), "A-102", 1, "3BHK", new BigDecimal("1480.00"), "VACANT");
        Flat flatA201 = seedFlat(societyA.getId(), towerA.getId(), wingA1.getId(), "A-201", 2, "2BHK", new BigDecimal("1150.00"), "TENANT_OCCUPIED");
        seedFlat(societyA.getId(), towerA.getId(), wingA1.getId(), "A-202", 2, "3BHK", new BigDecimal("1480.00"), "VACANT");
        Flat flatA301 = seedFlat(societyA.getId(), towerA.getId(), wingA1.getId(), "A-301", 3, "2BHK", new BigDecimal("1150.00"), "OWNER_OCCUPIED");
        seedFlat(societyA.getId(), towerA.getId(), wingA1.getId(), "A-502", 5, "3BHK", new BigDecimal("1550.00"), "OWNER_OCCUPIED");

        seedFlat(societyA.getId(), towerA.getId(), wingA2.getId(), "A-W101", 1, "2BHK", new BigDecimal("1180.00"), "VACANT");
        seedFlat(societyA.getId(), towerA.getId(), wingA2.getId(), "A-W201", 2, "3BHK", new BigDecimal("1520.00"), "OWNER_OCCUPIED");

        seedFlat(societyA.getId(), towerB.getId(), wingB1.getId(), "B-101", 1, "1BHK", new BigDecimal("750.00"), "VACANT");
        seedFlat(societyA.getId(), towerB.getId(), wingB1.getId(), "B-102", 1, "2BHK", new BigDecimal("1100.00"), "VACANT");
        seedFlat(societyA.getId(), towerB.getId(), wingB1.getId(), "B-201", 2, "2BHK", new BigDecimal("1100.00"), "TENANT_OCCUPIED");
        seedFlat(societyA.getId(), towerB.getId(), wingB1.getId(), "B-301", 3, "3BHK", new BigDecimal("1450.00"), "OWNER_OCCUPIED");

        // Seed Sample Demo Complaints
        Complaint c1 = new Complaint(
                flatA101.getId(),
                flatOwnerA.getId(),
                "TKT-PLM8921",
                "Master bathroom pipeline leakage",
                "PLUMBING",
                "HIGH",
                "Continuous water leakage from main inlet valve in master bathroom, needs gasket replacement."
        );
        c1.setSocietyId(societyA.getId());
        c1.setStatus("ASSIGNED");
        c1.setAssignedTo(staffA.getId());
        complaintRepository.save(c1);

        Complaint c2 = new Complaint(
                flatA201.getId(),
                tenantA.getId(),
                "TKT-ELE4490",
                "Main MCB tripping repeatedly",
                "ELECTRICAL",
                "MEDIUM",
                "The circuit breaker in the distribution box trips whenever the AC is switched on."
        );
        c2.setSocietyId(societyA.getId());
        c2.setStatus("IN_PROGRESS");
        c2.setAssignedTo(staffA.getId());
        complaintRepository.save(c2);

        Complaint c3 = new Complaint(
                flatA301.getId(),
                flatOwnerA.getId(),
                "TKT-LFT1003",
                "Passenger Lift 2 jerking during descent",
                "LIFT",
                "URGENT",
                "Lift #2 in Tower A makes a loud thumping noise and jerks between 5th and 3rd floors."
        );
        c3.setSocietyId(societyA.getId());
        c3.setStatus("SUBMITTED");
        complaintRepository.save(c3);

        // 5. Seed Invoices and Payments for Greenfield Heights
        Invoice invOct101 = new Invoice(
                flatA101.getId(),
                "INV-GREENFIELD-OCT2026-A101",
                "OCT-2026",
                new BigDecimal("3500.00"),
                LocalDate.now().minusDays(15),
                "Monthly Society Maintenance Assessment (October 2026)"
        );
        invOct101.setSocietyId(societyA.getId());
        invOct101.setStatus("PAID");
        invOct101 = invoiceRepository.save(invOct101);

        Payment payOct101 = new Payment(
                invOct101.getId(),
                flatOwnerA.getId(),
                "REC-2026-OCT881",
                new BigDecimal("3500.00"),
                "UPI",
                "TXN-S360-A14E08B2"
        );
        payOct101.setSocietyId(societyA.getId());
        paymentRepository.save(payOct101);

        Invoice invNov101 = new Invoice(
                flatA101.getId(),
                "INV-GREENFIELD-NOV2026-A101",
                "NOV-2026",
                new BigDecimal("3500.00"),
                LocalDate.now().plusDays(10),
                "Monthly Society Maintenance Assessment (November 2026)"
        );
        invNov101.setSocietyId(societyA.getId());
        invoiceRepository.save(invNov101);

        Invoice invNov201 = new Invoice(
                flatA201.getId(),
                "INV-GREENFIELD-NOV2026-A201",
                "NOV-2026",
                new BigDecimal("3500.00"),
                LocalDate.now().plusDays(10),
                "Monthly Society Maintenance Assessment (November 2026)"
        );
        invNov201.setSocietyId(societyA.getId());
        invoiceRepository.save(invNov201);

        Invoice invNov301 = new Invoice(
                flatA301.getId(),
                "INV-GREENFIELD-NOV2026-A301",
                "NOV-2026",
                new BigDecimal("4200.00"),
                LocalDate.now().plusDays(10),
                "Monthly Society Maintenance Assessment (November 2026)"
        );
        invNov301.setSocietyId(societyA.getId());
        invoiceRepository.save(invNov301);

        // 6. Seed Facilities for Greenfield Heights
        Facility clubHouse = new Facility("Grand Clubhouse", 100, new BigDecimal("500.00"), LocalTime.of(6, 0), LocalTime.of(22, 0));
        clubHouse.setSocietyId(societyA.getId());
        facilityRepository.save(clubHouse);

        Facility swimmingPool = new Facility("Olympic Lap Pool", 30, BigDecimal.ZERO, LocalTime.of(6, 0), LocalTime.of(20, 0));
        swimmingPool.setSocietyId(societyA.getId());
        facilityRepository.save(swimmingPool);

        Facility tennisCourt = new Facility("Tennis & Badminton Court", 4, new BigDecimal("150.00"), LocalTime.of(6, 0), LocalTime.of(21, 0));
        tennisCourt.setSocietyId(societyA.getId());
        facilityRepository.save(tennisCourt);

        Facility banquetHall = new Facility("Celebration Banquet Hall", 250, new BigDecimal("2000.00"), LocalTime.of(9, 0), LocalTime.of(23, 0));
        banquetHall.setSocietyId(societyA.getId());
        facilityRepository.save(banquetHall);

        // 7. Seed Notices for Greenfield Heights
        Notice notice1 = new Notice(
                "Annual General Body Meeting (AGM) - FY2026-27",
                "Notice is hereby given that the 12th Annual General Body Meeting of Greenfield Heights Cooperative Housing Society will be held on Sunday at 10:30 AM in the Grand Clubhouse. All flat owners are cordially requested to attend.",
                "EVENT",
                "NORMAL",
                societyAdminA.getId(),
                Instant.now().plusSeconds(86400 * 14)
        );
        notice1.setSocietyId(societyA.getId());
        noticeRepository.save(notice1);

        Notice notice2 = new Notice(
                "Urgent: Overhead Water Tank Cleaning & Pipeline Sanitization",
                "Please note that the main overhead water tanks for Tower A and Tower B will undergo scheduled chlorination and cleaning this Saturday from 09:00 AM to 02:00 PM. Water supply will remain paused during this window.",
                "MAINTENANCE",
                "URGENT",
                societyAdminA.getId(),
                Instant.now().plusSeconds(86400 * 5)
        );
        notice2.setSocietyId(societyA.getId());
        noticeRepository.save(notice2);

        Notice notice3 = new Notice(
                "Diwali Gala & Cultural Night — Registrations Open",
                "Cultural Committee invites enthusiastic participation from all residents for dance performances, musical events, and rangoli competitions scheduled for the Diwali Gala on Diwali Eve.",
                "EVENT",
                "NORMAL",
                committeeMemberA.getId(),
                Instant.now().plusSeconds(86400 * 20)
        );
        notice3.setSocietyId(societyA.getId());
        noticeRepository.save(notice3);

        // 8. Seed Property Hierarchy for Society B (Skyline Residency)
        Building pineBlock = new Building("Pine Block", 5, "Executive Suites");
        pineBlock.setSocietyId(societyB.getId());
        pineBlock = buildingRepository.save(pineBlock);

        Wing pineWing = new Wing(pineBlock.getId(), "Wing 1");
        pineWing.setSocietyId(societyB.getId());
        pineWing = wingRepository.save(pineWing);

        seedFlat(societyB.getId(), pineBlock.getId(), pineWing.getId(), "P-101", 1, "2BHK", new BigDecimal("1200.00"), "OWNER_OCCUPIED");
        seedFlat(societyB.getId(), pineBlock.getId(), pineWing.getId(), "P-102", 1, "2BHK", new BigDecimal("1200.00"), "VACANT");
        seedFlat(societyB.getId(), pineBlock.getId(), pineWing.getId(), "P-201", 2, "3BHK", new BigDecimal("1600.00"), "VACANT");
        seedFlat(societyB.getId(), pineBlock.getId(), pineWing.getId(), "P-301", 3, "PENTHOUSE", new BigDecimal("2400.00"), "OWNER_OCCUPIED");

        logger.info("Demo seed data initialization complete! Seeded 2 societies, 3 buildings, 4 wings, 16 flats, complaints, and all 7 role accounts.");
    }

    private Flat seedFlat(java.util.UUID societyId, java.util.UUID buildingId, java.util.UUID wingId, String flatNo, int floor, String type, BigDecimal area, String status) {
        Flat flat = new Flat(buildingId, wingId, flatNo, floor, type, area);
        flat.setSocietyId(societyId);
        flat.setOccupancyStatus(status);
        return flatRepository.save(flat);
    }
}
