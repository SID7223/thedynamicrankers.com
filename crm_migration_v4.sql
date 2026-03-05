-- Migration v4: Structured Task Management
-- Add priority and update status possibilities

-- Since SQLite doesn't support ALTER TABLE DROP CONSTRAINT, we recreate the table to update the CHECK constraint and add the priority column.
-- First, rename the old table
ALTER TABLE tasks RENAME TO tasks_old;

-- Create the new table with updated constraints and new priority column
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

-- Migrating data from the old table
-- Mapping: 'pending' -> 'todo', 'completed' -> 'done'
INSERT INTO tasks (id, title, description, assigned_to, due_date, status, created_by, created_at)
SELECT id, title, description, assigned_to, due_date,
       CASE WHEN status = 'completed' THEN 'done' ELSE 'todo' END,
       created_by, created_at
FROM tasks_old;

-- Drop the old table
DROP TABLE tasks_old;
