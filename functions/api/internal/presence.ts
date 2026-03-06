interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  // Simplified presence for now, as real-time is handled by SSE stream mostly.
  // This could store 'last_seen_at' in the users table.
  if (request.method === 'POST') {
    try {
      const { userId } = await request.json() as { userId: string };
      if (userId) {
        await env.DB.prepare('UPDATE users SET updated_at = CURRENT_TIMESTAMP WHERE id = ?').bind(userId).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
