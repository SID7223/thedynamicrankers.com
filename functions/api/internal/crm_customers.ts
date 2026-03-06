interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'GET') {
    const id = url.searchParams.get('id');
    try {
      if (id) {
        const customer = await env.DB.prepare('SELECT * FROM crm_customers WHERE id = ?').bind(id).first();
        return new Response(JSON.stringify(customer), { headers: { 'Content-Type': 'application/json' } });
      }
      const { results } = await env.DB.prepare('SELECT * FROM crm_customers ORDER BY created_at DESC').all();
      return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
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
      return new Response(JSON.stringify({ id, success: true }), { status: 201 });
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'PATCH') {
    try {
      const id = url.searchParams.get('id');
      const body = await request.json() as any;
      const updates = [];
      const values = [];

      for (const [key, value] of Object.entries(body)) {
        if (['name', 'phone', 'email', 'address', 'notes', 'sales_stage'].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        await env.DB.prepare(`UPDATE crm_customers SET ${updates.join(', ')} WHERE id = ?`).bind(...values, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    try {
      await env.DB.prepare('DELETE FROM crm_customers WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
