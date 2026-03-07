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

        // Use a format compatible with SQLite's CURRENT_TIMESTAMP
        let lastMsgTimestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
        let lastSignalTimestamp = lastMsgTimestamp;
        let lastSignalId = '';

        const pollInterval = setInterval(async () => {
          if (!env.DB) return;

          try {
            // 1. Fetch New Messages
            const { results: newMessages } = await env.DB.prepare(
              'SELECT m.*, u.name as sender_name, cr.task_id FROM messages m JOIN users u ON m.sender_id = u.id LEFT JOIN chat_rooms cr ON m.room_id = cr.id WHERE m.created_at > ? ORDER BY m.created_at ASC'
            ).bind(lastMsgTimestamp).all();

            for (const msg of (newMessages || []) as any[]) {
              sendEvent({
                type: 'CHAT_MSG',
                room: msg.task_id || (msg.room_id === 'global-room' ? '0' : msg.room_id),
                payload: {
                  id: msg.id,
                  room_id: msg.room_id,
                  content: msg.message_content,
                  sender: msg.sender_name,
                  timestamp: msg.created_at
                }
              });
              lastMsgTimestamp = msg.created_at;
            }

            // 2. Fetch Signals (Typing Status) from notifications table
            const { results: signals } = await env.DB.prepare(
              "SELECT * FROM notifications WHERE type = 'typing' AND created_at > ? ORDER BY created_at ASC LIMIT 20"
            ).bind(lastSignalTimestamp).all();

            for (const sig of (signals || []) as any[]) {
              if (sig.id === lastSignalId) continue;
              sendEvent({
                type: 'TYPING_STATUS',
                room: sig.reference_id === 'global-room' ? '0' : sig.reference_id,
                userId: sig.user_id,
                message: sig.message
              });
              lastSignalId = sig.id;
              lastSignalTimestamp = sig.created_at;
            }

            // 3. Optional: Sync Task Counts (less frequent)
            // sendEvent({ type: 'SYNC_TASKS' });

          } catch (err) {
            // Log error but keep the stream alive
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
