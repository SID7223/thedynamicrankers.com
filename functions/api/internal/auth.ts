interface Env {
  DB?: D1Database;
}

export const onRequest = async (context: { request: Request; env: Env }) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Handle GET for fetching users/operatives
  if (request.method === 'GET') {
    const action = url.searchParams.get('action');
    if (action === 'users') {
      try {
        let results: { id: number; username: string; email: string; role: string }[] = [];
        if (env.DB) {
          const { results: dbResults } = await env.DB.prepare('SELECT id, name as username, email, role FROM users').all();
          results = (dbResults as unknown as { id: number; username: string; email: string; role: string }[]) || [];
        }

        // Final fallback to ensure UI isn't empty
        if (results.length === 0) {
          results = [
            { id: 1, username: 'Saad Umar', email: 'saadumar7223@gmail.com', role: 'superuser' },
            { id: 2, username: 'Eric William', email: 'eric@thedynamicrankers.com', role: 'superuser' }
          ];
        }

        return new Response(JSON.stringify(results), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return new Response(JSON.stringify({ error: 'FETCH_USERS_FAILED', message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    }
  }

  // Handle POST for login
  if (request.method === 'POST') {
    try {
      let email = '';
      let password = '';

      try {
        const body = await request.json() as { email?: string; password?: string };
        email = (body?.email || '').toLowerCase().trim();
        password = body?.password || '';
      } catch {
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
      if (env.DB) {
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
      const message = err instanceof Error ? err.message : 'Unknown error';
      return new Response(JSON.stringify({ message: 'Sovereign Node Auth Error', details: message }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
};
