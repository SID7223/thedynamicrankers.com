interface Env {
  DB?: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  try {
    const { roomId, userId, username, isTyping } = await request.json() as any;

    // We don't store typing status in DB, just broadcast it via SSE in stream.ts
    // For that to work, we need a way for stream.ts to know about typing events.
    // In a stateless environment like Cloudflare Pages Functions, we'd typically use
    // Durable Objects or an external pub/sub.
    // Since we're constrained to D1, we'll use a temporary "presence" or "signals" table
    // if real real-time is needed, but for now we'll mock the broadcast capability
    // by making stream.ts poll a 'signals' table.

    await env.DB?.prepare(
      'INSERT INTO notifications (id, user_id, type, reference_id, message) VALUES (?, ?, ?, ?, ?)'
    ).bind(crypto.randomUUID(), userId, 'typing', roomId, isTyping ? `${username} is typing...` : 'STOP').run();

    return new Response(JSON.stringify({ success: true }));
  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
