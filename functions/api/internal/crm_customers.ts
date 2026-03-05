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
    const id = url.searchParams.get('id');
    try {
      if (id) {
        const customer = await env.DB.prepare('SELECT * FROM crm_customers WHERE id = ?').bind(id).first();
        return new Response(JSON.stringify(customer), { headers: { 'Content-Type': 'application/json' } });
      } else {
        const { results } = await env.DB.prepare('SELECT * FROM crm_customers ORDER BY created_at DESC').all();
        return new Response(JSON.stringify(results), { headers: { 'Content-Type': 'application/json' } });
      }
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json() as any;
      const id = crypto.randomUUID();
      await env.DB.prepare(
        'INSERT INTO crm_customers (id, name, phone, email, address, notes, sales_stage) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        id,
        body.name,
        body.phone || null,
        body.email || null,
        body.address || null,
        body.notes || null,
        body.sales_stage || 'Discovery'
      ).run();

      const newCustomer = await env.DB.prepare('SELECT * FROM crm_customers WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify(newCustomer), { status: 201 });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (request.method === 'PUT') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
      const body = await request.json() as any;

      await env.DB.prepare(
        'UPDATE crm_customers SET name = ?, phone = ?, email = ?, address = ?, notes = ?, sales_stage = ? WHERE id = ?'
      ).bind(
        body.name,
        body.phone,
        body.email,
        body.address,
        body.notes,
        body.sales_stage,
        id
      ).run();

      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    try {
      const id = url.searchParams.get('id');
      if (!id) return new Response(JSON.stringify({ error: 'Missing ID' }), { status: 400 });
      await env.DB.prepare('DELETE FROM crm_customers WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message }), { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
