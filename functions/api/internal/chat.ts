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
    if (request.method === 'GET') {
      const taskId = url.searchParams.get('taskId');
      const roomId = url.searchParams.get('roomId');
      const userId = url.searchParams.get('userId');

      let finalRoomId = roomId;
      if (!finalRoomId && taskId) {
        if (taskId === '0') finalRoomId = 'global-room';
        else {
          const room = await env.DB.prepare('SELECT id FROM chat_rooms WHERE task_id = ?').bind(taskId).first() as { id: string } | null;
          finalRoomId = room?.id || null;
        }
      }

      if (!finalRoomId) return jsonResponse({ messages: [], lastReadAt: null });

      const { results } = await env.DB.prepare(`
        SELECT m.*, m.message_content as content, m.created_at as timestamp, u.name as sender_name,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', ma.id, 'name', ma.file_name, 'type', ma.file_type, 'url', ma.file_url)) FROM message_attachments ma WHERE ma.message_id = m.id) as attachments,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('emoji', mr.emoji, 'count', (SELECT COUNT(*) FROM message_reactions mr2 WHERE mr2.message_id = m.id AND mr2.emoji = mr.emoji), 'me', (SELECT COUNT(*) FROM message_reactions mr3 WHERE mr3.message_id = m.id AND mr3.emoji = mr.emoji AND mr3.user_id = ?))) FROM (SELECT DISTINCT emoji FROM message_reactions WHERE message_id = m.id) mr) as reactions
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.room_id = ?
        ORDER BY m.created_at ASC
      `).bind(userId || '', finalRoomId).all();

      const lastRead = await env.DB.prepare('SELECT last_read_at FROM message_read_receipts WHERE user_id = ? AND room_id = ?').bind(userId || '', finalRoomId).first() as { last_read_at: string } | null;

      const processedResults = (results || []).map((r: any) => ({
        ...r,
        attachments: JSON.parse(r.attachments || '[]'),
        reactions: JSON.parse(r.reactions || '[]'),
        is_edited: !!r.edited
      }));

      return jsonResponse({ messages: processedResults, lastReadAt: lastRead?.last_read_at || null });
    }

    if (request.method === 'POST') {
      const body = await request.json() as any;
      const messageId = crypto.randomUUID();
      let finalRoomId = body.roomId;

      if (!finalRoomId && body.taskId !== undefined) {
        if (body.taskId === 0 || body.taskId === '0') finalRoomId = 'global-room';
        else {
          const room = await env.DB.prepare('SELECT id FROM chat_rooms WHERE task_id = ?').bind(body.taskId).first() as { id: string } | null;
          finalRoomId = room?.id;
        }
      }

      if (!finalRoomId) return jsonResponse({ error: 'Target room not found' }, 404);

      try {
        await env.DB.prepare(
          'INSERT INTO messages (id, room_id, sender_id, message_content, parent_message_id, message_type) VALUES (?, ?, ?, ?, ?, ?)'
        ).bind(
            messageId,
            finalRoomId,
            body.senderId,
            body.content || '',
            body.parentMessageId || null,
            body.messageType || 'text'
        ).run();
      } catch (err: any) {
          return jsonResponse({
              error: 'INSERT_MESSAGE_FAILED',
              message: err.message,
              detail: 'Check if parent_message_id exists and sender_id is a valid user ID.'
          }, 500);
      }

      if (body.attachments && Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          await env.DB.prepare(
            'INSERT INTO message_attachments (id, message_id, file_name, file_type, file_size, file_url) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(crypto.randomUUID(), messageId, att.name, att.type, att.size || 0, att.url).run();
        }
      }

      return jsonResponse({ id: messageId, success: true }, 201);
    }

    if (request.method === 'PATCH') {
      const id = url.searchParams.get('id');
      if (!id) return jsonResponse({ error: 'Missing message ID' }, 400);
      const body = await request.json() as any;
      const userId = body.userId;

      if (!userId) return jsonResponse({ error: 'Missing userId for authorization' }, 400);

      const message = await env.DB.prepare('SELECT sender_id, message_content FROM messages WHERE id = ?').bind(id).first() as { sender_id: string; message_content: string } | null;
      if (!message) return jsonResponse({ error: 'Message not found' }, 404);
      if (message.sender_id !== userId) return jsonResponse({ error: 'Unauthorized edit' }, 403);

      await env.DB.prepare('INSERT INTO message_edits (id, message_id, old_content) VALUES (?, ?, ?)').bind(crypto.randomUUID(), id, message.message_content).run();
      await env.DB.prepare('UPDATE messages SET message_content = ?, edited = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(body.content, id).run();

      return jsonResponse({ success: true });
    }

    if (request.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return jsonResponse({ error: 'Missing message ID' }, 400);
      await env.DB.prepare('DELETE FROM messages WHERE id = ?').bind(id).run();
      return jsonResponse({ success: true });
    }

    return jsonResponse({ error: 'Method Not Allowed' }, 405);
  } catch (err: any) {
    return jsonResponse({ error: err.message, detail: 'Internal API Error' }, 500);
  }
};
