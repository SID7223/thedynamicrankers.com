interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const messageId = url.searchParams.get('messageId');
  const userId = url.searchParams.get('userId');

  if (!env.DB) return new Response('DB binding missing', { status: 503 });
  if (!messageId || !userId) return new Response('Missing messageId or userId', { status: 400 });

  try {
    // 1. Fetch user role and message info
    const userRes = await env.DB.prepare('SELECT role FROM users WHERE id = ?').bind(userId).first() as { role: string } | null;
    const msgRes = await env.DB.prepare('SELECT m.*, r.task_id FROM messages m JOIN chat_rooms r ON m.room_id = r.id WHERE m.id = ?').bind(messageId).first() as { sender_id: string; task_id: string | null; message_content: string; created_at: string } | null;

    if (!userRes || !msgRes) return new Response('Resource not found', { status: 404 });

    // 2. Fetch task creator if message is in a task room
    let taskCreatorId = null;
    if (msgRes.task_id) {
        const taskRes = await env.DB.prepare('SELECT created_by FROM tasks WHERE id = ?').bind(msgRes.task_id).first() as { created_by: string } | null;
        taskCreatorId = taskRes?.created_by;
    }

    // 3. Authorization check
    // Admins, SuperUsers, Task Creator, and Sender can view history
    const isAuthorized = ['admin', 'superuser'].includes(userRes.role) ||
                       userId === msgRes.sender_id ||
                       userId === taskCreatorId;

    if (!isAuthorized) return new Response('Unauthorized access', { status: 403 });

    // 4. Fetch history records
    const { results: history } = await env.DB.prepare(
        'SELECT * FROM message_edits WHERE message_id = ? ORDER BY edited_at ASC'
    ).bind(messageId).all();

    return new Response(JSON.stringify({
        current_content: msgRes.message_content,
        created_at: msgRes.created_at,
        edits: history
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
