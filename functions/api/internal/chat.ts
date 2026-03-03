interface Env {
  DB: D1Database;
}

interface Message {
  id: number;
  task_id: number;
  sender_id: number;
  content: string;
  timestamp: string;
  sender_name: string;
  reactions?: { emoji: string; user_name: string; user_id: number }[];
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Missing taskId' }), { status: 400 });
  }

  try {
    const { results } = (await env.DB.prepare(
      'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.task_id = ? ORDER BY m.timestamp ASC'
    ).bind(taskId).all()) as unknown as { results: Message[] };

    const messages = results;

    // Fetch reactions for these messages
    const messageIds = messages.map((m) => m.id);
    let reactions: { message_id: number; emoji: string; user_name: string; user_id: number }[] = [];
    if (messageIds.length > 0) {
      const { results: reactionResults } = (await env.DB.prepare(
        `SELECT r.*, u.name as user_name FROM message_reactions r JOIN users u ON r.user_id = u.id WHERE r.message_id IN (${messageIds.join(',')})`
      ).all()) as unknown as { results: { message_id: number; emoji: string; user_name: string; user_id: number }[] };
      reactions = reactionResults;
    }

    const messagesWithReactions = messages.map((m) => ({
      ...m,
      reactions: reactions.filter((r) => r.message_id === m.id)
    }));

    return new Response(JSON.stringify({ results: messagesWithReactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as {
        action: string;
        taskId?: number;
        senderId?: number;
        content?: string;
        messageId?: number;
        userId?: number;
        emoji?: string;
    };
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};
