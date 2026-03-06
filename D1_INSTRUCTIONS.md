# Cloudflare D1 Database Maintenance Instructions

To ensure your database is perfectly aligned with the latest dashboard updates, please run the following SQL commands in your Cloudflare D1 Console.

## 1. Standardize Attachments Table
If your database currently uses `message_attachments`, run this to rename it to `attachments`:

```sql
ALTER TABLE message_attachments RENAME TO attachments;
```

*Note: If the table 'attachments' already exists and has data, you may need to merge them manually.*

## 2. Ensure Column Consistency
If your `messages` table is missing the `timestamp` column (using `created_at` instead), or vice versa, the application now handles both via `COALESCE`. However, for best performance, ensure at least one exists:

```sql
-- Add timestamp if missing
-- ALTER TABLE messages ADD COLUMN timestamp DATETIME DEFAULT CURRENT_TIMESTAMP;
```

## 3. Verify Constraints
Ensure your `messages` table allows `task_id` to be NULL for Global Communications:

```sql
-- This is usually the default, but you can check via:
-- PRAGMA table_info(messages);
```

## 4. Summary of Tables
Your database should contain these core tables for the internal dashboard:
- `users`
- `tasks`
- `messages`
- `attachments`
- `message_reads`
- `message_reactions`

You can verify your current tables with:
```sql
SELECT name FROM sqlite_master WHERE type='table';
```
