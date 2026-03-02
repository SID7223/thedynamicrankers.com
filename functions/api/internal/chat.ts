// Handles WebSocket / SSE-based Real-Time Comms

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Missing taskId' }), { status: 400 });
  }

  // SSE Stream Implementation (Server-Sent Events)
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      // Periodically check D1 for new messages in this task thread.
      // Since this is serverless, the "push" logic happens on each message POST,
      // which then updates a shared state (D1 or KV).

      const interval = setInterval(async () => {
        // Mock query for new messages in taskId...
        // const { results } = await env.DB.prepare('SELECT * FROM messages WHERE task_id = ?').bind(taskId).all();

        const data = JSON.stringify({
          id: Date.now(),
          content: 'Keep pushing for the edge.',
          sender: 'SID',
          timestamp: new Date().toISOString()
        });

        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 5000); // Poll every 5 seconds for the mock implementation.

      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
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

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const { taskId, content, senderId } = await request.json();

    // Insert message into D1
    // await env.DB.prepare('INSERT INTO messages (task_id, sender_id, content) VALUES (?, ?, ?)').bind(taskId, senderId, content).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
