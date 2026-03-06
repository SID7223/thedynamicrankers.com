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

      let lastTimestamp = new Date().toISOString();

      const pollInterval = setInterval(async () => {
        if (!env.DB) return;

        try {
          const { results: newMessages } = await env.DB.prepare(
            'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.created_at > ? ORDER BY m.created_at ASC'
          ).bind(lastTimestamp).all();

          for (const msg of (newMessages || []) as any[]) {
            sendEvent({
              type: 'CHAT_MSG',
              payload: {
                id: msg.id,
                room_id: msg.room_id,
                content: msg.message_content,
                sender: msg.sender_name,
                timestamp: msg.created_at
              }
            });
            lastTimestamp = msg.created_at;
          }

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
