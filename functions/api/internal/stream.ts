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
        let lastTaskSyncTimestamp = lastMsgTimestamp;

        const pollInterval = setInterval(async () => {
          if (!env.DB) return;

          try {
            // Optimized approach: Check for ANY change first to reduce D1 pressure if possible
            // But with D1, simple targeted queries are already quite efficient.
            // We'll focus on making the queries as lightweight as possible.

            // 1. Fetch New Messages (Targeted by timestamp)
            const { results: newMessages } = await env.DB.prepare(
              'SELECT m.id, m.room_id, m.message_content, m.created_at, u.name as sender_name, cr.task_id ' +
              'FROM messages m ' +
              'JOIN users u ON m.sender_id = u.id ' +
              'LEFT JOIN chat_rooms cr ON m.room_id = cr.id ' +
              'WHERE m.created_at > ? ' +
              'ORDER BY m.created_at ASC LIMIT 10'
            ).bind(lastMsgTimestamp).all();

            if (newMessages && newMessages.length > 0) {
              for (const msg of newMessages as any[]) {
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
            }

            // 2. Fetch Signals (Typing Status)
            const { results: signals } = await env.DB.prepare(
              "SELECT id, user_id, reference_id, message, created_at FROM notifications WHERE type = 'typing' AND created_at > ? ORDER BY created_at ASC LIMIT 10"
            ).bind(lastSignalTimestamp).all();

            if (signals && signals.length > 0) {
              for (const sig of signals as any[]) {
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
            }

            // 3. Task Sync Check (Check for updated_at in tasks table)
            const { results: taskUpdates } = await env.DB.prepare(
              'SELECT id FROM tasks WHERE updated_at > ? LIMIT 1'
            ).bind(lastTaskSyncTimestamp).all();

            if (taskUpdates && taskUpdates.length > 0) {
              sendEvent({ type: 'SYNC_TASKS' });
              lastTaskSyncTimestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
            }

          } catch (err) {
            console.error('SSE Poll Error:', err);
          }
        }, 5000); // Increased interval to 5s for Cloudflare Free Tier relief

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
