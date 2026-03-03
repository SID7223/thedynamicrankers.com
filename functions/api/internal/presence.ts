export const onRequestPost = async (context: { request: Request }) => {
  const { request } = context;

  try {
    const { user } = (await request.json()) as { user: string };

    // In a production environment with KV:
    // await env.PRESENCE.put(`presence:${user}`, 'online', { expirationTtl: 60 });

    // For this prototype, we acknowledge the heartbeat.
    // The SSE stream will handle the broadcast simulation.

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
