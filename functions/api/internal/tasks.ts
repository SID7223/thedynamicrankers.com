export const onRequestGet = async (context: any) => {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare(
      'SELECT t.*, u.name as assigned_name FROM tasks t JOIN users u ON t.assigned_to = u.id ORDER BY t.status DESC, t.created_at DESC'
    ).all();

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
};

export const onRequestPost = async (context: any) => {
  const { request, env } = context;

  try {
    const body = await request.json() as any;
    const { action, id, title, description, assigned_to, due_date, created_by, status } = body;

    if (action === 'TOGGLE') {
      await env.DB.prepare(
        'UPDATE tasks SET status = ? WHERE id = ?'
      ).bind(status, id).run();

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }

    if (action === 'CREATE') {
      const result = await env.DB.prepare(
        'INSERT INTO tasks (title, description, assigned_to, due_date, created_by) VALUES (?, ?, ?, ?, ?)'
      ).bind(title, description, assigned_to, due_date, created_by).run();

      return new Response(JSON.stringify({ success: true, id: result.meta.last_row_id }), { status: 201 });
    }

    return new Response(JSON.stringify({ error: 'Invalid Action' }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), { status: 500 });
  }
};
