# Society360 — Multi-Tenant Residential Society Management Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.3-brightgreen.svg?logo=springboot)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg?logo=openjdk)](https://www.oracle.com/java/)
[![React](https://img.shields.io/badge/React-18-blue.svg?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg?logo=tailwind-css)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791.svg?logo=postgresql)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED.svg?logo=docker)](https://www.docker.com/)

> *"One Platform. Every Society. Smarter Living."*

---

## 1. Project Overview

### What is Society360?
**Society360** is an all-in-one web platform designed to manage residential housing societies (apartment complexes, gated communities, and housing societies). Instead of building a separate website or app for each society, Society360 allows multiple independent societies to run on a single platform while keeping their data completely separated and secure.

> **What is Multi-Tenancy?**  
> Multi-tenancy is an architecture where multiple customer organizations (called "tenants" or societies) share the exact same software application and database, while strict digital barriers ensure that no society can ever view or touch another society's data.

### The Problem It Solves
Traditional residential society management is chaotic and fragmented:
- **Paper registers at security gates:** Lost visitor entries, long wait times, and fake phone numbers.
- **Messy WhatsApp groups:** Important maintenance notices get lost in everyday chatter, and arguments break out.
- **Manual maintenance collection:** Collecting checks, tracking unpaid dues in Excel spreadsheets, and handing out paper receipts.
- **Unresolved complaints:** Residents report water leaks or broken elevators, but nobody knows who is working on it or when it will be fixed.
- **Double-booked facilities:** Two residents show up to use the clubhouse or banquet hall at the exact same hour.

**Society360 replaces all of that with a clean, unified digital hub.**

---

### The 7 User Roles
Everyone in a residential community has different responsibilities. Society360 gives each person a tailored dashboard matching their exact role:

| # | Role Name | Who Uses It | What They Can Do |
|---|---|---|---|
| **1** | `PLATFORM_SUPER_ADMIN` | Platform Owners & Operators | Reviews and approves new society registration requests, views system-wide statistics, and monitors security audit logs. |
| **2** | `SOCIETY_ADMIN` | Society President or Office Manager | Adds buildings and flats, verifies new resident accounts, creates maintenance invoices, and assigns complaints to staff. |
| **3** | `COMMITTEE_MEMBER` | Elected Board / Committee Members | Views financial reports, reviews resident complaints, and posts official society-wide announcements. |
| **4** | `FLAT_OWNER` | Landlords & Homeowners | Views ownership records, pays monthly maintenance dues, approves tenants, and books community amenities (clubhouse, pool). |
| **5** | `TENANT` | Renters living in the flat | Pre-approves incoming guests/deliveries, submits maintenance complaints, views notice boards, and pays dues if agreed. |
| **6** | `SECURITY_GUARD` | Main Gate Guards & Security Staff | Checks visitors in and out, verifies resident pre-approved guest passes, logs delivery drivers, and tracks vehicles. |
| **7** | `MAINTENANCE_STAFF` | Electricians, Plumbers, Handymen | Views assigned repair tickets, updates job progress (`OPEN` → `IN_PROGRESS` → `RESOLVED`), and logs resolution notes. |

---

## 2. Tech Stack (What & Why)

Here is every technology, framework, and library used in this project, explained in simple words:

| Technology | Layer | What it is used for in Society360 | Why we chose it (in simple words) |
|---|---|---|---|
| **Java 21 (LTS)** | Backend | The core programming language powering the server. | It is fast, type-safe, rock-solid, and supported by long-term industry standards. |
| **Spring Boot 3.3.3** | Backend | The primary backend framework handling web servers, controllers, and services. | It eliminates boilerplate setup, starts up quickly, and provides built-in enterprise features. |
| **Spring Security 6** | Backend | Protects every API endpoint, manages login sessions, and checks user roles. | It provides bank-grade security and makes it easy to block unauthorized users before requests touch our database. |
| **Spring Data JPA & Hibernate** | Backend | Talks to the database without writing raw SQL strings for every basic query. | It automatically translates Java classes into database tables (called an **ORM**) and speeds up database operations. |
| **JJWT (io.jsonwebtoken)** | Backend | Creates, signs, and decodes secure digital login badges (**JSON Web Tokens**). | It allows stateless login so the server does not need to store million sessions in memory. |
| **PostgreSQL 16** | Database | The main relational database for production data storage. | Highly reliable, supports acid transactions, handles complex relationships, and handles heavy concurrent traffic. |
| **H2 In-Memory Database** | Database | A lightweight database that lives in your computer's RAM during local development. | Allows any teammate to download and run the backend immediately without having to install or configure PostgreSQL first. |
| **Springdoc OpenAPI (Swagger)** | Backend | Generates live interactive API documentation at `/swagger-ui.html`. | Lets teammates test and view all 35+ backend API endpoints directly in their web browser. |
| **React 18** | Frontend | The user interface library that builds dynamic web pages. | Allows us to break the web app into reusable, interactive components with fast virtual-DOM updates. |
| **Vite 5** | Frontend | The build tool and local development server for the React app. | Extremely fast hot-reloading (updates your browser instantly when you save a file) compared to older tools like Webpack. |
| **TypeScript 5** | Frontend | Adds strict type checking to JavaScript code. | Catches spelling mistakes and bugs in our code before running the browser, making teamwork much smoother. |
| **Tailwind CSS 3.4** | Frontend | Utility-first CSS styling framework. | Lets us style modern, responsive pages right inside our HTML tags without writing hundreds of messy CSS files. |
| **Axios** | Frontend | HTTP client that sends network requests to the backend API. | Supports automatic request interceptors, making it effortless to attach the user's JWT login token to every outgoing request. |
| **TanStack React Query** | Frontend | Manages fetching, caching, and auto-refreshing server data on the frontend. | Prevents duplicate network calls, provides easy loading spinners, and keeps dashboard data up-to-date automatically. |
| **React Hook Form + Zod** | Frontend | Form handling and input validation. | Ensures users cannot submit forms with missing fields or invalid email formats before sending data to the server. |
| **Lucide React** | Frontend | Clean and modern icon set. | Provides lightweight, consistent icons across all navigation bars, cards, and action buttons. |
| **Recharts** | Frontend | Charting library for graphs and visual analytics. | Renders clean visual charts for society admin revenue, occupancy percentages, and complaint metrics. |
| **Docker & Docker Compose** | DevOps | Packages the database, backend, and frontend into portable containers. | Ensures the entire project runs identically on every teammate's computer with just one terminal command. |
| **Maven Wrapper (`mvnw`)** | Tooling | Java dependency and build management tool. | Bundles the exact right version of Maven so teammates don't have to manually install or configure Maven on their machines. |

---

## 3. Folder & File Guide

Below is the layout of the repository and what each folder and file does:

```
BMS/
├── backend/                       # Java Spring Boot REST API
│   ├── src/main/java/com/society360/
│   │   ├── config/                # Security rules, CORS settings, initial admin setup
│   │   ├── controller/            # API endpoints receiving requests from the frontend
│   │   ├── domain/                # Database models (Entities) representing business data
│   │   ├── dto/                   # Data Transfer Objects (clean input/output shapes)
│   │   ├── exception/             # Central error handlers that return neat JSON error messages
│   │   ├── repository/            # Spring Data interfaces for querying the database
│   │   ├── security/              # JWT filters, password encoders, and multi-tenant isolation
│   │   ├── service/               # Core business logic and calculations
│   │   └── Society360Application.java # The main entry point that boots up the Spring Boot app
│   ├── src/test/java/             # Automated test cases (Isolation, double-booking prevention)
│   ├── pom.xml                    # Maven configuration listing all backend dependencies
│   └── Dockerfile                 # Docker build recipe for packaging the backend
│
├── frontend/                      # React 18 + Vite + TypeScript web application
│   ├── src/
│   │   ├── components/            # Reusable UI parts (Navbar, Sidebar, MetricCard)
│   │   ├── context/               # AuthContext managing user login session across pages
│   │   ├── pages/                 # Full web screens grouped neatly by user role
│   │   │   ├── public/            # Public website (Landing Page, Register Society)
│   │   │   ├── auth/              # Sign In (/login) and Resident Sign Up (/register)
│   │   │   ├── superadmin/        # Platform governance, applications, audit logs
│   │   │   ├── admin/             # Society management, flats, resident KYC, finances
│   │   │   ├── resident/          # Visitor passes, maintenance dues, complaints
│   │   │   ├── guard/             # Gate check-in/out scanner for security guards
│   │   │   ├── staff/             # Maintenance worker ticket task board
│   │   │   ├── facilities/        # Amenity slot booking with anti-double-booking guard
│   │   │   └── notices/           # Society broadcast bulletin board
│   │   ├── routes/                # ProtectedRoute checking user permissions before viewing a page
│   │   ├── services/api.ts        # Central Axios client sending requests to http://localhost:8080/api/v1
│   │   ├── types/index.ts         # TypeScript definitions for Users, Societies, Flats, Complaints
│   │   ├── App.tsx                # Main router mapping URLs to specific pages
│   │   └── main.tsx               # Frontend startup file rendering the React root
│   ├── package.json               # Frontend dependencies and npm scripts
│   ├── vite.config.ts             # Vite development server configuration
│   └── Dockerfile & nginx.conf    # Production Nginx setup for containerized deployment
│
├── database/                      # Relational database setup
│   └── migrations/
│       └── V1__init_schema.sql    # The complete PostgreSQL schema with all tables and foreign keys
│
├── docker/                        # Multi-container orchestration
│   └── docker-compose.yml         # Starts PostgreSQL, Backend, and Frontend together
│
└── docs/                          # Comprehensive technical blueprints and viva guides
    ├── 01_PRODUCT_REQUIREMENTS_DOCUMENT.md
    ├── 02_SYSTEM_ARCHITECTURE.md
    ├── 03_DATABASE_ERD_AND_SCHEMA.md
    ├── 04_ROLE_BASED_ACCESS_CONTROL_MATRIX.md
    ├── 05_API_DEVELOPMENT_PLAN.md
    ├── 06_IMPLEMENTATION_ROADMAP.md
    ├── SOCIETY360_MASTER_TECHNICAL_BLUEPRINT.md
    └── VIVA_AND_EVALUATION_GUIDE.md
```

### Key Backend Groups Explained
- **Controllers (`backend/.../controller/`):** The reception desk of the backend. They listen for HTTP requests (like `POST /api/v1/complaints` or `GET /api/v1/properties/hierarchy`), validate incoming data, call the appropriate Service, and return the response.
- **Services (`backend/.../service/`):** The brain of the application. All business rules live here (for example: checking if a resident has already booked a facility slot, calculating overdue maintenance fees, or generating visitor pass codes).
- **Repositories (`backend/.../repository/`):** The data fetchers. These interfaces talk directly to the database using Spring Data JPA. Every society query automatically includes `WHERE society_id = :currentSocietyId` to prevent data leaks.
- **Domain Entities (`backend/.../domain/`):** The blueprints for our database tables (such as `Society`, `UserAccount`, `Flat`, `Complaint`, `Invoice`, `VisitorEntry`).
- **Security & Multi-Tenancy (`backend/.../security/`):** Contains `TenantContextFilter` and `TenantContextHolder`. They inspect every incoming JWT token, read the user's `society_id`, and safely hold it for the duration of that request.

---

## 4. How Everything Connects (The Big Picture)

Here is a step-by-step walkthrough of what happens when a user clicks a button in the browser (for example, booking a clubhouse amenity or viewing their flats):

```mermaid
flowchart TD
    User["👤 Resident / User clicks in React UI"] -->|1. HTTP Request with Bearer JWT| Axios["Frontend Axios Client (api.ts)"]
    Axios -->|2. POST /api/v1/facilities/book| SpringSec["Spring Security & JwtAuthenticationFilter"]
    SpringSec -->|3. Validate Token Signature| TenantFilter["TenantContextFilter"]
    TenantFilter -->|4. Store society_id safely| ThreadLocal["TenantContextHolder (ThreadLocal)"]
    ThreadLocal -->|5. Forward request| Controller["FacilityController"]
    Controller -->|6. Run business validation| Service["FacilityServiceImpl"]
    Service -->|7. Query with tenant filter| Repository["FacilityBookingRepository"]
    Repository -->|8. SELECT / INSERT WHERE society_id = :id| Database[("Database (PostgreSQL / H2)")]
    Database -->|9. Clean isolated data returned| Service
    Service -->|10. Formatted DTO response| Controller
    Controller -->|11. JSON Response (HTTP 200 OK)| User
```

### The 5 Simple Steps:
1. **Frontend Action:** A user clicks a button on the React page. The Axios client automatically takes the user's saved JWT login token and attaches it to the request header (`Authorization: Bearer <token>`).
2. **Security Check (Spring Security):** The backend receives the request. `JwtAuthenticationFilter` checks if the token is valid, has not expired, and has not been tampered with.
3. **Tenant Isolation (Multi-Tenancy Guard):** `TenantContextFilter` extracts the user's `society_id` from the secure token and stores it in `TenantContextHolder`.
   > **What is ThreadLocal?**  
   > `ThreadLocal` is a secure memory pocket in Java that keeps variables isolated to the specific thread handling that user's request, guaranteeing that one user's data can never accidentally mix into another user's request.
4. **Business Logic (Service Layer):** The controller passes the data to the service layer. The service performs checks—such as ensuring no other resident booked that exact facility at that exact time.
5. **Database Execution & Safe Return:** The repository executes the query, strictly including the `society_id`. The database returns the matching record, which flows back to the frontend as a clean JSON response.

---

## 5. How to Run Locally (Step-by-Step)

You can run Society360 on any computer using either **Option 1 (Fast Dev Mode with H2)** or **Option 2 (Full Docker Mode with PostgreSQL)**.

### Prerequisites
Make sure you have installed on your machine:
- **Java 21 LTS** (`java -version`)
- **Node.js 18+ & npm** (`node -v` and `npm -v`)
- **Docker Desktop** (Optional, only needed if you want to run PostgreSQL via Docker)

---

### Option 1: Fast Local Dev (Recommended — Zero-Config In-Memory H2)

This mode requires **no database setup**. The backend automatically uses an in-memory database with the default Super Admin account pre-configured.

#### Step 1: Start the Spring Boot Backend
Open a terminal in the project root:
```bash
# Move into backend directory
cd backend

# On Windows PowerShell / Command Prompt:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```
- **Backend API Base:** `http://localhost:8080`
- **Interactive Swagger API Docs:** `http://localhost:8080/swagger-ui.html`
- **H2 Web Console:** `http://localhost:8080/h2-console`  
  *(JDBC URL: `jdbc:h2:mem:society360`, Username: `sa`, Password: leave blank)*

#### Step 2: Start the React Frontend
Open a **second** terminal window in the project root:
```bash
# Move into frontend directory
cd frontend

# Install node packages (only needed the first time)
npm install

# Start the local Vite development server
npm run dev
```
- **Web Application URL:** `http://localhost:3000`

---

### Option 2: Full Docker Deployment (Production PostgreSQL 16)

To start the full stack (PostgreSQL database + Spring Boot backend + React frontend) in isolated Docker containers:

```bash
# From the project root directory
docker-compose -f docker/docker-compose.yml up --build
```

To run in the background (detached mode):
```bash
docker-compose -f docker/docker-compose.yml up --build -d
```

To stop all containers:
```bash
docker-compose -f docker/docker-compose.yml down
```

---

### Default Platform Credentials

When the backend starts on a fresh database, it automatically creates the root **Platform Super Administrator**:

| Field | Value | Notes |
|---|---|---|
| **Login URL** | `http://localhost:3000/login` | Sign in here |
| **Email** | `superadmin@society360.com` | Configurable in `application.yml` |
| **Password** | `Admin@12345` | Configurable via `SUPERADMIN_PASSWORD` |
| **Role** | `PLATFORM_SUPER_ADMIN` | Has global platform control |

#### How to onboard a new society from scratch:
1. Go to `http://localhost:3000/register-society` and submit a new society application.
2. Sign in as the Super Admin (`superadmin@society360.com` / `Admin@12345`).
3. Open **Society Applications** in the Super Admin dashboard and click **Approve**.
4. The new society workspace is created, and the Society Admin can now log in to set up wings, flats, and staff!
5. Residents can sign up at `http://localhost:3000/register` to join their flat.

---

### Running Automated Tests

To run the automated security and isolation test suite:

```bash
cd backend

# On Windows:
.\mvnw.cmd test

# On Linux / macOS:
./mvnw test
```

#### What these tests verify:
1. **`testTenantContextLifecycle`:** Proves that the tenant memory pocket (`ThreadLocal`) sets, retrieves, and completely wipes tenant information so nothing lingers between requests.
2. **`testCrossTenantFlatIsolation`:** Creates flats under Society A and Society B, runs queries under Society A's credentials, and verifies that **Society B's flats are never leaked**.
3. **`testAntiDoubleBookingOverlapDetection`:** Simulates two residents booking the clubhouse for the same time window and proves that the second booking is automatically rejected with an `HTTP 409 Conflict`.

---

## 6. Key Docs Reference

Detailed documentation and viva defense guides are stored inside the `docs/` folder:

| Document | Link | 1-Line Plain-English Summary |
|---|---|---|
| **01. Product Requirements** | [01_PRODUCT_REQUIREMENTS_DOCUMENT.md](docs/01_PRODUCT_REQUIREMENTS_DOCUMENT.md) | Explains the real-world residential problems Society360 solves and its core features. |
| **02. System Architecture** | [02_SYSTEM_ARCHITECTURE.md](docs/02_SYSTEM_ARCHITECTURE.md) | High-level diagram and explanation of how the frontend, backend, security, and database communicate. |
| **03. Database ERD & Schema** | [03_DATABASE_ERD_AND_SCHEMA.md](docs/03_DATABASE_ERD_AND_SCHEMA.md) | Entity relationship diagrams and table schemas showing how flats, users, and societies connect. |
| **04. RBAC Permission Matrix** | [04_ROLE_BASED_ACCESS_CONTROL_MATRIX.md](docs/04_ROLE_BASED_ACCESS_CONTROL_MATRIX.md) | A complete spreadsheet-style matrix detailing what each of the 7 user roles can and cannot do. |
| **05. API Development Plan** | [05_API_DEVELOPMENT_PLAN.md](docs/05_API_DEVELOPMENT_PLAN.md) | The full list of all 35+ backend REST API routes, request bodies, and JSON responses. |
| **06. Implementation Roadmap** | [06_IMPLEMENTATION_ROADMAP.md](docs/06_IMPLEMENTATION_ROADMAP.md) | The step-by-step development phases followed to build this platform from start to finish. |
| **Master Technical Blueprint** | [SOCIETY360_MASTER_TECHNICAL_BLUEPRINT.md](docs/SOCIETY360_MASTER_TECHNICAL_BLUEPRINT.md) | The complete deep-dive architectural document covering cybersecurity, concurrency, and data models. |
| **Viva & Evaluation Guide** | [VIVA_AND_EVALUATION_GUIDE.md](docs/VIVA_AND_EVALUATION_GUIDE.md) | 15 common viva examiner questions & answers, live demo script, and defense cheat-sheet for professors. |

---

## Authors & Acknowledgments

- **Platform Architect & Engineering Team:** Society360 Contributors
- **Research Paper Reference:** *"A Multi-Tenant Digital Platform for Residential Society Management"*
- **Core Technologies:** Java 21, Spring Boot 3, React 18, Vite, TypeScript, Tailwind CSS, PostgreSQL 16, Docker.
