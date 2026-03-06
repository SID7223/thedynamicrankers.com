interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'GET') {
    try {
      const { results } = await env.DB.prepare(`
        SELECT t.*, u.name as assigned_name, creator.name as creator_name,
        (SELECT JSON_GROUP_ARRAY(JSON_OBJECT('id', user_id, 'name', name))
         FROM task_assignees ta
         JOIN users u2 ON ta.user_id = u2.id
         WHERE ta.task_id = t.id) as assignees
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        LEFT JOIN users creator ON t.created_by = creator.id
        ORDER BY t.created_at DESC
      `).all();

      const processedResults = (results || []).map((r: any) => ({
        ...r,
        assignees: JSON.parse(r.assignees || '[]')
      }));

      return new Response(JSON.stringify(processedResults), {
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
      const taskId = crypto.randomUUID();

      // Calculate next task number
      const lastTask = await env.DB.prepare('SELECT task_number FROM tasks ORDER BY created_at DESC LIMIT 1').first() as { task_number: string } | null;
      let nextNum = 101;
      if (lastTask && lastTask.task_number.startsWith('TASK-')) {
        nextNum = parseInt(lastTask.task_number.replace('TASK-', '')) + 1;
      }
      const taskNumber = `TASK-${nextNum}`;

      // 1. Create the task
      await env.DB.prepare(
        'INSERT INTO tasks (id, task_number, title, description, assigned_to, due_date, priority, status, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        taskId,
        taskNumber,
        body.title || 'Untitled Directive',
        body.description || null,
        body.assignees && body.assignees[0] ? body.assignees[0] : null,
        body.due_date || null,
        body.priority || 'Medium',
        body.status || 'todo',
        body.created_by
      ).run();

      // 2. Handle Multiple Assignees
      if (body.assignees && Array.isArray(body.assignees)) {
        for (const userId of body.assignees) {
          await env.DB.prepare(
            'INSERT OR IGNORE INTO task_assignees (id, task_id, user_id) VALUES (?, ?, ?)'
          ).bind(crypto.randomUUID(), taskId, userId).run();
        }
      }

      // 3. Create the associated chat room
      await env.DB.prepare(
        'INSERT INTO chat_rooms (id, type, task_id) VALUES (?, ?, ?)'
      ).bind(crypto.randomUUID(), 'task', taskId).run();

      return new Response(JSON.stringify({ id: taskId, success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'POST_TASK_FAILED', message: err.message }), { status: 500 });
    }
  }

  if (request.method === 'PATCH') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing directive ID' }), { status: 400 });

      const body = await request.json() as any;
      const updates = [];
      const values = [];

      if (body.status !== undefined) { updates.push('status = ?'); values.push(body.status); }
      if (body.priority !== undefined) { updates.push('priority = ?'); values.push(body.priority); }
      if (body.title !== undefined) { updates.push('title = ?'); values.push(body.title); }
      if (body.description !== undefined) { updates.push('description = ?'); values.push(body.description); }
      if (body.due_date !== undefined) { updates.push('due_date = ?'); values.push(body.due_date); }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
        await env.DB.prepare(query).bind(...values, id).run();
      }

      // Handle Multiple Assignees update
      if (body.assignees !== undefined && Array.isArray(body.assignees)) {
        // Delete old assignees and insert new ones
        await env.DB.prepare('DELETE FROM task_assignees WHERE task_id = ?').bind(id).run();
        for (const userId of body.assignees) {
          await env.DB.prepare(
            'INSERT INTO task_assignees (id, task_id, user_id) VALUES (?, ?, ?)'
          ).bind(crypto.randomUUID(), id, userId).run();
        }
        // Update the primary assigned_to field for backward compat
        if (body.assignees.length > 0) {
          await env.DB.prepare('UPDATE tasks SET assigned_to = ? WHERE id = ?').bind(body.assignees[0], id).run();
        } else {
          await env.DB.prepare('UPDATE tasks SET assigned_to = NULL WHERE id = ?').bind(id).run();
        }
      }

      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(JSON.stringify({ error: 'PATCH_TASK_FAILED', message: err.message }), { status: 500 });
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

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
};
