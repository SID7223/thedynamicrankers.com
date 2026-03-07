interface Env {
  DB?: D1Database;
}

const jsonResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { 'Content-Type': 'application/json' }
});

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return jsonResponse({ error: 'DB binding missing' }, 503);

  try {
    if (request.method === 'POST') {
      const { messageId, userId, emoji } = await request.json() as any;
      if (!messageId || !userId || !emoji) return jsonResponse({ error: 'Missing required fields' }, 400);

      const existing = await env.DB.prepare(
        'SELECT id FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?'
      ).bind(messageId, userId, emoji).first();

      if (existing) {
        await env.DB.prepare(
          'DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?'
        ).bind(messageId, userId, emoji).run();
      } else {
        try {
            await env.DB.prepare(
              'INSERT INTO message_reactions (id, message_id, user_id, emoji) VALUES (?, ?, ?, ?)'
            ).bind(crypto.randomUUID(), messageId, userId, emoji).run();
        } catch (err: any) {
            return jsonResponse({ error: 'REACTION_INSERT_FAILED', message: err.message, detail: 'Ensure messageId and userId exist in their respective tables.' }, 500);
        }
      }

      return jsonResponse({ success: true });
    }

    if (request.method === 'GET') {
      const userId = url.searchParams.get('userId');
      if (!userId) return jsonResponse({ error: 'Missing userId' }, 400);
      const { results } = await env.DB.prepare('SELECT emoji FROM user_favorite_emojis WHERE user_id = ?').bind(userId).all();
      return jsonResponse(results.map((r: any) => r.emoji));
    }

    if (request.method === 'PUT') {
      const { userId, emoji } = await request.json() as any;
      if (!userId || !emoji) return jsonResponse({ error: 'Missing required fields' }, 400);
      try {
          await env.DB.prepare('INSERT OR IGNORE INTO user_favorite_emojis (id, user_id, emoji) VALUES (?, ?, ?)').bind(crypto.randomUUID(), userId, emoji).run();
      } catch (err: any) {
          return jsonResponse({ error: 'FAVORITE_INSERT_FAILED', message: err.message }, 500);
      }
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
};
