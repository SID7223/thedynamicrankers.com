interface Env {
  DB: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    const allowedEmails = [
        'saadumar7223@gmail.com',
        'eric@thedynamicrankers.com'
    ];

    if (!email || !allowedEmails.includes(email.toLowerCase()) || password !== '123456') {
        return new Response(JSON.stringify({ message: 'Authorization Denied: Member Not Recognized' }), { status: 401 });
    }

    let user = null;

    // Attempt to find via D1, with fallback safety
    if (env.DB) {
      try {
        user = await env.DB.prepare(
          'SELECT id, name as username, role FROM users WHERE LOWER(email) = ?'
        ).bind(email.toLowerCase()).first() as { id: number; username: string; role: string } | null;
      } catch (dbErr) {
        console.error('D1 Database Query Failed:', dbErr);
      }
    }

    const sessionUser = user || {
        id: email.toLowerCase() === 'saadumar7223@gmail.com' ? 1 : 2,
        username: email.split('@')[0],
        role: 'superuser'
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
