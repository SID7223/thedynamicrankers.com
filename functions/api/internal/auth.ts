interface Env {
  DB?: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    let email = '';
    let password = '';

    try {
      const body = await request.json() as any;
      email = (body?.email || '').toLowerCase().trim();
      password = body?.password || '';
    } catch (e) {
      return new Response(JSON.stringify({ message: 'Bad Request: Invalid Payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!env.DB) return new Response('DB binding missing', { status: 503 });

    const user = await env.DB.prepare(
      'SELECT id, name as username, role FROM users WHERE LOWER(email) = ? AND password_hash = ?'
    ).bind(email, password).first() as { id: string; username: string; role: string } | null;

    if (!user) {
        return new Response(JSON.stringify({ message: 'Authorization Denied: Member Not Recognized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'dr_token=verified; Path=/; SameSite=Strict; HttpOnly'
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ message: 'Sovereign Node Auth Error', details: message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
};
