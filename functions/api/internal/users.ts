interface Env {
  DB: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;

  try {
    let results = [];

    if (env.DB) {
      const { results: dbResults } = await env.DB.prepare(
        'SELECT id, name as username, email, role FROM users ORDER BY name ASC'
      ).all();
      results = dbResults || [];
    }

    // Fallback if DB is missing or empty
    if (results.length === 0) {
      results = [
        { id: 1, username: 'SID', email: 'saadumar7223@gmail.com', role: 'superuser' },
        { id: 2, username: 'Eric', email: 'eric@thedynamicrankers.com', role: 'superuser' }
      ];
    }

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    return new Response(JSON.stringify({ error: 'GET_USERS_FAILED', message: (err as Error).message }), { status: 500 });
  }
};
