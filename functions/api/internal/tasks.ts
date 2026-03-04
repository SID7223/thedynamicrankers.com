interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB || typeof env.DB.prepare !== 'function') {
    return new Response(JSON.stringify({ error: 'D1 Binding "DB" missing or inactive' }), { status: 503, headers: { 'Content-Type': 'application/json' } });
  }

  if (request.method === 'GET') {
    try {
      const { results } = await env.DB.prepare(
        'SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id ORDER BY t.status DESC, t.created_at DESC'
      ).all();
      return new Response(JSON.stringify(results || []), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'GET_TASKS_FAILED', message: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const result = await env.DB.prepare(
        'INSERT INTO tasks (title, description, assigned_to, due_date, status, created_by) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        body.title || 'Untitled Directive',
        body.description || null,
        body.assigned_to || null,
        body.due_date || null,
        'pending',
        body.created_by || 1
      ).run();

      const newTask = await env.DB.prepare(
        'SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?'
      ).bind(result.meta.last_row_id).first();

      return new Response(JSON.stringify(newTask), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'POST_TASK_FAILED', message: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method === 'PATCH') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing directive ID' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

      const body = await request.json() as any;
      if (body.status !== undefined) {
        await env.DB.prepare('UPDATE tasks SET status = ? WHERE id = ?').bind(body.status, id).run();
      }
      if (body.assigned_to !== undefined) {
        await env.DB.prepare('UPDATE tasks SET assigned_to = ? WHERE id = ?').bind(body.assigned_to, id).run();
      }

      return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'PATCH_TASK_FAILED', message: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing directive ID' }), { status: 400 });

      await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'DELETE_TASK_FAILED', message: err.message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
};
