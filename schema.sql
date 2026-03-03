-- Core User Registry
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'superuser'
);

-- The Ledger (Tasks)
-- assigned_to is NULL for unassigned tasks
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER,
    due_date DATETIME,
    status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id),
    FOREIGN KEY (created_by) REFERENCES users(id)
);

-- The Comms (Messages)
-- task_id is NULL for Global Command Feed
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Slack-Style Reactions
CREATE TABLE message_reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    message_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    emoji TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(message_id, user_id, emoji)
);

-- Seeding Primary Operatives
INSERT INTO users (email, password_hash, name) VALUES
('saadumar7223@gmail.com', '$2b$10$Ex.vQOqO5W/Hk/Y.v3K3Z.m3eY3vY3vY3vY3vY3vY3vY3vY3v', 'SID'),
('eric@thedynamicrankers.com', '$2b$10$Ex.vQOqO5W/Hk/Y.v3K3Z.m3eY3vY3vY3vY3vY3vY3vY3vY3v', 'Eric');
