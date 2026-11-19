# Society360 — Viva, Technical Evaluation & Demonstration Defense Guide

> **Target Audience:** College Examination Committees, External Evaluators, Technical Interviewers, Project Reviewers, and Placement Evaluators.  
> **Project:** Society360 — Multi-Tenant Residential Society Management Platform  
> **Research Basis:** *"A Multi-Tenant Digital Platform for Residential Society Management"*

---

## 1. Executive Summary & Architecture Cheat Sheet

### 1.1 The Problem
Traditional residential societies suffer from operational silos:
- Gate registers are maintained on physical paper with zero auditability.
- Maintenance dues are tracked in disconnected Excel sheets, leading to reconciliation disputes.
- Resident complaints are scattered across unstructured WhatsApp groups with no SLAs or ownership.
- Multi-society property management companies are forced to deploy duplicate single-tenant software instances at high operational cost.

### 1.2 The Solution
**Society360** implements a **centralized, cloud-native, multi-tenant SaaS architecture**:
- **Single Database, Logical Partitioning:** Low infrastructure overhead with strict tenant isolation enforced at the application data tier.
- **7-Tier Role Hierarchy:** Tailored operational dashboards and permission boundaries for everyone from the Platform Super Admin to On-Duty Security Guards and Electricians.
- **Defensive Engineering Invariants:**
  1. *Zero Client Trust:* Society ID is derived exclusively from authenticated server-side JWT claims.
  2. *Anti-Double Booking:* Mathematical time-interval overlap prevention on facility reservations ($HTTP\ 409\ Conflict$).
  3. *Perimeter Integrity:* Active visitor duplication checks preventing multiple simultaneous check-ins for the same person.
  4. *Clean Architecture:* Strict layered decoupling (`Controller` → `Service` → `Repository` → `Database`).

---

## 2. 10-Minute Live Viva Demo Script

Follow this precise sequence during a live viva or practical demonstration to showcase all 7 roles and the complete multi-tenant lifecycle:

### Step 1: Public SaaS Landing Page (`/`) — (1 Minute)
- **Action:** Open `http://localhost:3000/`.
- **Examiner Talking Point:**
  > *"Society360 is not a simple admin portal; it is designed as a commercial SaaS product. The public landing page articulates our value proposition, security guarantees, architectural features, and multi-step onboarding workflow for prospective housing societies."*
- **Click:** *"Explore Demo"* or *"Login"*.

---

### Step 2: Platform Super Admin Dashboard — (2 Minutes)
- **Action:** On the `/login` screen, click the **"Super Admin"** 1-click demo button (or enter `superadmin@society360.com` / `Password@123`).
- **Dashboard:** Notice platform-wide KPIs: Total Societies (2), Approved Societies (2), Pending Applications (1), Total Users (7), and the Live Security Audit Stream.
- **Examiner Talking Point:**
  > *"The Platform Super Admin operates above the tenant layer. They cannot see private resident complaints or financial ledgers of any individual society, but they manage society onboarding approvals, global system health, and compliance audit logs."*
- **Navigate to:** *"Applications"* tab. Review the pending onboarding application for *Royal Palms Cooperative Housing*. Show the approval/rejection dialog with required justification notes.

---

### Step 3: Multi-Tenancy Proof — Society Admin A vs Society Admin B — (1.5 Minutes)
- **Action:** Log out and log in as **"Society Admin"** (`admin@greenfield.com` / `Password@123`).
- **Observe:** Workspace automatically locks to **Greenfield Heights** (`SOC-GREENFIELD`).
  - Total Flats: 16
  - Buildings: Tower A (Aster), Tower B (Begonia)
  - Occupancy: 75%
  - Collection: ₹42,500
- **Navigate to:** *"Property Structure"*. Expand Tower A → Wing A1 → Floor 1 → Flat 101.
- **Examiner Talking Point:**
  > *"Notice how the property hierarchy is strictly scoped. Even if a user alters request parameters in browser dev tools, our Spring Security `TenantContextFilter` extracts the cryptographic `society_id` from the JWT claims and injects it into a ThreadLocal `TenantContextHolder`. All repository queries are automatically tenant-constrained."*

---

### Step 4: Resident Workflow & Amenities Booking — (2 Minutes)
- **Action:** Log out and log in as **"Flat Owner"** (`owner@greenfield.com` / `Password@123`).
- **Observe Resident Dashboard:** Shows Flat A-101 ownership, active visitors, unpaid maintenance invoices, and official society announcements.
- **Navigate to:** *"Amenities & Facilities"*.
  - View amenities: *Grand Banquet Hall*, *Olympic Swimming Pool*, *Executive Tennis Court*, *Community Clubhouse*.
  - Attempt to book the *Grand Banquet Hall* for tomorrow 10:00 AM – 12:00 PM.
  - Show the booking succeeds and appears under "My Bookings".
  - Attempt to submit a second booking for 11:00 AM – 01:00 PM (overlapping slot).
  - Show that the backend immediately halts the transaction and returns a clean conflict toast: *"Selected slot overlaps with an existing confirmed reservation."*
- **Examiner Talking Point:**
  > *"We implemented strict anti-double-booking concurrency control using database-level time interval collision detection. Overlaps are mathematically detected: $Start_A < End_B \land End_A > Start_B$, throwing a custom `DoubleBookingException` mapped to HTTP 409 Conflict."*

---

### Step 5: Finance & Dues Settlement — (1 Minute)
- **Action:** In the Resident portal, navigate to *"Invoices & Dues"*.
- **Observe:** Monthly Society Maintenance Bill for Flat A-101 (₹4,500, Status: PENDING).
- **Click:** *"Pay Now"*. Select Credit Card / UPI simulation.
- **Examiner Talking Point:**
  > *"Notice the payment flow: our backend utilizes an Anti-Corruption Layer with a `PaymentGateway` interface. The `SimulatedPaymentGateway` returns a simulated bank transaction reference (`TXN-...`), updates the invoice to `PAID`, records a relational `Payment` record, and outputs a downloadable cryptographic receipt."*

---

### Step 6: Perimeter Security & Guard Gate Pass — (1.5 Minutes)
- **Action:** As Resident, go to *"Visitors"* and click *"Pre-Approve Visitor"* (e.g., Guest "Rahul Sharma", Phone "9876543210", Purpose "Dinner Guest").
- **Log out** and log in as **"Security Guard"** (`guard@greenfield.com` / `Password@123`).
- **Observe Guard Dashboard:**
  - Real-time tally: Today's Visitors, Currently On-Premises, Expected Pre-Approvals.
  - The pre-approved guest "Rahul Sharma" appears in the Expected list.
  - Click *"Record Check-In"*. The visitor transitions to "Currently Inside".
  - Explain the Anti-Duplication logic: If the guard attempts to enter the same guest while their status is already inside, the system flags the duplicate entry and blocks it.
  - Click *"Record Exit"*. The exit timestamp is captured, computing total visit duration.

---

### Step 7: SLA-Driven Maintenance Staff Queue — (1 Minute)
- **Action:** Log out and log in as **"Maintenance Staff"** (`electrician@greenfield.com` / `Password@123`).
- **Observe Staff Workspace:**
  - Shows assigned work orders (e.g., "Corridor Light Flickering in Wing B").
  - Click *"Start Work"* (moves status from `ASSIGNED` to `IN_PROGRESS`).
  - Add resolution note *"Replaced LED driver and ballast"* and click *"Mark Resolved"*.
  - Show how status transitions are governed by an internal state machine preventing invalid jumps.

---

## 3. Top 20 Technical Viva Questions & Model Answers

### Q1: Why did you choose a Shared Database with a Tenant Discriminator Column (`society_id`) instead of Database-per-tenant or Schema-per-tenant?
**Model Answer:**  
> *"In multi-tenant SaaS architecture, there are three primary models: Database-per-tenant, Schema-per-tenant, and Shared-database-shared-schema. We selected the shared-database model with a `society_id` discriminator because:
> 1. **Resource Efficiency & Cost:** In residential management where a platform may host hundreds of societies, maintaining hundreds of independent connection pools, schema migrations, and database instances creates massive memory and operational overhead.
> 2. **Operational Simplicity:** A single migration script (Flyway/Liquibase) updates all societies synchronously.
> 3. **Cross-Tenant Aggregation:** Allows Platform Super Admins to calculate global platform analytics efficiently without distributed queries.
> To address the primary risk of this approach—data leakage—we enforced strict logical isolation via Spring Security filter chains and `TenantContextHolder`, ensuring no query can execute without being scoped to the authenticated tenant's ID."*

---

### Q2: How do you prevent a malicious resident in Society A from accessing Society B's data by tampering with request headers or payloads?
**Model Answer:**  
> *"We apply the **Zero Trust Principle**:
> 1. We **never trust client-supplied tenant identifiers** in URLs, request bodies, or headers.
> 2. When a user authenticates via `/api/auth/login`, the backend verifies their credentials against the database and signs a stateless JWT containing the immutable claim `society_id`.
> 3. On every incoming request, our `TenantContextFilter` intercepts the request, verifies the JWT signature using our HMAC-SHA256 secret key, extracts the verified `society_id`, and places it in a ThreadLocal variable (`TenantContextHolder`).
> 4. All business services and repositories read the tenant context exclusively from this server-side ThreadLocal. Even if a user sends `X-Society-ID: fake-id` or modifies a path variable, the authenticated token's claim overrides and isolates the query."*

---

### Q3: What is `ThreadLocal` and how did you prevent `ThreadLocal` memory leaks in the Spring Boot Tomcat thread pool?
**Model Answer:**  
> *"In Spring Boot, Tomcat maintains a pool of reusable worker threads. If data stored in a `ThreadLocal` variable is not cleared when a request finishes, that thread will carry the previous user's data into subsequent unrelated requests, causing catastrophic data leaks and memory leaks.
> To prevent this, we implemented a strict `finally` block in our `TenantContextFilter`:
> ```java
> try {
>     TenantContextHolder.setTenantId(extractedTenantId);
>     filterChain.doFilter(request, response);
> } finally {
>     TenantContextHolder.clear(); // Guarantees thread sanitation
> }
> ```
> This guarantees that regardless of whether a request completes successfully or throws an uncaught exception, the thread's local storage is wiped clean before the thread is returned to the pool."*

---

### Q4: How does your system prevent race conditions and double bookings for society amenities?
**Model Answer:**  
> *"When multiple residents attempt to reserve the same amenity (e.g., Banquet Hall) at the same time, naive systems experience race conditions where two bookings are accepted for overlapping intervals.
> In Society360:
> 1. We defined an overlap detection query in `FacilityBookingRepository` based on standard interval overlap logic:
>    $$\text{Existing Booking Conflicting} \iff (\text{Existing Start} < \text{Requested End}) \land (\text{Existing End} > \text{Requested Start})$$
> 2. This check executes inside a `@Transactional` boundary.
> 3. If an overlap is detected, the service halts execution and throws `DoubleBookingException`, which our centralized `GlobalExceptionHandler` translates to `HTTP 409 Conflict`.
> 4. In PostgreSQL production mode, this is complemented by a unique partial exclusion constraint preventing simultaneous confirmed bookings on the same facility ID."*

---

### Q5: How is Role-Based Access Control (RBAC) enforced between the 7 different roles?
**Model Answer:**  
> *"We enforce authorization at two levels:
> 1. **URL-Level Spring Security AntMatchers:** In `SecurityConfig.java`, we define route hierarchies:
>    - `/api/superadmin/**` requires `ROLE_PLATFORM_SUPER_ADMIN`
>    - `/api/properties/**` requires `ROLE_SOCIETY_ADMIN`
>    - `/api/visitors/entry` requires `ROLE_SECURITY_GUARD`
> 2. **Method-Level Security:** We use `@PreAuthorize("hasAnyRole('SOCIETY_ADMIN', 'COMMITTEE_MEMBER')")` annotations directly above sensitive service and controller methods.
> 3. **UI Dynamic Navigation:** The frontend React sidebar inspects `user.role` from the authenticated user context to render only the permissible navigation routes and buttons, preventing unauthorized UI actions."*

---

### Q6: What design patterns did you use in the backend architecture?
**Model Answer:**  
> *"We utilized several classical software design patterns:
> 1. **Layered Architecture Pattern:** Controller → Service → Repository → Entity.
> 2. **Adapter / Anti-Corruption Layer Pattern:** The `PaymentGateway` interface decouples our internal finance domain from external banking APIs (`SimulatedPaymentGateway`).
> 3. **Data Transfer Object (DTO) Pattern:** Requests and responses use dedicated DTOs (e.g., `LoginRequest`, `SocietyAnalyticsDto`) to avoid exposing internal entity structures or triggering lazy loading exceptions.
> 4. **Singleton Pattern:** Spring-managed beans (`@Service`, `@Repository`, `@Component`).
> 5. **ThreadLocal Storage Pattern:** `TenantContextHolder` stores the tenant context for the duration of a thread's execution."*

---

### Q7: Why did you avoid Lombok in this enterprise implementation?
**Model Answer:**  
> *"While Lombok reduces boilerplate code through compile-time bytecode manipulation, it introduces several significant trade-offs:
> 1. **IDE and Compiler Fragility:** Annotation processor incompatibilities frequently break Maven builds across disparate developer environments and CI/CD pipelines.
> 2. **Debugging and Inspection:** Standard Java getters, setters, and explicit constructors provide transparent stack traces, straightforward step-through debugging, and zero dependency on IDE compiler plugins.
> 3. **Academic Evaluation:** Explicit POJOs demonstrate a thorough understanding of encapsulation, defensive copying, and constructors to external evaluators."*

---

### Q8: How does your application handle database migrations?
**Model Answer:**  
> *"We created `database/migrations/V1__init_schema.sql` containing all 17 relational DDL definitions, primary keys, UUID generation functions, foreign key constraints with `ON DELETE RESTRICT` or `CASCADE`, and performance indexes.
> In local development mode (`dev` profile), Hibernate generates schemas dynamically on top of an in-memory H2 database.
> In production mode (`prod` profile), `spring.jpa.hibernate.ddl-auto` is set to `validate`, ensuring no automatic destructive schema mutations occur, while migrations are managed via version-controlled SQL migration scripts."*

---

### Q9: Explain the resident onboarding and KYC verification workflow.
**Model Answer:**  
> *"A user registering on the platform does not automatically receive access to a society or flat:
> 1. The user registers by submitting their name, email, phone, requested flat ID, and resident type (`FLAT_OWNER` or `TENANT`).
> 2. Their initial occupancy status is set to `PENDING_VERIFICATION`, and their account role remains unverified with zero data access.
> 3. The Society Admin sees this request in their **Resident Verification Queue** (`/admin/residents`).
> 4. The Admin reviews the application details and either clicks **Approve** (which transitions status to `VERIFIED` and binds the user account to the flat's active occupancy record) or **Reject** with an explanatory reason.
> 5. Only upon approval can the resident log in and view society invoices, notices, and gate records."*

---

### Q10: How does the Visitor Anti-Duplication check work at the Security Gate?
**Model Answer:**  
> *"When a visitor arrives at the security gate:
> 1. The guard inputs the visitor's mobile number or scans their digital QR pass.
> 2. The backend queries `VisitorEntryRepository.findBySocietyIdAndContactNumberAndStatus(societyId, phone, "INSIDE")`.
> 3. If an active entry record already exists with status `INSIDE`, the system rejects the check-in with a 400 Bad Request error stating that this visitor is already recorded inside the premises.
> 4. Only after an exit timestamp is recorded and status changes to `COMPLETED` can a new entry pass be generated for that contact number."*

---

### Q11: What is the purpose of the Mobile Application in this repository?
**Model Answer:**  
> *"Residential societies rely heavily on mobile-first workflows:
> 1. **Security Guards:** Walk around perimeters and cannot carry desktop PCs; they need a mobile QR scanner for gate check-ins.
> 2. **Residents:** Need instantaneous push notifications and a 1-tap QR gate pass to send to expected guests.
> 3. **Maintenance Staff:** Need a mobile task list to view tickets, update job statuses on-site, and capture photos.
> We designed a complete React Native / Expo mobile application architecture in `/mobile` that consumes the exact same REST APIs and JWT security model as the web frontend."*

---

### Q12: How are passwords secured in the database?
**Model Answer:**  
> *"Passwords are never stored in plaintext. We utilize Spring Security's `BCryptPasswordEncoder` configured with a salt round factor of 10. BCrypt incorporates a random 128-bit salt and an adaptive cryptographic hash function that is computationally resistant to dictionary attacks, rainbow table lookups, and brute-force cracking."*

---

### Q13: What indexes did you create in the database and why?
**Model Answer:**  
> *"In a multi-tenant database, query performance depends on indexing the tenant discriminator column:
> 1. We indexed `(society_id)` across all tenant tables: `flats`, `complaints`, `visitor_entries`, `invoices`, `facilities`, and `notices`.
> 2. We created compound indexes:
>    - `idx_flats_society_building`: `(society_id, building_id)` for quick hierarchical flat lookups.
>    - `idx_visitors_active`: `(society_id, status)` for instantaneous retrieval of currently on-premise visitors.
>    - `idx_facility_booking_overlap`: `(facility_id, booking_date, start_time, end_time)` for high-speed concurrency collision checks."*

---

### Q14: How does the frontend manage state between different tenant contexts?
**Model Answer:**  
> *"In `frontend/src/context/AuthContext.tsx`, authenticated state (JWT token, user object, active society) is managed through React Context with `localStorage` persistence.
> When a user logs out or switches accounts:
> 1. The auth token and user state are cleared.
> 2. TanStack Query cache is invalidated (`queryClient.clear()`), preventing stale cached data from Society A from ever rendering in Society B's view.
> 3. The Axios interceptor automatically attaches the current JWT token (`Bearer ...`) to all subsequent outbound HTTP headers."*

---

### Q15: How do you handle exceptions centrally in the backend?
**Model Answer:**  
> *"We implemented `GlobalExceptionHandler` annotated with `@RestControllerAdvice`. It intercepts exceptions thrown anywhere in the application and transforms them into standardized `ApiResponse<T>` JSON objects:
> - `BadCredentialsException` → 401 Unauthorized
> - `AccessDeniedException` → 403 Forbidden
> - `ResourceNotFoundException` → 404 Not Found
> - `DoubleBookingException` → 409 Conflict
> - `MethodArgumentNotValidException` (Bean Validation) → 400 Bad Request with field-by-field validation error maps."*

---

### Q16: How is the Property Hierarchy structured and validated?
**Model Answer:**  
> *"The hierarchy is:  
> **`Society` (1) ── (N) `Building` (1) ── (N) `Wing` (1) ── (N) `Floor` (1) ── (N) `Flat`**  
> We enforce relational integrity via foreign keys. To prevent human error, we apply a compound unique constraint: `(wing_id, flat_number)` ensuring no duplicate flat numbers can exist within the same wing of a building."*

---

### Q17: What is the Complaint Lifecycle and how is SLA compliance tracked?
**Model Answer:**  
> *"The complaint ticket follows a strict state machine:  
> **`OPEN` → `ASSIGNED` → `IN_PROGRESS` → `RESOLVED` → `CLOSED`**  
> 1. When a resident creates a ticket, it starts as `OPEN`.
> 2. The Society Admin assigns it to a staff member (`ASSIGNED`), recording `assigned_to` and `assigned_at`.
> 3. Staff moves it to `IN_PROGRESS` upon commencing physical work.
> 4. Upon completion, staff marks it `RESOLVED` with mandatory resolution comments.
> 5. The system calculates Resolution SLA Time: $\Delta T = \text{resolved\_at} - \text{created\_at}$. Tickets unresolved past 48 hours are flagged as `OVERDUE` in admin analytics."*

---

### Q18: What is the purpose of Docker Compose in this project?
**Model Answer:**  
> *"Our `docker-compose.yml` provides a production-grade infrastructure blueprint:
> 1. Service 1 (`postgres`): Runs official PostgreSQL 16 Alpine with persistent volume mounting and auto-initialization of our `V1__init_schema.sql` DDL.
> 2. Service 2 (`backend`): Compiles our multi-stage Eclipse Temurin Java 21 container with environment variable overrides.
> 3. Service 3 (`frontend`): Builds the optimized Vite bundle and serves it via an Nginx reverse proxy on port 3000, routing `/api/` calls seamlessly to the backend.
> This enables zero-dependency deployment on any cloud server (AWS EC2, DigitalOcean, Azure) with a single command: `docker-compose up -d`."*

---

### Q19: How did you test your multi-tenant isolation?
**Model Answer:**  
> *"We wrote an automated integration test suite in `MultiTenantIsolationTest.java`:
> 1. We authenticate under Society A's context and execute repository queries.
> 2. We assert that every retrieved entity strictly possesses `society_id == Society A.id`.
> 3. We assert that `society_id != Society B.id` for all returned records.
> 4. We simulate overlapping facility bookings and verify that the concurrency collision guard throws `DoubleBookingException`.
> All tests run cleanly within Maven Surefire (`mvn test`)."*

---

### Q20: What are the primary future enhancements for Society360?
**Model Answer:**  
> *"1. **Automated ANPR (Automatic Number Plate Recognition):** Integrating CCTV cameras with OpenCV/YOLO at the security gate to automatically lift boom barriers for registered resident vehicles.  
> 2. **Real Payment Gateway Integration:** Connecting live Razorpay/Stripe webhooks for instant UPI QR code generation and automated invoice reconciliation.  
> 3. **IoT Smart Metering:** Integrating smart water and electricity meters for automated consumption-based utility billing.  
> 4. **WhatsApp Business API Notifications:** Sending instant visitor arrival approval alerts to resident WhatsApp accounts."*

---

*Society360 — Master Viva, Evaluation & Technical Presentation Guide*
