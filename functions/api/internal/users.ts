export const onRequestGet = async (context: any) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, name, email FROM users ORDER BY name ASC'
    ).all();

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
};
