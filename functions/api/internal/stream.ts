/**
 * Internal SSE Stream Protocol (Edge-Optimized)
 *
 * Event Types:
 * - { type: 'HEARTBEAT', timestamp: string }
 * - { type: 'CHAT_MSG', payload: { task_id: number, content: string, sender: string } }
 * - { type: 'TASK_TOGGLE', payload: { id: number, status: 'pending' | 'completed' } }
 * - { type: 'TASK_CREATED', payload: { id: number, title: string } }
 * - { type: 'TYPING_INDICATOR', payload: { user: string, isTyping: boolean } }
 * - { type: 'PRESENCE_UPDATE', active_users: string[] }
 */

export const onRequestGet = async (context: { request: Request }) => {
  const { request } = context;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      // Continuous Heartbeat
      const heartbeat = setInterval(() => {
        sendEvent({ type: 'HEARTBEAT', timestamp: new Date().toISOString() });
      }, 30000);

      // Presence Update Simulation for the prototype
      // In prod, this would be triggered by KV changes or Durable Objects
      const presenceSim = setInterval(() => {
          sendEvent({ type: 'PRESENCE_UPDATE', active_users: ['SID', 'Eric'] });
      }, 15000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        clearInterval(presenceSim);
        controller.close();
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
