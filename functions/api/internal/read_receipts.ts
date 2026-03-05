/* eslint-disable @typescript-eslint/no-explicit-any */
interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'POST') {
    try {
      const { userId, taskId } = await request.json() as { userId: number; taskId: number };

      // Mark all unread messages in this thread as read by this user
      await env.DB.prepare(`
        INSERT OR IGNORE INTO message_reads (message_id, user_id)
        SELECT id, ? FROM messages
        WHERE (task_id ${taskId === 0 ? 'IS NULL' : '= ?'})
        AND sender_id != ?
      `).bind(userId, ...(taskId === 0 ? [] : [taskId]), userId).run();

      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
