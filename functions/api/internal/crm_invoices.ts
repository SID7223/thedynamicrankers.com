interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  if (request.method === 'GET') {
    const customerId = url.searchParams.get('customerId');
    try {
      let query = 'SELECT i.*, c.name as customer_name FROM crm_invoices i JOIN crm_customers c ON i.customer_id = c.id';
      let results;
      if (customerId) {
        query += ' WHERE i.customer_id = ? ORDER BY i.created_at DESC';
        const { results: dbResults } = await env.DB.prepare(query).bind(customerId).all();
        results = dbResults;
      } else {
        query += ' ORDER BY i.created_at DESC';
        const { results: dbResults } = await env.DB.prepare(query).all();
        results = dbResults;
      }
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
        'INSERT INTO crm_invoices (id, customer_id, amount, description, status) VALUES (?, ?, ?, ?, ?)'
      ).bind(
        id,
        body.customer_id,
        body.amount,
        body.description || null,
        body.status || 'invoice_created'
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
        if (['amount', 'description', 'status'].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        await env.DB.prepare(`UPDATE crm_invoices SET ${updates.join(', ')} WHERE id = ?`).bind(...values, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    try {
      await env.DB.prepare('DELETE FROM crm_invoices WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
