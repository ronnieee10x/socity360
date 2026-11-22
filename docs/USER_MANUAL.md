# Society360 — End-User Operations Manual

Welcome to the **Society360 Residential Society Management Platform** user guide. This manual provides simple, step-by-step instructions for residents, committee members, gate security guards, and maintenance technicians to navigate and make the most of Society360.

> **Note on Scope:**  
> This manual is specifically created for day-to-day community members and frontline staff. Administrative setup functions (such as platform governance and society workspace configuration) are handled exclusively by Society Administrators and Platform Operators in a separate administrator handbook.

---

## Table of Contents
1. [Getting Started & Login Guide](#1-getting-started--login-guide)
   - [1.1 Creating an Account & Submitting Flat KYC](#11-creating-an-account--submitting-flat-kyc)
   - [1.2 Logging In](#12-logging-in)
   - [1.3 Understanding Your Dashboard & Navigation Bar](#13-understanding-your-dashboard--navigation-bar)
   - [1.4 Logging Out Securely](#14-logging-out-securely)
2. [Committee Member Guide](#2-committee-member-guide)
   - [2.1 Accessing the Committee Workspace](#21-accessing-the-committee-workspace)
   - [2.2 Monitoring Financial Collections & Dues Ledger](#22-monitoring-financial-collections--dues-ledger)
   - [2.3 Auditing & Approving Resident KYC Applications](#23-auditing--approving-resident-kyc-applications)
   - [2.4 Overseeing Maintenance Complaints & Assigning Staff](#24-overseeing-maintenance-complaints--assigning-staff)
   - [2.5 Publishing Official Notices & Emergency Circulars](#25-publishing-official-notices--emergency-circulars)
3. [Flat Owner Guide](#3-flat-owner-guide)
   - [3.1 Accessing the Owner Portal](#31-accessing-the-owner-portal)
   - [3.2 Viewing & Paying Maintenance Dues Online](#32-viewing--paying-maintenance-dues-online)
   - [3.3 Downloading Instant Digital Payment Receipts](#33-downloading-instant-digital-payment-receipts)
   - [3.4 Generating 6-Digit Pre-Approved Visitor Passes](#34-generating-6-digit-pre-approved-visitor-passes)
   - [3.5 Filing Maintenance Complaints & Tracking Repairs](#35-filing-maintenance-complaints--tracking-repairs)
   - [3.6 Reserving Society Amenities (Clubhouse, Sports Courts)](#36-reserving-society-amenities-clubhouse-sports-courts)
   - [3.7 Reading Society Notices & Bulletins](#37-reading-society-notices--bulletins)
4. [Resident Tenant Guide](#4-resident-tenant-guide)
   - [4.1 Accessing the Tenant Portal](#41-accessing-the-tenant-portal)
   - [4.2 Pre-Approving Guests & Tracking Gate Visitors](#42-pre-approving-guests--tracking-gate-visitors)
   - [4.3 Raising Maintenance Tickets for Rented Flats](#43-raising-maintenance-tickets-for-rented-flats)
   - [4.4 Reserving Society Amenities](#44-reserving-society-amenities)
   - [4.5 Viewing Society Notices & Alerts](#45-viewing-society-notices--alerts)
5. [Security Guard Guide](#5-security-guard-guide)
   - [5.1 The Main Perimeter Gate Console](#51-the-main-perimeter-gate-console)
   - [5.2 Verifying 6-Digit Resident Guest Passes](#52-verifying-6-digit-resident-guest-passes)
   - [5.3 Registering Walk-In Visitors & Deliveries](#53-registering-walk-in-visitors--deliveries)
   - [5.4 Tracking Active Visitors & Logging Departures](#54-tracking-active-visitors--logging-departures)
6. [Maintenance Staff Guide](#6-maintenance-staff-guide)
   - [6.1 Accessing Assigned Work Orders](#61-accessing-assigned-work-orders)
   - [6.2 Starting Work on a Ticket](#62-starting-work-on-a-ticket)
   - [6.3 Resolving Tickets & Adding Work Completion Notes](#63-resolving-tickets--adding-work-completion-notes)
7. [Troubleshooting & Frequently Asked Questions (FAQ)](#7-troubleshooting--frequently-asked-questions-faq)
8. [Screenshot Checklist](#8-screenshot-checklist)

---

## 1. Getting Started & Login Guide

### 1.1 Creating an Account & Submitting Flat KYC
Every resident (Owner or Tenant) creates an individual account and links it to their society flat.

![Resident Registration Page](./screenshots/register-page.png)

1. Open your web browser and navigate to `http://localhost:3000/register`.
2. Select your housing society from the **Select Your Housing Society** dropdown list.
3. Enter your **Full Name**, **Email Address**, and **Mobile Phone Number**.
4. Choose a strong password (minimum 6 characters) and re-type it in the **Confirm Password** field.
5. Click **Create Resident Account**.
6. After creating your account, submit your flat occupancy request:
   - Choose your Flat from the directory.
   - Select your occupancy type: **FLAT OWNER** or **TENANT**.
   - Provide a link or upload reference for your ownership deed or rental lease agreement.
7. Your account is placed into the **Pending Verification** queue. Once the Society Admin or Committee Member verifies your documents, your account unlocks full portal access.

---

### 1.2 Logging In

![Sign In Page](./screenshots/login-page.png)

1. Navigate to `http://localhost:3000/login`.
2. In the **Email Address** field, enter your registered email.
3. In the **Password** field, enter your password.
4. Click **Sign In to Workspace**.
5. The system automatically reads your assigned role and redirects you directly to your personalized workspace:
   - Committee Members $\to$ `/committee/dashboard`
   - Flat Owners $\to$ `/resident/owner/dashboard`
   - Tenants $\to$ `/resident/tenant/dashboard`
   - Security Guards $\to$ `/guard/gate`
   - Maintenance Staff $\to$ `/staff/tasks`

---

### 1.3 Understanding Your Dashboard & Navigation Bar

![Top Navigation Bar and Workspace Sidebar](./screenshots/navigation-sidebar.png)

When logged in, your screen is divided into two primary zones:
- **Top Header Bar:**
  - Displays the **Society360** logo and your society's name in a green badge.
  - Shows your **Full Name** and verified **Role Badge** on the right.
- **Left Navigation Sidebar:**
  - Lists every tool and page available to your role. Clicking any item instantly opens that workspace.

### 1.4 Logging Out Securely
1. Look at the top-right corner of the header bar.
2. Click the **Sign Out** button (represented by an exit door icon next to your profile).
3. Your security token will be cleared and you will be returned to the login screen.

---

## 2. Committee Member Guide

As a **Committee Member**, you have executive oversight over society operations, financial collections, resident verification approvals, maintenance issues, and community notices.

### 2.1 Accessing the Committee Workspace
From your left sidebar, click **Committee Dashboard** (`/committee/dashboard`). Here you can monitor community health indicators, active tasks, and upcoming meetings.

---

### 2.2 Monitoring Financial Collections & Dues Ledger

![Committee Financial Ledger](./screenshots/committee-finance-ledger.png)

1. Click **Financial Collections** (`/committee/finance`) in the sidebar.
2. Review the top KPI summary cards:
   - **Total Billed:** The cumulative sum of all issued maintenance dues.
   - **Total Collected:** Total payments successfully received through the digital gateway.
   - **Pending Receivables:** Unpaid dues awaiting resident settlement.
   - **Collection Efficiency:** The percentage ratio of collected dues versus total billed amounts.
3. Use the filter tabs to review the dues ledger:
   - Click **All Invoices** to see every generated bill.
   - Click **Pending Dues** to isolate overdue flats.
   - Click **Paid Invoices** to inspect settled bills.
4. To inspect proof of payment for any paid bill, find the invoice in the list and click **View Receipt**.

---

### 2.3 Auditing & Approving Resident KYC Applications

![Resident Verification Queue](./screenshots/committee-resident-kyc.png)

1. In the sidebar, click **Resident Verifications** (`/committee/residents`).
2. The verification roster displays all applicants with their name, email, phone number, flat number, and occupancy type (**OWNER** or **TENANT**).
3. Under the **Document Proof** column, click **Inspect Proof** to view the uploaded property deed or rental agreement.
4. Taking action on a pending application:
   - **To Approve:** Click the green **Approve** button. A confirmation popup will open stating that approving this application will activate the resident's account and mark the flat as **OCCUPIED**. Click **Confirm APPROVED**.
   - **To Reject:** Click the red **Reject** button. A text box will prompt you for an explanation (e.g., *"Rental agreement expired"* or *"Name does not match registry deed"*). Enter the reason and click **Confirm REJECTED**.

---

### 2.4 Overseeing Maintenance Complaints & Assigning Staff

![Committee Complaints Oversight](./screenshots/committee-complaints-oversight.png)

1. Click **Complaints Oversight** (`/committee/complaints`) in the sidebar.
2. Use the status tabs (**All**, **Submitted**, **In Progress**, **Resolved**) or the search bar to locate specific issues.
3. Review ticket priorities (**Urgent**, **High**, **Medium**, **Low**).
4. Review technician assignment notes, root-cause repair details, and resident feedback.

---

### 2.5 Publishing Official Notices & Emergency Circulars

![Broadcast Notice Modal](./screenshots/committee-broadcast-notice.png)

1. Click **Notice Bulletins** (`/committee/notices`) in the sidebar.
2. In the top-right corner, click **+ Broadcast Notice**.
3. In the popup window, fill out the form:
   - **Notice Title:** Enter a brief subject line (e.g., *"Elevator Annual Maintenance"*).
   - **Notice Category:** Select `GENERAL`, `MAINTENANCE`, `EMERGENCY`, `EVENT`, or `MEETING`.
   - **Priority Level:** Choose `NORMAL`, `HIGH`, or `URGENT`. (Selecting `URGENT` or `EMERGENCY` automatically places a prominent red alert banner at the top of every resident's dashboard).
   - **Notice Content:** Enter the complete text of the notice, including dates, timings, and contact persons.
4. Click **Publish Notice**. The announcement will appear immediately on all resident screens.

---

## 3. Flat Owner Guide

As a **Flat Owner**, you can manage your property dues, pre-approve guests for easy gate entry, file maintenance requests, reserve amenities, and read announcements.

### 3.1 Accessing the Owner Portal
Log in and click **Owner Portal** (`/resident/owner/dashboard`) in the sidebar to view your primary flat information and recent activity.

---

### 3.2 Viewing & Paying Maintenance Dues Online

![Pay Maintenance Bill Modal](./screenshots/owner-pay-dues.png)

1. In the sidebar, click **Pay Invoices** (`/resident/owner/invoices`).
2. At the top of the page, a yellow notification banner alerts you if you have any unpaid bills, showing the total overdue balance.
3. Locate the invoice card for the current billing cycle.
4. Click **Pay Now** to launch the secure checkout dialog.
5. Select your preferred payment method:
   - **UPI / QR:** Enter your Virtual Payment Address (e.g., `user@okhdfcbank`).
   - **Card:** Enter your credit or debit card number.
   - **NetBanking:** Enter your bank account identifier.
6. Click **Authorize & Pay ₹[Amount]**.

---

### 3.3 Downloading Instant Digital Payment Receipts

![Digital Payment Receipt Modal](./screenshots/owner-payment-receipt.png)

1. As soon as your payment is processed, the **Payment Successful!** receipt dialog automatically appears on your screen.
2. The receipt displays:
   - **Receipt Number** (e.g., `REC-202611-0012`)
   - **Bank Transaction Reference** (e.g., `TXN-63914820`)
   - **Flat Number** and **Society Name**
   - **Payment Mode** and **Amount Paid**
3. Click **Close Receipt** to dismiss the dialog.
4. You can view or print this receipt at any time in the future by clicking **View Receipt** on any paid invoice card.

---

### 3.4 Generating 6-Digit Pre-Approved Visitor Passes

![Generate Guest Pass Modal](./screenshots/owner-generate-pass.png)
![6-Digit Gate Pass PIN Display](./screenshots/owner-gate-pin.png)

Avoid gate delays for your guests, delivery couriers, and cabs by issuing a pre-approved digital pass:
1. In the sidebar, click **Pre-Approve Visitors** (`/resident/owner/visitors`).
2. In the top-right corner, click **+ Generate Guest Pass**.
3. In the popup form, enter:
   - **Visitor Full Name:** Name of your guest or driver.
   - **Visitor Contact Phone:** Guest's mobile number.
   - **Purpose:** Select `Guest / Family`, `Delivery`, `Cab`, or `Service Technician`.
   - **Vehicle (Optional):** Car or bike license plate number.
4. Click **Create Pass & PIN**.
5. A dark confirmation card displays a unique **6-Digit Numerical PIN** (e.g., `8 4 1 9 2 0`).
6. Share this 6-digit PIN with your guest via SMS or WhatsApp. When they arrive at the society gate, they simply tell this PIN to the security guard for instant entry.

---

### 3.5 Filing Maintenance Complaints & Tracking Repairs

![Log Maintenance Complaint Modal](./screenshots/owner-log-complaint.png)

If you notice plumbing leaks, electrical problems, or other issues:
1. In the sidebar, click **Raise Complaint** (`/resident/owner/complaints`).
2. Click **Log New Complaint**.
3. Fill in the required fields:
   - **Issue Title:** A short summary (e.g., *"Kitchen sink drain pipe leaking"*).
   - **Category:** Select `PLUMBING`, `ELECTRICAL`, `CARPENTRY`, `CIVIL`, `LIFT`, `SECURITY`, or `HOUSEKEEPING`.
   - **Priority:** Select `LOW`, `MEDIUM`, `HIGH`, or `URGENT / EMERGENCY`.
   - **Description:** Provide details about the problem and your preferred inspection timings.
   - **Photo URL (Optional):** Provide an image link showing the problem.
4. Click **Submit Complaint**.
5. Track your ticket directly on the page:
   - **SUBMITTED:** The complaint is logged and waiting for admin review.
   - **ASSIGNED:** A maintenance technician has been designated.
   - **IN_PROGRESS:** The technician has arrived and started repairs.
   - **RESOLVED:** The issue is fixed. You can read the technician's resolution notes directly on the card.

---

### 3.6 Reserving Society Amenities (Clubhouse, Sports Courts)

![Book Amenity Modal](./screenshots/owner-book-amenity.png)

1. In the sidebar, click **Book Amenities** (`/resident/owner/facilities`).
2. Browse through the available community facilities (Clubhouse, Swimming Pool, Tennis Court, Banquet Hall).
3. Review capacity, opening hours, and hourly charges.
4. Click **Book Slot** on the facility card you wish to use.
5. In the booking dialog:
   - Select your **Booking Date**.
   - Select **Start Time** and **End Time**.
6. Click **Confirm Reservation**.
7. If another resident has already reserved that time slot, the system will prevent duplicate bookings and display a notice: *"Double-Booking Conflict: This slot is already booked by another resident."* Simply select a different time window.

---

### 3.7 Reading Society Notices & Bulletins

![Society Notice Bulletin](./screenshots/owner-notices.png)

1. Click **Society Notices** (`/resident/owner/notices`) in the sidebar.
2. Check the top of the screen for any red **High Priority Advisory** banners.
3. Use the filter buttons (**All**, **General**, **Maintenance**, **Emergency**, **Events**, **Meetings**) to browse announcements.

---

## 4. Resident Tenant Guide

As a **Resident Tenant**, you have access to day-to-day living tools: visitor approvals, maintenance requests, amenity bookings, and society circulars.

### 4.1 Accessing the Tenant Portal
After logging in, your home screen is the **Tenant Portal** (`/resident/tenant/dashboard`), confirming your active flat and building wing.

---

### 4.2 Pre-Approving Guests & Tracking Gate Visitors

![Tenant Visitor Approvals](./screenshots/tenant-visitors.png)

1. In the sidebar, click **Visitor Approvals** (`/resident/tenant/visitors`).
2. Click **+ Generate Guest Pass** whenever you expect guests, food delivery, or couriers.
3. Enter your visitor's details (Name, Phone, Purpose, Vehicle) and click **Create Pass & PIN**.
4. Share the generated **6-digit PIN** with your visitor.
5. In the **Visitor Log History** table, you can monitor:
   - Guest check-in timestamps.
   - Whether the visitor is currently inside the complex or checked out.
   - Total stay duration.

---

### 4.3 Raising Maintenance Tickets for Rented Flats

![Tenant Maintenance Ticket](./screenshots/tenant-complaint.png)

1. In the sidebar, click **Maintenance Tickets** (`/resident/tenant/complaints`).
2. Click **Log New Complaint**.
3. Select the category (such as `Plumbing` or `Electrical`), describe the issue inside your rented flat, and click **Submit Complaint**.
4. You will see your assigned technician's name and contact number once they are assigned to your ticket.

---

### 4.4 Reserving Society Amenities
1. Click **Book Amenities** (`/resident/tenant/facilities`) in the sidebar.
2. Select your desired facility (Gym, Pool, Badminton Court).
3. Pick your preferred date and time, then click **Confirm Reservation**.

---

### 4.5 Viewing Society Notices & Alerts
1. Click **Notices & Alerts** (`/resident/tenant/notices`) in the sidebar.
2. Stay updated on power shutdowns, water tank cleaning schedules, festival celebrations, and general guidelines.

---

## 5. Security Guard Guide

As a **Security Guard**, you safeguard the main entrance gate. The **Gate Console** is designed with large text, high contrast, and quick one-click actions for fast gate operations.

### 5.1 The Main Perimeter Gate Console

![Security Guard Gate Console](./screenshots/guard-gate-console.png)

1. Log in to the application. The system opens the **Gate Console** (`/guard/gate`) directly.
2. Look at the top stats bar:
   - **Active On Premise:** The live count of all outside visitors currently inside the society.
   - **Expected Passes:** The count of visitors pre-registered by residents for today.

---

### 5.2 Verifying 6-Digit Resident Guest Passes

![Guard 6-Digit Code Verification](./screenshots/guard-verify-pin.png)

When a visitor arrives stating that the resident gave them a pass code:
1. Make sure the **Verify 6-Digit Pass Code** tab is selected.
2. Ask the visitor: *"Please tell me your 6-digit entry code."*
3. Type the 6 numbers into the large pin box (e.g., `8 4 1 9 2 0`).
4. Click the green **Authorize Entry** button.
5. The console verifies the code instantly:
   - **Success:** A green banner appears confirming: *"Entry Authorized: [Visitor Name] for Flat [Flat Number]"*. Open the gate for the visitor.
   - **Invalid Code:** A red banner warns: *"Invalid or expired pass code"*. Double check the code with the visitor.
6. The **Expected Guests for Today** list below the input box shows upcoming pre-approved guests for quick reference.

---

### 5.3 Registering Walk-In Visitors & Deliveries

![Guard Walk-In Registration](./screenshots/guard-walkin-form.png)

When a delivery courier, cab, or unexpected guest arrives without a pre-approved pass:
1. Click the **Walk-In Registration** tab.
2. In the **Destination Flat** dropdown, select the flat the visitor is visiting.
3. Enter the visitor's **Full Name** and **Contact Phone Number**.
4. Select the **Visit Purpose**:
   - `Guest / Family`
   - `Delivery / Courier`
   - `Cab / Ride Share`
   - `Service / Repair`
   - `Other`
5. If the visitor has a vehicle, enter their license plate under **Vehicle No (Optional)**.
6. Click **Record Walk-In Entry & Check-In**.
7. The visitor is recorded in the system, and their entry timestamp is logged.

---

### 5.4 Tracking Active Visitors & Logging Departures

![Guard Active Visitors & Checkout](./screenshots/guard-active-visitors.png)

When a visitor leaves the premises:
1. Click the **Active Visitors** tab.
2. You will see a list of every guest and delivery courier currently inside the society.
3. Find the departing visitor by their name, vehicle plate, or flat number.
4. Click the black **Check Out** button in their table row.
5. The system records the departure timestamp, calculates the total duration of their visit, and removes them from the active visitors list.

---

## 6. Maintenance Staff Guide

As a **Maintenance Technician**, your workspace is your daily repair dispatch queue. You can review assigned jobs, notify residents when work begins, and log completion notes.

### 6.1 Accessing Assigned Work Orders

![Maintenance Work Orders Board](./screenshots/staff-tasks-board.png)

1. Log in to the application. The system opens the **Assigned Work Orders** page (`/staff/tasks`).
2. Check the header banner to see your **Active Queue** count.
3. Review your assigned work order cards:
   - **Ticket ID** (e.g., `TKT-202611-004`)
   - **Priority Badge:** `Urgent` (red), `High Priority` (amber), or `Normal` (blue).
   - **Category:** Plumbing, Electrical, Carpentry, etc.
   - **Resident Details:** Flat number, building tower, resident's name, and phone number.

---

### 6.2 Starting Work on a Ticket

![Start Work Action](./screenshots/staff-start-work.png)

1. When you arrive at the resident's flat to begin inspections:
2. Find the relevant ticket card with status **Assigned**.
3. Click the purple **Start Work** button.
4. The ticket status updates immediately to an animated spinning **In Progress** badge. This lets the resident know that the technician is currently working on the issue.

---

### 6.3 Resolving Tickets & Adding Work Completion Notes

![Complete Work Order Modal](./screenshots/staff-resolve-modal.png)

1. Once the repair is complete and verified with the resident:
2. Click the green **Mark Resolved** button on the work order card.
3. In the **Complete Work Order** dialog:
   - Read the ticket number and summary.
   - In the **Resolution Notes** box, type a clear explanation of what was fixed (e.g., *"Replaced worn washer on kitchen faucet, sealed valve threads, and tested water flow. No further leaks detected."*).
4. Click **Confirm Resolution**.
5. The card status changes to a green **Done** badge, and your resolution notes are saved to the ticket history for the resident and committee to review.

---

## 7. Troubleshooting & Frequently Asked Questions (FAQ)

### Q1: Why can't I access my flat dashboard after registering?
> **Answer:** When you register as a new resident, your account is placed in a **Pending Verification** state. The Society Administrator or Committee Member must verify your ownership deed or rental agreement to prevent unauthorized access. Once approved, logging in will automatically take you to your flat dashboard.

### Q2: What should I do if my amenity booking shows "Double-Booking Conflict"?
> **Answer:** Society360 features an automatic concurrency lock that prevents two residents from reserving the same amenity at the same time. If you see an `HTTP 409 Conflict` error, it means another resident has already reserved that time window. Simply choose an earlier or later time slot, or select a different date.

### Q3: How do I share a 6-digit visitor pass with my guest?
> **Answer:** When you create a guest pass under **Pre-Approve Visitors**, the system displays a large 6-digit number (e.g., `841920`). Copy this number or take a screenshot, and send it to your guest via text message or WhatsApp. When they reach the gate, they can give this PIN to the security guard for instant clearance.

### Q4: Can I pay maintenance dues using UPI or Debit/Credit cards?
> **Answer:** Yes. Society360 supports UPI (Google Pay, PhonePe, Paytm, BHIM), all major Credit/Debit cards, and NetBanking. Digital receipts with bank transaction references are generated immediately upon payment confirmation.

### Q5: What happens if a security guard enters an incorrect 6-digit pass code?
> **Answer:** If the 6-digit code does not match any active pre-approved pass for today, the console will display an alert: *"Invalid or expired pass code"*. The guard can ask the visitor to re-check the PIN sent by the resident, or use the **Walk-In Registration** tab to manually check the visitor in.

---

## 8. Screenshot Checklist

To complete this manual with visual illustrations, capture the screens listed below from your local development environment and save them into the `docs/screenshots/` folder:

| Filename | Page / Route | Role to Log In As | What to Capture in the Screenshot |
|---|---|---|---|
| `register-page.png` | `/register` | *Logged Out* | Full resident registration form with society dropdown. |
| `login-page.png` | `/login` | *Logged Out* | Sign-in screen with email and password fields. |
| `navigation-sidebar.png` | Any dashboard | `FLAT_OWNER` or `COMMITTEE_MEMBER` | Top navigation bar with society badge, user name, and the left sidebar. |
| `committee-finance-ledger.png` | `/committee/finance` | `COMMITTEE_MEMBER` | Financial KPI cards (Billed, Collected, Receivables) and the dues table. |
| `committee-resident-kyc.png` | `/committee/residents` | `COMMITTEE_MEMBER` | Resident verification roster showing pending KYC applications and decision buttons. |
| `committee-complaints-oversight.png` | `/committee/complaints` | `COMMITTEE_MEMBER` | Community complaints oversight board with category and priority badges. |
| `committee-broadcast-notice.png` | `/committee/notices` | `COMMITTEE_MEMBER` | The "+ Broadcast Notice" modal with title, type, priority, and text inputs. |
| `owner-pay-dues.png` | `/resident/owner/invoices` | `FLAT_OWNER` | Outstanding dues banner and the "Pay Maintenance Bill" checkout modal. |
| `owner-payment-receipt.png` | `/resident/owner/invoices` | `FLAT_OWNER` | The green "Payment Successful!" digital receipt dialog. |
| `owner-generate-pass.png` | `/resident/owner/visitors` | `FLAT_OWNER` | The "Generate Pre-Approved Pass" popup form. |
| `owner-gate-pin.png` | `/resident/owner/visitors` | `FLAT_OWNER` | The dark card showing the generated 6-digit Gate PIN. |
| `owner-log-complaint.png` | `/resident/owner/complaints` | `FLAT_OWNER` | The "Log Maintenance Complaint" popup form. |
| `owner-book-amenity.png` | `/resident/owner/facilities` | `FLAT_OWNER` | The "Book Amenity Slot" modal with date and time selectors. |
| `owner-notices.png` | `/resident/owner/notices` | `FLAT_OWNER` | Society notice board showing circulars and emergency advisory banners. |
| `tenant-visitors.png` | `/resident/tenant/visitors` | `TENANT` | Tenant visitor log history table and pass generator button. |
| `tenant-complaint.png` | `/resident/tenant/complaints` | `TENANT` | Maintenance ticket list showing technician assignment status. |
| `guard-gate-console.png` | `/guard/gate` | `SECURITY_GUARD` | Main perimeter gate console header with active counters. |
| `guard-verify-pin.png` | `/guard/gate` | `SECURITY_GUARD` | "Verify 6-Digit Pass Code" tab with PIN input and expected guests. |
| `guard-walkin-form.png` | `/guard/gate` | `SECURITY_GUARD` | "Walk-In Registration" tab with flat dropdown and visitor details form. |
| `guard-active-visitors.png` | `/guard/gate` | `SECURITY_GUARD` | "Active Visitors" tab showing table with "Check Out" buttons. |
| `staff-tasks-board.png` | `/staff/tasks` | `MAINTENANCE_STAFF` | Technician work order board showing assigned repair tickets. |
| `staff-start-work.png` | `/staff/tasks` | `MAINTENANCE_STAFF` | Work order card showing "Start Work" button and resident details. |
| `staff-resolve-modal.png` | `/staff/tasks` | `MAINTENANCE_STAFF` | "Complete Work Order" modal with resolution notes text area. |

---
*Society360 — One Platform. Every Society. Smarter Living.*
