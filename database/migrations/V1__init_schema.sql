-- ============================================================================
-- Society360 Database Schema Migration V1
-- Target Database: PostgreSQL 16
-- Multi-Tenancy Strategy: Shared Database with society_id Discriminator
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Societies
CREATE TABLE IF NOT EXISTS societies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(80) NOT NULL UNIQUE,
    address_line TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    pin_code VARCHAR(12) NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'ACTIVE',
    settings TEXT DEFAULT '{"billingCycle":"MONTHLY","lateFeePercentage":5.0,"visitorCurfew":"23:00"}',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_societies_status ON societies(status);
CREATE INDEX IF NOT EXISTS idx_societies_code ON societies(code);

-- 2. Society Applications
CREATE TABLE IF NOT EXISTS society_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_name VARCHAR(150) NOT NULL,
    registration_number VARCHAR(80) NOT NULL,
    address_line TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    state VARCHAR(80) NOT NULL,
    pin_code VARCHAR(12) NOT NULL,
    building_count INT NOT NULL,
    flat_count INT NOT NULL,
    applicant_name VARCHAR(100) NOT NULL,
    applicant_email VARCHAR(120) NOT NULL,
    applicant_phone VARCHAR(20) NOT NULL,
    document_url VARCHAR(255),
    status VARCHAR(35) NOT NULL DEFAULT 'PENDING',
    rejection_reason TEXT,
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_society_apps_status ON society_applications(status);

-- 3. User Accounts
CREATE TABLE IF NOT EXISTS user_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID REFERENCES societies(id) ON DELETE RESTRICT,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(35) NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'ACTIVE',
    avatar_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_society_id ON user_accounts(society_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON user_accounts(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON user_accounts(role);

-- 4. Refresh Tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

-- 5. Buildings
CREATE TABLE IF NOT EXISTS buildings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name VARCHAR(80) NOT NULL,
    total_floors INT NOT NULL DEFAULT 1,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_society_building UNIQUE (society_id, name)
);

CREATE INDEX IF NOT EXISTS idx_buildings_society_id ON buildings(society_id);

-- 6. Wings
CREATE TABLE IF NOT EXISTS wings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    name VARCHAR(30) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_building_wing UNIQUE (building_id, name)
);

CREATE INDEX IF NOT EXISTS idx_wings_society_id ON wings(society_id);
CREATE INDEX IF NOT EXISTS idx_wings_building_id ON wings(building_id);

-- 7. Flats
CREATE TABLE IF NOT EXISTS flats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    building_id UUID NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
    wing_id UUID NOT NULL REFERENCES wings(id) ON DELETE CASCADE,
    flat_number VARCHAR(30) NOT NULL,
    floor_number INT NOT NULL,
    flat_type VARCHAR(30) NOT NULL,
    square_feet NUMERIC(8,2) NOT NULL,
    occupancy_status VARCHAR(30) NOT NULL DEFAULT 'VACANT',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_wing_flat UNIQUE (wing_id, flat_number)
);

CREATE INDEX IF NOT EXISTS idx_flats_society_id ON flats(society_id);
CREATE INDEX IF NOT EXISTS idx_flats_building_wing ON flats(building_id, wing_id);

-- 8. Occupancies
CREATE TABLE IF NOT EXISTS occupancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    occupancy_type VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    document_proof_url VARCHAR(255),
    rejection_reason TEXT,
    verified_by UUID REFERENCES user_accounts(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_occupancies_society ON occupancies(society_id);
CREATE INDEX IF NOT EXISTS idx_occupancies_flat_user ON occupancies(flat_id, user_id);

-- 9. Visitor Entries
CREATE TABLE IF NOT EXISTS visitor_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    visitor_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    purpose VARCHAR(100) NOT NULL,
    entry_type VARCHAR(30) NOT NULL,
    pass_code VARCHAR(10),
    status VARCHAR(30) NOT NULL DEFAULT 'EXPECTED',
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    guard_id UUID REFERENCES user_accounts(id),
    approved_by UUID REFERENCES user_accounts(id),
    vehicle_number VARCHAR(30),
    photo_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visitors_society_status ON visitor_entries(society_id, status);
CREATE INDEX IF NOT EXISTS idx_visitors_flat ON visitor_entries(flat_id);

-- 10. Complaints
CREATE TABLE IF NOT EXISTS complaints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    created_by UUID NOT NULL REFERENCES user_accounts(id),
    ticket_number VARCHAR(40) NOT NULL UNIQUE,
    title VARCHAR(150) NOT NULL,
    category VARCHAR(40) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'MEDIUM',
    description TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',
    photo_url VARCHAR(255),
    assigned_to UUID REFERENCES user_accounts(id),
    resolution_notes TEXT,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_complaints_society_status ON complaints(society_id, status);
CREATE INDEX IF NOT EXISTS idx_complaints_ticket ON complaints(ticket_number);

-- 11. Invoices
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    flat_id UUID NOT NULL REFERENCES flats(id) ON DELETE CASCADE,
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    billing_month VARCHAR(20) NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    late_fee NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    due_date DATE NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'UNPAID',
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_invoices_society_flat ON invoices(society_id, flat_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);

-- 12. Payments
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    paid_by UUID NOT NULL REFERENCES user_accounts(id),
    receipt_number VARCHAR(50) NOT NULL UNIQUE,
    amount_paid NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL,
    transaction_reference VARCHAR(100) NOT NULL UNIQUE,
    payment_status VARCHAR(25) NOT NULL DEFAULT 'SUCCESS',
    paid_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_payments_society_invoice ON payments(society_id, invoice_id);

-- 13. Facilities
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    booking_charge_per_hour NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    opening_time TIME NOT NULL,
    closing_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_facilities_society ON facilities(society_id);

-- 14. Facility Bookings
CREATE TABLE IF NOT EXISTS facility_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    facility_id UUID NOT NULL REFERENCES facilities(id) ON DELETE CASCADE,
    booked_by UUID NOT NULL REFERENCES user_accounts(id),
    flat_id UUID NOT NULL REFERENCES flats(id),
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status VARCHAR(25) NOT NULL DEFAULT 'CONFIRMED',
    total_cost NUMERIC(8,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bookings_facility_date ON facility_bookings(facility_id, booking_date, status);

-- 15. Notices
CREATE TABLE IF NOT EXISTS notices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID NOT NULL REFERENCES societies(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    notice_type VARCHAR(30) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'NORMAL',
    published_by UUID NOT NULL REFERENCES user_accounts(id),
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notices_society ON notices(society_id);

-- 16. Notice Reads
CREATE TABLE IF NOT EXISTS notice_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notice_id UUID NOT NULL REFERENCES notices(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES user_accounts(id) ON DELETE CASCADE,
    read_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_notice_user_read UNIQUE (notice_id, user_id)
);

-- 17. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    society_id UUID,
    user_id UUID,
    user_email VARCHAR(120),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id VARCHAR(100),
    ip_address VARCHAR(45),
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_society_action ON audit_logs(society_id, action);
