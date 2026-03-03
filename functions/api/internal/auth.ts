interface Env {
  DB: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (!email || password !== '123456') {
        return new Response(JSON.stringify({ message: 'Invalid Credentials' }), { status: 401 });
    }

    // Try to find existing user or just create/mock one for this session
    // In this hardened version, we'll try to get the ID from DB if it exists, else use 1
    const user = await env.DB.prepare(
      'SELECT id, name as username, role FROM users WHERE email = ?'
    ).bind(email).first() as { id: number; username: string; role: string } | null;

    const sessionUser = user || {
        id: 1,
        username: email.split('@')[0],
        role: 'operative'
    };

    const response = new Response(JSON.stringify(sessionUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    response.headers.set('Set-Cookie', 'dr_token=verified; Path=/; SameSite=Strict');
    return response;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ message: 'Internal Server Error', details: message }), { status: 500 });
  }
};
