/* eslint-disable @typescript-eslint/no-explicit-any */
interface Env {
  DB?: D1Database;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch {
          // Controller might already be closed
        }
      };

      sendEvent({ type: 'HEARTBEAT', timestamp: new Date().toISOString() });

      let lastMessageId = 0;

      if (env.DB) {
        try {
          const lastMsg = await env.DB.prepare('SELECT id FROM messages ORDER BY id DESC LIMIT 1').first() as { id: number } | null;
          if (lastMsg) lastMessageId = lastMsg.id;
        } catch (err) {
          console.error('Initial baseline check failed:', err);
        }
      }

      const pollInterval = setInterval(async () => {
        if (!env.DB) return;

        try {
          // Check for updates (messages, tasks, or deleted tasks)
          const counts = await env.DB.prepare('SELECT (SELECT MAX(id) FROM messages) as msg, (SELECT MAX(id) FROM tasks) as tsk, (SELECT COUNT(*) FROM tasks) as tsk_count').first() as any;

          if (counts && counts.msg > lastMessageId) {
            const { results: newMessages } = await env.DB.prepare(
              'SELECT m.*, COALESCE(m.timestamp, m.created_at) as timestamp, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id > ? ORDER BY id ASC'
            ).bind(lastMessageId).all();

            for (const msg of (newMessages || []) as any[]) {
              sendEvent({
                type: 'CHAT_MSG',
                payload: {
                  id: msg.id,
                  task_id: msg.task_id || 0,
                  content: msg.content,
                  sender_name: msg.sender_name,
                  timestamp: msg.timestamp
                }
              });
              lastMessageId = Math.max(lastMessageId, msg.id);
            }
          }

          // Trigger a refresh event for any change in tasks
          sendEvent({ type: 'SYNC_TASKS' });

        } catch (err) {
          console.error('SSE Poll Error:', err);
        }
      }, 3000);

      const heartbeat = setInterval(() => {
        sendEvent({ type: 'HEARTBEAT', timestamp: new Date().toISOString() });
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(pollInterval);
        clearInterval(heartbeat);
        try {
          controller.close();
        } catch {
          // Already closed
        }
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};
