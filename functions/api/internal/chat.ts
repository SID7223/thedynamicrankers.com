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

    if (taskId === null) return new Response('Missing taskId', { status: 400 });

    try {
      // Get messages with read status and attachments
      const { results } = await env.DB.prepare(`
        SELECT m.*, u.name as sender_name,
        (SELECT COUNT(*) FROM message_reads mr WHERE mr.message_id = m.id AND mr.user_id != m.sender_id) as read_count,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', ma.id, 'name', ma.file_name, 'type', ma.file_type, 'url', ma.file_url)) FROM attachments ma WHERE ma.message_id = m.id) as attachments
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.task_id ${taskId === '0' ? 'IS NULL' : '= ?'}
        ORDER BY m.timestamp ASC
      `).bind(...(taskId === '0' ? [] : [taskId])).all();

      const processedResults = results.map((r: any) => ({
        ...r,
        attachments: JSON.parse(r.attachments || '[]')
      }));

      return new Response(JSON.stringify(processedResults), { headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as any;

      // We use a transaction or serial prepares
      const result = await env.DB.prepare(
        'INSERT INTO messages (task_id, sender_id, content) VALUES (?, ?, ?)'
      ).bind(
        body.taskId === 0 ? null : body.taskId,
        body.senderId,
        body.content || ''
      ).run();

      const newMessageId = result.meta.last_row_id;

      // Auto-mark as read by sender
      await env.DB.prepare('INSERT INTO message_reads (message_id, user_id) VALUES (?, ?)').bind(newMessageId, body.senderId).run();

      // Handle attachments
      if (body.attachments && Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          await env.DB.prepare(
            'INSERT INTO attachments (message_id, file_name, file_type, file_size, file_url) VALUES (?, ?, ?, ?, ?)'
          ).bind(
            newMessageId,
            att.name,
            att.type,
            att.size || 0,
            att.url // Base64 or Blob reference
          ).run();
        }
      }

      return new Response(JSON.stringify({ id: newMessageId, success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
