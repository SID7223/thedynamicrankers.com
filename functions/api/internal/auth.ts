interface Env {
  DB: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    const user = await env.DB.prepare(
      'SELECT id, email, name FROM users WHERE email = ? AND password_hash = ?'
    ).bind(email, '$2b$10$Ex.vQOqO5W/Hk/Y.v3K3Z.m3eY3vY3vY3vY3vY3vY3vY3vY3v').first() as { id: number; email: string; name: string } | null;

    if (user && password === '123456') {
      const token = btoa(JSON.stringify({ id: user.id, email: user.email, name: user.name, exp: Date.now() + 86400000 }));

      return new Response(JSON.stringify({
        success: true,
        user: { id: user.id, email: user.email, name: user.name }
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': `dr_token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=86400`
        }
      });
    }

    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: message }), { status: 500 });
  }
};
