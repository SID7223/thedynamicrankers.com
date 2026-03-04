/**
 * Internal SSE Stream Protocol (Edge-Optimized)
 *
 * This stream provides real-time updates for the Sovereign Node dashboard.
 * In a serverless environment like Cloudflare Pages, maintaining a "global"
 * state for triggers usually requires Durable Objects.
 * For this implementation, we optimize the polling and delivery logic.
 */

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

      // Send initial heartbeat
      sendEvent({ type: 'HEARTBEAT', timestamp: new Date().toISOString() });

      // Track last seen IDs to only push new events
      let lastMessageId = 0;
      let lastTaskId = 0;

      // Initial check to set the baseline
      if (env.DB) {
        try {
          const lastMsg = await env.DB.prepare('SELECT id FROM messages ORDER BY id DESC LIMIT 1').first() as { id: number } | null;
          if (lastMsg) lastMessageId = lastMsg.id;

          const lastTsk = await env.DB.prepare('SELECT id FROM tasks ORDER BY id DESC LIMIT 1').first() as { id: number } | null;
          if (lastTsk) lastTaskId = lastTsk.id;
        } catch (err) {
          console.error('Initial baseline check failed:', err);
        }
      }

      // 1. High-frequency Database Polling (Simulated Trigger)
      const pollInterval = setInterval(async () => {
        if (!env.DB) return;

        try {
          // Check for new messages
          const { results: newMessages } = await env.DB.prepare(
            'SELECT m.*, u.name as sender_name FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.id > ? ORDER BY id ASC'
          ).bind(lastMessageId).all();

          if (newMessages && newMessages.length > 0) {
            for (const item of newMessages) {
              const msg = item as any;
              sendEvent({
                type: 'CHAT_MSG',
                payload: {
                  id: msg.id,
                  task_id: msg.task_id || 0,
                  content: msg.content,
                  sender: msg.sender_name,
                  timestamp: msg.timestamp
                }
              });
              lastMessageId = Math.max(lastMessageId, msg.id);
            }
          }

          // Check for new tasks
          const { results: newTasks } = await env.DB.prepare(
            'SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id > ? ORDER BY id ASC'
          ).bind(lastTaskId).all();

          if (newTasks && newTasks.length > 0) {
            for (const item of newTasks) {
              const task = item as any;
              sendEvent({
                type: 'TASK_CREATED',
                payload: task
              });
              lastTaskId = Math.max(lastTaskId, task.id);
            }
          }
        } catch (err) {
          console.error('SSE Poll Error:', err);
        }
      }, 3000);

      // 2. Continuous Heartbeat
      const heartbeat = setInterval(() => {
        sendEvent({ type: 'HEARTBEAT', timestamp: new Date().toISOString() });
      }, 30000);

      // 3. Presence Simulation
      const presenceSim = setInterval(() => {
          sendEvent({ type: 'PRESENCE_UPDATE', active_users: ['SID', 'Eric'] });
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(pollInterval);
        clearInterval(heartbeat);
        clearInterval(presenceSim);
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
