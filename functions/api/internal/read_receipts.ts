interface Env {
  DB?: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  try {
    const body = await request.json() as any;
    const { userId, roomId } = body;

    if (!userId || !roomId) return new Response('Missing required fields', { status: 400 });

    await env.DB.prepare(`
      INSERT INTO message_read_receipts (id, user_id, room_id, last_read_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, room_id) DO UPDATE SET last_read_at = CURRENT_TIMESTAMP
    `).bind(crypto.randomUUID(), userId, roomId).run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
