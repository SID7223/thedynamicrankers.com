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
      let query = 'SELECT * FROM crm_appointments';
      let results;
      if (customerId) {
        query += ' WHERE customer_id = ? ORDER BY appointment_date ASC, appointment_time ASC';
        const { results: dbResults } = await env.DB.prepare(query).bind(customerId).all();
        results = dbResults;
      } else {
        query += ' ORDER BY appointment_date ASC, appointment_time ASC';
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
        if (['customer_name', 'email', 'phone', 'appointment_date', 'appointment_time', 'status'].includes(key)) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length > 0) {
        updates.push('updated_at = CURRENT_TIMESTAMP');
        await env.DB.prepare(`UPDATE crm_appointments SET ${updates.join(', ')} WHERE id = ?`).bind(...values, id).run();
      }
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  if (request.method === 'DELETE') {
    const id = url.searchParams.get('id');
    try {
      await env.DB.prepare('DELETE FROM crm_appointments WHERE id = ?').bind(id).run();
      return new Response(JSON.stringify({ success: true }));
    } catch (err: any) {
      return new Response(err.message, { status: 500 });
    }
  }

  return new Response('Method Not Allowed', { status: 405 });
};
