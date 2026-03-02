export const onRequestGet: PagesFunction<any> = async (context) => {
  try {
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

export const onRequestPost: PagesFunction<any> = async (context) => {
  const { request } = context;

  try {
    await request.json();
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
};
