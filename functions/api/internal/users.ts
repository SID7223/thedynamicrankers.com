interface Env {
  DB: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name as username, email, role FROM users ORDER BY name ASC'
    ).all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};
