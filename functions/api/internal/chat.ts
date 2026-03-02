export const onRequestGet = async (context: any) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Missing taskId' }), { status: 400 });
  }

  try {
    const { results: messages } = await env.DB.prepare(
      'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.task_id = ? ORDER BY m.timestamp ASC'
    ).bind(taskId).all();

    // Fetch reactions for these messages
    const messageIds = messages.map((m: any) => m.id);
    let reactions = [];
    if (messageIds.length > 0) {
      const { results } = await env.DB.prepare(
        \`SELECT r.*, u.name as user_name FROM message_reactions r JOIN users u ON r.user_id = u.id WHERE r.message_id IN (\${messageIds.join(',')})\`
      ).all();
      reactions = results;
    }

    const messagesWithReactions = messages.map((m: any) => ({
      ...m,
      reactions: reactions.filter((r: any) => r.message_id === m.id)
    }));

    return new Response(JSON.stringify({ results: messagesWithReactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  try {
    const body = await request.json() as any;
    const { action, taskId, senderId, content, messageId, userId, emoji } = body;

    if (action === 'SEND') {
      const result = await env.DB.prepare(
        'INSERT INTO messages (task_id, sender_id, content) VALUES (?, ?, ?)'
      ).bind(taskId, senderId, content).run();

      return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { status: 201 });
    }

    if (action === 'REACT') {
      await env.DB.prepare(
        'INSERT OR REPLACE INTO message_reactions (message_id, user_id, emoji) VALUES (?, ?, ?)'
      ).bind(messageId, userId, emoji).run();

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === 'DELETE_REACTION') {
        await env.DB.prepare(
            'DELETE FROM message_reactions WHERE message_id = ? AND user_id = ? AND emoji = ?'
        ).bind(messageId, userId, emoji).run();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
};
