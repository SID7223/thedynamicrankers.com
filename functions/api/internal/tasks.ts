interface Env {
  DB?: D1Database;
}

interface TaskUpdateBody {
  id?: string | number;
  status?: string;
  priority?: string;
  assigned_to?: number;
  title?: string;
  description?: string;
  due_date?: string;
}

interface TaskCreateBody {
  title?: string;
  description?: string;
  assigned_to?: number;
  due_date?: string;
  priority?: string;
  status?: string;
  created_by?: number;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB || typeof env.DB.prepare !== 'function') {
    return new Response(JSON.stringify({ error: 'D1 Binding "DB" missing or inactive' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  if (request.method === 'GET') {
    // Handle SSE stream request
    if (url.searchParams.get('stream') === 'true') {
      const { readable, writable } = new TransformStream();
      const writer = writable.getWriter();
      const encoder = new TextEncoder();

      // Send initial keep-alive or comment to establish stream
      writer.write(encoder.encode('retry: 10000\n\n'));

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    try {
      const { results } = await env.DB.prepare(
        'SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id ORDER BY t.created_at DESC'
      ).all();
      return new Response(JSON.stringify(results || []), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ error: 'GET_TASKS_FAILED', message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as TaskCreateBody;
      const result = await env.DB.prepare(
        'INSERT INTO tasks (title, description, assigned_to, due_date, priority, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        body.title || 'Untitled Directive',
        body.description || null,
        body.assigned_to || null,
        body.due_date || null,
        body.priority || 'Medium',
        body.status || 'todo',
        body.created_by || 1
      ).run();

      const newTask = await env.DB.prepare(
        'SELECT t.*, u.name as assigned_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?'
      ).bind(result.meta.last_row_id).first();

      return new Response(JSON.stringify(newTask), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ error: 'POST_TASK_FAILED', message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  // Support both PUT (from frontend) and PATCH
  if (request.method === 'PATCH' || request.method === 'PUT') {
    try {
      const body = await request.json() as TaskUpdateBody;
      const id = url.searchParams.get('id') || body.id;

      if (!id) return new Response(JSON.stringify({ error: 'Missing directive ID' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });

      const updates: string[] = [];
      const values: (string | number | null)[] = [];

      if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
      if (body.priority !== undefined) { updates.push('priority = ?'); values.push(body.priority); }
      if (body.assigned_to !== undefined) { updates.push('assigned_to = ?'); values.push(body.assigned_to); }
      if (body.title !== undefined) { updates.push('title = ?'); values.push(body.title); }
      if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description); }
      if (body.due_date !== undefined) { updates.push('due_date = ?'); values.push(body.due_date); }

      if (updates.length > 0) {
        const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
        await env.DB.prepare(query).bind(...values, id).run();
      }

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ error: 'UPDATE_TASK_FAILED', message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing directive ID' }), { status: 400 });

      await env.DB.prepare('DELETE FROM tasks WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ error: 'DELETE_TASK_FAILED', message }), { status: 500 });
    }
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
};
