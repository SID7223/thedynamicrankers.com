interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (request.method === 'GET') {
    const taskIdRaw = url.searchParams.get('taskId');
    if (taskIdRaw === null) return new Response(JSON.stringify({ error: 'Missing taskId' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    const taskId = parseInt(taskIdRaw);

    try {
      if (!env.DB || typeof env.DB.prepare !== 'function') {
          return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }

      let query = 'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE ';
      query += taskId === 0 ? 'm.task_id IS NULL ' : 'm.task_id = ? ';
      query += 'ORDER BY m.timestamp ASC';

      const stmt = env.DB.prepare(query);
      const { results } = taskId === 0 ? await stmt.all() : await stmt.bind(taskId).all();

      const messages = (results || []) as any[];
      if (messages.length === 0) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });

      const messageIds = messages.map(m => m.id);
      const { results: reactions } = await env.DB.prepare(
        `SELECT r.*, u.name as user_name FROM message_reactions r JOIN users u ON r.user_id = u.id WHERE r.message_id IN (${messageIds.join(',')})`
      ).all();

      const messagesWithReactions = messages.map(m => ({
        ...m,
        reactions: ((reactions || []) as any[]).filter(r => r.message_id === m.id)
      }));

      return new Response(JSON.stringify(messagesWithReactions), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err: unknown) {
      console.error('Critical Chat GET Error:', err);
      return new Response(JSON.stringify({ error: 'GET_CHAT_FAILED', message: (err as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method === 'POST') {
    try {
      if (!env.DB || typeof env.DB.prepare !== 'function') {
        return new Response(JSON.stringify({ error: 'D1 Binding "DB" missing or inactive' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
      }

      const body = await request.json() as any;
      const { action } = body;

      if (action === 'SEND') {
        const taskId = body.taskId === 0 ? null : body.taskId;
        await env.DB.prepare(
          'INSERT INTO messages (task_id, sender_id, content) VALUES (?, ?, ?)'
        ).bind(taskId, body.senderId || 1, body.content || '').run();
        return new Response(JSON.stringify({ success: true }), { status: 201, headers: { 'Content-Type': 'application/json' } });
      }

      if (action === 'REACT') {
        await env.DB.prepare(
          'INSERT OR REPLACE INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)'
        ).bind(body.messageId, body.userId || 1, body.emoji).run();
        return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (err: unknown) {
      console.error('Critical Chat POST Error:', err);
      return new Response(JSON.stringify({ error: 'POST_CHAT_FAILED', message: (err as Error).message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
};
