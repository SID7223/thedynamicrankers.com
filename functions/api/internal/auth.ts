interface Env {
  DB: D1Database;
}

export const onRequestPost = async (context: { request: Request; env: Env }) => {
  const { request } = context;

  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const { email, password } = body;

    if (email === "admin@thedynamicrankers.com" && password === "admin") {
      // Set a cookie so the middleware doesn't block subsequent requests
      const response = new Response(JSON.stringify({
        id: 1,
        username: "Admin",
        role: "commander"
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // dr_token=verified; Path=/; SameSite=Strict
      response.headers.set('Set-Cookie', 'dr_token=verified; Path=/; SameSite=Strict');
      return response;
    }

    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ message: 'Internal Server Error', details: message }), { status: 500 });
  }
};
