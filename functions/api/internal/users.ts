interface Env {
  DB: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, email FROM users ORDER BY name ASC'
    ).all();

    console.log(`Fetched ${results.length} operatives from D1`);

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('D1 Operative Fetch Error:', message);
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};
