interface Env {
  DB: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'D1 Binding "DB" missing' }), { status: 500 });
  }
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name as username, email, role FROM users ORDER BY name ASC'
    ).all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: 'GET_USERS_FAILED', message: (err as Error).message }), { status: 500 });
  }
};
