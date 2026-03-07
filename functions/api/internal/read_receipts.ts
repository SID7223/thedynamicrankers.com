interface Env {
  DB?: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  try {
    const { userId, roomId } = await request.json() as any;
    if (!env.DB) return new Response('DB binding missing', { status: 503 });

    await env.DB.prepare(`
      INSERT INTO message_read_receipts (id, user_id, room_id, last_read_at)
      VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(user_id, room_id) DO UPDATE SET last_read_at = CURRENT_TIMESTAMP
    `).bind(crypto.randomUUID(), userId, roomId).run();

    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
