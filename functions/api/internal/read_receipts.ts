interface Env {
  DB?: D1Database;
}

const jsonResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json' }
});

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  if (!env.DB) return jsonResponse({ error: 'DB binding missing' }, 503);

  try {
    const { userId, roomId } = await request.json() as any;
    if (!userId || !roomId) return jsonResponse({ error: 'Missing required fields' }, 400);

    try {
        await env.DB.prepare(`
          INSERT INTO message_read_receipts (id, user_id, room_id, last_read_at)
          VALUES (?, ?, ?, CURRENT_TIMESTAMP)
          ON CONFLICT(user_id, room_id) DO UPDATE SET last_read_at = CURRENT_TIMESTAMP
        `).bind(crypto.randomUUID(), userId, roomId).run();
    } catch (sqlErr: any) {
        return jsonResponse({ error: 'SQL_READ_RECEIPT_FAILED', message: sqlErr.message, hint: 'Ensure message_read_receipts table exists.' }, 500);
    }

    return jsonResponse({ success: true });
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
};
