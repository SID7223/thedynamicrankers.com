/* eslint-disable @typescript-eslint/no-explicit-any */
interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) {
    return new Response(JSON.stringify({ error: 'Database binding missing' }), { status: 503 });
  }

  if (request.method === 'GET') {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM crm_appointments ORDER BY appointment_date ASC, appointment_time ASC').all();
      return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const id = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO crm_appointments (id, customer_id, customer_name, email, phone, appointment_date, appointment_time, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        id,
        body.customer_id,
        body.customer_name,
        body.email || null,
        body.phone || null,
        body.appointment_date,
        body.appointment_time,
        body.status || 'scheduled'
      ).run();

      return new Response(JSON.stringify({ id, success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (request.method === 'PATCH') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
      const body = await request.json() as any;

      if (body.status) {
        await env.DB.prepare('UPDATE crm_appointments SET status = ? WHERE id = ?').bind(body.status, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
      await env.DB.prepare('DELETE FROM crm_appointments WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
