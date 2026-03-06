-- Industry-Level Database Schema Blueprint (Cloudflare D1 / SQLite)
-- Optimized for Messaging, Tasks, CRM, and AI Integration.

PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'superuser', 'operative', 'viewer')) DEFAULT 'operative',
    timezone_preference TEXT DEFAULT 'Asia/Karachi',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY, -- UUID
    task_number TEXT UNIQUE NOT NULL, -- e.g., TASK-101
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('backlog', 'todo', 'in_progress', 'review', 'done')) DEFAULT 'todo',
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    created_by TEXT NOT NULL,
    assigned_to TEXT,
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- 3. Task Permissions Table (Extended Access)
CREATE TABLE IF NOT EXISTS task_permissions (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    permission_level TEXT CHECK(permission_level IN ('viewer', 'contributor', 'admin')) DEFAULT 'contributor',
    granted_by TEXT NOT NULL,
    granted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (granted_by) REFERENCES users(id),
    UNIQUE(task_id, user_id)
);

-- 4. Chat Rooms Table
CREATE TABLE IF NOT EXISTS chat_rooms (
    id TEXT PRIMARY KEY, -- UUID
    type TEXT CHECK(type IN ('task', 'global', 'direct')) NOT NULL,
    task_id TEXT UNIQUE, -- Null if global/direct
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY, -- UUID
    room_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    parent_message_id TEXT, -- For threading
    message_content TEXT NOT NULL,
    message_type TEXT CHECK(message_type IN ('text', 'image', 'audio', 'gif', 'emoji', 'system')) DEFAULT 'text',
    edited BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id),
    FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 6. Message Attachments Table
CREATE TABLE IF NOT EXISTS message_attachments (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL, -- in bytes
    file_name TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 7. Message Mentions Table
CREATE TABLE IF NOT EXISTS message_mentions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    mentioned_user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (mentioned_user_id) REFERENCES users(id)
);

-- 8. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL, -- task_access, mention, reply, status_change
    reference_id TEXT, -- ID of the related task or message
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Task Access Requests Table
CREATE TABLE IF NOT EXISTS task_access_requests (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    requesting_user_id TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'approved', 'rejected')) DEFAULT 'pending',
    approved_by TEXT,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    approved_at DATETIME,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (requesting_user_id) REFERENCES users(id),
    FOREIGN KEY (approved_by) REFERENCES users(id)
);

-- 10. CRM Customers Table
CREATE TABLE IF NOT EXISTS crm_customers (
    id TEXT PRIMARY KEY, -- UUID
    name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    notes TEXT,
    sales_stage TEXT CHECK(sales_stage IN ('Discovery', 'Trial', 'Presentation', 'Paperwork', 'Checkout', 'Closed')) DEFAULT 'Discovery',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 11. CRM Invoices Table
CREATE TABLE IF NOT EXISTS crm_invoices (
    id TEXT PRIMARY KEY, -- UUID
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('invoice_created', 'sent', 'payment_received')) DEFAULT 'invoice_created',
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- 12. CRM Appointments Table
CREATE TABLE IF NOT EXISTS crm_appointments (
    id TEXT PRIMARY KEY, -- UUID
    customer_id TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    appointment_date TEXT NOT NULL, -- ISO date
    appointment_time TEXT NOT NULL, -- HH:MM
    status TEXT CHECK(status IN ('scheduled', 'completed')) DEFAULT 'scheduled',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- 13. Message Search Index (FTS5)
CREATE VIRTUAL TABLE IF NOT EXISTS message_search_index USING fts5(
    message_id UNINDEXED,
    room_id UNINDEXED,
    content
);

-- 14. Triggers for FTS5
CREATE TRIGGER IF NOT EXISTS after_message_insert AFTER INSERT ON messages BEGIN
    INSERT INTO message_search_index(message_id, room_id, content)
    VALUES (new.id, new.room_id, new.message_content);
END;

CREATE TRIGGER IF NOT EXISTS after_message_update AFTER UPDATE ON messages BEGIN
    UPDATE message_search_index SET content = new.message_content
    WHERE message_id = old.id;
END;

CREATE TRIGGER IF NOT EXISTS after_message_delete AFTER DELETE ON messages BEGIN
    DELETE FROM message_search_index WHERE message_id = old.id;
END;

-- 15. Seed Initial Superusers
-- Note: UUIDs generated for the seed users
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
('u_001', 'SID', 'saadumar7223@gmail.com', '123456', 'superuser'),
('u_002', 'Eric', 'eric@thedynamicrankers.com', '123456', 'superuser');

-- 16. Initialize Global Chat Room
INSERT OR IGNORE INTO chat_rooms (id, type, task_id) VALUES ('global-room', 'global', NULL);
