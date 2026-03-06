interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  // Not implemented in the new schema yet, but keeping the placeholder for future
  // We can track last_read_message_id per user per room in a new table if needed.
  return new Response(JSON.stringify({ success: true }));
};
