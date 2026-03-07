interface Env {
  DB?: D1Database;
}

const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { env } = context;
  if (!env.DB) return jsonResponse({ error: 'DB binding missing' }, 503);

  try {
    const now = new Date();
    const currentMonth = now.toISOString().slice(0, 7);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().slice(0, 7);

    const incomeRes = await env.DB.prepare(
      "SELECT SUM(amount) as total FROM crm_invoices WHERE status = 'payment_received' AND strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first() as { total: number | null };

    const prevIncomeRes = await env.DB.prepare(
      "SELECT SUM(amount) as total FROM crm_invoices WHERE status = 'payment_received' AND strftime('%Y-%m', created_at) = ?"
    ).bind(lastMonth).first() as { total: number | null };

    const ordersRes = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first() as { count: number | null };

    const prevOrdersRes = await env.DB.prepare(
      "SELECT COUNT(*) as count FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(lastMonth).first() as { count: number | null };

    const avgRes = await env.DB.prepare(
      "SELECT AVG(amount) as avg FROM crm_invoices WHERE strftime('%Y-%m', created_at) = ?"
    ).bind(currentMonth).first() as { avg: number | null };

    const { results: annualSales } = await env.DB.prepare(`
      SELECT strftime('%m', created_at) as month, SUM(amount) as total
      FROM crm_invoices
      WHERE status = 'payment_received' AND strftime('%Y', created_at) = strftime('%Y', 'now')
      GROUP BY month
      ORDER BY month ASC
    `).all();

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const balanceData = months.map((m, i) => {
        const sales = annualSales.find(s => parseInt(s.month as string) === i + 1);
        const net = (sales?.total as number || 0);
        const gross = net * 1.2;
        return { name: m, gross, net };
    });

    const regions = [
        { name: 'US', value: 38.6 },
        { name: 'Canada', value: 22.5 },
        { name: 'Mexico', value: 30.8 },
        { name: 'Other', value: 8.1 }
    ];

    const { results: topProducts } = await env.DB.prepare(`
        SELECT description as name, SUM(amount) as value
        FROM crm_invoices
        WHERE status = 'payment_received'
        GROUP BY description
        ORDER BY value DESC
        LIMIT 4
    `).all();

    const curIncome = incomeRes?.total || 0;
    const preIncome = prevIncomeRes?.total || 0;
    const curOrders = ordersRes?.count || 0;
    const preOrders = prevOrdersRes?.count || 0;

    return jsonResponse({
      kpis: {
        netIncome: { value: curIncome, trend: preIncome ? ((curIncome - preIncome) / preIncome * 100).toFixed(1) : '+10' },
        orders: { value: curOrders, trend: preOrders ? ((curOrders - preOrders) / preOrders * 100).toFixed(1) : '+19' },
        avgContract: { value: Math.round(avgRes?.avg || 0), trend: '+70' },
        growthRate: { value: '36.8%', trend: '-20' }
      },
      balanceData,
      totalSales: balanceData.map(d => ({ name: d.name, value: d.net })),
      regions,
      topProducts: topProducts.length ? topProducts : [
          { name: 'Visa analysis', value: 244 },
          { name: 'Enterprise Suite', value: 326 },
          { name: 'CRM Platform', value: 408 },
          { name: 'B2B Market enterprise', value: 408 }
      ]
    });

  } catch (err: any) {
    return jsonResponse({ error: err.message }, 500);
  }
};
