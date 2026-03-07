interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'POST') {
    try {
      const { messageId, userId, emoji } = await request.json() as any;

      // Toggle logic: If exists, delete. Otherwise, insert.
      const existing = await env.DB.prepare(
        'SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?'
      ).bind(messageId, userId, emoji).first();

      if (existing) {
        await env.DB.prepare(
          'DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?'
        ).bind(messageId, userId, emoji).run();
      } else {
        await env.DB.prepare(
          'INSERT INTO message_reactions (id, message_id, user_id, emoji) VALUES (?, ?, ?, ?)'
        ).bind(crypto.randomUUID(), messageId, userId, emoji).run();
      }

      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  // GET user favorites
  if (request.method === 'GET') {
     const userId = url.searchParams.get('userId');
     if (!userId) return new Response('Missing userId', { status: 400 });
     const { results } = await env.DB.prepare('SELECT emoji FROM user_favorite_emojis WHERE user_id = ?').bind(userId).all();
     return new Response(JSON.stringify(results.map((r: any) => r.emoji)));
  }

  // PUT favorite
  if (request.method === 'PUT') {
      const { userId, emoji } = await request.json() as any;
      await env.DB.prepare('INSERT OR IGNORE INTO user_favorite_emojis (id, user_id, emoji) VALUES (?, ?, ?)').bind(crypto.randomUUID(), userId, emoji).run();
      return new Response(JSON.stringify({ success: true }));
  }

  return new Response('Method Not Allowed', { status: 405 });
};
