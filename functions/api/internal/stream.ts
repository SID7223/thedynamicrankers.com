interface Env {
  DB?: D1Database;
}

export const onRequestGet = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  try {
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

        // Use a format compatible with SQLite CURRENT_TIMESTAMP (YYYY-MM-DD HH:MM:SS)
        let lastTimestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

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

            // Also broadcast task sync for real-time dashboard updates
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
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};
