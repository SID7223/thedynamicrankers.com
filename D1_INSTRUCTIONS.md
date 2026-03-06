# Cloudflare D1 Database Maintenance Instructions

To ensure your database is perfectly aligned with the latest dashboard updates and to resolve all "INVALID DATE" or syncing errors, please follow this "Flush & Rebuild" procedure.

## ⚠️ WARNING
This procedure will delete all existing data in your Command Center database. Since we are in the testing phase, this is the recommended way to ensure a perfectly clean schema.

## Instructions

1.  Open your **Cloudflare Dashboard**.
2.  Navigate to **Workers & Pages** > **D1**.
3.  Select your database (e.g., `dr-command-center`).
4.  Click on the **Console** tab.
5.  Copy and paste the entire content of the `FINAL_DATABASE_CLEANUP.sql` file (located in your repository root) into the console.
6.  Click **Execute**.

## What this fixes:
1.  **Redundant Tables:** Removes `message_attachments` and consolidates everything into `attachments`.
2.  **Date Errors:** Standardizes on `timestamp` columns with default values, and ensures the backend uses `COALESCE` for backward compatibility.
3.  **Global Comms:** Correctly configures the `messages` table to allow `task_id` to be NULL, which is required for the "Strategic Comms" (Global) view.
4.  **UUID Support:** Ensures CRM tables (`crm_customers`, etc.) use TEXT primary keys for application-generated UUIDs.

## Verification
After execution, you can verify the tables by running:
```sql
SELECT name FROM sqlite_master WHERE type='table';
```

You should see: `users`, `tasks`, `messages`, `attachments`, `message_reads`, `crm_customers`, `crm_invoices`, and `crm_appointments`.
