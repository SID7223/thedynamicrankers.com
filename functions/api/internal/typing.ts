interface Env {
  DB?: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  try {
    const body = await request.json() as any;
    const { roomId, userId, username, isTyping } = body;

    if (!userId || !roomId) return new Response('Missing required fields', { status: 400 });

    await env.DB.prepare(
      'INSERT INTO notifications (id, user_id, type, reference_id, message) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), userId, 'typing', roomId, isTyping ? `${username} is typing...` : 'STOP').run();

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
