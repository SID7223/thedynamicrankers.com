interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  if (!env.DB) return new Response('DB binding missing', { status: 503 });

  try {
    // 1. Net Income (Sum of payment_received invoices)
    const incomeRes = await env.DB.prepare(
      "SELECT SUM(amount) as total FROM crm_invoices WHERE status = 'payment_received'"
    ).first() as { total: number };

    // 2. Orders per month (Current month count)
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const ordersRes = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first() as { count: number };

    // 3. Average Contract
    const avgRes = await env.DB.prepare(
      "SELECT AVG(amount) as avg FROM crm_invoices"
    ).first() as { avg: number };

    // 4. Monthly Sales Data (Last 6 months)
    const { results: monthlySales } = await env.DB.prepare(`
      SELECT strftime('%m', created_at) as month, SUM(amount) as total
      FROM crm_invoices
      WHERE status = 'payment_received'
      GROUP BY month
      ORDER BY month DESC
      LIMIT 12
    `).all();

    // 5. Task Status Distribution
    const { results: taskStats } = await env.DB.prepare(
      "SELECT status, COUNT(*) as count FROM tasks GROUP BY status"
    ).all();

    // 6. Recent Top Products (Derive from invoice descriptions or just mock based on frequency)
    const { results: topProducts } = await env.DB.prepare(`
        SELECT description as name, SUM(amount) as value
        FROM crm_invoices
        WHERE status = 'payment_received'
        GROUP BY description
        ORDER BY value DESC
        LIMIT 5
    `).all();

    return new Response(JSON.stringify({
      netIncome: incomeRes?.total || 0,
      ordersThisMonth: ordersRes?.count || 0,
      avgContract: avgRes?.avg || 0,
      monthlySales: monthlySales.reverse(),
      taskStats,
      topProducts
    }), { headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    return new Response(err.message, { status: 500 });
  }
};
