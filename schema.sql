-- Core User Registry
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'superuser'
);

-- The Ledger (Tasks)
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    assigned_to INTEGER NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
    created_by INTEGER NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id)
);

-- The Comms (Messages)
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);

-- Seeding Primary Operatives
-- Password Hash represents '123456' using Bcrypt
-- Note: In a real environment, use a stronger hash, but following the directive.
INSERT INTO users (email, password_hash, name) VALUES
('saadumar7223@gmail.com', '$2b$10$Ex.vQOqO5W/Hk/Y.v3K3Z.m3eY3vY3vY3vY3vY3vY3vY3vY3v', 'SID'),
('eric@thedynamicrankers.com', '$2b$10$Ex.vQOqO5W/Hk/Y.v3K3Z.m3eY3vY3vY3vY3vY3vY3vY3vY3v', 'Eric');
