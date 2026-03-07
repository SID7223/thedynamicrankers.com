interface Env {
  DB?: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  if (!env.DB) return new Response(JSON.stringify({ error: 'DB binding missing' }), { status: 503, headers: { 'Content-Type': 'application/json' } });

  try {
    const { results: tables } = await env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    const schema: Record<string, any> = {};

    for (const table of (tables || []) as any[]) {
      const { results: columns } = await env.DB.prepare(`PRAGMA table_info(${table.name})`).all();
      schema[table.name] = columns;
    }

    return new Response(JSON.stringify(schema, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
