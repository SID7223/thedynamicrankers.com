/* eslint-disable @typescript-eslint/no-explicit-any */
interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'GET') {
    const taskId = url.searchParams.get('taskId');
    const userId = url.searchParams.get('userId');

    // taskId is required, can be 0 for global
    if (taskId === null) return new Response('Missing taskId', { status: 400 });

    try {
      // Get messages with read status for other users
      const { results } = await env.DB.prepare(`
        SELECT m.*, u.name as sender_name,
        (SELECT COUNT(*) FROM message_reads mr WHERE mr.message_id = m.id AND mr.user_id != m.sender_id) as read_count
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.task_id ${taskId === '0' ? 'IS NULL' : '= ?'}
        ORDER BY m.timestamp ASC
      `).bind(...(taskId === '0' ? [] : [taskId])).all();

      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const result = await env.DB.prepare(
        'INSERT INTO messages (task_id, sender_id, content) VALUES (?, ?, ?)'
      ).bind(
        body.taskId === 0 ? null : body.taskId,
        body.senderId,
        body.content
      ).run();

      const newMessageId = result.meta.last_row_id;

      // Auto-mark as read by sender
      await env.DB.prepare('INSERT INTO message_reads (message_id, user_id) VALUES (?, ?)').bind(newMessageId, body.senderId).run();

      return new Response(JSON.stringify({ id: newMessageId, success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
