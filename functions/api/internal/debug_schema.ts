interface Env {
  DB?: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: 'DB binding missing' }), { status: 503, headers: { 'Content-Type': 'application/json' } });

  const tablesToCheck = [
    'users', 'tasks', 'task_permissions', 'chat_rooms', 'messages',
    'message_attachments', 'message_edits', 'chat_room_members',
    'message_mentions', 'message_task_mentions', 'notifications',
    'task_access_requests', 'crm_customers', 'crm_invoices',
    'crm_appointments', 'task_assignees', 'task_attachments',
    'message_reactions', 'user_favorite_emojis', 'message_read_receipts'
  ];

  const report: Record<string, any> = {
    status: 'checking_tables',
    tables: {}
  };

  for (const table of tablesToCheck) {
    try {
      const result = await env.DB.prepare(`SELECT count(*) as count FROM ${table}`).first();
      report.tables[table] = { exists: true, count: result?.count };
    } catch (err: any) {
      report.tables[table] = { exists: false, error: err.message };
    }
  }

  // Also try to get SQLite version or other info if allowed
  try {
      const version = await env.DB.prepare('SELECT sqlite_version()').first();
      report.sqlite_version = version;
  } catch (e) {}

  return new Response(JSON.stringify(report, null, 2), {
    headers: { 'Content-Type': 'application/json' }
  });
};
