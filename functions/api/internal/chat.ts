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
      // Robust query with fallbacks for timestamp/created_at and attachments table names
      const query = `
        SELECT m.*,
               COALESCE(m.timestamp, m.created_at) as timestamp,
               u.name as sender_name,
               (SELECT COUNT(*) FROM message_reads mr WHERE mr.message_id = m.id AND mr.user_id != m.sender_id) as read_count,
               COALESCE(
                 (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', ma.id, 'name', ma.file_name, 'type', ma.file_type, 'url', ma.file_url)) FROM attachments ma WHERE ma.message_id = m.id),
                 (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', ma.id, 'name', ma.file_name, 'type', ma.file_type, 'url', ma.file_url)) FROM message_attachments ma WHERE ma.message_id = m.id),
                 '[]'
               ) as attachments
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.task_id ${taskId === '0' ? 'IS NULL' : '= ?'}
        ORDER BY timestamp ASC
      `;

      const { results } = await env.DB.prepare(query).bind(...(taskId === '0' ? [] : [taskId])).all();

      const processedResults = results.map((r: any) => ({
        ...r,
        attachments: typeof r.attachments === 'string' ? JSON.parse(r.attachments || '[]') : (r.attachments || [])
      }));

      return new Response(JSON.stringify(processedResults), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      console.error('CHAT_GET_ERROR:', err);
      return new Response(JSON.stringify({ error: 'FETCH_MESSAGES_FAILED', message: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const taskId = body.taskId === 0 ? null : body.taskId;
      const senderId = body.senderId;
      const content = body.content || '';

      if (!senderId) {
        return new Response(JSON.stringify({ error: 'Missing senderId' }), { status: 400 });
      }

      // Insert message - handle both possible column names for timestamp if necessary,
      // but D1 usually handles DEFAULT CURRENT_TIMESTAMP automatically
      const result = await env.DB.prepare(
        'INSERT INTO messages (task_id, sender_id, content) VALUES (?, ?, ?)'
      ).bind(taskId, senderId, content).run();

      const newMessageId = result.meta.last_row_id;

      // Auto-mark as read by sender
      try {
        await env.DB.prepare('INSERT OR IGNORE INTO message_reads (message_id, user_id) VALUES (?, ?)').bind(newMessageId, senderId).run();
      } catch (e) {
        console.warn('READ_RECEIPT_AUTO_FAIL:', e);
      }

      // Handle attachments - try both table names
      if (body.attachments && Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          try {
            await env.DB.prepare(
              'INSERT INTO attachments (message_id, file_name, file_type, file_size, file_url) VALUES (?, ?, ?, ?, ?)'
            ).bind(newMessageId, att.name, att.type, att.size || 0, att.url).run();
          } catch (e) {
            // Fallback to message_attachments
            try {
              await env.DB.prepare(
                'INSERT INTO message_attachments (message_id, file_name, file_type, file_size, file_url) VALUES (?, ?, ?, ?, ?)'
              ).bind(newMessageId, att.name, att.type, att.size || 0, att.url).run();
            } catch (e2) {
              console.error('ATTACHMENT_INSERT_FAILED:', e2);
            }
          }
        }
      }

      return new Response(JSON.stringify({ id: newMessageId, success: true }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      console.error('CHAT_POST_ERROR:', err);
      return new Response(JSON.stringify({ error: 'POST_MESSAGE_FAILED', message: err.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
