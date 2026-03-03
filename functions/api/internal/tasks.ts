interface Env {
  DB: D1Database;
}

export const onRequestGet = async (context: { env: Env }) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      'SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id ORDER BY t.status DESC, t.created_at DESC'
    ).all();

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as {
        action: string;
        id?: number;
        title?: string;
        description?: string;
        assigned_to?: number;
        due_date?: string;
        created_by?: number;
        status?: string;
    };
    const { action, id, title, description, assigned_to, due_date, created_by, status } = body;

    if (action === 'TOGGLE') {
      await env.DB.prepare(
        'UPDATE tasks SET status = ? WHERE id = ?'
      ).bind(status, id).run();

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === 'ASSIGN') {
        await env.DB.prepare(
            'UPDATE tasks SET assigned_to = ? WHERE id = ?'
        ).bind(assigned_to, id).run();
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === 'CREATE') {
      const result = await env.DB.prepare(
        'INSERT INTO tasks (title, description, assigned_to, due_date, created_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(title, description, assigned_to || null, due_date, created_by).run();

      return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { status: 201 });
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};
