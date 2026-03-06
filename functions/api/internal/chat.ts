interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'GET') {
    const taskId = url.searchParams.get('taskId');
    const roomId = url.searchParams.get('roomId');

    try {
      let finalRoomId = roomId;

      // If taskId is provided, find its room
      if (!finalRoomId && taskId) {
        if (taskId === '0') {
          finalRoomId = 'global-room';
        } else {
          const room = await env.DB.prepare('SELECT id FROM chat_rooms WHERE task_id = ?').bind(taskId).first() as { id: string } | null;
          finalRoomId = room?.id || null;
        }
      }

      if (!finalRoomId) return new Response(JSON.stringify([]), { status: 200, headers: { 'Content-Type': 'application/json' } });

      const { results } = await env.DB.prepare(`
        SELECT m.*, u.name as sender_name,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', ma.id, 'name', ma.file_name, 'type', ma.file_type, 'url', ma.file_url)) FROM message_attachments ma WHERE ma.message_id = m.id) as attachments
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        WHERE m.room_id = ?
        ORDER BY m.timestamp ASC
      `).bind(finalRoomId).all();

      const processedResults = (results || []).map((r: any) => ({
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
      const messageId = crypto.randomUUID();

      let finalRoomId = body.roomId;
      if (!finalRoomId && body.taskId !== undefined) {
        if (body.taskId === 0 || body.taskId === '0') {
          finalRoomId = 'global-room';
        } else {
          const room = await env.DB.prepare('SELECT id FROM chat_rooms WHERE task_id = ?').bind(body.taskId).first() as { id: string } | null;
          finalRoomId = room?.id;
        }
      }

      if (!finalRoomId) return new Response('Room not found', { status: 404 });

      await env.DB.prepare(
        'INSERT INTO messages (id, room_id, sender_id, content, parent_message_id, message_type) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        messageId,
        finalRoomId,
        body.senderId,
        body.content || '',
        body.parentMessageId || null,
        body.messageType || 'text'
      ).run();

      // Handle attachments
      if (body.attachments && Array.isArray(body.attachments)) {
        for (const att of body.attachments) {
          await env.DB.prepare(
            'INSERT INTO message_attachments (id, message_id, file_name, file_type, file_size, file_url) VALUES (?, ?, ?, ?, ?, ?)'
          ).bind(
            crypto.randomUUID(),
            messageId,
            att.name,
            att.type,
            att.size || 0,
            att.url
          ).run();
        }
      }

      return new Response(JSON.stringify({ id: messageId, success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
