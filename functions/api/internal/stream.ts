/**
 * Internal SSE Stream Protocol (Edge-Optimized)
 *
 * Event Types:
 * - { type: 'HEARTBEAT', timestamp: string }
 * - { type: 'CHAT_MSG', payload: { task_id: number, content: string, sender: string } }
 * - { type: 'TASK_TOGGLE', payload: { id: number, status: 'pending' | 'completed' } }
 * - { type: 'TASK_CREATED', payload: { id: number, title: string } }
 * - { type: 'TYPING_INDICATOR', payload: { user: string, isTyping: boolean } }
 */

export const onRequestGet = async (context: { request: Request }) => {
  const { request } = context;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const sendEvent = (event: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      // Continuous Heartbeat to maintain Edge Link
      const heartbeat = setInterval(() => {
        sendEvent({ type: 'HEARTBEAT', timestamp: new Date().toISOString() });
      }, 30000);

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
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
