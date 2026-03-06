interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'GET') {
    const roomId = url.searchParams.get('roomId');
    if (!roomId) return new Response('Missing roomId', { status: 400 });

    try {
      const { results } = await env.DB.prepare(`
        SELECT u.id, u.name, u.role, rm.joined_at
        FROM users u
        JOIN chat_room_members rm ON u.id = rm.user_id
        WHERE rm.room_id = ?
        ORDER BY u.name ASC
      `).bind(roomId).all();
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const { roomId, userId } = await request.json() as { roomId: string; userId: string };
      await env.DB.prepare(
        'INSERT OR IGNORE INTO chat_room_members (id, room_id, user_id) VALUES (?, ?, ?)'
      ).bind(crypto.randomUUID(), roomId, userId).run();
      return new Response(JSON.stringify({ success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    const roomId = url.searchParams.get('roomId');
    const userId = url.searchParams.get('userId');
    if (!roomId || !userId) return new Response('Missing params', { status: 400 });

    try {
      await env.DB.prepare(
        'DELETE FROM chat_room_members WHERE room_id = ? AND user_id = ?'
      ).bind(roomId, userId).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
