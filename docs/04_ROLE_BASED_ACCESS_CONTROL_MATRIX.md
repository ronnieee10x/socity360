# Society360 — Role-Based Access Control (RBAC) & Permission Matrix

**Document Version:** 1.0.0  
**Enforcement Architecture:** Dual-Layer Enforcement (Spring Security `@PreAuthorize` + Tenant Context Scoping + React ProtectedRoute Guards)  
**Roles Covered:** 7 Roles (`PLATFORM_SUPER_ADMIN`, `SOCIETY_ADMIN`, `COMMITTEE_MEMBER`, `FLAT_OWNER`, `TENANT`, `SECURITY_GUARD`, `MAINTENANCE_STAFF`)  

---

## 1. Permission Legend

- **`C`**: Create / Add new records
- **`R-All`**: Read all records within the scope (Platform-wide for Super Admin, Society-wide for Society Admin/Committee)
- **`R-Own`**: Read only records directly owned by or mapped to the authenticated user/flat
- **`U`**: Update / Edit records
- **`D`**: Delete / Deactivate records
- **`A`**: Approve / Reject / Authorize workflows
- **`—`**: Prohibited / HTTP 403 Forbidden

---

## 2. Comprehensive RBAC Matrix

| Functional Resource / Domain | PLATFORM_SUPER_ADMIN | SOCIETY_ADMIN | COMMITTEE_MEMBER | FLAT_OWNER | TENANT | SECURITY_GUARD | MAINTENANCE_STAFF |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **Platform Society Applications** | R-All, A, U | — | — | — | — | — | — |
| **Society Profile & Workspaces** | R-All, U, D | R-All, U | R-All | R-Own | R-Own | R-Own | — |
| **Buildings, Wings & Flats** | R-All | C, R-All, U, D | R-All | R-Own | R-Own | R-All (Lookup) | R-All (Lookup) |
| **Resident Verification (KYC)** | R-All | R-All, A, U | R-All, A | C (Submit Own) | C (Submit Own) | — | — |
| **Resident Directory** | — | R-All, U | R-All | R-All (Public) | R-All (Public) | R-All (Lookup) | — |
| **Visitor Entry & Exit (Gate)** | — | R-All | R-All | R-Own, A | R-Own, A | C, R-All, U, A | — |
| **Pre-Approved Guest Passes** | — | R-All | R-All | C, R-Own, D | C, R-Own, D | R-All (Verify) | — |
| **Complaints (Tickets)** | — | R-All, U, A | R-All | C, R-Own, U | C, R-Own, U | — | R-All (Assigned), U |
| **Maintenance Work Orders** | — | C, R-All, U | R-All | — | — | — | R-Own, U (Resolve) |
| **Maintenance Invoices** | — | C, R-All, U | R-All | R-Own | R-Own (View) | — | — |
| **Payment Processing** | — | R-All | R-All | C (Pay), R-Own | C (Pay), R-Own | — | — |
| **Financial Ledger & Reports** | — | R-All | R-All | R-Own (Receipts) | R-Own (Receipts) | — | — |
| **Facility Registry** | — | C, R-All, U, D | R-All | R-All | R-All | R-All | — |
| **Facility Bookings** | — | R-All, A, D | R-All, A | C, R-Own, D | C, R-Own, D | R-All (Today) | — |
| **Official Notices & Polls** | — | C, R-All, U, D | C, R-All, U | R-All, Vote | R-All, Vote | R-All (View) | R-All (View) |
| **Guard & Staff Accounts** | — | C, R-All, U, D | R-All | — | — | — | — |
| **Audit Logs** | R-All (Global) | R-All (Society) | R-All (Society) | — | — | — | — |
| **Analytics Dashboards** | Platform Analytics | Society Analytics | Society Analytics | Personal Stats | Personal Stats | Gate Stats | Workload Stats |

---

## 3. Critical Security Boundaries

1. **Super Admin Isolation:**
   - The `PLATFORM_SUPER_ADMIN` cannot browse private resident gate passes, flat visitor photos, or personal complaints unless performing an explicit formal administrative audit.
   - Super Admin cannot generate maintenance invoices for an individual flat.
2. **Resident Boundary:**
   - Residents (`FLAT_OWNER` and `TENANT`) cannot view another flat's financial invoices, overdue balances, or private visitor history.
3. **Guard Boundary:**
   - Security Guards can only look up flats to verify visitor destinations. They are strictly prohibited from viewing financial ledgers, resident documents, or maintenance finances.
4. **Maintenance Staff Boundary:**
   - Maintenance staff have access only to complaints assigned to their department or account. They cannot access gate logs or resident KYC documents.
5. **Cross-Tenant Boundary:**
   - Any query attempting `WHERE society_id = :anotherTenant` using credentials belonging to `:currentTenant` will immediately throw `AccessDeniedException` (HTTP 403) and log an alert in `audit_logs`.
