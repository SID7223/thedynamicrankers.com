-- ====================================================================
-- DYNAMIC RANKERS - COMMAND CENTER FLUSH & REBUILD SCRIPT
-- WARNING: This will delete ALL existing data and recreate the schema.
-- ====================================================================

-- 1. DROP ALL EXISTING TABLES
DROP TABLE IF EXISTS message_reads;
DROP TABLE IF EXISTS message_reactions;
DROP TABLE IF EXISTS message_attachments; -- Remove redundant table
DROP TABLE IF EXISTS attachments;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS tasks;
DROP TABLE IF EXISTS crm_appointments;
DROP TABLE IF EXISTS crm_invoices;
DROP TABLE IF EXISTS crm_customers;
DROP TABLE IF EXISTS users;

-- 2. CREATE CLEAN SCHEMA

-- Core User Registry
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'superuser'
);

-- CRM: Customers (TEXT PK for UUIDs)
CREATE TABLE crm_customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    sales_stage TEXT CHECK(sales_stage IN ('Discovery', 'Trial', 'Presentation', 'Paperwork', 'Checkout', 'Closed')) DEFAULT 'Discovery',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CRM: Invoices
CREATE TABLE crm_invoices (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('invoice_created', 'sent', 'payment_received')) DEFAULT 'invoice_created',
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- CRM: Appointments
CREATE TABLE crm_appointments (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    customer_name TEXT,
    email TEXT,
    phone TEXT,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- Operations: The Ledger (Tasks)
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    due_date DATETIME,
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    status TEXT CHECK(status IN ('backlog', 'todo', 'in_progress', 'review', 'done')) DEFAULT 'todo',
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Operations: The Comms (Messages)
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER, -- NULL for Global Strategic Comms
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Messaging: Attachments
CREATE TABLE attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Messaging: Read Receipts
CREATE TABLE message_reads (
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3. SEED INITIAL DATA
INSERT INTO users (email, password_hash, name) VALUES
('saadumar7223@gmail.com', '123456', 'Saad Umar'),
('eric@thedynamicrankers.com', '123456', 'Eric William');
