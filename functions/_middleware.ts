interface Env {
  DB: D1Database;
  JWT_SECRET: string;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context;
  const url = new URL(request.url);

  // Security layer for /internal/*
  if (url.pathname.startsWith('/internal/') || url.pathname.startsWith('/api/internal/')) {
    const authHeader = request.headers.get('Authorization');
    const cookieHeader = request.headers.get('Cookie');

    // Minimal check: if no auth exists, return 404 (Obfuscation)
    if (!authHeader && (!cookieHeader || !cookieHeader.includes('dr_token'))) {
      return new Response('Not Found', { status: 404 });
    }

    // In a real implementation, we would verify the JWT here.
    // For now, let the request pass through to the specific handlers that will check the token.
  }

  const response = await next();

  // Set X-Robots-Tag: noindex, nofollow for all /internal/ responses
  if (url.pathname.startsWith('/internal/') || url.pathname.startsWith('/api/internal/')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
};
