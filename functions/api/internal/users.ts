interface Env {
  DB?: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  try {
    if (!env.DB) return new Response('DB binding missing', { status: 503 });

    const { results } = await env.DB.prepare(
      'SELECT id, name as username, email, role FROM users ORDER BY name ASC'
    ).all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: 'GET_USERS_FAILED', message: (err as Error).message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
};
