# Society360 — Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Approved Architecture Draft  
**Project:** Society360 — Multi-Tenant Residential Society Management Platform  
**Tagline:** *"One Platform. Every Society. Smarter Living."*  
**Target Evaluation:** College Viva & Project Defense, GitHub Portfolio Showcase, Enterprise SaaS Foundation  

---

## 1. Executive Summary & Problem Statement

### 1.1 Context
Residential gated communities and housing societies face critical operational inefficiencies due to fragmented, manual, or paper-based management methods. Gatekeepers log visitors in physical registers; maintenance dues are tracked on spreadsheets with prone-to-error reconciliation; complaints are informally exchanged over WhatsApp groups without resolution tracking; facility bookings result in double-booking conflicts; and society committees struggle to maintain transparent accounting and auditable governance.

### 1.2 Core Thesis (from "A Multi-Tenant Digital Platform for Residential Society Management")
Rather than deploying isolated, custom software for every residential complex, **Society360** implements a **cloud-native, multi-tenant Software-as-a-Service (SaaS) architecture**. A single unified codebase and shared database serve hundreds of independent housing societies while strictly guaranteeing:
1. **Zero Data Leakage:** Cryptographic and query-level isolation between tenant workspaces.
2. **Role-Driven Workflows:** Tailored operational interfaces for 7 distinct stakeholder roles.
3. **End-to-End Governance:** From initial society onboarding and verification by the Platform Super Admin, through building/flat allocation, resident KYC verification, visitor gatekeeping, automated maintenance invoicing, to auditable dispute management.

---

## 2. Target User Personas & The 7 Roles

| Role Code | Role Name | Primary Responsibility & User Persona |
| :--- | :--- | :--- |
| `PLATFORM_SUPER_ADMIN` | Platform Super Administrator | SaaS operator. Approves/rejects society onboarding applications, suspends rogue societies, monitors cross-tenant platform health, and reviews global audit logs. |
| `SOCIETY_ADMIN` | Society Administrator | Society President or Secretary. Configures physical infrastructure (buildings, wings, flats), verifies residents, manages committee roles, issues staff credentials, and configures billing rules. |
| `COMMITTEE_MEMBER` | Management Committee Member | Treasurer or Executive Member. Reviews financial reconciliations, tracks outstanding society dues, approves facility bookings, and monitors complaint resolution SLAs. |
| `FLAT_OWNER` | Flat Owner / Landlord | Property owner. Authorizes tenant onboarding, pays maintenance invoices, participates in official society polls, issues pre-approved guest passes, and logs unit-specific issues. |
| `TENANT` | Resident Tenant | Verified renting resident. Approves or denies visitor gate entries in real-time, logs maintenance complaints, views society notices, and books shared community facilities. |
| `SECURITY_GUARD` | Gate Security Staff | Gatekeeper stationed at the perimeter. Checks in expected/walk-in visitors, validates pre-approved QR/numerical passes, logs delivery/service personnel, and records exit timestamps. |
| `MAINTENANCE_STAFF` | Service / Maintenance Personnel | Plumber, Electrician, Facility Technician. Receives assigned complaint tickets, updates progress status, uploads completion notes/photos, and closes work orders. |

---

## 3. Core Functional Modules & Detailed Workflows

### 3.1 Public Marketing & Landing Experience
- **Hero & Value Proposition:** High-converting SaaS landing page highlighting multi-tenant security, smart gatekeeping, automated accounting, and facility reservations.
- **Interactive Tour & Role Previews:** Visual breakdown of what each of the 7 roles sees and does.
- **One-Click Demo Launchpad:** Dedicated Demo Login Portal providing one-click authentication credentials for all 7 roles across 2 pre-seeded sample societies (e.g., *Greenfield Heights* and *Skyline Residency*).
- **Public Society Registration Portal:** Self-service multi-step application submission for prospective housing societies.

### 3.2 Society Registration & Super Admin Onboarding Lifecycle
```
[Applicant / Society Secretary]
           │
           ▼ Submits Registration Form (Docs, Units, Contact)
   [Status: PENDING]
           │
           ▼ Platform Super Admin Reviews Documents & Details
     ┌─────┴───────────────────────────────┐
     ▼                                     ▼
[Status: APPROVED]                 [Status: REJECTED / INFO_REQUIRED]
     │                                     │
     ├─► Generates Unique Society UUID      └─► Rejection Reason Recorded
     ├─► Provisions Isolated Workspace
     ├─► Auto-Generates Society Admin Account
     └─► Logs Immutable Super Admin Audit Event
```

### 3.3 Building, Wing, Floor & Unit Hierarchy Management
To reflect the true architectural configuration of any modern housing society, the system implements a strict 5-level hierarchy:
$$\text{Society} \longrightarrow \text{Building} \longrightarrow \text{Wing} \longrightarrow \text{Floor} \longrightarrow \text{Flat / Unit}$$
- **Duplicate Prevention:** Flat identifiers must be unique per Wing within the same Building and Society.
- **Metadata Configuration:** Flat unit type (1BHK, 2BHK, 3BHK, Penthouse, Studio), square footage, maintenance calculation factor, occupancy status (`VACANT`, `OWNER_OCCUPIED`, `TENANT_OCCUPIED`).

### 3.4 Resident Onboarding & KYC Verification Workflow
A registered user account cannot gain access to tenant data simply by signing up.
1. Resident submits a **Join Request** selecting Society, Building, Wing, and Flat Number, specifying ownership type (`OWNER` or `TENANT`) and uploading proof of residence / lease deed.
2. Initial State: `PENDING`.
3. Society Admin or Committee Member reviews the KYC documentation in the Admin Verification Queue.
4. Decision: `APPROVED` (role updated, Flat Occupancy record activated) or `REJECTED` (with mandatory explanation) or `CORRECTION_REQUIRED`.
5. Strict isolation: The resident's JWT token is scoped exclusively to their approved `society_id` and unit.

### 3.5 Perimeter Security & Visitor Gatekeeping
- **Pre-Approval Passes:** Residents can create pre-approved visit passes (generating a 6-digit PIN and entry pass) for expected guests, cabs, or deliveries.
- **Walk-In / Gate Visitor Entry:** Guards enter visitor name, mobile number, host flat, and purpose of visit.
- **Concurrency & Anti-Duplication:** System checks and prevents multiple concurrent "Active/Checked-In" statuses for the identical visitor pass.
- **Check-Out Validation:** Guard marks exit; system computes visit duration and archives the log. Exit can only be logged for visitors currently marked as `CHECKED_IN`.

### 3.6 Complaints & Maintenance Work-Order Management
- **Resident Filing:** Title, category (`PLUMBING`, `ELECTRICAL`, `CIVIL`, `SECURITY`, `COMMON_AREA`), description, urgency (`LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`), photo attachment.
- **State Machine:**
  $$\text{SUBMITTED} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{RESOLVED} \longrightarrow \text{CLOSED}$$
- **Resolution Tracking:** Maintenance staff adds technical resolution notes; Admin verifies before marking ticket `CLOSED`.

### 3.7 Financial Billing, Invoicing & Payment Processing
- **Invoice Generation Engine:** Society Admin generates monthly/quarterly maintenance invoices flat-wise based on fixed fee or per-sq-ft formula.
- **Status Lifecycle:** `UNPAID` $\longrightarrow$ `PAID` $\longrightarrow$ `OVERDUE` $\longrightarrow$ `PARTIALLY_PAID`.
- **Payment Gateway Architecture:** Clean abstraction layer (`PaymentService` interface) decoupling business logic from external gateways. Initial implementation provides an interactive **Simulated Payment Gateway** clearly tagged as test/simulation with realistic reference numbers and instant receipt generation, designed for drop-in replacement with live Razorpay/Stripe webhooks.
- **Auditable Receipts:** Every payment creates an immutable `PaymentReceipt` record with receipt numbering (`REC-{SOCIETY_CODE}-{YEAR}-{AUTO_INC}`).

### 3.8 Facility Booking & Anti-Double-Booking Engine
- **Facility Registry:** Clubhouse, Banquet Hall, Tennis Court, Swimming Pool, Guest Parking.
- **Slot Reservation:** Residents pick date and time-slot.
- **Concurrency Control:** Database-level transactional lock ensures two residents cannot simultaneously reserve overlapping time intervals for the same facility.

### 3.9 Notices, Announcements & Community Engagement
- **Notice Types:** `EMERGENCY_ALERT`, `GENERAL_NOTICE`, `MAINTENANCE_DOWNTIME`, `EVENT`, `POLL`.
- **Targeting:** Society-wide or Building-specific.
- **Read Receipts:** Flat-level read tracking so administrators know what percentage of residents viewed critical alerts.

### 3.10 Platform & Society Analytics
- **Super Admin:** Platform churn, society growth rate, active tenants, cross-society transaction volume.
- **Society Admin & Committee:** Maintenance collection efficiency, overdue dues aging, complaint turnaround time (MTTR), facility utilization rates, visitor footfall trends.

---

## 4. Non-Functional Requirements (NFR)

1. **Security & Data Isolation:** No API endpoint shall allow retrieval, alteration, or deletion of tenant data without validating that the authenticated session's `society_id` matches the entity's `society_id`.
2. **Password & Token Security:** BCrypt password hashing (work factor 12). Stateless JWT access tokens with short TTL (15-60 min) paired with cryptographically secure DB-backed refresh tokens.
3. **Auditability:** Every administrative modification (society status changes, resident approvals, manual invoice waivers) records an immutable log entry with IP, actor ID, timestamp, and before/after snapshot.
4. **Resilience & Scalability:** Monorepo with containerized microservices ready for Docker deployment.
5. **Demonstrability:** Zero-friction viva demonstration with full seeded sample data and one-click role switcher.
