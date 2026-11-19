# Society360 — API Development Plan & REST Endpoints Specification

**Document Version:** 1.0.0  
**Base URL:** `/api/v1`  
**Authentication Scheme:** HTTP Bearer Header (`Authorization: Bearer <JWT_ACCESS_TOKEN>`)  
**Standard Response Contract:** All responses return a unified `ApiResponse<T>` envelope.

```json
{
  "success": true,
  "message": "Operation executed successfully",
  "data": { ... },
  "timestamp": "2026-11-19T15:30:00Z"
}
```

---

## 1. Authentication & Session Domain (`/api/v1/auth`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/register` | Public | Register initial user profile (creates pending account) |
| `POST` | `/api/v1/auth/login` | Public | Authenticates credentials, returns JWT access & refresh tokens with user role and tenant metadata |
| `POST` | `/api/v1/auth/refresh-token` | Public | Rotates refresh token and returns new JWT access token |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revokes refresh token in database |
| `GET`  | `/api/v1/auth/me` | Authenticated | Returns current authenticated profile, role, and tenant context |
| `POST` | `/api/v1/auth/forgot-password`| Public | Initiates password reset email flow |
| `POST` | `/api/v1/auth/reset-password` | Public | Validates reset token and sets new password |
| `GET`  | `/api/v1/auth/demo-accounts`  | Public (Dev) | Returns pre-seeded demo accounts across all 7 roles for instant viva login |

---

## 2. Platform Super Admin Domain (`/api/v1/super-admin`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/super-admin/dashboard` | `PLATFORM_SUPER_ADMIN` | Global platform metrics: total societies, pending applications, active residents |
| `GET`  | `/api/v1/super-admin/applications` | `PLATFORM_SUPER_ADMIN` | List all incoming society onboarding applications with status filters |
| `GET`  | `/api/v1/super-admin/applications/{id}` | `PLATFORM_SUPER_ADMIN` | Retrieve detailed application, attached documents, and audit history |
| `POST` | `/api/v1/super-admin/applications/{id}/approve` | `PLATFORM_SUPER_ADMIN` | Approves society application, provisions workspace, creates Society Admin |
| `POST` | `/api/v1/super-admin/applications/{id}/reject` | `PLATFORM_SUPER_ADMIN` | Rejects application with required reason note |
| `GET`  | `/api/v1/super-admin/societies` | `PLATFORM_SUPER_ADMIN` | Paginated listing of all registered societies |
| `PATCH`| `/api/v1/super-admin/societies/{id}/status` | `PLATFORM_SUPER_ADMIN` | Suspends or reactivates a society workspace |
| `GET`  | `/api/v1/super-admin/audit-logs` | `PLATFORM_SUPER_ADMIN` | Global immutable security and administrative audit trail |

---

## 3. Public Society Onboarding Domain (`/api/v1/societies`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/societies/apply` | Public | Multi-step society onboarding submission |
| `GET`  | `/api/v1/societies/public-list` | Public | Searchable list of registered societies for resident registration dropdowns |
| `GET`  | `/api/v1/societies/current` | Society Scoped | Returns profile and settings for the authenticated society |
| `PUT`  | `/api/v1/societies/current` | `SOCIETY_ADMIN` | Updates society profile, contact details, and emergency contacts |
| `PUT`  | `/api/v1/societies/current/settings` | `SOCIETY_ADMIN` | Updates maintenance billing rules, curfew hours, and security preferences |

---

## 4. Property Hierarchy Domain (`/api/v1/buildings`, `/api/v1/flats`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/buildings` | Society Scoped | Retrieves all buildings within the society |
| `POST` | `/api/v1/buildings` | `SOCIETY_ADMIN` | Adds a new building with wing/floor configuration |
| `GET`  | `/api/v1/buildings/{id}/wings` | Society Scoped | Lists wings associated with a specific building |
| `POST` | `/api/v1/buildings/{id}/wings` | `SOCIETY_ADMIN` | Adds a wing to a building |
| `GET`  | `/api/v1/flats` | Society Scoped | Lists flats with optional filters (`buildingId`, `wingId`, `occupancyStatus`) |
| `POST` | `/api/v1/flats` | `SOCIETY_ADMIN` | Registers a new flat/unit with unique number validation |
| `GET`  | `/api/v1/flats/{id}` | Society Scoped | Detailed flat view (resident, owner, current invoices, open tickets) |
| `PUT`  | `/api/v1/flats/{id}` | `SOCIETY_ADMIN` | Updates flat parameters (area, flat type, occupancy status) |

---

## 5. Resident Onboarding & KYC Domain (`/api/v1/residents`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/residents/join-request` | Authenticated | Submits verification request for flat occupancy (Owner / Tenant) |
| `GET`  | `/api/v1/residents/verification-queue` | `SOCIETY_ADMIN`, `COMMITTEE_MEMBER` | Lists pending resident verification applications |
| `POST` | `/api/v1/residents/verifications/{id}/approve` | `SOCIETY_ADMIN`, `COMMITTEE_MEMBER` | Approves resident KYC, links flat, assigns resident role |
| `POST` | `/api/v1/residents/verifications/{id}/reject` | `SOCIETY_ADMIN`, `COMMITTEE_MEMBER` | Rejects resident KYC with explanation note |
| `GET`  | `/api/v1/residents/directory` | Society Scoped | Directory of approved residents (respecting privacy phone masks) |
| `GET`  | `/api/v1/residents/my-occupancy` | `FLAT_OWNER`, `TENANT` | Details of the flat currently occupied/owned by the user |

---

## 6. Gate Security & Visitor Domain (`/api/v1/visitors`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/visitors/pre-approve` | `FLAT_OWNER`, `TENANT` | Generates a 6-digit visitor pass for expected guest |
| `POST` | `/api/v1/visitors/check-in` | `SECURITY_GUARD` | Records entry for walk-in or pre-approved visitor |
| `POST` | `/api/v1/visitors/{id}/check-out` | `SECURITY_GUARD` | Records exit timestamp, marking visitor session completed |
| `GET`  | `/api/v1/visitors/active` | `SECURITY_GUARD`, Admin | Real-time list of visitors currently inside the society premises |
| `GET`  | `/api/v1/visitors/my-visitors` | `FLAT_OWNER`, `TENANT` | Past and expected visitor logs for the caller's flat |
| `POST` | `/api/v1/visitors/{id}/approve` | `FLAT_OWNER`, `TENANT` | Resident approves walk-in visitor from gate prompt |
| `POST` | `/api/v1/visitors/{id}/reject` | `FLAT_OWNER`, `TENANT` | Resident denies entry to walk-in visitor |

---

## 7. Complaints & Maintenance Domain (`/api/v1/complaints`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/complaints` | `FLAT_OWNER`, `TENANT` | Raises new maintenance complaint with photo & category |
| `GET`  | `/api/v1/complaints` | Society Scoped | List complaints (Residents see own; Admins & Staff see all/assigned) |
| `GET`  | `/api/v1/complaints/{id}` | Society Scoped | Detailed complaint view with lifecycle history |
| `POST` | `/api/v1/complaints/{id}/assign` | `SOCIETY_ADMIN` | Assigns complaint ticket to maintenance technician |
| `PATCH`| `/api/v1/complaints/{id}/status` | Admin, Staff | Transitions status (`IN_PROGRESS`, `RESOLVED`, `CLOSED`) with resolution notes |

---

## 8. Finance & Invoicing Domain (`/api/v1/finance`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/finance/invoices/generate-batch` | `SOCIETY_ADMIN` | Generates monthly maintenance invoices for all occupied flats |
| `GET`  | `/api/v1/finance/invoices` | Society Scoped | List invoices (Residents see own; Admins see society-wide) |
| `GET`  | `/api/v1/finance/invoices/{id}` | Society Scoped | Invoice details with itemized charges |
| `POST` | `/api/v1/finance/payments/simulate` | `FLAT_OWNER`, `TENANT` | Processes simulated digital payment, settles invoice, issues receipt |
| `GET`  | `/api/v1/finance/receipts/{receiptNo}` | Society Scoped | Generates official PDF/printable payment receipt |
| `GET`  | `/api/v1/finance/reports/dues` | `SOCIETY_ADMIN`, Committee | Outstanding dues ledger by building, wing, and flat |

---

## 9. Notices & Facility Reservations (`/api/v1/notices`, `/api/v1/facilities`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/notices` | Society Scoped | Retrieves active bulletins and emergency alerts |
| `POST` | `/api/v1/notices` | `SOCIETY_ADMIN`, Committee | Publishes official announcement or emergency notice |
| `POST` | `/api/v1/notices/{id}/mark-read` | Residents | Tracks resident notice consumption |
| `GET`  | `/api/v1/facilities` | Society Scoped | Catalog of bookable amenities (Clubhouse, Gym, Hall) |
| `GET`  | `/api/v1/facilities/{id}/availability`| Society Scoped | Real-time calendar slot availability check |
| `POST` | `/api/v1/facilities/book` | `FLAT_OWNER`, `TENANT` | Reserves facility slot with anti-double-booking concurrency lock |
| `POST` | `/api/v1/facilities/bookings/{id}/cancel` | Resident, Admin | Cancels reservation and frees slot |

---

## 10. Analytics & Reporting Domain (`/api/v1/analytics`)

| Method | Endpoint | Allowed Roles | Description |
| :--- | :--- | :--- | :--- |
| `GET`  | `/api/v1/analytics/society-summary` | Admin, Committee | Executive summary: Occupancy %, Collection %, Open Complaints, Footfall |
| `GET`  | `/api/v1/analytics/visitor-trends` | Admin, Security | 7-day and 30-day visitor volume curves |
| `GET`  | `/api/v1/analytics/financial-health`| Admin, Committee | Revenue collected vs projected maintenance dues |
| `GET`  | `/api/v1/analytics/maintenance-sla` | Admin, Staff | Mean time to resolution (MTTR) by category |
