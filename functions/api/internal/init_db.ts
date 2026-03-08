interface Env {
  DB?: D1Database;
}

export const onRequestPost = async (context: { env: Env }) => {
  const { env } = context;
  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  const schema = `
-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
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
    id TEXT PRIMARY KEY,
    task_number TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('backlog', 'todo', 'in_progress', 'review', 'done')) DEFAULT 'todo',
    priority TEXT CHECK(priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium',
    created_by TEXT NOT NULL,
    assigned_to TEXT,
    due_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (created_by) REFERENCES users(id),
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- 3. Task Permissions Table
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
    id TEXT PRIMARY KEY,
    type TEXT CHECK(type IN ('task', 'global', 'direct')) NOT NULL,
    task_id TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 5. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    parent_message_id TEXT,
    message_content TEXT NOT NULL,
    message_type TEXT CHECK(message_type IN ('text', 'image', 'audio', 'gif', 'emoji', 'system')) DEFAULT 'text',
    edited BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
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
    file_size INTEGER NOT NULL,
    file_name TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 7. Message Edits Table
CREATE TABLE IF NOT EXISTS message_edits (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    old_content TEXT NOT NULL,
    edited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- 8. Chat Room Members
CREATE TABLE IF NOT EXISTS chat_room_members (
    id TEXT PRIMARY KEY,
    room_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(room_id, user_id)
);

-- 9. Message Mentions (Users)
CREATE TABLE IF NOT EXISTS message_mentions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    mentioned_user_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (mentioned_user_id) REFERENCES users(id)
);

-- 10. Message Task Mentions
CREATE TABLE IF NOT EXISTS message_task_mentions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    task_id TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    reference_id TEXT,
    message TEXT NOT NULL,
    read_status BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 12. Task Access Requests Table
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

-- 13. CRM Customers Table
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

-- 14. CRM Invoices Table
CREATE TABLE IF NOT EXISTS crm_invoices (
    id TEXT PRIMARY KEY,
    customer_id TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    status TEXT CHECK(status IN ('invoice_created', 'sent', 'payment_received')) DEFAULT 'invoice_created',
    invoice_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- 15. CRM Appointments Table
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
    is_archived BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (customer_id) REFERENCES crm_customers(id) ON DELETE CASCADE
);

-- 18. Task Assignees Table
CREATE TABLE IF NOT EXISTS task_assignees (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(task_id, user_id)
);

-- 19. Task Attachments Table
CREATE TABLE IF NOT EXISTS task_attachments (
    id TEXT PRIMARY KEY,
    task_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    file_url TEXT NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
);

-- 23. Message Reactions Table
CREATE TABLE IF NOT EXISTS message_reactions (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(message_id, user_id, emoji)
);

-- 24. User Favorite Emojis Table
CREATE TABLE IF NOT EXISTS user_favorite_emojis (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    emoji TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, emoji)
);

-- 25. Message Read Receipts Table
CREATE TABLE IF NOT EXISTS message_read_receipts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    room_id TEXT NOT NULL,
    last_read_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE,
    UNIQUE(user_id, room_id)
);
`;

  try {
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const sql of statements) {
        await env.DB.prepare(sql).run();
    }

    // Seed initial superusers if they don't exist
    await env.DB.prepare(`
      INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES
      ('u_001', 'SID', 'saadumar7223@gmail.com', '123456', 'superuser'),
      ('u_002', 'Eric', 'eric@thedynamicrankers.com', '123456', 'superuser')
    `).run();

    // Initialize Global Chat Room if it doesn't exist
    await env.DB.prepare("INSERT OR IGNORE INTO chat_rooms (id, type, task_id) VALUES ('global-room', 'global', NULL)").run();

    // Seed Initial Members for Global Room
    await env.DB.prepare("INSERT OR IGNORE INTO chat_room_members (id, room_id, user_id) VALUES ('mem_001', 'global-room', 'u_001')").run();
    await env.DB.prepare("INSERT OR IGNORE INTO chat_room_members (id, room_id, user_id) VALUES ('mem_002', 'global-room', 'u_002')").run();

    return new Response(JSON.stringify({ success: true, message: 'Database schema verified/initialized safely.' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
