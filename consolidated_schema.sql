-- Consolidated Schema for dr-command-center
-- Ensures compatibility between CRM (UUIDs) and Core System (Integers)

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'superuser'
);

-- 2. Tasks table
CREATE TABLE IF NOT EXISTS tasks (
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

-- 3. Messages table
CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- 4. Message attachments table
CREATE TABLE IF NOT EXISTS message_attachments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 5. Message reads table
CREATE TABLE IF NOT EXISTS message_reads (
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (message_id, user_id),
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 6. CRM Customers table (TEXT IDs for UUIDs)
CREATE TABLE IF NOT EXISTS crm_customers (
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

-- 7. CRM Invoices table (TEXT IDs for UUIDs)
CREATE TABLE IF NOT EXISTS crm_invoices (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('invoice_created', 'sent', 'payment_received')) DEFAULT 'invoice_created',
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- 8. CRM Appointments table (TEXT IDs for UUIDs)
CREATE TABLE IF NOT EXISTS crm_appointments (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    appointment_date TEXT NOT NULL,
    appointment_time TEXT NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'completed')) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- Seed Primary Operatives
INSERT OR IGNORE INTO users (id, email, password_hash, name, role) VALUES
(1, 'saadumar7223@gmail.com', '123456', 'SID', 'superuser'),
(2, 'eric@thedynamicrankers.com', '123456', 'Eric', 'superuser');
