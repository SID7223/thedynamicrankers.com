// Handles D1 CRUD Operations for the Command Center

export const onRequestGet: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    // List all active tasks from D1
    // const { results } = await env.DB.prepare('SELECT * FROM tasks ORDER BY created_at DESC').all();

    // Mock response for building the UI
    const results = [
      { id: 1, title: 'Edge Deployment', status: 'pending', assigned_to: 'SID', created_at: '2026-03-02' },
      { id: 2, title: 'Strategic Review', status: 'completed', assigned_to: 'Eric', created_at: '2026-03-01' }
    ];

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;

  try {
    const { title, description, assigned_to } = await request.json();

    // Insert new task into D1
    // await env.DB.prepare('INSERT INTO tasks (title, description, assigned_to, created_by) VALUES (?, ?, ?, ?)').bind(title, description, assigned_to, creator_id).run();

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
