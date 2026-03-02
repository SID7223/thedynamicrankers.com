export const onRequestGet: PagesFunction<any> = async (context) => {
  const { request } = context;
  const url = new URL(request.url);
  const taskId = url.searchParams.get('taskId');

  if (!taskId) {
    return new Response(JSON.stringify({ error: 'Missing taskId' }), { status: 400 });
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();

      const interval = setInterval(async () => {
        const data = JSON.stringify({
          id: Date.now(),
          content: 'Keep pushing for the edge.',
          sender: 'SID',
          timestamp: new Date().toISOString()
        });

        controller.enqueue(encoder.encode(`data: ${data}\n\n`));
      }, 5000);

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

export const onRequestPost: PagesFunction<any> = async (context) => {
  const { request } = context;

  try {
    await request.json();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
