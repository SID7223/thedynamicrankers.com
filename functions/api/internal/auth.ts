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
      console.error('Invalid JSON in auth request body:', e);
      return new Response(JSON.stringify({ message: 'Bad Request: Invalid Payload' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const allowedEmails = [
        'saadumar7223@gmail.com',
        'eric@thedynamicrankers.com'
    ];

    if (!email || !allowedEmails.includes(email) || password !== '123456') {
        return new Response(JSON.stringify({ message: 'Authorization Denied: Member Not Recognized' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    let user = null;

    // Defensive D1 check
    if (env.DB && typeof env.DB.prepare === 'function') {
      try {
        user = await env.DB.prepare(
          'SELECT id, name as username, role FROM users WHERE LOWER(email) = ?'
        ).bind(email).first() as { id: number; username: string; role: string } | null;
      } catch (dbErr) {
        console.error('D1 Auth Query Failed:', dbErr);
      }
    }

    const sessionUser = user || {
        id: email === 'saadumar7223@gmail.com' ? 1 : 2,
        username: email.split('@')[0],
        role: 'superuser'
    };

    return new Response(JSON.stringify(sessionUser), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': 'dr_token=verified; Path=/; SameSite=Strict; HttpOnly'
      }
    });
  } catch (err: unknown) {
    console.error('Critical Auth Error:', err);
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ message: 'Sovereign Node Auth Error', details: message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
    });
  }
};
