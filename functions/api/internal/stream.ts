export const onRequestGet = async (context: any) => {
  const { request } = context;

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // In a real multi-user scenario, we might use a Durable Object or a pub/sub mechanism.
      // For this hardened prototype, we'll implement a polling mechanism that simulates liveness
      // while providing the SSE interface expected by the client.

      const sendEvent = (event: any) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
      };

      // Heartbeat
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
